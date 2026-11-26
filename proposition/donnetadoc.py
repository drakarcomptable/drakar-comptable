# -*- coding: utf-8 -*-
"""DONETADOC : d'une adresse a une proposition, en une fois.

Le travail se fait en tache de fond et rend compte de son avancement, parce
qu'il dure une a deux minutes et qu'une page qui ne dit rien pendant deux
minutes donne l'impression d'etre plantee.

Deux choses peuvent manquer et ne sont pas des erreurs :

- le site refuse d'etre photographie : il faut alors deux captures a la main ;
- le site ne repond pas du tout : il faut une autre adresse.

Dans les deux cas le travail se met en PAUSE au lieu d'echouer, et reprend
la ou il s'est arrete une fois ce qui manque fourni.
"""

import io
import json
import os
import re
import subprocess
import sys
import threading
import time
import uuid

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOTS = os.path.join(ICI, 'depots')
SORTIE = os.path.join(ICI, 'sortie')

# Les etapes, et ce qu'elles valent sur la jauge. La somme fait 100.
ETAPES = [
    ('lecture', 'Lecture du site', 12),
    ('photo', 'Photographie des sections', 46),
    ('montage', 'Montage de la proposition', 12),
    ('pdf', 'Fabrication du document', 30),
]

TRAVAUX = {}
VERROU = threading.Lock()


def _maj(ident, **kw):
    with VERROU:
        t = TRAVAUX.get(ident)
        if t:
            t.update(kw)
            t['vu'] = time.time()


def etat(ident):
    with VERROU:
        t = TRAVAUX.get(ident)
        return dict(t) if t else None


def _slug(nom):
    s = ''.join(c if c.isalnum() else '-' for c in (nom or '').lower()).strip('-')
    return s or 'prospect'


def utile(sortie, n=1600):
    """Garde la partie d'un journal d'erreur qui dit quelque chose.

    Une trace Python se termine par l'appel qui a echoue, pas par la
    cause : quand un script Node echoue sous gen.py, le vrai message est
    AVANT la trace. Couper la fin cachait donc l'essentiel.
    """
    t = (sortie or '').strip()
    if len(t) <= n:
        return t
    lignes = t.split('\n')
    # on ecarte la mecanique de subprocess, qui ne renseigne personne
    bruit = ('Traceback (most recent call last)', 'File "', '    ',
             'subprocess.CalledProcessError', 'raise CalledProcessError')
    garde = [l for l in lignes if not l.startswith(bruit)]
    t2 = '\n'.join(garde).strip()
    if 40 < len(t2) <= n:
        return t2
    return (t2 or t)[:n]


def _node(script, *args, timeout=240):
    """Rend (sortie, releve). Le releve est garde meme quand tout va bien.

    Il ne l'etait pas, et c'est ce qui a rendu une panne en ligne muette :
    sections.cjs signalait « capture presque vide » sur sa sortie d'erreur,
    personne ne la lisait, et le journal du travail n'en disait rien.
    """
    r = subprocess.run(['node', os.path.join(ICI, script)] + list(args),
                       capture_output=True, text=True, timeout=timeout)
    if r.returncode != 0:
        raise RuntimeError(utile(r.stderr or r.stdout) or
                           'le script a échoué sans rien dire')
    return r.stdout, (r.stderr or '').strip()


def _fiche(ident):
    """Le fichier de donnees du travail, relu a chaque modification."""
    return os.path.join(DEPOTS, 'doc-' + ident + '.json')


def _fabrique(ident, p):
    """Ecrit la fiche et lance le generateur. Rend le chemin du PDF."""
    if not os.path.isdir(DEPOTS):
        os.makedirs(DEPOTS)
    f = _fiche(ident)
    io.open(f, 'w', encoding='utf-8').write(
        json.dumps(p, ensure_ascii=False, indent=2) + '\n')
    r = subprocess.run([sys.executable, os.path.join(ICI, 'gen.py'), f],
                       capture_output=True, text=True, timeout=300)
    if r.returncode != 0:
        raise RuntimeError(utile(r.stderr or r.stdout))
    return os.path.join(SORTIE, p['slug'] + '.pdf'), r.stdout.strip()


