"""
Module d'envoi d'email avec le rapport des offres d'emploi.
Supporte : Gmail SMTP, fichier HTML local (fallback).
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

from config import EMAIL_CONFIG, PROFIL


def generer_html_rapport(offres: list) -> str:
    """Génère un rapport HTML élégant des offres triées par note."""

    date_str = datetime.now().strftime("%d/%m/%Y à %H:%M")

    # Grouper par catégorie
    categories = {}
    for offre in offres:
        cat = offre.get("categorie_poste", "Non catégorisé")
        categories.setdefault(cat, []).append(offre)

    # Stats
    total = len(offres)
    top_offres = sum(1 for o in offres if o.get("note", 0) >= 7)
    bonnes_offres = sum(1 for o in offres if 5 <= o.get("note", 0) < 7)

    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            margin: 0;
            padding: 20px;
            color: #333;
        }}
        .container {{
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 24px;
        }}
        .header p {{
            margin: 8px 0 0;
            opacity: 0.8;
            font-size: 14px;
        }}
        .stats {{
            display: flex;
            justify-content: center;
            gap: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }}
        .stat {{
            text-align: center;
        }}
        .stat-number {{
            font-size: 28px;
            font-weight: bold;
            color: #0f3460;
        }}
        .stat-label {{
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }}
        .section {{
            padding: 20px 30px;
        }}
        .section h2 {{
            color: #0f3460;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 8px;
            font-size: 18px;
        }}
        .offre {{
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 12px;
            transition: box-shadow 0.2s;
        }}
        .offre:hover {{
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        .offre-header {{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }}
        .offre-titre {{
            font-weight: bold;
            font-size: 16px;
            color: #1a1a2e;
            text-decoration: none;
        }}
        .offre-titre:hover {{
            color: #0f3460;
            text-decoration: underline;
        }}
        .note {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            min-width: 40px;
            text-align: center;
        }}
        .note-top {{ background: #d4edda; color: #155724; }}
        .note-good {{ background: #fff3cd; color: #856404; }}
        .note-ok {{ background: #f8d7da; color: #721c24; }}
        .offre-meta {{
            font-size: 13px;
            color: #666;
            margin-top: 5px;
        }}
        .offre-meta span {{
            margin-right: 15px;
        }}
        .offre-detail {{
            font-size: 12px;
            color: #888;
            margin-top: 8px;
            font-style: italic;
        }}
        .offre-desc {{
            font-size: 13px;
            color: #555;
            margin-top: 8px;
            line-height: 1.4;
        }}
        .source-badge {{
            display: inline-block;
            background: #e9ecef;
            color: #495057;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
        }}
        .footer {{
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #888;
            font-size: 12px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Rapport d'offres d'emploi</h1>
            <p>Généré le {date_str} pour {PROFIL['nom']}</p>
        </div>

        <div class="stats">
            <div class="stat">
                <div class="stat-number">{total}</div>
                <div class="stat-label">Offres trouvées</div>
            </div>
            <div class="stat">
                <div class="stat-number" style="color: #155724;">{top_offres}</div>
                <div class="stat-label">Excellentes (7+)</div>
            </div>
            <div class="stat">
                <div class="stat-number" style="color: #856404;">{bonnes_offres}</div>
                <div class="stat-label">Bonnes (5-7)</div>
            </div>
        </div>
"""

    # Afficher les offres groupées par catégorie
    for categorie in ["Customer Success Manager", "Responsable Marketing",
                       "Business Intelligence", "Contrôleur de gestion",
                       "Chef de projet", "Commercial", "Non catégorisé"]:
        cat_offres = categories.get(categorie, [])
        if not cat_offres:
            continue

        html += f"""
        <div class="section">
            <h2>{categorie} ({len(cat_offres)} offres)</h2>
"""
        for offre in sorted(cat_offres, key=lambda x: x.get("note", 0), reverse=True):
            note = offre.get("note", 0)
            note_class = "note-top" if note >= 7 else "note-good" if note >= 5 else "note-ok"
            url = offre.get("url", "#")
            titre = offre.get("titre", "Sans titre")
            entreprise = offre.get("entreprise", "")
            localisation = offre.get("localisation", "")
            source = offre.get("source", "")
            detail = offre.get("note_detail", "")
            desc = offre.get("description", "")[:200]

            html += f"""
            <div class="offre">
                <div class="offre-header">
                    <div>
                        <a href="{url}" class="offre-titre" target="_blank">{titre}</a>
                        <div class="offre-meta">
                            <span>🏢 {entreprise or 'N/A'}</span>
                            <span>📍 {localisation or 'Paris'}</span>
                            <span class="source-badge">{source}</span>
                        </div>
                    </div>
                    <span class="note {note_class}">{note}/10</span>
                </div>
                {"<div class='offre-desc'>" + desc + "...</div>" if desc else ""}
                <div class="offre-detail">📊 {detail}</div>
            </div>
"""

        html += "        </div>\n"

    html += f"""
        <div class="footer">
            <p>Ce rapport a été généré automatiquement par Job Scraper.</p>
            <p>Sources : Indeed, Welcome to the Jungle, LinkedIn, France Travail, APEC, HelloWork, Google</p>
        </div>
    </div>
</body>
</html>"""

    return html


def envoyer_email(offres: list) -> bool:
    """Envoie le rapport par email. Retourne True si succès."""
    html = generer_html_rapport(offres)
    date_str = datetime.now().strftime("%d/%m/%Y")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{EMAIL_CONFIG['sujet_prefix']} — {date_str} ({len(offres)} offres)"
    msg["From"] = EMAIL_CONFIG["expediteur"]
    msg["To"] = EMAIL_CONFIG["destinataire"]

    # Version texte simple
    texte_simple = f"Rapport d'offres d'emploi du {date_str}\n\n"
    for offre in offres:
        texte_simple += f"[{offre.get('note', 0)}/10] {offre.get('titre', '')} — {offre.get('entreprise', '')} ({offre.get('source', '')})\n"
        texte_simple += f"  {offre.get('url', '')}\n\n"

    msg.attach(MIMEText(texte_simple, "plain"))
    msg.attach(MIMEText(html, "html"))

    # Essayer d'envoyer via SMTP
    expediteur = EMAIL_CONFIG.get("expediteur") or os.environ.get("SMTP_EMAIL", "")
    mot_de_passe = EMAIL_CONFIG.get("mot_de_passe") or os.environ.get("SMTP_PASSWORD", "")

    if expediteur and mot_de_passe:
        try:
            with smtplib.SMTP(EMAIL_CONFIG["smtp_server"], EMAIL_CONFIG["smtp_port"]) as server:
                server.starttls()
                server.login(expediteur, mot_de_passe)
                server.send_message(msg)
            print(f"\n✅ Email envoyé avec succès à {EMAIL_CONFIG['destinataire']}")
            return True
        except Exception as e:
            print(f"\n⚠️  Échec envoi email : {e}")
    else:
        print("\n⚠️  Identifiants SMTP non configurés.")

    # Fallback : sauvegarder le rapport HTML localement
    return sauvegarder_rapport_local(html)


def sauvegarder_rapport_local(html: str) -> bool:
    """Sauvegarde le rapport HTML en fichier local."""
    date_str = datetime.now().strftime("%Y-%m-%d_%H%M")
    filename = f"rapport_offres_{date_str}.html"
    filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)

    try:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"📄 Rapport sauvegardé : {filepath}")
        print(f"   Ouvrez ce fichier dans votre navigateur pour consulter les résultats.")
        return True
    except Exception as e:
        print(f"❌ Erreur sauvegarde : {e}")
        return False
