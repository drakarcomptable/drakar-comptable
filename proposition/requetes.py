# -*- coding: utf-8 -*-
"""De vraies requetes de marche, et la preuve que le site n'y est pas.

Jusqu'ici les requetes imprimees sur la proposition venaient des titres
du site : « their words », « highlighted work ». Personne ne tape ca, et
un prospect le voit a la premiere ligne.

Ici elles viennent de l'autocompletion de Google, c'est-a-dire de ce que
de vraies personnes tapent vraiment. Chacune est ensuite verifiee sur une
vraie page de resultats : le site ressort-il dans les liens, et surtout
est-il cite par la reponse de l'IA de Google.

C'est ce second point qui vaut le detour. La colonne « requetes sur
lesquelles vous n'etes pas cite » cessait d'etre credible des qu'on y
reflechissait, parce que rien ne l'avait verifiee. Elle devient un
constat, avec le nom des concurrents que l'IA cite a la place.

Tout ici echoue en douceur : sans cle, sans reseau, hors quota ou sur une
reponse inattendue, la fonction rend None et l'appelant garde l'ancienne
methode. Une proposition sans requetes verifiees reste une proposition ;
une proposition qui plante n'existe pas.
"""
import json
import os
import re
import unicodedata
import urllib.parse
import urllib.request

RACINE = 'https://serpapi.com/search.json'
DELAI = 60

# Chaque appel coute une recherche au forfait. Un document ne doit pas
# pouvoir vider le quota du mois a lui tout seul.
BUDGET = 10
A_VERIFIER = 3          # combien de requetes candidates on va verifier

# Mots qui font qu'une suggestion n'est pas une requete de marche.
# « saasu maa » est du bruit d'une autre langue, « demo » et « jobs » sont
# des intentions qui ne sont pas celles d'un acheteur de prestation.
BRUIT = {
    'jobs', 'job', 'emploi', 'stage', 'salaire', 'recrutement', 'avis',
    'wikipedia', 'linkedin', 'connexion', 'login', 'gratuit', 'free',
    'pdf', 'exemple', 'exemples', 'definition', 'meaning', 'traduction',
    'telecharger', 'download', 'tuto', 'tutoriel', 'cours', 'formation',
}


# Des lieux qui ne sont pas le marche d'un prospect francais.
#
# L'autocompletion repond au monde entier : « cabinet conseil management
# maroc » est une vraie requete, tapee par de vraies personnes, et elle
# n'a aucun rapport avec un cabinet bordelais. On ne l'ecarte que si le
# site lui-meme ne parle pas de cet endroit, pour ne pas priver de sa
# requete un prospect qui y travaille vraiment.
GEO_HORS = {
    'maroc', 'tunisie', 'algerie', 'senegal', 'cameroun', 'ivoire',
    'canada', 'quebec', 'montreal', 'suisse', 'belgique', 'luxembourg',
    'bruxelles', 'geneve', 'lausanne', 'dakar', 'casablanca', 'abidjan',
    'usa', 'uk', 'london', 'york', 'dubai', 'india',
    # Une ville francaise qui n'est pas la sienne est tout aussi fausse :
    # proposer « cabinet conseil management nantes » a un cabinet
    # bordelais est une erreur visible des la premiere lecture. A defaut
    # de savoir ou il est, on prefere la requete sans ville, qui est de
    # toute facon la plus cherchee.
    'paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'bordeaux',
    'lille', 'rennes', 'strasbourg', 'montpellier', 'grenoble', 'angers',
    'dijon', 'nimes', 'reims', 'havre', 'toulon', 'brest', 'tours',
    'limoges', 'clermont', 'amiens', 'metz', 'besancon', 'orleans',
    'rouen', 'mulhouse', 'caen', 'nancy', 'avignon', 'poitiers', 'pau',
    'versailles', 'annecy', 'bayonne', 'perpignan', 'biarritz', 'ajaccio',
    'guadeloupe', 'martinique', 'reunion',
}


