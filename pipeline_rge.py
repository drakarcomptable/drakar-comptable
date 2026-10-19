# -*- coding: utf-8 -*-
"""Construction de la data prospection "energies renouvelables / solaire / PAC".

Chaine : annuaire RGE (ADEME) -> entreprises actives + dirigeants
(recherche-entreprises.api.gouv.fr) -> telephones (RGE puis Google Places)
-> dedoublonnage contre les domaines deja presents dans le CRM.

Trois modes :
  --probe        schema reel des deux API, un enregistrement chacune.
  --mesure N     deroule l'entonnoir sur N entreprises et donne le taux de
                 06/07 etage par etage. C'est la mesure a passer avant de
                 derouler sur tout l'annuaire.
  --run          pipeline complet, sortie CSV.

Les noms de champs ADEME ne sont pas verifies : --probe les affiche, et le
script s'arrete franchement si un champ attendu manque plutot que de
produire des taux a zero.
"""
import argparse, csv, json, os, random, re, sys, time
from collections import Counter
from pathlib import Path

import requests

# --- Sources -----------------------------------------------------------------

ADEME_URL = ("https://data.ademe.fr/data-fair/api/v1/datasets/"
             "liste-des-entreprises-rge-2/lines")
RECHERCHE_URL = "https://recherche-entreprises.api.gouv.fr/search"
PLACES_URL = "https://places.googleapis.com/v1/places:searchText"

# Noms de champs cote ADEME. A confirmer au premier --probe : le dataset a
# deja change de nommage par le passe. Plusieurs candidats par champ, le
# premier present gagne.
CHAMPS = {
    "siret":    ["siret", "siret_entreprise", "SIRET"],
    "nom":      ["nom_entreprise", "raison_sociale", "nom"],
    "domaine":  ["domaine", "nom_domaine", "libelle_domaine"],
    "tel":      ["telephone", "tel", "telephone_entreprise"],
    "site":     ["site_internet", "site_web", "url"],
    "cp":       ["code_postal", "codepostal"],
    "commune":  ["commune", "ville"],
}

# Domaines RGE retenus. "coeur" = la cible annoncee (solaire + PAC), "large"
# ajoute le reste des ENR si le volume coeur est trop mince.
DOMAINES = {
    "coeur": ["solaire", "photovoltaiqu", "pompe a chaleur", "pompes a chaleur",
              "chauffe-eau thermodynamique", "chauffe eau thermodynamique"],
    "large": ["solaire", "photovoltaiqu", "pompe a chaleur", "pompes a chaleur",
              "chauffe-eau thermodynamique", "chauffe eau thermodynamique",
              "geothermi", "biomasse", "bois", "eolien", "solaire thermique"],
}

class BlocageReseau(RuntimeError):
    """Hote non autorise par la politique reseau de l'environnement."""


PAUSE_ADEME = 0.15
PAUSE_RECHERCHE = 0.15   # l'API publique tolere ~7 req/s, on reste en dessous
PAUSE_PLACES = 0.05


# --- Utilitaires -------------------------------------------------------------

def sans_accents(s):
    tr = str.maketrans("àâäéèêëîïôöùûüç", "aaaeeeeiioouuuc")
    return (s or "").lower().translate(tr)


def http(url, methode="GET", params=None, json_body=None, headers=None,
         cache=None, essais=4):
    """GET/POST avec cache disque et reprise exponentielle.

    Le cache evite de rebruler du quota Places quand on relance une mesure.
    """
    if cache is not None and cache.exists():
        return json.loads(cache.read_text(encoding="utf-8"))
    attente = 2.0
    for n in range(essais):
        try:
            if methode == "GET":
                r = requests.get(url, params=params, headers=headers, timeout=45)
            else:
                r = requests.post(url, params=params, json=json_body,
                                  headers=headers, timeout=45)
            if r.status_code in (429, 500, 502, 503, 504) and n < essais - 1:
                time.sleep(attente); attente *= 2; continue
            r.raise_for_status()
            data = r.json()
            if cache is not None:
                cache.parent.mkdir(parents=True, exist_ok=True)
                cache.write_text(json.dumps(data, ensure_ascii=False),
                                 encoding="utf-8")
            return data
        except requests.exceptions.ProxyError as e:
            # Refus de politique du proxy de sortie : inutile d'insister,
            # l'hote n'est pas autorise pour cette session.
            if "403" in str(e) or "407" in str(e):
                hote = re.sub(r"^https?://([^/]+).*", r"\1", url)
                raise BlocageReseau(
                    "Hote refuse par la politique reseau de l'environnement : %s\n"
                    "A autoriser dans Network access (Allowed domains) avant de "
                    "relancer." % hote) from None
            raise
        except requests.exceptions.RequestException as e:
            if n == essais - 1:
                raise
            # 403/407 cote service : refus d'autorisation, pas un incident
            rep = getattr(e, "response", None)
            if rep is not None and rep.status_code in (401, 403, 407):
                raise
            time.sleep(attente); attente *= 2
    return None


