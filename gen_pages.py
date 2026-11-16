# -*- coding: utf-8 -*-
"""Pages de contenu du site NAZAR.

La home est un cas a part : elle garde son CSS en ligne, parce que c'est la
page ou le premier affichage compte le plus. Les pages de contenu, elles,
partagent nazar.css, qui est deja le systeme de design des pages legales et
des rapports de mission. Une seule feuille, mise en cache d'une page a
l'autre.

Ce fichier porte aussi le registre des pages : sitemap.xml et llms.txt en
sortent. Ajouter une page ici la publie partout, et rien ne peut diverger.

Aucun nom de client n'apparait dans ce qui est produit.
"""

import datetime
import io
import json
import os

RACINE = 'https://nazar-seo.fr/'
SORTIE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nazar-site')

RDV = '/audit-gratuit'          # la page qui porte la prise de rendez-vous
ORG = RACINE + '#organisation'  # l'entite declaree sur la home


# --------------------------------------------------------------------------
# Registre
# --------------------------------------------------------------------------
# Chaque page : slug, balises, en-tete, blocs, FAQ, appel a l'action.
# 'prio' alimente le sitemap, 'llms' la fiche de lecture des moteurs.

PAGES = [
{
 'slug': 'audit-geo',
 'fil': 'Audit GEO',
 'titre': u'Audit GEO gratuit : ce que les IA disent de vous | NAZAR',
 'desc': u'Audit GEO gratuit en 9 minutes : le relevé de ce que ChatGPT, '
         u'Perplexity et Gemini répondent sur votre marché, et des '
         u'concurrents qu’ils citent à votre place.',
 'kick': u'Gratuit, 9 minutes',
 'h1': u'Ce que les IA répondent déjà sur votre marché',
 'chapo': u'Un audit GEO mesure votre présence dans les réponses des moteurs '
          u'génératifs. NAZAR le réalise gratuitement, en direct, et vous '
          u'repartez avec le relevé et la feuille de route.',
 'bouton': u'Réserver mon audit',
 'prio': '0.9',
 'llms': u'Audit GEO gratuit : relevé de ce que les moteurs génératifs '
         u'répondent sur votre marché, concurrents cités, sources reprises.',
 'service': u'Audit GEO',
 'blocs': [
   {'note': u'Définition',
    'h2': u'Qu’est-ce qu’un audit GEO ?',
    'tete': u'Un audit GEO est le relevé de ce que les moteurs génératifs '
            u'répondent aujourd’hui aux questions d’achat de votre secteur. '
            u'Il identifie si votre entreprise est citée, qui l’est à votre '
            u'place, et sur quelles sources le modèle s’appuie pour le dire.',
    'corps': [
      u'Le GEO, pour <i>generative engine optimization</i>, désigne le travail '
      u'de visibilité dans les réponses de ChatGPT, Perplexity, Gemini, Claude, '
      u'Copilot et dans les AI Overviews de Google. L’audit en est le point de '
      u'départ : avant de chercher à être cité, il faut savoir ce qui est dit.',
      u'La différence avec un audit de référencement classique tient à l’objet '
      u'mesuré. Un audit SEO regarde des positions dans une liste de liens. Un '
      u'audit GEO regarde un texte rédigé, où deux ou trois acteurs sont nommés '
      u'et les autres absents. Il n’y a pas de dixième place en GEO.']},

   {'note': u'Contenu',
    'h2': u'Que contient l’audit NAZAR ?',
    'tete': u'Quatre éléments, remis à l’issue de l’échange.',
    'pts': [
      u'<b>Le relevé des réponses.</b> Ce que les principaux moteurs répondent '
      u'aujourd’hui aux questions d’achat de votre marché.',
      u'<b>Les concurrents cités à votre place.</b> Nommément, avec la fréquence '
      u'à laquelle chacun revient.',
      u'<b>Les sources reprises.</b> Les pages sur lesquelles le modèle s’appuie '
      u'pour parler de votre secteur. C’est là que se joue l’essentiel du travail.',
      u'<b>Une estimation chiffrée.</b> Ce que représente, pour votre activité, '
      u'le fait d’être absent de ces réponses.']},

   {'note': u'Déroulé',
    'h2': u'Comment se passe l’audit ?',
    'tete': u'En visioconférence, avec un consultant, sans préparation de votre '
            u'côté.',
    'ol': [
      u'Vous choisissez un créneau. Le rendez-vous dure trente minutes, '
      u'l’audit lui-même en prend neuf : le reste est là pour vos questions.',
      u'Le consultant interroge les moteurs en direct, devant vous, sur les '
      u'questions que posent vos acheteurs.',
      u'Vous repartez avec le relevé et la feuille de route. Sans engagement, '
      u'et sans obligation de travailler avec NAZAR ensuite.']},

   {'note': u'Transparence',
    'sombre': True,
    'h2': u'Pourquoi est-il gratuit ?',
    'tete': u'Parce que le relevé se fait en direct et qu’il nous coûte neuf '
            u'minutes.',
    'corps': [
      u'Un audit GEO ne demande pas de collecte longue : les réponses des '
      u'moteurs s’obtiennent en les interrogeant. Ce qui prend du temps, c’est '
      u'le travail qui vient après, et c’est celui-là qui se facture.',
      u'Nous préférons donc montrer d’abord. Si le relevé montre que vous êtes '
      u'déjà bien cité, nous vous le dirons, et il n’y aura pas de suite.']},
 ],
 'faq': [
   (u'Combien de temps dure un audit GEO ?',
    u'L’audit lui-même prend neuf minutes. Le créneau réservé est de trente '
    u'minutes, pour laisser la place à vos questions et à la lecture du relevé.'),
   (u'Faut-il préparer quelque chose ?',
    u'Non. L’adresse de votre site suffit. Le consultant interroge les moteurs '
    u'en direct pendant l’échange, vous voyez les réponses en même temps que lui.'),
   (u'L’audit est-il vraiment gratuit ?',
    u'Oui, et sans engagement. Il n’y a ni contrepartie, ni période d’essai à '
    u'résilier. Si le relevé montre que votre entreprise est déjà bien citée, '
    u'nous vous le disons et l’échange s’arrête là.'),
   (u'Quelle différence avec un audit SEO ?',
    u'Un audit SEO mesure des positions dans une liste de liens et l’état '
    u'technique d’un site. Un audit GEO mesure ce qu’un moteur génératif '
    u'<i>dit</i> de vous dans une réponse rédigée. Les deux sont liés : les pages '
    u'bien positionnées dans Google ont statistiquement plus de chances d’être '
    u'reprises par un modèle.'),
   (u'Quels moteurs sont couverts ?',
    u'ChatGPT, Perplexity, Gemini, Claude, Copilot et les AI Overviews de '
    u'Google. Le choix des questions posées dépend de votre marché, pas d’une '
    u'liste type.'),
   (u'Au bout de combien de temps voit-on un effet ?',
    u'Les premiers déplacements se mesurent en semaines : les moteurs '
    u'génératifs réévaluent leurs sources plus souvent qu’un index classique ne '
    u'se réorganise. Une position stable, elle, se construit sur plusieurs '
    u'mois. Méfiez-vous de qui promet une citation immédiate.'),
 ],
 'voisins': [
   (u'/', u'NAZAR, agence SEO et GEO',
    u'Qui nous sommes, ce que nous faisons et pour qui.'),
 ],
 'cend': {
   'h2': u'Voyons ce que les IA répondent sur votre marché',
   'p': u'Neuf minutes de relevé, trente minutes de créneau, aucune préparation '
        u'de votre côté. Gratuit et sans engagement.',
   'bouton': u'Réserver mon audit'},
},
]


