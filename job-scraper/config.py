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
# Priorité : 10 = coeur de cible, 8-9 = très pertinent, 6-7 = intéressant,
#             4-5 = acceptable, 3 = dernier recours
POSTES_CIBLES = [
    # ─── COEUR DE CIBLE (priorité 10) ───
    {"titre": "Customer Success Manager", "priorite": 10, "aliases": [
        "CSM", "Customer Success", "Responsable Customer Success",
        "Customer Success Manager", "Responsable succès client",
        "Client Success Manager", "Chargé de Customer Success",
        "Customer Success Specialist", "Customer Success Associate",
        "Responsable relation client", "Chargé de relation client",
        "Client Relationship Manager", "Customer Experience Manager",
        "Responsable fidélisation", "Chargé de fidélisation client",
        "Customer Engagement Manager", "Customer Onboarding Manager",
        "Responsable satisfaction client", "Client Partner",
        "Customer Care Manager", "Responsable accompagnement client",
    ]},
    {"titre": "Responsable Marketing", "priorite": 10, "aliases": [
        "Responsable Marketing", "Chargé de marketing", "Marketing Manager",
        "Chef de projet marketing", "Marketing Coordinator",
        "Chargé d'études marketing", "Chargé de communication et marketing",
        "Marketing Analyst", "Digital Marketing Manager",
        "Coordinateur marketing", "Assistant marketing",
        "Chargé de marketing opérationnel", "Marketing Specialist",
        "Responsable marketing digital", "Responsable marketing opérationnel",
        "Brand Manager", "Responsable de marque", "Chef de marque",
        "Chargé de marketing et communication", "Responsable communication",
        "Traffic Manager", "Growth Marketing Manager", "Growth Manager",
        "Responsable acquisition", "Chargé d'acquisition",
        "Responsable CRM", "CRM Manager", "Chargé CRM",
        "Marketing Operations Manager", "Marketing Ops",
        "Content Marketing Manager", "Chargé de contenu",
        "Responsable contenu", "Content Manager",
        "Social Media Manager", "Community Manager",
        "Chargé de communication digitale", "Responsable média",
        "Media Planner", "Chargé média",
    ]},

    # ─── TRÈS PERTINENT (priorité 9) ───
    {"titre": "Business Intelligence", "priorite": 9, "aliases": [
        "Business Intelligence", "BI Analyst", "Analyste BI",
        "Data Analyst", "Analyste de données", "Business Analyst",
        "Chargé de reporting", "Analyste décisionnel",
        "BI Developer", "Consultant BI",
        "Data Analyst Marketing", "Analyste data",
        "Chargé d'études statistiques", "Chargé d'études",
        "Analyste business", "Analyste de performance",
        "Performance Analyst", "Insight Analyst",
        "Reporting Analyst", "Chargé de data analyse",
        "Consultant data", "Data & Reporting Analyst",
        "Analyste KPI", "Tableau de bord analyst",
        "Chargé de veille et analyse", "Market Research Analyst",
        "Chargé d'études de marché", "Analyste études de marché",
        "Revenue Analyst", "Analyste revenus",
    ]},
    {"titre": "Contrôleur de gestion", "priorite": 9, "aliases": [
        "Contrôleur de gestion", "Contrôle de gestion",
        "Management Controller", "Financial Controller",
        "Contrôleur financier", "Contrôleur de gestion junior",
        "Assistant contrôle de gestion",
        "Contrôleur de gestion commerciale", "Contrôleur de gestion marketing",
        "Contrôleur de gestion opérationnel", "Contrôleur budgétaire",
        "Analyste financier", "Financial Analyst",
        "Chargé de contrôle de gestion", "Gestionnaire financier",
        "Analyste budget", "Budget Analyst",
        "Contrôleur de gestion média", "Contrôleur de gestion distribution",
        "Revenue Controller", "Cost Controller",
        "Responsable contrôle de gestion",
        "Auditeur interne", "Auditeur junior",
        "FP&A Analyst", "Financial Planning Analyst",
    ]},

    # ─── INTÉRESSANT (priorité 8) ───
    {"titre": "Chef de projet", "priorite": 8, "aliases": [
        "Chef de projet", "Project Manager", "Chargé de projet",
        "Chef de projet digital", "Chef de projet innovation",
        "Coordinateur de projet", "Project Coordinator",
        "Chef de projet CRM", "Chef de projet data",
        "Chef de projet web", "Chef de projet e-commerce",
        "Chef de projet communication", "Chef de projet événementiel",
        "Chargé de projet digital", "Chargé de projet marketing",
        "Chargé de projet innovation", "Program Manager",
        "Delivery Manager", "Scrum Master",
        "Product Owner", "Chef de produit",
        "Responsable de projet", "PMO",
        "Chef de projet transformation",
    ]},
    {"titre": "Chargé d'études / Consultant", "priorite": 8, "aliases": [
        "Chargé d'études", "Consultant junior",
        "Consultant en management", "Consultant en organisation",
        "Consultant marketing", "Consultant CRM",
        "Consultant en stratégie", "Strategy Consultant",
        "Consultant fonctionnel", "Consultant digital",
        "Analyste consultant", "Consultant data",
        "Chargé de mission", "Chargé de mission marketing",
        "Chargé de mission innovation", "Chargé de mission data",
        "Consultant en transformation digitale",
        "Chargé d'études quantitatives", "Chargé d'études qualitatives",
    ]},

    # ─── POSTES CONNEXES PROFIL (priorité 7) ───
    {"titre": "Operations / Ops Manager", "priorite": 7, "aliases": [
        "Operations Manager", "Responsable opérations",
        "Chargé des opérations", "Business Operations",
        "Sales Operations", "Revenue Operations",
        "RevOps", "Sales Ops", "Marketing Ops",
        "Ops Manager", "Operations Analyst",
        "Responsable support", "Support Manager",
        "Responsable back-office", "Office Manager",
    ]},
    {"titre": "Product / Produit", "priorite": 7, "aliases": [
        "Product Manager", "Chef de produit",
        "Product Owner", "Product Analyst",
        "Responsable produit", "Product Marketing Manager",
        "Chargé de produit", "Associate Product Manager",
        "Product Specialist",
    ]},
    {"titre": "Account Manager / KAM", "priorite": 7, "aliases": [
        "Account Manager", "Key Account Manager",
        "Responsable de comptes", "Gestionnaire de comptes",
        "Chargé de comptes", "Client Account Manager",
        "Account Executive", "Strategic Account Manager",
        "Responsable grands comptes", "Chargé de clientèle",
        "Responsable portefeuille clients",
    ]},
    {"titre": "Média / Audiovisuel", "priorite": 7, "aliases": [
        "Chargé de médias", "Media Buyer", "Media Planner",
        "Chargé de production", "Assistant de production",
        "Chargé de programmation", "Chargé d'audience",
        "Audience Analyst", "Analyste audience",
        "Responsable diffusion", "Responsable distribution",
        "Chargé d'acquisition média", "Média trader",
    ]},

    # ─── ACCEPTABLE (priorité 5) ───
    {"titre": "Administratif / Gestion", "priorite": 5, "aliases": [
        "Assistant de gestion", "Gestionnaire administratif",
        "Assistant administratif et financier",
        "Chargé administratif", "Coordinator",
        "Office Manager", "Assistant de direction",
        "Gestionnaire back-office",
    ]},

    # ─── DERNIER RECOURS (priorité 3) ───
    {"titre": "Commercial", "priorite": 3, "aliases": [
        "Commercial", "Business Developer", "BDR",
        "Sales Manager", "Commercial terrain",
        "Ingénieur commercial", "Technico-commercial",
        "SDR", "Sales Development Representative",
        "Inside Sales", "Chargé de développement commercial",
        "Responsable commercial", "Commercial sédentaire",
        "Commercial B2B", "Commercial B2C",
        "Prospecteur", "Attaché commercial",
    ]},
]