def champ(enr, cle):
    """Valeur du premier alias present pour `cle`, ou None."""
    for alias in CHAMPS[cle]:
        if alias in enr and enr[alias] not in (None, ""):
            return enr[alias]
    return None


# --- Telephones --------------------------------------------------------------

def normalise_tel(brut):
    """Numero FR en E.164, ou None si inexploitable."""
    if not brut:
        return None
    n = re.sub(r"[^\d+]", "", str(brut))
    if n.startswith("+33"):
        n = "0" + n[3:]
    elif n.startswith("0033"):
        n = "0" + n[4:]
    elif n.startswith("33") and len(n) == 11:
        n = "0" + n[2:]
    if not re.fullmatch(r"0\d{9}", n):
        return None
    return "+33" + n[1:]


def genre_tel(e164):
    """mobile | fixe | special | voip — selon le prefixe ARCEP."""
    if not e164:
        return "absent"
    p = e164[3]          # chiffre apres +33
    if p in "67":
        return "mobile"
    if p == "9":
        return "voip"
    if p == "8":
        return "special"
    if p in "12345":
        return "fixe"
    return "autre"


def domaine_de(url):
    if not url:
        return None
    d = re.sub(r"^https?://", "", str(url).strip().lower())
    d = d.split("/")[0].split("?")[0]
    d = re.sub(r"^www\.", "", d)
    return d or None


# --- Etape 1 : annuaire RGE --------------------------------------------------

def charge_rge(perimetre, plafond, cache_dir, verbeux=True):
    """Pagine l'annuaire RGE, filtre les domaines ENR, dedoublonne par SIREN.

    Le dedoublonnage se fait AVANT l'echantillonnage : une entreprise porte
    souvent plusieurs certificats RGE, tirer au sort sur les lignes brutes
    biaiserait l'echantillon vers les gros multi-certifies.
    """
    mots = [sans_accents(m) for m in DOMAINES[perimetre]]
    par_siren, lignes_vues, page, taille = {}, 0, 1, 1000
    while True:
        cache = cache_dir / f"rge_p{page}.json" if cache_dir else None
        data = http(ADEME_URL, params={"size": taille, "page": page}, cache=cache)
        res = data.get("results", [])
        if not res:
            break
        if page == 1 and res:
            manquants = [c for c in ("siret", "nom", "domaine")
                         if champ(res[0], c) is None]
            if manquants:
                sys.exit("Schema ADEME inattendu : champs introuvables %s.\n"
                         "Cles reellement presentes : %s\n"
                         "Mettre CHAMPS a jour (voir --probe)."
                         % (manquants, sorted(res[0].keys())))
        for enr in res:
            lignes_vues += 1
            dom = sans_accents(champ(enr, "domaine") or "")
            if not any(m in dom for m in mots):
                continue
            siret = str(champ(enr, "siret") or "")
            siren = re.sub(r"\D", "", siret)[:9]
            if len(siren) != 9:
                continue
            e = par_siren.setdefault(siren, {
                "siren": siren, "siret": siret,
                "nom": champ(enr, "nom"),
                "cp": champ(enr, "cp"), "commune": champ(enr, "commune"),
                "tel_rge": None, "site_rge": None, "domaines_rge": set(),
            })
            e["domaines_rge"].add(champ(enr, "domaine"))
            e["tel_rge"] = e["tel_rge"] or normalise_tel(champ(enr, "tel"))
            e["site_rge"] = e["site_rge"] or domaine_de(champ(enr, "site"))
        if verbeux:
            print("  RGE page %d : %d lignes lues, %d entreprises ENR uniques"
                  % (page, lignes_vues, len(par_siren)), file=sys.stderr)
        if plafond and len(par_siren) >= plafond:
            break
        if len(res) < taille:
            break
        page += 1
        time.sleep(PAUSE_ADEME)
    for e in par_siren.values():
        e["domaines_rge"] = " | ".join(sorted(x for x in e["domaines_rge"] if x))
    return list(par_siren.values()), lignes_vues