def _depart(ident, url, captures=None):
    """Le travail lui-meme, hors du fil qui sert les pages."""
    try:
        _maj(ident, etape='lecture', pct=3, message='Lecture du site…')
        a = None
        try:
            a = json.loads(_node('analyse.cjs', url, timeout=120)[0])
        except Exception as e:
            a = {'atteint': False, 'erreur': str(e)[:200]}

        if not a.get('atteint'):
            # Le site n'a pas repondu. On ne jette pas le travail : on
            # demande une autre adresse, ou des captures a la main.
            _maj(ident, etat='pause_lien', pct=10,
                 message='Le site n’a pas répondu.',
                 detail=a.get('erreur', ''),
                 besoin='Donnez une autre adresse, ou déposez deux captures.')
            return

        nom = a.get('entreprise') or _slug(url)
        _maj(ident, pct=12, entreprise=nom, analyse=a,
             message='Site lu : ' + nom)

        # ---- photographie ----
        vues = []
        releve = ''
        if captures:
            _maj(ident, etape='photo', pct=52,
                 message='Captures fournies à la main.')
        else:
            _maj(ident, etape='photo', pct=18,
                 message='Photographie des sections, c’est le plus long…')
            try:
                sortie, releve = _node('sections.cjs', url, DEPOTS,
                                       _slug(nom), timeout=300)
                vues = json.loads(sortie)
            except Exception as e:
                # Pas de coupe a 300 caracteres : le releve passe
                # d'abord et la cause vient en dernier, donc couper par
                # le debut gardait le preambule et jetait la raison.
                _maj(ident, etat='pause_images', pct=30,
                     message='Le site n’a pas pu être photographié.',
                     detail=utile(str(e), 1200),
                     besoin='Déposez deux captures : la page d’accueil, '
                            'et la section à annoter.')
                return
            if not vues:
                _maj(ident, etat='pause_images', pct=30,
                     message='Aucune section exploitable n’a été trouvée.',
                     journal=releve,
                     besoin='Déposez deux captures : la page d’accueil, '
                            'et la section à annoter.')
                return
            for v in vues:
                v['depot'] = os.path.basename(v['fichier'])
            notees = [v for v in vues if v.get('note') is not None]
            mieux = max(notees, key=lambda v: v['note'])['titre'] if notees else None
            _maj(ident, pct=58, vues=vues,
                 message='%d sections photographiées%s.' % (
                     len(vues),
                     ', retenue : « %s »' % mieux if mieux else ''))

        # ---- montage ----
        _maj(ident, etape='montage', pct=62, message='Montage de la proposition…')
        p = monte(nom, url, a, vues, captures)
        # Une requete absente se corrige en dix secondes si on le sait, et
        # part chez un prospect si on ne le sait pas.
        if len(p.get('_pistes') or []) < 2:
            releve = (releve + '\n' if releve else '') + (
                'requetes : aucune piste exploitable retenue sur ce site. '
                'A completer a la main : « ajoute la requête <mot> à <volume> »')
        _maj(ident, pct=72, donnees=p)

        # ---- fabrication ----
        _maj(ident, etape='pdf', pct=78, message='Fabrication du document…')
        chemin, journal = _fabrique(ident, p)
        if releve:
            journal = 'photographie :\n' + \
                '\n'.join('  ' + l for l in releve.splitlines()) + '\n' + journal
        _maj(ident, etat='fini', pct=100, etape='fini',
             message='Document prêt.', journal=journal,
             pdf='/pdf/' + os.path.basename(chemin))
    except Exception as e:
        _maj(ident, etat='echec', message='La fabrication a échoué.',
             detail=str(e)[:1600])