# Des mots qui apparaissent dans un nom de marque sans lui appartenir.
# « Agency » dans « 1600.agency » ne doit pas disqualifier « agence video
# saas », qui est une requete de marche parfaitement legitime.
GENERIQUE = {
    'agency', 'agence', 'group', 'groupe', 'studio', 'conseil', 'cabinet',
    'consulting', 'factory', 'lab', 'labs', 'media', 'digital', 'france',
    'company', 'solutions', 'services', 'partners', 'expert', 'experts',
}


def _jetons_marque(marque):
    """Les mots qui identifient vraiment la marque.

    Comparer la marque en sous-chaine etait faux : « x » se trouve dans
    « bordeaux », et une marque appelee « Pro » aurait disqualifie
    « production video ». On compare des mots entiers, et on laisse de
    cote ceux qui n'appartiennent a personne.
    """
    return {m for m in re.split(r'[^a-z0-9]+', _plat(marque))
            if len(m) >= 3 and m not in GENERIQUE}


def _plat(x):
    """Sans accents, en minuscules : pour comparer, jamais pour afficher."""
    return ''.join(c for c in unicodedata.normalize('NFD', (x or '').lower())
                   if unicodedata.category(c) != 'Mn')


class Serp(object):
    """Un compteur d'appels autant qu'un client.

    Le budget est porte par l'objet et non par une variable globale :
    deux documents fabriques en meme temps ne doivent pas se voler leur
    quota ni s'additionner par accident.
    """

    def __init__(self, cle=None, budget=BUDGET):
        self.cle = cle or os.environ.get('SERP_API_KEY') or ''
        self.reste = budget
        self.appels = 0
        self.notes = []

    def actif(self):
        return bool(self.cle)

    def _get(self, **kw):
        if not self.cle or self.reste <= 0:
            return None
        kw['api_key'] = self.cle
        self.reste -= 1
        self.appels += 1
        url = RACINE + '?' + urllib.parse.urlencode(kw)
        try:
            with urllib.request.urlopen(url, timeout=DELAI) as r:
                d = json.load(r)
        except Exception as e:
            self.notes.append('appel SerpAPI echoue : ' + str(e)[:90])
            return None
        if isinstance(d, dict) and d.get('error'):
            self.notes.append('SerpAPI : ' + str(d['error'])[:90])
            return None
        return d

    # ------------------------------------------------------------ pistes

    def suggestions(self, graine, pays='fr'):
        """Ce que Google propose quand on commence a taper la graine."""
        d = self._get(engine='google_autocomplete', q=graine,
                      hl=pays, gl=pays)
        if not d:
            return []
        return [s.get('value', '') for s in (d.get('suggestions') or [])
                if s.get('value')]

    # ------------------------------------------------------------ preuve

    def verifie(self, requete, domaine, pays='fr'):
        """Le site ressort-il, et l'IA de Google le cite-t-elle.

        Rend None si la page n'a pas pu etre lue, pour qu'on ne confonde
        jamais « verifie absent » et « pas verifie ». La difference est
        toute la valeur de la page.
        """
        d = self._get(engine='google', q=requete, hl=pays, gl=pays)
        if not d:
            return None
        dom = _plat(domaine)
        org = d.get('organic_results') or []
        rang = None
        for r in org:
            if dom in _plat(r.get('link') or ''):
                rang = r.get('position')
                break

        sources, ia_vue = [], False
        bloc = d.get('ai_overview') or {}
        if bloc:
            ia_vue = True
            refs = bloc.get('references') or []
            # Google charge souvent sa reponse IA a part : SerpAPI rend
            # alors un jeton, et les sources demandent un second appel.
            if not refs and bloc.get('page_token'):
                d2 = self._get(engine='google_ai_overview',
                               page_token=bloc['page_token'])
                if d2:
                    refs = ((d2.get('ai_overview') or {}).get('references')
                            or [])
            for r in refs:
                lien = r.get('link') or ''
                nom = r.get('source') or urllib.parse.urlparse(lien).netloc
                if nom:
                    sources.append({'nom': nom, 'lien': lien})

        cite_ia = any(dom in _plat(s['lien']) or dom in _plat(s['nom'])
                      for s in sources)
        return {
            'mot': requete,
            'rang': rang,
            'ia_presente': ia_vue,
            'ia_cite': cite_ia,
            'concurrents': [s['nom'] for s in sources
                            if dom not in _plat(s['lien'])][:8],
            'voisines': [r.get('query') for r in (d.get('related_searches')
                                                  or []) if r.get('query')][:6],
        }


