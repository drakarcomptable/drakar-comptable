"""
Configuration du profil candidat et des paramètres de recherche.
"""

# === PROFIL CANDIDAT ===
PROFIL = {
    "nom": "Matthieu Batard",
    "email": "matthieu.batardpro@gmail.com",
    "localisation": "Paris",
    "type_contrat": "CDI",
    "formation": [
        "Master Management de l'Innovation, Grande École SUP de CO, Grenoble EM",
        "University of Texas at Dallas (parcours international)",
        "DUT GEA, Management des Organisations, IUT A de Lille",
    ],
    "experiences": [
        "Études Marketing (LFP Média) — analyse données, audiences, campagnes",
        "Chef de projet Innovation (Radiofrance) — veille, événements, intrapreneuriat",
        "Contrôleur de Gestion Distribution Internationale (Studiocanal/Canal+) — reporting, facturation",
        "Responsable Customer Success (Assurly) — conversion, relation client, produit",
    ],
    "competences": [
        "Excel", "Power BI", "SAP", "Microsoft Office", "Microsoft Project",
        "Analyse de données", "Reporting financier", "Gestion de projet",
        "Marketing", "Études de marché", "CRM", "Customer Success",
        "Contrôle de gestion", "Business Intelligence",
    ],
    "langues": ["Français (natif)", "Anglais C1", "Allemand B2"],
}

# === POSTES RECHERCHÉS (par priorité décroissante) ===
POSTES_CIBLES = [
    {"titre": "Customer Success Manager", "priorite": 10, "aliases": [
        "CSM", "Customer Success", "Responsable Customer Success",
        "Customer Success Manager", "Responsable succès client",
        "Client Success Manager", "Chargé de Customer Success",
    ]},
    {"titre": "Responsable Marketing", "priorite": 10, "aliases": [
        "Responsable Marketing", "Chargé de marketing", "Marketing Manager",
        "Chef de projet marketing", "Marketing Coordinator",
        "Chargé d'études marketing", "Chargé de communication et marketing",
        "Marketing Analyst", "Digital Marketing Manager",
    ]},
    {"titre": "Business Intelligence", "priorite": 9, "aliases": [
        "Business Intelligence", "BI Analyst", "Analyste BI",
        "Data Analyst", "Analyste de données", "Business Analyst",
        "Chargé de reporting", "Analyste décisionnel",
        "BI Developer", "Consultant BI",
    ]},
    {"titre": "Contrôleur de gestion", "priorite": 9, "aliases": [
        "Contrôleur de gestion", "Contrôle de gestion",
        "Management Controller", "Financial Controller",
        "Contrôleur financier", "Contrôleur de gestion junior",
        "Assistant contrôle de gestion",
    ]},
    {"titre": "Chef de projet", "priorite": 7, "aliases": [
        "Chef de projet", "Project Manager", "Chargé de projet",
        "Chef de projet digital", "Chef de projet innovation",
        "Coordinateur de projet",
    ]},
    {"titre": "Commercial", "priorite": 3, "aliases": [
        "Commercial", "Business Developer", "Account Manager",
        "Chargé d'affaires", "Sales Manager", "Account Executive",
        "Commercial terrain", "Ingénieur commercial",
    ]},
]

# === MOTS-CLÉS DE RECHERCHE ===
MOTS_CLES_RECHERCHE = [
    "Customer Success Manager CDI Paris",
    "CSM junior Paris CDI",
    "Responsable marketing Paris CDI",
    "Chargé marketing CDI Paris",
    "Chef de projet marketing Paris",
    "Business Intelligence analyst Paris CDI",
    "Data analyst junior Paris CDI",
    "Analyste BI Paris",
    "Contrôleur de gestion Paris CDI",
    "Contrôle de gestion junior Paris",
    "Chef de projet innovation Paris CDI",
    "Business analyst Paris CDI",
    "Chargé d'études marketing Paris CDI",
    "Marketing analyst Paris CDI",
    "Reporting analyst Paris CDI",
]

# === LOCALISATION ===
LOCALISATIONS_ACCEPTEES = [
    "paris", "île-de-france", "ile-de-france", "idf",
    "hauts-de-seine", "92", "75", "93", "94",
    "boulogne", "issy-les-moulineaux", "levallois",
    "neuilly", "la défense", "puteaux", "nanterre",
    "saint-denis", "montreuil", "vincennes",
]

# === CONFIG EMAIL ===
EMAIL_CONFIG = {
    "destinataire": "matthieu.batardpro@gmail.com",
    "sujet_prefix": "[Job Scraper] Offres du jour",
    # Pour l'envoi via Gmail SMTP, il faut un mot de passe d'application
    # Voir README pour la configuration
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "expediteur": "",       # À remplir avec votre email d'envoi
    "mot_de_passe": "",     # À remplir avec le mot de passe d'application Gmail
}

# === SCRAPING CONFIG ===
SCRAPING = {
    "max_offres_par_source": 50,
    "delai_entre_requetes": 2,  # secondes
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "note_minimum_affichage": 3,  # Note minimum pour inclure dans le rapport
}