def _cadre(c, marge=1.4):
    """Un cadre rouge autour d'une cible mesuree, en % de l'image.

    La marge evite que le trait colle au texte. Le cote est celui ou il
    reste de la place : une etiquette posee a droite d'un bloc deja a
    droite sortirait de la page.
    """
    x = max(0.0, c['x'] - marge)
    y = max(0.0, c['y'] - marge)
    w = min(100.0 - x, c['w'] + 2 * marge)
    h = min(100.0 - y, c['h'] + 2 * marge)
    return {'x': round(x, 2), 'y': round(y, 2), 'w': round(w, 2),
            'h': round(h, 2), 'cote': 'droite' if x + w / 2 < 50 else 'gauche'}


def reperes_section(sec):
    """Pourquoi les IA passent a cote de la section montree.

    Chaque repere s'appuie sur un comptage fait sur ce bloc precis :
    combien de puces, combien de phrases, combien de chiffres, combien de
    questions. Ce qui se joue n'est pas la qualite de la redaction, c'est
    la citation : un moteur generatif reprend des phrases sourcables, pas
    des listes de puces. Un consultant les deplace et les reecrit ensuite
    s'il veut.
    """
    if not sec:
        return []
    mots = sec.get('mots') or 0
    puces = sec.get('puces') or 0
    phrases = sec.get('phrases') or 0
    chiffres = sec.get('chiffres') or 0
    questions = sec.get('questions') or 0

    # Chaque constat sait sur quoi il veut pointer, par ordre de
    # preference. Un constat sur des puces designe la liste, un constat
    # sur l'absence de chiffres designe le texte qui aurait du en porter.
    trouves = []
    if puces >= 5 and (not mots or phrases / max(mots, 1) < 0.03):
        trouves.append(('%d puces et aucune phrase : une IA n’a rien à citer ici'
                        % puces, ('puces', 'para', 'titre')))
    if chiffres == 0 and mots >= 40:
        trouves.append(('Aucune donnée chiffrée : les IA reprennent ce qu’elles '
                        'peuvent sourcer', ('para', 'puces', 'titre')))
    if questions == 0 and mots >= 40:
        trouves.append(('Ce bloc ne répond à aucune requête : rien à reprendre '
                        'dans une réponse IA', ('titre', 'para', 'puces')))
    if not trouves and mots:
        trouves.append(('Offre décrite sans requête cible : invisible dans les '
                        'réponses des IA', ('titre', 'para', 'puces')))

    cibles = sec.get('cibles') or {}
    pris, out = set(), []
    for texte, prefs in trouves[:3]:
        c = None
        for cle in prefs:
            v = cibles.get(cle)
            if not v or cle in pris:
                continue
            # un cadre qui couvre toute l'image ne designe rien
            if v['w'] >= 92 and v['h'] >= 80:
                continue
            c = v
            pris.add(cle)
            break
        # Mieux vaut un repere de moins qu'un cadre rouge sur du vide :
        # sur un document envoye a un prospect, une fleche qui ne montre
        # rien decredibilise la page entiere.
        if c:
            out.append(dict(_cadre(c), texte=texte))
    return out


# Ce que la proposition vise, marche par marche. C'est un document
# d'avant-vente : il montre un ordre de grandeur, et l'audit etablit le
# chiffre reel. Un volume a zero ne dit rien a personne, et une promesse de
# cent demandes par mois n'est pas credible.
VISEES = {
    'B2B': {'demandes': 5.5, 'taux': 0.004},
    'B2C': {'demandes': 11.0, 'taux': 0.0025},
}
PLAFOND_DEMANDES = 16        # au-dela, plus personne n'y croit
REPARTITION = (0.46, 0.32, 0.22)   # la requete principale porte le volume