# --- Etape 2 : entreprise active + dirigeants --------------------------------

def enrichit_entreprise(e, cache_dir):
    """Statut administratif et dirigeant principal via recherche-entreprises."""
    cache = cache_dir / f"re_{e['siren']}.json" if cache_dir else None
    try:
        data = http(RECHERCHE_URL, params={"q": e["siren"], "per_page": 1},
                    cache=cache)
    except requests.exceptions.RequestException as err:
        e["statut"] = "erreur_api"; e["erreur"] = str(err)[:120]
        return e
    res = (data or {}).get("results") or []
    if not res:
        e["statut"] = "introuvable"
        return e
    r = res[0]
    e["statut"] = "actif" if r.get("etat_administratif") == "A" else "ferme"
    e["nom_legal"] = r.get("nom_raison_sociale") or r.get("nom_complet")
    e["effectif"] = r.get("tranche_effectif_salarie")
    e["naf"] = r.get("activite_principale")
    dirs = r.get("dirigeants") or []
    pp = [d for d in dirs if d.get("type_dirigeant") == "personne physique"] or dirs
    if pp:
        d = pp[0]
        e["dirigeant_prenom"] = (d.get("prenoms") or "").split(" ")[0].title()
        e["dirigeant_nom"] = (d.get("nom") or "").title()
        e["dirigeant_qualite"] = d.get("qualite")
    e["nb_dirigeants"] = len(dirs)
    return e


# --- Etape 3 : telephone via Google Places -----------------------------------

def tel_via_places(e, cle, cache_dir):
    """Telephone de l'etablissement via Places API (New) searchText."""
    requete = " ".join(x for x in [e.get("nom_legal") or e.get("nom"),
                                   e.get("cp"), e.get("commune")] if x)
    cache = cache_dir / ("places_%s.json" % e["siren"]) if cache_dir else None
    entetes = {
        "X-Goog-Api-Key": cle,
        "X-Goog-FieldMask": ("places.displayName,places.nationalPhoneNumber,"
                             "places.internationalPhoneNumber,places.websiteUri,"
                             "places.formattedAddress"),
    }
    try:
        data = http(PLACES_URL, methode="POST",
                    json_body={"textQuery": requete, "languageCode": "fr",
                               "regionCode": "FR", "maxResultCount": 1},
                    headers=entetes, cache=cache)
    except requests.exceptions.RequestException as err:
        e["places"] = "erreur"; e["erreur"] = str(err)[:120]
        return e
    lieux = (data or {}).get("places") or []
    if not lieux:
        e["places"] = "sans_fiche"
        return e
    p = lieux[0]
    e["places"] = "fiche"
    e["tel_places"] = normalise_tel(p.get("internationalPhoneNumber")
                                    or p.get("nationalPhoneNumber"))
    e["site_places"] = domaine_de(p.get("websiteUri"))
    return e


# --- Etape 4 : dedoublonnage CRM ---------------------------------------------

def charge_domaines_crm(chemin):
    """Domaines deja en base, un par ligne ou en colonne CSV."""
    p = Path(chemin)
    if not p.exists():
        sys.exit("Fichier de domaines CRM introuvable : %s" % chemin)
    vus = set()
    with p.open(encoding="utf-8", errors="replace") as f:
        tete = f.readline()
        f.seek(0)
        if "," in tete or ";" in tete:
            sep = ";" if tete.count(";") > tete.count(",") else ","
            for ligne in csv.reader(f, delimiter=sep):
                for cell in ligne:
                    d = domaine_de(cell)
                    if d and "." in d:
                        vus.add(d)
        else:
            for ligne in f:
                d = domaine_de(ligne)
                if d and "." in d:
                    vus.add(d)
    return vus


# --- Modes -------------------------------------------------------------------

def mode_probe(cache_dir):
    print("=== ADEME / annuaire RGE ===")
    data = http(ADEME_URL, params={"size": 1})
    res = data.get("results") or []
    print("total annonce :", data.get("total"))
    if res:
        print("champs :", json.dumps(sorted(res[0].keys()), ensure_ascii=False))
        print("exemple :", json.dumps(res[0], ensure_ascii=False, indent=2)[:1500])
        print("\nmapping CHAMPS resolu :")
        for cle in CHAMPS:
            print("  %-8s -> %r" % (cle, champ(res[0], cle)))
    print("\n=== recherche-entreprises ===")
    d2 = http(RECHERCHE_URL, params={"q": "pompe a chaleur", "per_page": 1})
    r2 = (d2.get("results") or [{}])[0]
    print("champs :", json.dumps(sorted(r2.keys()), ensure_ascii=False))
    print("dirigeants :", json.dumps(r2.get("dirigeants"), ensure_ascii=False)[:800])


