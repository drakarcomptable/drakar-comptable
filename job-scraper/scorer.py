"""
Système de notation des offres d'emploi (0-10) basé sur le profil candidat.

Barème :
- Correspondance titre/poste : 0-4 pts
- Localisation Paris/IDF : 0-2 pts
- Type de contrat CDI : 0-1 pt
- Compétences mentionnées : 0-2 pts
- Niveau d'expérience (junior/non spécifié/senior) : +1.5 à -4 pts
- Bonus secteur/profil : 0-1 pt
"""

import re
from config import PROFIL, POSTES_CIBLES, LOCALISATIONS_ACCEPTEES


def normaliser(texte: str) -> str:
    """Normalise un texte pour la comparaison."""
    if not texte:
        return ""
    return re.sub(r"\s+", " ", texte.lower().strip())


def detecter_niveau_experience(texte: str) -> str:
    """
    Détecte le niveau d'expérience dans une offre.
    Retourne : 'junior', 'mid', 'senior', ou 'non_specifie'.
    """
    # Mots clairement JUNIOR
    junior_patterns = [
        r"\bjunior\b", r"\bdébutant\b", r"\bdebutant\b",
        r"\bpremier emploi\b", r"\bjeune diplômé\b", r"\bjeune diplomé\b",
        r"\bentry[ -]level\b", r"\bgraduate\b",
        r"\b0[- ]?[àa]?[- ]?[12] ans?\b",  # 0-1 an, 0-2 ans
        r"\b1[- ]?[àa]?[- ]?2 ans?\b",      # 1-2 ans
        r"\b1[- ]?[àa]?[- ]?3 ans?\b",      # 1-3 ans
        r"\bsans expérience\b",
        r"\bprofil débutant\b",
        r"\bsortie d'école\b", r"\bsortie école\b",
        r"\bfraîchement diplômé\b",
    ]

    # Mots clairement SENIOR / expérimenté
    senior_patterns = [
        r"\bsenior\b", r"\bsénior\b", r"\bsr\.\b",
        r"\bexpérimenté\b", r"\bexperimente\b", r"\bconfirmé\b",
        r"\b[5-9] ans?\b.*expérience", r"\b[5-9] ans?\b.*experience",
        r"\b1[0-9] ans?\b",  # 10+ ans
        r"\b[89][- ]?[àa]?[- ]?1[0-9] ans?\b",  # 8-10 ans, etc.
        r"\b5[- ]?[àa]?[- ]?[0-9]+ ans?\b",     # 5-X ans
        r"\b7[- ]?[àa]?[- ]?[0-9]+ ans?\b",     # 7-X ans
        r"\bdirecteur\b", r"\bdirectrice\b",
        r"\bhead of\b", r"\bvp\b", r"\bvice[ -]president\b",
        r"\blead\b", r"\bprincipal\b", r"\bstaff\b",
        r"\bc-level\b", r"\bchief\b",
        r"\bmanagement d'équipe\b", r"\bencadrement\b.*équipe",
    ]

    # Mots MID-LEVEL
    mid_patterns = [
        r"\b[3-4] ans?\b.*expérience", r"\b[3-4] ans?\b.*experience",
        r"\b2[- ]?[àa]?[- ]?5 ans?\b",  # 2-5 ans
        r"\b3[- ]?[àa]?[- ]?5 ans?\b",  # 3-5 ans
        r"\bintermédiaire\b",
    ]

    is_junior = any(re.search(p, texte) for p in junior_patterns)
    is_senior = any(re.search(p, texte) for p in senior_patterns)
    is_mid = any(re.search(p, texte) for p in mid_patterns)

    if is_junior and not is_senior:
        return "junior"
    if is_senior and not is_junior:
        return "senior"
    if is_mid:
        return "mid"
    return "non_specifie"