# --------------------------------------------------------------------------
# Fabrication
# --------------------------------------------------------------------------

FLECHE = (u'<span class="arrow"><svg viewBox="0 0 24 24" fill="none" '
          u'stroke="currentColor" stroke-width="3" stroke-linecap="round" '
          u'stroke-linejoin="round" aria-hidden="true">'
          u'<path d="M5 12h13M12 5l7 7-7 7"/></svg></span>')


def bouton(href, libelle, variante=u'btn-dark'):
    return (u'<a class="btn %s" href="%s">%s%s</a>'
            % (variante, href, libelle, FLECHE))


def tete(p):
    """Le <head>, identique d'une page a l'autre sauf les balises propres."""
    url = RACINE + p['slug']
    L = [u'<!doctype html>', u'<html lang="fr">', u'<head>',
         u'<meta charset="utf-8">',
         u'<meta name="viewport" content="width=device-width,initial-scale=1">',
         u'<title>%s</title>' % p['titre'],
         u'<meta name="description" content="%s">' % p['desc'],
         u'<meta name="robots" content="index,follow">',
         u'<link rel="canonical" href="%s">' % url,
         u'<meta property="og:type" content="website">',
         u'<meta property="og:title" content="%s">' % p['titre'],
         u'<meta property="og:description" content="%s">' % p['desc'],
         u'<meta property="og:url" content="%s">' % url,
         u'<meta property="og:image" content="%slogo-partage.png">' % RACINE,
         u'<meta property="og:site_name" content="NAZAR">',
         u'<meta property="og:locale" content="fr_FR">',
         u'<link rel="icon" href="/favicon.ico" sizes="48x48">',
         u'<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">',
         # la police part avant la feuille de style : sinon le navigateur
         # ne la decouvre qu'apres avoir lu le CSS
         u'<link rel="preload" href="/police-jakarta.woff2" as="font" '
         u'type="font/woff2" crossorigin>',
         u'<link rel="stylesheet" href="/nazar.css">',
         u'</head>', u'<body>']
    return L