def mode_mesure(n, perimetre, domaines_crm, cache_dir, graine, cle_places):
    """Entonnoir complet sur un echantillon, taux etage par etage."""
    print("Chargement de l'annuaire RGE (perimetre %s)..." % perimetre,
          file=sys.stderr)
    # On charge large pour pouvoir tirer au sort, pas juste les n premiers :
    # les premieres pages sont triees et donneraient un echantillon regional.
    entreprises, lignes = charge_rge(perimetre, plafond=max(n * 20, 2000),
                                     cache_dir=cache_dir)
    print("  %d lignes RGE lues -> %d entreprises ENR uniques (facteur de "
          "dedoublonnage %.1fx)" % (lignes, len(entreprises),
                                    lignes / max(len(entreprises), 1)),
          file=sys.stderr)
    if not entreprises:
        sys.exit("Aucune entreprise sur ce perimetre : verifier DOMAINES.")

    random.Random(graine).shuffle(entreprises)
    ech = entreprises[:n]
    print("Echantillon de %d entreprises (graine %d)\n" % (len(ech), graine),
          file=sys.stderr)

    for i, e in enumerate(ech, 1):
        enrichit_entreprise(e, cache_dir)
        time.sleep(PAUSE_RECHERCHE)
        # Places seulement si l'annuaire RGE n'a pas deja donne un mobile :
        # le champ telephone du RGE est gratuit, autant l'epuiser d'abord.
        if cle_places and e.get("statut") == "actif" \
                and genre_tel(e.get("tel_rge")) != "mobile":
            tel_via_places(e, cle_places, cache_dir)
            time.sleep(PAUSE_PLACES)
        if i % 10 == 0:
            print("  %d/%d" % (i, len(ech)), file=sys.stderr)

    # --- Entonnoir
    actives = [e for e in ech if e.get("statut") == "actif"]
    avec_dir = [e for e in actives if e.get("dirigeant_nom")]
    neuves = [e for e in avec_dir
              if not (domaines_crm and (e.get("site_rge") in domaines_crm
                                        or e.get("site_places") in domaines_crm))]

    def meilleur(e):
        for t in (e.get("tel_rge"), e.get("tel_places")):
            if genre_tel(t) == "mobile":
                return t
        return e.get("tel_places") or e.get("tel_rge")

    def pc(a, b):
        return "%5.1f%%" % (100.0 * a / b) if b else "    -"

    print("\n" + "=" * 68)
    print("ENTONNOIR — echantillon de %d entreprises RGE %s" % (len(ech), perimetre))
    print("=" * 68)
    etapes = [
        ("Echantillon", len(ech)),
        ("Actives (recherche-entreprises)", len(actives)),
        ("dont dirigeant personne physique nomme", len(avec_dir)),
        ("dont absentes du CRM", len(neuves)),
    ]
    for lib, v in etapes:
        print("%-42s %5d  %s de l'echantillon" % (lib, v, pc(v, len(ech))))

    print("\n--- Telephones sur les %d boites exploitables ---" % len(neuves))
    src = Counter()
    for e in neuves:
        src["RGE " + genre_tel(e.get("tel_rge"))] += 1
        if "tel_places" in e or e.get("places"):
            src["Places " + genre_tel(e.get("tel_places"))] += 1
    for k in sorted(src):
        print("  %-24s %5d  %s" % (k, src[k], pc(src[k], len(neuves))))

    genres = Counter(genre_tel(meilleur(e)) for e in neuves)
    print("\n--- Meilleur numero retenu par entreprise ---")
    for g in ("mobile", "fixe", "voip", "special", "autre", "absent"):
        if genres[g]:
            print("  %-10s %5d  %s" % (g, genres[g], pc(genres[g], len(neuves))))

    mob = genres["mobile"]
    print("\n" + "=" * 68)
    print("TAUX DE 06/07 : %d sur %d exploitables  = %s" % (mob, len(neuves), pc(mob, len(neuves))))
    print("                %d sur %d echantillonnees = %s  <- taux bout en bout"
          % (mob, len(ech), pc(mob, len(ech))))
    print("=" * 68)
    print("\nProjection sur les %d entreprises ENR de l'annuaire : ~%d mobiles."
          % (len(entreprises), round(len(entreprises) * mob / max(len(ech), 1))))
    erreurs = [e for e in ech if e.get("erreur")]
    if erreurs:
        print("\n%d erreurs API (taux fausse d'autant) ; premiere : %s"
              % (len(erreurs), erreurs[0]["erreur"]))
    return ech