def noter_offre(offre: dict) -> dict:
    """
    Attribue une note de 0 à 10 à une offre d'emploi.

    Critères de notation :
    - Correspondance titre/poste (0-4 points)
    - Localisation (0-2 points)
    - Type de contrat CDI (0-1 point)
    - Compétences mentionnées (0-2 points)
    - Niveau d'expérience (variable)
    - Bonus secteur/profil (0-1 point)

    Retourne l'offre enrichie avec 'note', 'note_detail', 'categorie_poste', 'niveau'.
    """
    titre = normaliser(offre.get("titre", ""))
    description = normaliser(offre.get("description", ""))
    localisation = normaliser(offre.get("localisation", ""))
    contrat = normaliser(offre.get("type_contrat", ""))
    entreprise = normaliser(offre.get("entreprise", ""))
    texte_complet = f"{titre} {description} {localisation} {contrat} {entreprise}"

    note = 0.0
    details = []

    # --- 1. Correspondance poste (0-4 points) ---
    meilleur_match_poste = None
    meilleur_score_poste = 0

    for poste in POSTES_CIBLES:
        for alias in poste["aliases"]:
            alias_norm = normaliser(alias)
            # Match exact dans le titre = score max
            if alias_norm in titre:
                score = (poste["priorite"] / 10) * 4
                if score > meilleur_score_poste:
                    meilleur_score_poste = score
                    meilleur_match_poste = poste["titre"]
            # Match dans la description = score réduit
            elif alias_norm in description:
                score = (poste["priorite"] / 10) * 2.5
                if score > meilleur_score_poste:
                    meilleur_score_poste = score
                    meilleur_match_poste = poste["titre"]

    note += meilleur_score_poste
    if meilleur_match_poste:
        details.append(f"Poste: {meilleur_match_poste} (+{meilleur_score_poste:.1f})")

    # --- 2. Localisation (0-2 points) ---
    score_loc = 0
    for loc in LOCALISATIONS_ACCEPTEES:
        if loc in localisation or loc in texte_complet:
            score_loc = 2
            break
    if score_loc == 0 and ("remote" in texte_complet or "télétravail" in texte_complet):
        score_loc = 1.5
    note += score_loc
    if score_loc > 0:
        details.append(f"Localisation OK (+{score_loc})")

    # --- 3. Type de contrat (0-1 point) ---
    score_contrat = 0
    if "cdi" in texte_complet:
        score_contrat = 1
    elif "cdd" in texte_complet or "alternance" in texte_complet:
        score_contrat = 0.3
    note += score_contrat
    if score_contrat > 0:
        details.append(f"Contrat: CDI (+{score_contrat})")

    # --- 4. Compétences (0-2 points) ---
    competences_trouvees = []
    competences_check = [
        "excel", "power bi", "powerbi", "sap", "crm", "reporting",
        "gestion de projet", "marketing", "analyse",
        "customer success", "business intelligence",
        "contrôle de gestion", "data", "kpi", "dashboard",
        "salesforce", "hubspot", "google analytics",
        "tableau", "sql", "erp", "budgets", "prévisions",
        "études de marché", "veille concurrentielle",
        "facturation", "trésorerie", "consolidation",
        "roi", "acquisition", "conversion", "rétention",
        "onboarding", "churn", "nps", "satisfaction client",
    ]
    for comp in competences_check:
        if comp in texte_complet:
            competences_trouvees.append(comp)

    score_comp = min(2, len(competences_trouvees) * 0.35)
    note += score_comp
    if competences_trouvees:
        details.append(f"Compétences: {', '.join(competences_trouvees[:5])} (+{score_comp:.1f})")

    # --- 5. Niveau d'expérience (JUNIOR / NON SPECIFIE / MID / SENIOR) ---
    niveau = detecter_niveau_experience(texte_complet)

    if niveau == "junior":
        # PRIORITE N°1 : offre junior = gros bonus
        score_niveau = 1.5
        details.append(f"Niveau: JUNIOR (+{score_niveau})")
    elif niveau == "non_specifie":
        # Pas de mention de niveau = probablement accessible, léger bonus
        score_niveau = 0.5
        details.append(f"Niveau: non spécifié (+{score_niveau})")
    elif niveau == "mid":
        # Mid-level = pas idéal mais jouable
        score_niveau = -0.5
        details.append(f"Niveau: intermédiaire ({score_niveau})")
    elif niveau == "senior":
        # SENIOR = forte pénalité, ne correspond pas du tout
        score_niveau = -4
        details.append(f"Niveau: SENIOR ({score_niveau})")
    else:
        score_niveau = 0

    note += score_niveau

    # --- 6. Bonus secteur / profil (0-1 point) ---
    bonus = 0
    mots_bonus_forts = [
        "innovation", "média", "audiovisuel", "sport",
        "international", "anglais", "trilingue",
        "musique", "cinéma", "entertainment", "divertissement",
        "radio", "télévision", "streaming",
    ]
    mots_bonus_legers = [
        "startup", "scale-up", "saas", "tech",
        "e-commerce", "luxe", "mode", "culture",
        "agile", "collaboratif",
    ]
    forts_trouves = [m for m in mots_bonus_forts if m in texte_complet]
    legers_trouves = [m for m in mots_bonus_legers if m in texte_complet]
    bonus = min(1, len(forts_trouves) * 0.3 + len(legers_trouves) * 0.15)
    note += bonus
    tous_bonus = forts_trouves + legers_trouves
    if tous_bonus:
        details.append(f"Secteur: {', '.join(tous_bonus[:4])} (+{bonus:.1f})")

    # Plafonner entre 0 et 10
    note_finale = max(0, min(10, round(note, 1)))

    offre["note"] = note_finale
    offre["note_detail"] = " | ".join(details) if details else "Peu de correspondance"
    offre["categorie_poste"] = meilleur_match_poste or "Non catégorisé"
    offre["niveau"] = niveau

    return offre


def trier_offres(offres: list) -> list:
    """Trie les offres par note décroissante."""
    return sorted(offres, key=lambda x: x.get("note", 0), reverse=True)


def filtrer_offres(offres: list, note_min: float = 3) -> list:
    """Filtre les offres en dessous d'une note minimum."""
    return [o for o in offres if o.get("note", 0) >= note_min]
