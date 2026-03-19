#!/bin/bash
# =============================================================
# Job Scraper — Lancement en une ligne
# =============================================================
# Usage :
#   ./run.sh                     # Scraping complet + rapport
#   ./run.sh --dry-run           # Test sans email
#   ./run.sh --save-html         # Sauvegarder aussi en HTML
#   ./run.sh --note-min 5        # Filtrer note >= 5
#   ./run.sh --sources indeed,wttj  # Sources spécifiques
# =============================================================

cd "$(dirname "$0")"

# Installer les dépendances si nécessaire
pip install -q -r requirements.txt 2>/dev/null

# Lancer le scraper
python3 main.py "$@"