# === MOTS-CLÉS DE RECHERCHE ===
MOTS_CLES_RECHERCHE = [
    # Coeur de cible
    "Customer Success Manager CDI Paris",
    "CSM junior Paris CDI",
    "Responsable relation client CDI Paris",
    "Chargé de fidélisation client Paris CDI",
    "Responsable marketing CDI Paris",
    "Chargé marketing CDI Paris",
    "Chef de projet marketing Paris CDI",
    "Marketing manager junior Paris CDI",
    "Chargé CRM Paris CDI",
    "Growth marketing Paris CDI",
    "Content manager Paris CDI",
    # BI / Data
    "Business Intelligence analyst Paris CDI",
    "Data analyst junior Paris CDI",
    "Analyste BI Paris CDI",
    "Chargé de reporting Paris CDI",
    "Chargé d'études marketing Paris CDI",
    "Marketing analyst Paris CDI",
    "Reporting analyst Paris CDI",
    "Analyste performance Paris CDI",
    # Contrôle de gestion
    "Contrôleur de gestion Paris CDI",
    "Contrôle de gestion junior Paris CDI",
    "Analyste financier junior Paris CDI",
    "FP&A analyst Paris CDI",
    # Chef de projet / Consultant
    "Chef de projet innovation Paris CDI",
    "Chef de projet digital Paris CDI",
    "Chargé de projet CRM Paris CDI",
    "Consultant junior management Paris CDI",
    "Chargé de mission Paris CDI",
    # Business Analyst / Ops
    "Business analyst Paris CDI",
    "Operations analyst Paris CDI",
    "Revenue operations Paris CDI",
    # Product
    "Product manager junior Paris CDI",
    "Chef de produit junior Paris CDI",
    # Account / KAM
    "Account manager junior Paris CDI",
    "Chargé de comptes Paris CDI",
    # Média
    "Chargé d'audience média Paris CDI",
    "Media planner junior Paris CDI",
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