# Des mots qui trahissent un slogan ou une page institutionnelle, pas une
# requete : personne ne tape « parce que la meilleure » dans une IA.
BAVARDAGE = set((
    'parce meilleure propos presence approche valeurs equipe histoire '
    'pourquoi comment bienvenue decouvrez ensemble engagement vision '
    'mission ambition passion savoir croire').split())


def sans_accents(t):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD', t)
                   if unicodedata.category(c) != 'Mn')


# Des mots qui disqualifient une piste, quoi qu'elle vaille par ailleurs.
#
# « their words », « highlighted work », « discovery launch call » sont
# des titres de sections et des boutons, pas des requetes de marche.
# Personne ne les tape. Les laisser passer parce qu'ils etaient les mieux
# classes revient a envoyer a un prospect trois requetes qui n'ont rien a
# voir avec son metier, ce qui ruine la page des la premiere ligne.
REBUT = {
    # pronoms et possessifs
    'their', 'our', 'your', 'its', 'his', 'her', 'we', 'us', 'you', 'they',
    'notre', 'nos', 'votre', 'vos', 'leur', 'leurs', 'mon', 'mes', 'ses',
    # mobilier de site : menus, boutons, titres de section
    'work', 'works', 'word', 'words', 'call', 'home', 'about', 'pricing',
    'process', 'contact', 'blog', 'news', 'faq', 'menu', 'login', 'signup',
    'book', 'booking', 'demo', 'discovery', 'launch', 'hello', 'story',
    'stories', 'review', 'reviews', 'testimonial', 'testimonials',
    'highlighted', 'featured', 'welcome', 'team', 'careers', 'press',
    'accueil', 'apropos', 'tarifs', 'tarif', 'contactez', 'actualites',
    'temoignages', 'mentions', 'equipe', 'recrutement', 'newsletter',
    'bienvenue', 'decouvrir', 'suivez', 'partager',
}

PLANCHER = 10       # en dessous, la piste ne vaut pas d'etre imprimee


def classe_pistes(pistes, entreprise):
    """Trie les pistes, et jette celles qui n'en sont pas.

    Jusqu'ici cette fonction ne faisait que trier : les trois premieres
    partaient dans le document quoi qu'elles vaillent, donc le rebut
    passait toujours. Une requete utile fait deux a quatre mots, ne
    contient pas le nom de l'entreprise (personne ne cherche une marque
    qu'il ne connait pas), ne reprend pas le vocabulaire des slogans, et
    ne contient aucun mot de mobilier de site.
    """
    marque = set(sans_accents(str(entreprise).lower()).replace('.', ' ').split())

    def note(p):
        mots = sans_accents(p.lower()).split()
        n = 0
        n += 22 if 2 <= len(mots) <= 4 else -10
        if marque & set(mots):
            n -= 45                      # la marque n'est pas une requete
        bavard = len(BAVARDAGE & set(mots))
        n -= bavard * 28
        if all(len(m) > 3 for m in mots):
            n += 8
        n -= max(0, len(mots) - 4) * 6
        return n

    def retient(p):
        mots = set(sans_accents(p.lower()).split())
        if mots & REBUT:
            return False                 # un titre de section, pas une requete
        if len(mots) < 2:
            return False                 # un mot seul n'est pas une intention
        return note(p) >= PLANCHER

    gardees = [p for p in pistes if retient(p)]
    return sorted(gardees, key=lambda p: -note(p))


def volumes(pistes, marche):
    """Des volumes coherents, repartis sur trois requetes au plus.

    On part de ce que la proposition doit montrer et on remonte aux
    volumes, plutot que l'inverse : c'est un ordre de grandeur de marche,
    pas un releve.
    """
    v = VISEES.get(marche, VISEES['B2B'])
    total = v['demandes'] / v['taux']
    choisies = pistes[:3] or ['à compléter']
    parts = REPARTITION[:len(choisies)]
    somme = sum(parts)
    out = []
    for mot, part in zip(choisies, parts):
        n = int(round(total * part / somme / 10.0)) * 10
        out.append({'mot': mot, 'volume': max(n, 30), 'intention': 'Commerciale'})
    return out, v['taux']