# ---------------------------------------------------------------- graines

def graines(pistes, mots_site, marque):
    """Par quoi commencer a taper.

    Les pistes tirees du site sont de mauvaises requetes, mais de bonnes
    graines : elles portent le vocabulaire du metier. L'autocompletion
    fait le reste du chemin, et elle le fait avec ce que les gens tapent.
    """
    vus, out = set(), []
    for p in list(pistes or []) + list(mots_site or []):
        g = ' '.join((p or '').split()[:3]).strip()
        if len(g) < 5:
            continue
        plat = _plat(g)
        jm = _jetons_marque(marque)
        if plat in vus or (jm and jm <= set(plat.split())):
            continue
        vus.add(plat)
        out.append(g)
    return out[:3]


def _recevable(s, marque, rebut, texte_site=''):
    mots = set(_plat(s).split())
    if not (2 <= len(mots) <= 5):
        return False
    if mots & BRUIT or mots & {_plat(x) for x in rebut}:
        return False
    # tous les mots de la marque, pas un seul : une marque faite de mots
    # du marche (« Pro Video ») ne doit pas emporter avec elle les
    # requetes du marche (« production video entreprise »)
    jetons = _jetons_marque(marque)
    if jetons and jetons <= mots:
        return False
    ailleurs = mots & GEO_HORS
    if ailleurs and not any(g in _plat(texte_site) for g in ailleurs):
        return False
    return True


def cherche(pistes, mots_site, marque, domaine, rebut=(), cle=None,
            budget=BUDGET, pays='fr', texte_site=''):
    """La chaine complete. Rend (requetes, notes) ou (None, notes).

    None veut dire « pas verifie », jamais « rien trouve » : l'appelant
    doit pouvoir retomber sur l'ancienne methode sans imprimer une
    colonne vide en se taisant.
    """
    s = Serp(cle, budget)
    if not s.actif():
        return None, ['pas de clé SerpAPI, requêtes tirées du site comme avant']

    gr = graines(pistes, mots_site, marque)
    if not gr:
        return None, ['aucune graine exploitable pour interroger Google']

    candidates, vus = [], set()
    for g in gr[:2]:
        for sug in s.suggestions(g, pays):
            if not _recevable(sug, marque, rebut, texte_site):
                continue
            k = _plat(sug)
            if k in vus:
                continue
            vus.add(k)
            candidates.append(sug)
    if not candidates:
        return None, (s.notes +
                      ['Google ne propose rien d’exploitable sur : ' +
                       ', '.join(gr)])

    # la plus precise d'abord : une requete longue est plus proche d'une
    # intention d'achat qu'un mot seul
    candidates.sort(key=lambda x: -len(x.split()))

    verifiees, absentes = [], []
    for c in candidates[:A_VERIFIER]:
        if s.reste <= 1:
            break
        v = s.verifie(c, domaine, pays)
        if not v:
            continue
        verifiees.append(v)
        if not v['ia_cite'] and v['rang'] is None:
            absentes.append(v)

    if not verifiees:
        return None, s.notes + ['aucune requête n’a pu être vérifiée']

    # Ce qu'on imprime, ce sont les requetes ou il n'est pas : c'est le
    # sujet de la page. S'il ressort partout, on le dit plutot que de
    # fabriquer un manque.
    retenues = absentes or []
    notes = list(s.notes)
    notes.append('%d requête(s) vérifiée(s) sur Google en %d appels, '
                 '%d sans citation' % (len(verifiees), s.appels, len(absentes)))
    if not absentes:
        notes.append('le site ressort sur toutes les requêtes testées : '
                     'rien à reprocher de ce côté, à compléter à la main')
    return (retenues or None), notes
