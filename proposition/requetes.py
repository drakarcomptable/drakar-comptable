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
BUDGET = 12
# Une candidate sur deux peut etre ecartee apres verification, faute de
# marche : on en essaie une de plus pour ne pas finir avec une seule.
A_VERIFIER = 4

# Mots qui font qu'une suggestion n'est pas une requete de marche.
# « saasu maa » est du bruit d'une autre langue, « demo » et « jobs » sont
# des intentions qui ne sont pas celles d'un acheteur de prestation.
BRUIT = {
    'jobs', 'job', 'emploi', 'stage', 'salaire', 'recrutement', 'avis',
    'wikipedia', 'linkedin', 'connexion', 'login', 'gratuit', 'free',
    'pdf', 'exemple', 'exemples', 'definition', 'meaning', 'traduction',
    'telecharger', 'download', 'tuto', 'tutoriel', 'cours', 'formation',
    # « déchets industriels banals en anglais » n'est pas une requete de
    # marche, c'est quelqu'un qui cherche une traduction. Le nom d'une
    # langue etrangere dans une requete trahit presque toujours cette
    # intention-la, jamais celle d'acheter une prestation.
    'anglais', 'arabe', 'espagnol', 'allemand', 'italien', 'portugais',
    'neerlandais', 'chinois', 'russe', 'japonais', 'polonais', 'turc',
    'roumain', 'english', 'spanish', 'german', 'synonyme', 'liste',
}

# Des sources qui trahissent une requete sans marche.
#
# « dechets industriels no man's sky » a passe tous les filtres : les
# deux premiers mots sont bien ceux du site. Ce que l'IA citait, en
# revanche, ne laissait aucun doute : trois YouTube et un site de jeux.
# Quand la reponse de Google s'appuie surtout la-dessus, la requete
# n'interesse pas un acheteur de prestation.
# Des fragments, pas des domaines : la liste des sources porte le nom
# affiche par Google (« YouTube ») aussi bien que l'adresse.
NON_MARCHAND = (
    'youtube', 'wikipedia', 'wiktionary', 'reddit', 'quora', 'tiktok',
    'facebook', 'instagram', 'twitter', 'pinterest', 'linkedin',
    'service-public', 'gouv.fr', 'legifrance', 'fandom', 'jeuxvideo',
    'gamekult', 'games.', 'millenium', 'dictionnaire', 'forum',
)


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


def _racine(m):
    """Le mot sans sa marque du pluriel.

    Le noyau d'un site de pentest contenait « pentests », et la requete
    « pentest as a service » ne correspondait a rien : le filtre par
    sujet rejetait tout. Comparer des racines evite qu'un « s » decide
    du sort d'une recherche.
    """
    return m[:-1] if len(m) > 4 and m.endswith(('s', 'x')) else m


def _racines(mots):
    return {_racine(m) for m in mots}


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

VIDES = {
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'en',
    'au', 'aux', 'pour', 'par', 'sur', 'dans', 'avec', 'sans', 'chez',
    'qui', 'que', 'quoi', 'dont', 'est', 'sont', 'etre', 'avoir', 'plus',
    'tout', 'tous', 'toute', 'votre', 'vos', 'notre', 'nos', 'son', 'ses',
    'the', 'and', 'for', 'with', 'your', 'our', 'you', 'we', 'that',
    'this', 'from', 'are', 'all', 'more', 'get', 'will', 'can',
}


def vocabulaire(titre, principaux, secondaires):
    """De quoi ce site parle, par ordre d'importance.

    La balise titre et le H1 disent le metier ; un item de menu ou un
    titre de section ne dit qu'un detail. Sans ce poids, une page
    secondaire suffisait a emporter toute la recherche : sur un site de
    pentest, une mention d'hebergement a fait sortir « modèle attestation
    d'hébergement », qui est une requete administrative sans aucun
    rapport avec son marche.
    """
    poids = {}
    for texte, p in ([(titre, 3)] + [(x, 3) for x in (principaux or [])] +
                     [(x, 1) for x in (secondaires or [])]):
        for m in re.split(r'[^a-z0-9]+', _plat(texte or '')):
            if len(m) < 4 or m in VIDES:
                continue
            r = _racine(m)
            poids[r] = poids.get(r, 0) + p
    return poids


def noyau(poids, marque, n=10):
    """Les mots qui font vraiment le metier du site."""
    jm = _jetons_marque(marque)
    cl = [m for m in sorted(poids, key=lambda x: (-poids[x], x))
          if m not in jm and m not in BRUIT]
    return cl[:n]