def barre():
    return [u'<nav class="topbar"><div class="rail">',
            u'<a class="home" href="/"><img src="/logo.png" width="40" height="40" '
            u'alt="NAZAR"><span>NAZAR</span></a>',
            u'<span class="sep"></span>',
            u'<a class="back" href="%s">Audit gratuit</a>' % RDV,
            u'</div></nav>']


def ariane(p):
    return [u'<nav class="fil" aria-label="Fil d’Ariane"><ol>',
            u'<li><a href="/">Accueil</a></li>',
            u'<li><span aria-current="page">%s</span></li>' % p['fil'],
            u'</ol></nav>']


def entete(p):
    L = [u'<header class="phero"><div class="rail">']
    L += ariane(p)
    L += [u'<span class="kick">%s</span>' % p['kick'],
          u'<h1>%s</h1>' % p['h1'],
          u'<p class="chapo">%s</p>' % p['chapo'],
          bouton(RDV, p['bouton'], u'btn-white'),
          u'</div></header>']
    return L


def corps(p):
    L = [u'<main class="cbody"><div class="rail">']
    for b in p['blocs']:
        cl = u'bloc sombre' if b.get('sombre') else u'bloc'
        L.append(u'<section class="%s">' % cl)
        if b.get('note'):
            L.append(u'<p class="note">%s</p>' % b['note'])
        L.append(u'<h2>%s</h2>' % b['h2'])
        # la reponse dans les deux premieres phrases sous le titre :
        # c'est cette forme que les moteurs extraient
        if b.get('tete'):
            L.append(u'<p class="tete">%s</p>' % b['tete'])
        for t in b.get('corps', []):
            L.append(u'<p>%s</p>' % t)
        if b.get('pts'):
            L.append(u'<ul class="pts">')
            L += [u'<li><span>%s</span></li>' % x for x in b['pts']]
            L.append(u'</ul>')
        if b.get('ol'):
            L.append(u'<ol>')
            L += [u'<li>%s</li>' % x for x in b['ol']]
            L.append(u'</ol>')
        L.append(u'</section>')

    if p.get('faq'):
        L.append(u'<section class="bloc">')
        L.append(u'<h2>Questions fréquentes</h2>')
        L.append(u'<div class="faq">')
        for q, r in p['faq']:
            L.append(u'<details><summary>%s</summary>'
                     u'<div class="rep"><p>%s</p></div></details>' % (q, r))
        L.append(u'</div></section>')

    if p.get('voisins'):
        L.append(u'<section class="bloc">')
        L.append(u'<h2>À lire aussi</h2>')
        L.append(u'<div class="voisins">')
        for href, t, d in p['voisins']:
            L.append(u'<a href="%s"><b>%s</b><span>%s</span></a>' % (href, t, d))
        L.append(u'</div></section>')

    L.append(u'</div></main>')
    return L


def fin(p):
    c = p['cend']
    return [u'<section class="cend"><div class="narrow">',
            u'<h2>%s</h2>' % c['h2'],
            u'<p>%s</p>' % c['p'],
            bouton(RDV, c['bouton']),
            u'</div></section>']


def pied():
    return [u'<footer><div class="rail">',
            u'<span>© %d NAZAR</span>' % datetime.date.today().year,
            u'<address class="fadr">10 rue de Penthièvre, 75008 Paris</address>',
            u'<a href="tel:+33743392574">+33 7 43 39 25 74</a>',
            u'<span class="sep"></span>',
            u'<a href="/mentions-legales.html">Mentions légales</a>',
            u'<a href="/confidentialite.html">Confidentialité</a>',
            u'</div></footer>']


def donnees(p):
    """BreadcrumbList, Service et FAQPage.

    Le fil d'Ariane est affiche sur la page, la FAQ aussi : on ne declare
    jamais ici ce que la page ne montre pas.
    """
    url = RACINE + p['slug']
    blocs = [{
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': RACINE},
            {'@type': 'ListItem', 'position': 2, 'name': p['fil'], 'item': url}]}]

    if p.get('service'):
        blocs.append({
            '@context': 'https://schema.org', '@type': 'Service',
            'name': p['service'],
            'serviceType': 'Generative engine optimization',
            'provider': {'@id': ORG},
            'areaServed': {'@type': 'Country', 'name': 'France'},
            'url': url,
            'description': p['desc']})

    if p.get('faq'):
        blocs.append({
            '@context': 'https://schema.org', '@type': 'FAQPage',
            'mainEntity': [
                {'@type': 'Question', 'name': q,
                 'acceptedAnswer': {'@type': 'Answer', 'text': r}}
                for q, r in p['faq']]})

    return [u'<script type="application/ld+json">\n%s\n</script>'
            % json.dumps(b, ensure_ascii=False, indent=1) for b in blocs]