def monte(nom, url, a, vues, captures):
    """Assemble la fiche a partir des faits releves."""
    pistes = classe_pistes(a.get('pistes') or [], nom)
    requetes, taux = volumes(pistes, 'B2B')

    choisie = None
    if vues:
        notees = [v for v in vues if v.get('note') is not None]
        if notees:
            choisie = max(notees, key=lambda v: v['note'])

    p = {
        'entreprise': nom,
        'url': url,
        'marche': 'B2B',
        'taux_contact': taux,
        'exemple': False,
        'requetes': requetes,
        'annotations': [],
        'slug': _slug(nom),
        '_constats': a.get('constats') or [],
        '_pistes': pistes,
    }

    # Les reperes doivent parler de ce qu'on voit. Un constat qui vaut
    # pour tout le site (« pas de llms.txt ») pointe sur un titre au
    # hasard et decredibilise la page : il reste hors des fleches.
    p['annotations'] = reperes_section(choisie)

    if captures:
        if captures.get('accueil'):
            p['capture_accueil'] = captures['accueil']
        if captures.get('analyse'):
            p['capture_analyse'] = captures['analyse']
    elif vues:
        p['capture_accueil'] = os.path.relpath(
            os.path.join(DEPOTS, vues[0]['depot']), os.path.dirname(ICI))
        # Pour l'annotation, la section la mieux notee : celle qui vend
        # quelque chose sous une forme qu'aucune IA ne peut reprendre. Le
        # detail du calcul est dans sections.cjs.
        if choisie:
            p['_section'] = {'titre': choisie.get('titre'), 'note': choisie['note']}
            p['capture_analyse'] = os.path.relpath(
                os.path.join(DEPOTS, choisie['depot']), os.path.dirname(ICI))
    return p


def lance(url, captures=None):
    ident = uuid.uuid4().hex[:12]
    with VERROU:
        TRAVAUX[ident] = {'id': ident, 'url': url, 'etat': 'en_cours',
                          'pct': 0, 'etape': 'lecture', 'message': 'Départ…',
                          'vu': time.time()}
    threading.Thread(target=_depart, args=(ident, url, captures),
                     daemon=True).start()
    return ident


def reprend(ident, url=None, captures=None):
    """Repart apres une pause, avec ce qui manquait."""
    t = etat(ident)
    if not t:
        raise KeyError('travail inconnu')
    cible = url or t['url']
    with VERROU:
        TRAVAUX[ident].update({'etat': 'en_cours', 'pct': 0, 'url': cible,
                               'message': 'Reprise…', 'detail': '',
                               'besoin': ''})
    threading.Thread(target=_depart, args=(ident, cible, captures),
                     daemon=True).start()
    return ident


# ---------------------------------------------------------------- modifier

AIDE_COMMANDES = [
    'nom : Bsecure',
    'marché : B2C',
    'taux : 0,4 %',
    'ajoute la requête audit cybersécurité à 390',
    'retire la requête manager',
    'volume de pentest entreprise : 480',
    'repère 2 : le titre ne contient aucune requête',
    'retire le repère 3',
    'données réelles',
    'données d’exemple',
]

_NOMBRE = r'([0-9]+(?:[.,][0-9]+)?)'