def mode_run(perimetre, domaines_crm, cache_dir, cle_places, sortie, plafond):
    entreprises, lignes = charge_rge(perimetre, plafond, cache_dir)
    print("%d lignes RGE -> %d entreprises uniques" % (lignes, len(entreprises)),
          file=sys.stderr)
    retenues = []
    for i, e in enumerate(entreprises, 1):
        enrichit_entreprise(e, cache_dir)
        time.sleep(PAUSE_RECHERCHE)
        if e.get("statut") != "actif":
            continue
        if cle_places and genre_tel(e.get("tel_rge")) != "mobile":
            tel_via_places(e, cle_places, cache_dir)
            time.sleep(PAUSE_PLACES)
        if domaines_crm and (e.get("site_rge") in domaines_crm
                             or e.get("site_places") in domaines_crm):
            continue
        e["tel_mobile"] = next((t for t in (e.get("tel_rge"), e.get("tel_places"))
                                if genre_tel(t) == "mobile"), None)
        e["tel_autre"] = e.get("tel_places") or e.get("tel_rge")
        retenues.append(e)
        if i % 100 == 0:
            print("  %d/%d traitees, %d retenues" % (i, len(entreprises),
                                                     len(retenues)), file=sys.stderr)
    colonnes = ["siren", "siret", "nom", "nom_legal", "cp", "commune", "naf",
                "effectif", "domaines_rge", "dirigeant_prenom", "dirigeant_nom",
                "dirigeant_qualite", "tel_mobile", "tel_autre", "site_rge",
                "site_places"]
    with open(sortie, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=colonnes, extrasaction="ignore")
        w.writeheader()
        for e in retenues:
            w.writerow(e)
    mob = sum(1 for e in retenues if e.get("tel_mobile"))
    print("Ecrit %s : %d lignes, dont %d avec mobile." % (sortie, len(retenues), mob),
          file=sys.stderr)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--probe", action="store_true", help="schema reel des API")
    g.add_argument("--mesure", type=int, metavar="N",
                   help="taux de 06/07 sur un echantillon de N entreprises")
    g.add_argument("--run", action="store_true", help="pipeline complet")
    ap.add_argument("--perimetre", choices=["coeur", "large"], default="coeur",
                    help="coeur = solaire + PAC (defaut), large = toutes ENR")
    ap.add_argument("--crm-domaines", metavar="FICHIER",
                    help="domaines deja en CRM, pour le dedoublonnage")
    ap.add_argument("--cache", default=".cache_rge",
                    help="repertoire de cache des reponses API")
    ap.add_argument("--graine", type=int, default=42)
    ap.add_argument("--plafond", type=int, default=0,
                    help="arret apres N entreprises (0 = tout l'annuaire)")
    ap.add_argument("--sortie", default="prospects_rge.csv")
    ap.add_argument("--sans-places", action="store_true",
                    help="ne pas appeler Google Places")
    a = ap.parse_args()

    cache_dir = Path(a.cache) if a.cache else None
    cle = None
    if not a.sans_places:
        cle = os.environ.get("GOOGLE_MAPS_API_KEY")
        if not cle and not a.probe:
            sys.exit("GOOGLE_MAPS_API_KEY absente de l'environnement.\n"
                     "La passer en variable d'environnement, ou lancer avec "
                     "--sans-places pour ne mesurer que les telephones du RGE.")
    crm = charge_domaines_crm(a.crm_domaines) if a.crm_domaines else set()
    if a.crm_domaines:
        print("%d domaines CRM charges pour le dedoublonnage" % len(crm),
              file=sys.stderr)

    if a.probe:
        mode_probe(cache_dir)
    elif a.mesure:
        mode_mesure(a.mesure, a.perimetre, crm, cache_dir, a.graine, cle)
    else:
        mode_run(a.perimetre, crm, cache_dir, cle, a.sortie, a.plafond)


if __name__ == "__main__":
    try:
        main()
    except BlocageReseau as e:
        sys.exit(str(e))
    except KeyboardInterrupt:
        sys.exit("\nInterrompu.")
