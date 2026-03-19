#!/usr/bin/env python3
"""
Job Scraper — Scraping automatisé d'offres d'emploi multi-plateformes.

Usage :
    python main.py                  # Scraping complet + rapport email/HTML
    python main.py --dry-run        # Test sans envoi d'email
    python main.py --note-min 5     # Filtrer les offres avec note >= 5
    python main.py --sources indeed,wttj  # Scraper uniquement certaines sources

Profil : Matthieu Batard — CDI Paris
Postes : CSM, Marketing, BI, Contrôle de gestion, Chef de projet, Commercial
"""

import argparse
import sys
import os
from datetime import datetime

# Ajouter le dossier courant au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scrapers import (
    scrape_toutes_plateformes,
    scrape_indeed,
    scrape_wttj,
    scrape_linkedin_via_google,
    scrape_france_travail,
    scrape_apec,
    scrape_hellowork,
    scrape_google_jobs,
)
from scorer import noter_offre, trier_offres, filtrer_offres
from emailer import envoyer_email, sauvegarder_rapport_local, generer_html_rapport
from config import SCRAPING


SOURCES_MAP = {
    "indeed": scrape_indeed,
    "wttj": scrape_wttj,
    "linkedin": scrape_linkedin_via_google,
    "francetravail": scrape_france_travail,
    "apec": scrape_apec,
    "hellowork": scrape_hellowork,
    "google": scrape_google_jobs,
}


def main():
    parser = argparse.ArgumentParser(
        description="Scraper automatisé d'offres d'emploi multi-plateformes"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Mode test : scrape et note, mais ne pas envoyer d'email"
    )
    parser.add_argument(
        "--note-min", type=float, default=SCRAPING["note_minimum_affichage"],
        help="Note minimale pour inclure une offre (défaut: 3)"
    )
    parser.add_argument(
        "--sources", type=str, default="",
        help="Sources à scraper, séparées par des virgules (ex: indeed,wttj,linkedin)"
    )
    parser.add_argument(
        "--save-html", action="store_true",
        help="Toujours sauvegarder le rapport HTML localement"
    )
    args = parser.parse_args()

    print("\n" + "=" * 60)
    print("  JOB SCRAPER — Matthieu Batard")
    print(f"  {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 60)

    # === 1. SCRAPING ===
    if args.sources:
        source_names = [s.strip().lower() for s in args.sources.split(",")]
        offres = []
        for name in source_names:
            if name in SOURCES_MAP:
                offres.extend(SOURCES_MAP[name]())
            else:
                print(f"⚠️  Source inconnue : {name}. Disponibles : {', '.join(SOURCES_MAP.keys())}")
    else:
        offres = scrape_toutes_plateformes()

    if not offres:
        print("\n❌ Aucune offre trouvée. Vérifiez votre connexion internet.")
        sys.exit(1)

    # === 2. NOTATION ===
    print(f"\n📊 Notation de {len(offres)} offres...")
    offres_notees = [noter_offre(offre) for offre in offres]

    # === 3. TRI ET FILTRAGE ===
    offres_triees = trier_offres(offres_notees)
    offres_filtrees = filtrer_offres(offres_triees, note_min=args.note_min)

    print(f"\n📋 Résultats :")
    print(f"   Total collecté : {len(offres)}")
    print(f"   Après filtrage (≥ {args.note_min}) : {len(offres_filtrees)}")

    # Afficher le top 10 dans la console
    print(f"\n🏆 TOP 10 des meilleures offres :")
    print("-" * 60)
    for i, offre in enumerate(offres_filtrees[:10], 1):
        note = offre.get("note", 0)
        titre = offre.get("titre", "")[:50]
        entreprise = offre.get("entreprise", "N/A")[:20]
        source = offre.get("source", "")
        categorie = offre.get("categorie_poste", "")
        print(f"  {i:2d}. [{note}/10] {titre}")
        print(f"      {entreprise} | {source} | {categorie}")

    # === 4. ENVOI / SAUVEGARDE ===
    if args.dry_run:
        print("\n🔸 Mode dry-run : pas d'envoi d'email.")
        if args.save_html:
            html = generer_html_rapport(offres_filtrees)
            sauvegarder_rapport_local(html)
    else:
        envoyer_email(offres_filtrees)

    if args.save_html and not args.dry_run:
        html = generer_html_rapport(offres_filtrees)
        sauvegarder_rapport_local(html)

    print(f"\n✅ Terminé ! {len(offres_filtrees)} offres pertinentes identifiées.\n")


if __name__ == "__main__":
    main()
