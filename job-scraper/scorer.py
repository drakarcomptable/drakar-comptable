"""
Système de notation des offres d'emploi (0-10) basé sur le profil candidat.
"""

import re
from config import PROFIL, POSTES_CIBLES, LOCALISATIONS_ACCEPTEES


def normaliser(texte: str) -> str:
    """Normalise un texte pour la comparaison."""
    if not texte:
        return ""
    return re.sub(r"\s+", " ", texte.lower().strip())


def noter_offre(offre: dict) -> dict:
    """
    Attribue une note de 0 à 10 à une offre d'emploi.

    Critères de notation :
    - Correspondance titre/poste (0-4 points)
    - Localisation (0-2 points)
    - Type de contrat CDI (0-1 point)
    - Compétences mentionnées (0-2 points)
    - Bonus : mots-clés profil (0-1 point)

    Retourne l'offre enrichie avec 'note', 'note_detail', 'categorie_poste'.
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
        "excel", "power bi", "sap", "crm", "reporting",
        "gestion de projet", "marketing", "analyse",
        "customer success", "business intelligence",
        "contrôle de gestion", "data", "kpi", "dashboard",
        "salesforce", "hubspot", "google analytics",
    ]
    for comp in competences_check:
        if comp in texte_complet:
            competences_trouvees.append(comp)

    score_comp = min(2, len(competences_trouvees) * 0.4)
    note += score_comp
    if competences_trouvees:
        details.append(f"Compétences: {', '.join(competences_trouvees[:5])} (+{score_comp:.1f})")

    # --- 5. Bonus profil (0-1 point) ---
    bonus = 0
    mots_bonus = [
        "junior", "débutant", "premier emploi", "jeune diplômé",
        "0-2 ans", "1-3 ans", "entry level",
        "innovation", "média", "audiovisuel", "sport",
        "international", "anglais", "trilingue",
    ]
    mots_trouves = [m for m in mots_bonus if m in texte_complet]
    bonus = min(1, len(mots_trouves) * 0.25)
    note += bonus
    if mots_trouves:
        details.append(f"Bonus: {', '.join(mots_trouves[:4])} (+{bonus:.1f})")

    # --- Pénalités ---
    penalites_mots = [
        "senior", "10 ans", "8 ans", "directeur", "head of",
        "lead", "principal", "staff", "vp ",
    ]
    penalite = 0
    for mot in penalites_mots:
        if mot in texte_complet:
            penalite += 1.5
    penalite = min(3, penalite)
    note -= penalite
    if penalite > 0:
        details.append(f"Pénalité séniorité (-{penalite})")

    # Plafonner entre 0 et 10
    note_finale = max(0, min(10, round(note, 1)))

    offre["note"] = note_finale
    offre["note_detail"] = " | ".join(details) if details else "Peu de correspondance"
    offre["categorie_poste"] = meilleur_match_poste or "Non catégorisé"

    return offre


def trier_offres(offres: list) -> list:
    """Trie les offres par note décroissante."""
    return sorted(offres, key=lambda x: x.get("note", 0), reverse=True)


def filtrer_offres(offres: list, note_min: float = 3) -> list:
    """Filtre les offres en dessous d'une note minimum."""
    return [o for o in offres if o.get("note", 0) >= note_min]
