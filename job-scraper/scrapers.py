"""
Scrapers pour les différentes plateformes d'emploi.
Chaque scraper retourne une liste de dict avec les clés :
  titre, entreprise, localisation, type_contrat, description, url, source, date
"""

import time
import random
import re
import urllib.parse
from datetime import datetime

import requests
from bs4 import BeautifulSoup

from config import SCRAPING, MOTS_CLES_RECHERCHE


HEADERS = {
    "User-Agent": SCRAPING["user_agent"],
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


def _pause():
    """Pause aléatoire entre les requêtes pour éviter le blocage."""
    time.sleep(SCRAPING["delai_entre_requetes"] + random.uniform(0.5, 1.5))


def _safe_get(url: str, params: dict = None, timeout: int = 15) -> requests.Response | None:
    """GET sécurisé avec gestion d'erreurs."""
    try:
        resp = requests.get(url, headers=HEADERS, params=params, timeout=timeout)
        resp.raise_for_status()
        return resp
    except requests.RequestException as e:
        print(f"  [ERREUR] {url[:80]}... -> {e}")
        return None


# =============================================================================
# 1. INDEED
# =============================================================================
def scrape_indeed() -> list:
    """Scrape les offres Indeed France."""
    print("\n[Indeed] Démarrage du scraping...")
    offres = []

    for query in MOTS_CLES_RECHERCHE:
        url = "https://fr.indeed.com/jobs"
        params = {
            "q": query,
            "l": "Paris (75)",
            "sort": "date",
            "fromage": 14,  # derniers 14 jours
        }

        resp = _safe_get(url, params)
        if not resp:
            _pause()
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        cards = soup.select("div.job_seen_beacon, div.jobsearch-ResultsList div.result")

        for card in cards[:SCRAPING["max_offres_par_source"]]:
            try:
                titre_el = card.select_one("h2.jobTitle a, h2.jobTitle span")
                titre = titre_el.get_text(strip=True) if titre_el else ""

                entreprise_el = card.select_one("span.companyName, [data-testid='company-name']")
                entreprise = entreprise_el.get_text(strip=True) if entreprise_el else ""

                loc_el = card.select_one("div.companyLocation, [data-testid='text-location']")
                localisation = loc_el.get_text(strip=True) if loc_el else ""

                lien_el = card.select_one("h2.jobTitle a")
                lien = "https://fr.indeed.com" + lien_el["href"] if lien_el and lien_el.get("href") else ""

                snippet_el = card.select_one("div.job-snippet, td.resultContent div.heading6")
                description = snippet_el.get_text(strip=True) if snippet_el else ""

                if titre:
                    offres.append({
                        "titre": titre,
                        "entreprise": entreprise,
                        "localisation": localisation,
                        "type_contrat": "CDI",
                        "description": description,
                        "url": lien,
                        "source": "Indeed",
                        "date": datetime.now().strftime("%Y-%m-%d"),
                    })
            except Exception:
                continue

        _pause()

    print(f"[Indeed] {len(offres)} offres trouvées")
    return _deduplicate(offres)


# =============================================================================
# 2. WELCOME TO THE JUNGLE
# =============================================================================
def scrape_wttj() -> list:
    """Scrape les offres Welcome to the Jungle."""
    print("\n[WTTJ] Démarrage du scraping...")
    offres = []

    search_terms = [
        "customer success manager", "responsable marketing",
        "business intelligence", "contrôleur de gestion",
        "data analyst", "chef de projet", "marketing analyst",
        "business analyst", "chargé CRM", "content manager",
        "account manager", "chef de produit", "consultant junior",
        "chargé de reporting", "operations manager",
        "chargé relation client", "media planner",
    ]

    for term in search_terms:
        slug = urllib.parse.quote(term)
        url = f"https://www.welcometothejungle.com/fr/jobs?query={slug}&refinementList%5Bcontract_type%5D%5B%5D=full-time&aroundLatLng=48.8566%2C2.3522&aroundRadius=30000"

        resp = _safe_get(url)
        if not resp:
            _pause()
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        cards = soup.select("article, div[data-testid='search-results-list-item-wrapper'], li[data-testid]")

        for card in cards[:SCRAPING["max_offres_par_source"]]:
            try:
                titre_el = card.select_one("h4, h3, [role='heading']")
                titre = titre_el.get_text(strip=True) if titre_el else ""

                entreprise_el = card.select_one("h3, span.ais-Highlight")
                entreprise = entreprise_el.get_text(strip=True) if entreprise_el else ""

                loc_el = card.select_one("p, span")
                localisation = loc_el.get_text(strip=True) if loc_el else ""

                lien_el = card.select_one("a[href*='/jobs/']")
                lien = ""
                if lien_el and lien_el.get("href"):
                    href = lien_el["href"]
                    lien = href if href.startswith("http") else "https://www.welcometothejungle.com" + href

                if titre:
                    offres.append({
                        "titre": titre,
                        "entreprise": entreprise,
                        "localisation": localisation or "Paris",
                        "type_contrat": "CDI",
                        "description": f"{titre} - {entreprise}",
                        "url": lien,
                        "source": "Welcome to the Jungle",
                        "date": datetime.now().strftime("%Y-%m-%d"),
                    })
            except Exception:
                continue

        _pause()

    print(f"[WTTJ] {len(offres)} offres trouvées")
    return _deduplicate(offres)


# =============================================================================
# 3. LINKEDIN (via Google)
# =============================================================================
def scrape_linkedin_via_google() -> list:
    """Scrape les offres LinkedIn via les résultats Google."""
    print("\n[LinkedIn/Google] Démarrage du scraping...")
    offres = []

    queries = [
        "site:linkedin.com/jobs Customer Success Manager Paris CDI",
        "site:linkedin.com/jobs Responsable marketing Paris CDI",
        "site:linkedin.com/jobs Business Intelligence analyst Paris CDI",
        "site:linkedin.com/jobs Contrôleur de gestion Paris CDI",
        "site:linkedin.com/jobs Data analyst junior Paris CDI",
        "site:linkedin.com/jobs Chef de projet innovation Paris CDI",
        "site:linkedin.com/jobs Business analyst Paris CDI",
        "site:linkedin.com/jobs CRM manager Paris CDI",
        "site:linkedin.com/jobs Account manager junior Paris CDI",
        "site:linkedin.com/jobs Product manager junior Paris CDI",
        "site:linkedin.com/jobs Consultant junior Paris CDI",
        "site:linkedin.com/jobs Chargé de reporting Paris CDI",
        "site:linkedin.com/jobs Growth marketing Paris CDI",
        "site:linkedin.com/jobs Revenue operations Paris CDI",
    ]

    for query in queries:
        url = "https://www.google.com/search"
        params = {"q": query, "num": 15, "hl": "fr"}

        resp = _safe_get(url, params)
        if not resp:
            _pause()
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        results = soup.select("div.g, div.tF2Cxc")

        for result in results:
            try:
                titre_el = result.select_one("h3")
                titre_raw = titre_el.get_text(strip=True) if titre_el else ""
                # Nettoyer le titre LinkedIn
                titre = re.sub(r"\s*[-–|]\s*LinkedIn.*$", "", titre_raw).strip()

                lien_el = result.select_one("a")
                lien = lien_el["href"] if lien_el and lien_el.get("href") else ""

                snippet_el = result.select_one("div.VwiC3b, span.aCOpRe")
                description = snippet_el.get_text(strip=True) if snippet_el else ""

                # Extraire entreprise du titre si possible
                parts = titre.split(" - ")
                poste = parts[0].strip() if parts else titre
                entreprise = parts[1].strip() if len(parts) > 1 else ""

                if poste and "linkedin.com" in lien:
                    offres.append({
                        "titre": poste,
                        "entreprise": entreprise,
                        "localisation": "Paris",
                        "type_contrat": "CDI",
                        "description": description,
                        "url": lien,
                        "source": "LinkedIn",
                        "date": datetime.now().strftime("%Y-%m-%d"),
                    })
            except Exception:
                continue

        _pause()

    print(f"[LinkedIn/Google] {len(offres)} offres trouvées")
    return _deduplicate(offres)


# =============================================================================
# 4. FRANCE TRAVAIL (ex Pôle Emploi) — API publique
# =============================================================================
def scrape_france_travail() -> list:
    """Scrape via Google les offres France Travail (ex Pôle Emploi)."""
    print("\n[France Travail] Démarrage du scraping...")
    offres = []

    queries = [
        "site:francetravail.fr Customer Success Manager Paris",
        "site:francetravail.fr responsable marketing Paris CDI",
        "site:francetravail.fr contrôleur de gestion Paris CDI",
        "site:francetravail.fr business intelligence Paris CDI",
        "site:francetravail.fr data analyst Paris CDI",
        "site:francetravail.fr chef de projet marketing Paris CDI",
        "site:francetravail.fr chargé de relation client Paris CDI",
        "site:francetravail.fr chargé CRM Paris CDI",
        "site:francetravail.fr consultant junior Paris CDI",
    ]

    for query in queries:
        url = "https://www.google.com/search"
        params = {"q": query, "num": 10, "hl": "fr"}

        resp = _safe_get(url, params)
        if not resp:
            _pause()
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        results = soup.select("div.g, div.tF2Cxc")

        for result in results:
            try:
                titre_el = result.select_one("h3")
                titre_raw = titre_el.get_text(strip=True) if titre_el else ""
                titre = re.sub(r"\s*[-–|]\s*(France Travail|Pôle Emploi).*$", "", titre_raw).strip()

                lien_el = result.select_one("a")
                lien = lien_el["href"] if lien_el and lien_el.get("href") else ""

                snippet_el = result.select_one("div.VwiC3b, span.aCOpRe")
                description = snippet_el.get_text(strip=True) if snippet_el else ""

                if titre:
                    offres.append({
                        "titre": titre,
                        "entreprise": "",
                        "localisation": "Paris",
                        "type_contrat": "CDI",
                        "description": description,
                        "url": lien,
                        "source": "France Travail",
                        "date": datetime.now().strftime("%Y-%m-%d"),
                    })
            except Exception:
                continue

        _pause()

    print(f"[France Travail] {len(offres)} offres trouvées")
    return _deduplicate(offres)


# =============================================================================
# 5. APEC
# =============================================================================
def scrape_apec() -> list:
    """Scrape les offres APEC via Google."""
    print("\n[APEC] Démarrage du scraping...")
    offres = []

    queries = [
        "site:apec.fr Customer Success Manager Paris",
        "site:apec.fr responsable marketing Paris CDI",
        "site:apec.fr contrôleur de gestion Paris CDI",
        "site:apec.fr business intelligence Paris CDI",
        "site:apec.fr chef de projet Paris CDI",
        "site:apec.fr account manager Paris CDI",
        "site:apec.fr chargé d'études Paris CDI",
        "site:apec.fr analyste financier junior Paris CDI",
        "site:apec.fr consultant junior Paris CDI",
    ]

    for query in queries:
        url = "https://www.google.com/search"
        params = {"q": query, "num": 10, "hl": "fr"}

        resp = _safe_get(url, params)
        if not resp:
            _pause()
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        results = soup.select("div.g, div.tF2Cxc")

        for result in results:
            try:
                titre_el = result.select_one("h3")
                titre_raw = titre_el.get_text(strip=True) if titre_el else ""
                titre = re.sub(r"\s*[-–|]\s*Apec.*$", "", titre_raw).strip()

                lien_el = result.select_one("a")
                lien = lien_el["href"] if lien_el and lien_el.get("href") else ""

                snippet_el = result.select_one("div.VwiC3b, span.aCOpRe")
                description = snippet_el.get_text(strip=True) if snippet_el else ""

                if titre:
                    offres.append({
                        "titre": titre,
                        "entreprise": "",
                        "localisation": "Paris",
                        "type_contrat": "CDI",
                        "description": description,
                        "url": lien,
                        "source": "APEC",
                        "date": datetime.now().strftime("%Y-%m-%d"),
                    })
            except Exception:
                continue

        _pause()

    print(f"[APEC] {len(offres)} offres trouvées")
    return _deduplicate(offres)


# =============================================================================
# 6. HELLOWORK (ex RegionsJob)
# =============================================================================
def scrape_hellowork() -> list:
    """Scrape les offres HelloWork via Google."""
    print("\n[HelloWork] Démarrage du scraping...")
    offres = []

    queries = [
        "site:hellowork.com Customer Success Manager Paris CDI",
        "site:hellowork.com responsable marketing Paris CDI",
        "site:hellowork.com contrôleur de gestion Paris CDI",
        "site:hellowork.com data analyst Paris CDI",
        "site:hellowork.com business analyst Paris CDI",
        "site:hellowork.com account manager Paris CDI",
        "site:hellowork.com chef de projet digital Paris CDI",
        "site:hellowork.com chargé CRM Paris CDI",
    ]

    for query in queries:
        url = "https://www.google.com/search"
        params = {"q": query, "num": 10, "hl": "fr"}

        resp = _safe_get(url, params)
        if not resp:
            _pause()
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        results = soup.select("div.g, div.tF2Cxc")

        for result in results:
            try:
                titre_el = result.select_one("h3")
                titre_raw = titre_el.get_text(strip=True) if titre_el else ""
                titre = re.sub(r"\s*[-–|]\s*HelloWork.*$", "", titre_raw).strip()

                lien_el = result.select_one("a")
                lien = lien_el["href"] if lien_el and lien_el.get("href") else ""

                snippet_el = result.select_one("div.VwiC3b, span.aCOpRe")
                description = snippet_el.get_text(strip=True) if snippet_el else ""

                if titre:
                    offres.append({
                        "titre": titre,
                        "entreprise": "",
                        "localisation": "Paris",
                        "type_contrat": "CDI",
                        "description": description,
                        "url": lien,
                        "source": "HelloWork",
                        "date": datetime.now().strftime("%Y-%m-%d"),
                    })
            except Exception:
                continue

        _pause()

    print(f"[HelloWork] {len(offres)} offres trouvées")
    return _deduplicate(offres)


# =============================================================================
# 7. GOOGLE JOBS (recherche générale)
# =============================================================================
def scrape_google_jobs() -> list:
    """Scrape les offres via Google Jobs (recherche classique)."""
    print("\n[Google Jobs] Démarrage du scraping...")
    offres = []

    queries = [
        "Customer Success Manager CDI Paris offre emploi",
        "Responsable marketing CDI Paris recrutement",
        "Business Intelligence analyst CDI Paris emploi",
        "Contrôleur de gestion CDI Paris offre",
        "Data analyst junior CDI Paris emploi",
        "Chef de projet marketing CDI Paris recrutement",
        "Consultant junior management CDI Paris emploi",
        "Product manager junior CDI Paris recrutement",
        "Account manager junior CDI Paris emploi",
        "CRM manager CDI Paris offre emploi",
        "Revenue operations CDI Paris emploi",
        "Chargé d'études CDI Paris recrutement",
    ]

    for query in queries:
        url = "https://www.google.com/search"
        params = {"q": query, "num": 15, "hl": "fr"}

        resp = _safe_get(url, params)
        if not resp:
            _pause()
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        results = soup.select("div.g, div.tF2Cxc")

        for result in results:
            try:
                titre_el = result.select_one("h3")
                titre = titre_el.get_text(strip=True) if titre_el else ""

                lien_el = result.select_one("a")
                lien = lien_el["href"] if lien_el and lien_el.get("href") else ""

                snippet_el = result.select_one("div.VwiC3b, span.aCOpRe")
                description = snippet_el.get_text(strip=True) if snippet_el else ""

                # Ignorer les résultats déjà couverts par d'autres scrapers
                if any(domain in lien for domain in ["indeed.com", "linkedin.com", "welcometothejungle.com"]):
                    continue

                if titre:
                    offres.append({
                        "titre": titre,
                        "entreprise": "",
                        "localisation": "Paris",
                        "type_contrat": "",
                        "description": description,
                        "url": lien,
                        "source": "Google",
                        "date": datetime.now().strftime("%Y-%m-%d"),
                    })
            except Exception:
                continue

        _pause()

    print(f"[Google Jobs] {len(offres)} offres trouvées")
    return _deduplicate(offres)


# =============================================================================
# UTILITAIRES
# =============================================================================
def _deduplicate(offres: list) -> list:
    """Supprime les doublons basés sur le titre + entreprise ou URL."""
    seen = set()
    unique = []
    for offre in offres:
        key = (offre.get("titre", "").lower()[:50], offre.get("entreprise", "").lower())
        url_key = offre.get("url", "")
        if key not in seen and url_key not in seen:
            seen.add(key)
            if url_key:
                seen.add(url_key)
            unique.append(offre)
    return unique


def scrape_toutes_plateformes() -> list:
    """Lance le scraping sur toutes les plateformes et retourne toutes les offres."""
    print("=" * 60)
    print("  SCRAPING MULTI-PLATEFORMES — Recherche d'emploi")
    print("=" * 60)

    toutes_offres = []

    scrapers = [
        ("Indeed", scrape_indeed),
        ("Welcome to the Jungle", scrape_wttj),
        ("LinkedIn (via Google)", scrape_linkedin_via_google),
        ("France Travail", scrape_france_travail),
        ("APEC", scrape_apec),
        ("HelloWork", scrape_hellowork),
        ("Google Jobs", scrape_google_jobs),
    ]

    for nom, scraper_fn in scrapers:
        try:
            resultats = scraper_fn()
            toutes_offres.extend(resultats)
        except Exception as e:
            print(f"[ERREUR] {nom}: {e}")

    # Dédupliquer l'ensemble
    toutes_offres = _deduplicate(toutes_offres)

    print(f"\n{'=' * 60}")
    print(f"  TOTAL : {len(toutes_offres)} offres uniques collectées")
    print(f"{'=' * 60}")

    return toutes_offres