def page(p):
    L = tete(p) + barre() + entete(p) + corps(p) + fin(p) + pied() + donnees(p)
    L += [u'</body>', u'</html>']
    return u'\n'.join(L) + u'\n'


# --------------------------------------------------------------------------
# Plan du site et fiche de lecture
# --------------------------------------------------------------------------

def plan(jour):
    """sitemap.xml et llms.txt sortent du meme registre que les pages."""
    entrees = [('', '1.0', u'NAZAR SEO & GEO',
                u'Collectif de consultants en référencement sur Google et sur '
                u'les IA génératives. Audit GEO gratuit en 9 minutes.')]
    entrees += [(p['slug'], p['prio'], p['fil'], p['llms']) for p in PAGES]

    x = [u'<?xml version="1.0" encoding="UTF-8"?>',
         u'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for s, pr, _t, _d in entrees:
        x += [u'  <url>', u'    <loc>%s%s</loc>' % (RACINE, s),
              u'    <lastmod>%s</lastmod>' % jour,
              u'    <priority>%s</priority>' % pr, u'  </url>']
    x.append(u'</urlset>')
    io.open(os.path.join(SORTIE, 'sitemap.xml'), 'w',
            encoding='utf-8').write(u'\n'.join(x) + u'\n')
    return entrees


def fiche(jour, entrees):
    """llms.txt, convention llmstxt.org.

    Il existe pour qu'un moteur generatif puisse citer NAZAR sans avoir a
    interpreter une mise en page. Aucun nom de client n'y figure : une
    recherche sur la marque d'un client ne doit pas remonter jusqu'ici.
    """
    L = [u'# NAZAR SEO & GEO', u'',
         u'> NAZAR est un collectif français de consultants en référencement naturel',
         u'> (SEO) et en référencement dans les intelligences artificielles génératives',
         u'> (GEO, pour generative engine optimization). NAZAR travaille la visibilité',
         u'> des entreprises dans les réponses de ChatGPT, Perplexity, Gemini et Claude,',
         u'> dans les AI Overviews de Google, et leur position dans les résultats de',
         u'> recherche classiques. Basé à Paris, le collectif intervient partout en France.',
         u'', u'## Définitions', u'',
         u'- **GEO (generative engine optimization)** : l\'ensemble des techniques qui',
         u'  rendent une entreprise citable par les moteurs génératifs. Là où le SEO vise',
         u'  une position dans une liste de liens, le GEO vise la présence dans une',
         u'  réponse rédigée, où un seul acteur est souvent nommé.',
         u'- **AEO (answer engine optimization)** : terme employé comme synonyme de GEO',
         u'  par une partie du marché. L\'objet est le même : être la réponse.',
         u'- **LLMO (large language model optimization)** : autre synonyme en circulation.',
         u'', u'## Offre', u'',
         u'- **Audit GEO gratuit** : un consultant NAZAR audite le site en direct et remet',
         u'  une feuille de route de visibilité dans les IA. L’audit lui-même prend neuf',
         u'  minutes ; le créneau réservé est de trente minutes, pour laisser la place aux',
         u'  questions. En visioconférence, sans engagement.',
         u'- **Accompagnement GEO et SEO** : travail continu sur la citabilité du site, le',
         u'  contenu, les données structurées et la notoriété de la marque.',
         u'', u'## Pages', u'']
    for s, _pr, t, d in entrees:
        L.append(u'- [%s](%s%s) : %s' % (t, RACINE, s, d))
    L += [u'', u'## Contact', u'',
          u'- Site : https://nazar-seo.fr/',
          u'- LinkedIn : https://www.linkedin.com/company/nazar-seo/',
          u'- Adresse : 10 rue de Penthièvre, 75008 Paris, France',
          u'', u'Dernière mise à jour : ' + jour]
    io.open(os.path.join(SORTIE, 'llms.txt'), 'w',
            encoding='utf-8').write(u'\n'.join(L) + u'\n')


def main():
    jour = datetime.date.today().isoformat()
    for p in PAGES:
        chemin = os.path.join(SORTIE, p['slug'] + '.html')
        io.open(chemin, 'w', encoding='utf-8').write(page(p))
        print('  %-24s %6d octets' % (p['slug'] + '.html',
                                      os.path.getsize(chemin)))
    entrees = plan(jour)
    fiche(jour, entrees)
    print('  %-24s %6d octets' % ('sitemap.xml',
                                  os.path.getsize(os.path.join(SORTIE, 'sitemap.xml'))))
    print('  %-24s %6d octets' % ('llms.txt',
                                  os.path.getsize(os.path.join(SORTIE, 'llms.txt'))))


if __name__ == '__main__':
    main()
