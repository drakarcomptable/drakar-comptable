# Job Scraper — Guide de configuration

## Installation rapide

```bash
cd job-scraper
pip install -r requirements.txt
```

## Lancement

```bash
# Scraping complet (toutes les plateformes) + rapport HTML local
python main.py --save-html

# Mode test (pas d'email)
python main.py --dry-run --save-html

# Filtrer uniquement les très bonnes offres (note >= 6)
python main.py --note-min 6 --save-html

# Scraper uniquement Indeed et WTTJ
python main.py --sources indeed,wttj --save-html

# Ou en une ligne via le script bash :
./run.sh --save-html
```

## Configuration email (Gmail)

Pour recevoir le rapport par email à matthieu.batardpro@gmail.com :

1. Aller sur https://myaccount.google.com/apppasswords
2. Créer un "mot de passe d'application" pour "Mail"
3. Configurer dans `config.py` :

```python
EMAIL_CONFIG = {
    "destinataire": "matthieu.batardpro@gmail.com",
    "expediteur": "votre-email@gmail.com",
    "mot_de_passe": "xxxx xxxx xxxx xxxx",  # mot de passe d'application
}
```

Ou via variables d'environnement :

```bash
export SMTP_EMAIL="votre-email@gmail.com"
export SMTP_PASSWORD="xxxx xxxx xxxx xxxx"
python main.py
```

## Automatisation (cron)

Pour lancer le scraping tous les jours à 8h :

```bash
crontab -e
# Ajouter :
0 8 * * * cd /chemin/vers/job-scraper && python3 main.py >> scraper.log 2>&1
```

## Sources scrapées

| Source | Méthode |
|--------|---------|
| Indeed | Scraping direct |
| Welcome to the Jungle | Scraping direct |
| LinkedIn | Via résultats Google |
| France Travail | Via résultats Google |
| APEC | Via résultats Google |
| HelloWork | Via résultats Google |
| Google Jobs | Recherche générale |

## Système de notation (0-10)

| Critère | Points |
|---------|--------|
| Correspondance titre/poste | 0–4 |
| Localisation Paris/IDF | 0–2 |
| Contrat CDI | 0–1 |
| Compétences trouvées | 0–2 |
| Bonus (junior, innovation...) | 0–1 |
| Pénalité séniorité | -0 à -3 |