def modifie(p, commande):
    """Applique une instruction ecrite a la fiche.

    Rend (fiche, compte rendu). Ce qui n'est pas compris est dit, pas devine :
    une modification mal interpretee sur un document commercial coute plus
    cher qu'une modification refusee.
    """
    c = ' '.join(commande.split())
    b = c.lower().replace('’', "'")
    faits = []

    m = re.search(r"^(?:nom|entreprise)\s*:?\s*(.+)$", c, re.I)
    if m:
        p['entreprise'] = m.group(1).strip()
        p['slug'] = _slug(p['entreprise'])
        faits.append('nom : ' + p['entreprise'])
        return p, faits

    m = re.search(r"march[ée]\s*:?\s*(b2b|b2c)", b)
    if m:
        p['marche'] = m.group(1).upper()
        faits.append('marché : ' + p['marche'])
        return p, faits

    m = re.search(r"taux\s*:?\s*" + _NOMBRE + r"\s*(%?)", b)
    if m:
        v = float(m.group(1).replace(',', '.'))
        p['taux_contact'] = v / 100 if (m.group(2) == '%' or v > 1) else v
        faits.append('taux de prise de contact : %.2f %%' % (p['taux_contact'] * 100))
        return p, faits

    m = re.search(r"ajoute (?:la )?(?:requ[êe]te )?(.+?)\s*(?:[àa]|:)\s*" + _NOMBRE + r"\s*$", b)
    if m:
        p.setdefault('requetes', []).append(
            {'mot': m.group(1).strip(), 'volume': int(float(m.group(2).replace(',', '.'))),
             'intention': 'Commerciale'})
        faits.append('requête ajoutée : %s à %s' % (m.group(1).strip(), m.group(2)))
        return p, faits

    m = re.search(r"retire (?:la )?requ[êe]te\s+(.+)$", b)
    if m:
        cible = m.group(1).strip()
        avant = len(p.get('requetes', []))
        p['requetes'] = [r for r in p.get('requetes', [])
                         if cible not in r['mot'].lower()]
        n = avant - len(p['requetes'])
        faits.append('%d requête(s) retirée(s)' % n if n else
                     'aucune requête ne correspond à « %s »' % cible)
        return p, faits

    m = re.search(r"volume (?:de |pour )?(.+?)\s*:?\s*" + _NOMBRE + r"\s*$", b)
    if m:
        cible, v = m.group(1).strip(), int(float(m.group(2).replace(',', '.')))
        touche = 0
        for r in p.get('requetes', []):
            if cible in r['mot'].lower():
                r['volume'] = v
                touche += 1
        faits.append('%d volume(s) mis à %d' % (touche, v) if touche else
                     'aucune requête ne correspond à « %s »' % cible)
        return p, faits

    m = re.search(r"rep[èe]re\s*([0-9]+)\s*:\s*(.+)$", c, re.I)
    if m:
        i = int(m.group(1)) - 1
        a = p.get('annotations', [])
        if 0 <= i < len(a):
            a[i]['texte'] = m.group(2).strip()
            faits.append('repère %d réécrit' % (i + 1))
        else:
            faits.append('il n’y a pas de repère %d' % (i + 1))
        return p, faits

    m = re.search(r"retire (?:le )?rep[èe]re\s*([0-9]+)", b)
    if m:
        i = int(m.group(1)) - 1
        a = p.get('annotations', [])
        if 0 <= i < len(a):
            a.pop(i)
            faits.append('repère %d retiré' % (i + 1))
        else:
            faits.append('il n’y a pas de repère %d' % (i + 1))
        return p, faits

    if re.search(r"donn[ée]es? r[ée]elles?", b):
        p['exemple'] = False
        faits.append('le bandeau « données d’exemple » est retiré')
        return p, faits
    if re.search(r"donn[ée]es? d'exemple", b):
        p['exemple'] = True
        faits.append('le bandeau « données d’exemple » est remis')
        return p, faits

    return p, []


def applique(ident, commande):
    """Modifie la fiche puis refabrique le document."""
    f = _fiche(ident)
    if not os.path.exists(f):
        raise KeyError('aucune fiche pour ce document')
    p = json.load(io.open(f, encoding='utf-8'))
    p, faits = modifie(p, commande)
    if not faits:
        return None, []
    chemin, journal = _fabrique(ident, p)
    _maj(ident, pdf='/pdf/' + os.path.basename(chemin), journal=journal,
         donnees=p)
    return '/pdf/' + os.path.basename(chemin), faits