def graines(pistes, poids, marque):
    """Par quoi commencer a taper.

    Les pistes tirees du site sont de mauvaises requetes, mais de bonnes
    graines : elles portent le vocabulaire du metier. L'autocompletion
    fait le reste du chemin, et elle le fait avec ce que les gens tapent.

    On garde d'abord les pistes faites des mots les plus centraux du
    site, puis, a defaut, ces mots centraux accoles deux a deux.
    """
    jm = _jetons_marque(marque)
    cl = noyau(poids, marque)
    rang = {m: i for i, m in enumerate(cl)}

    notees = []
    for p in (pistes or []):
        g = ' '.join((p or '').split()[:3]).strip()
        if len(g) < 5:
            continue
        mots = set(_plat(g).split())
        if jm and jm <= mots:
            continue
        # Une piste qui n'emploie pas les mots du titre n'est pas hors
        # sujet pour autant : « location de bennes » est un service, pas
        # un detail, et c'est exactement le genre de requete qu'on
        # cherche. Elle passe apres, elle n'est plus jetee.
        touche = [rang[m] for m in _racines(mots) if m in rang]
        notees.append((min(touche) if touche else len(rang) + 1, g))
    notees.sort()

    vus, out = set(), []
    for _, g in notees:
        if _plat(g) not in vus:
            vus.add(_plat(g))
            out.append(g)
    for i in range(min(3, len(cl))):
        for j in range(i + 1, min(4, len(cl))):
            g = cl[i] + ' ' + cl[j]
            if g not in vus:
                vus.add(g)
                out.append(g)
    return out[:3]


def _recevable(s, marque, rebut, texte_site='', noyau_mots=()):
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
    # Elle doit parler du metier du site. L'autocompletion part vite
    # ailleurs : une seule mention d'hebergement sur un site de pentest
    # suffisait a faire sortir « modèle attestation d'hébergement ».
    if noyau_mots and not (_racines(mots) & _racines(noyau_mots)):
        return False
    return True


def _informatif(v):
    """La reponse de l'IA s'appuie-t-elle surtout sur du non-marchand.

    Une requete dont Google illustre la reponse avec YouTube, Wikipedia
    ou un site de jeux n'est pas une requete d'acheteur, quels que
    soient ses mots. C'est une preuve, pas une supposition : elle vient
    de la page de resultats qu'on vient de lire.
    """
    liens = [_plat(s) for s in (v.get('concurrents') or [])]
    if len(liens) < 3:
        return False
    hors = sum(1 for n in liens if any(x in n for x in NON_MARCHAND))
    return hors * 2 > len(liens)


def cherche(pistes, titre, principaux, secondaires, marque, domaine,
            rebut=(), cle=None, budget=BUDGET, pays='fr'):
    """La chaine complete. Rend (requetes, notes) ou (None, notes).

    None veut dire « pas verifie », jamais « rien trouve » : l'appelant
    doit pouvoir retomber sur l'ancienne methode sans imprimer une
    colonne vide en se taisant.
    """
    s = Serp(cle, budget)
    if not s.actif():
        return None, ['pas de clé SerpAPI, requêtes tirées du site comme avant']

    poids = vocabulaire(titre, principaux, secondaires)
    ny = set(noyau(poids, marque))
    texte_site = ' '.join([titre or ''] + list(principaux or []) +
                          list(secondaires or []))

    gr = graines(pistes, poids, marque)
    if not gr:
        return None, ['aucune graine exploitable pour interroger Google']

    candidates, vus = [], set()
    for g in gr[:2]:
        for sug in s.suggestions(g, pays):
            if not _recevable(sug, marque, rebut, texte_site, ny):
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

    verifiees, absentes, notes_inf = [], [], []
    for c in candidates[:A_VERIFIER]:
        if s.reste <= 1:
            break
        v = s.verifie(c, domaine, pays)
        if not v:
            continue
        verifiees.append(v)
        if _informatif(v):
            notes_inf.append(c)
            continue
        if not v['ia_cite'] and v['rang'] is None:
            absentes.append(v)

    if not verifiees:
        return None, s.notes + ['aucune requête n’a pu être vérifiée']

    # Ce qu'on imprime, ce sont les requetes ou il n'est pas : c'est le
    # sujet de la page. S'il ressort partout, on le dit plutot que de
    # fabriquer un manque.
    retenues = absentes or []
    notes = list(s.notes)
    notes.append('graines : ' + ', '.join(gr))
    if notes_inf:
        notes.append('écartée(s) faute de marché, vu les sources citées : '
                     + ', '.join(notes_inf))
    notes.append('%d requête(s) vérifiée(s) sur Google en %d appels, '
                 '%d sans citation' % (len(verifiees), s.appels, len(absentes)))
    if not absentes:
        notes.append('le site ressort sur toutes les requêtes testées : '
                     'rien à reprocher de ce côté, à compléter à la main')
    return (retenues or None), notes
