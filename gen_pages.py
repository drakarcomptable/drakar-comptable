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


from pages_nazar import PAGES  # noqa: E402  le contenu vit a part


# --------------------------------------------------------------------------
# Fabrication
# --------------------------------------------------------------------------

FLECHE = (u'<span class="arrow"><svg viewBox="0 0 24 24" fill="none" '
          u'stroke="currentColor" stroke-width="3" stroke-linecap="round" '
          u'stroke-linejoin="round" aria-hidden="true">'
          u'<path d="M5 12h13M12 5l7 7-7 7"/></svg></span>')


MOIS = (u'janvier', u'février', u'mars', u'avril', u'mai', u'juin',
        u'juillet', u'août', u'septembre', u'octobre', u'novembre',
        u'décembre')


def date_fr(iso):
    a, m, j = iso.split('-')
    return u'%d %s %s' % (int(j), MOIS[int(m) - 1], a)


def og(p):
    """Le nom de la vignette de partage. Un article vit sous /blog/, mais
    son image reste a plat : un sous-dossier d'images n'apporte rien."""
    return ('blog-' + p['slug']) if p.get('parent') == 'blog' else p['slug']


def adr(p):
    """Le chemin public d'une page. Un article vit sous /blog/, pour que
    l'URL dise la meme chose que le fil d'Ariane."""
    return ('blog/' + p['slug']) if p.get('parent') == 'blog' else p['slug']


def bouton(href, libelle, variante=u'btn-dark'):
    return (u'<a class="btn %s" href="%s">%s%s</a>'
            % (variante, href, libelle, FLECHE))


def tete(p):
    """Le <head>, identique d'une page a l'autre sauf les balises propres."""
    url = RACINE + adr(p)
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
         u'<meta property="og:image" content="%sog/%s.jpg">' % (RACINE, og(p)),
         u'<meta property="og:image:width" content="1200">',
         u'<meta property="og:image:height" content="630">',
         u'<meta property="og:image:alt" content="%s">' % p['h1'],
         u'<meta property="og:site_name" content="NAZAR">',
         u'<meta property="og:locale" content="fr_FR">',
         # sans cette ligne, X et LinkedIn affichent une vignette carree
         u'<meta name="twitter:card" content="summary_large_image">',
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


PARENTS = {'blog': (u'Blog', u'/blog')}


def ariane(p):
    L = [u'<nav class="fil" aria-label="Fil d’Ariane"><ol>',
         u'<li><a href="/">Accueil</a></li>']
    if p.get('parent'):
        nom, href = PARENTS[p['parent']]
        L.append(u'<li><a href="%s">%s</a></li>' % (href, nom))
    L.append(u'<li><span aria-current="page">%s</span></li>' % p['fil'])
    L.append(u'</ol></nav>')
    return L


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
        if b.get('etapes'):
            L.append(u'<div class="etapes">')
            for e in b['etapes']:
                cl = u'et cle' if e.get('cle') else u'et'
                L.append(u'<div class="%s"><span class="n"></span><div>'
                         u'<b>%s</b><span>%s</span>' % (cl, e['t'], e['d']))
                if e.get('ici'):
                    L.append(u'<span class="ici">%s</span>' % e['ici'])
                L.append(u'</div><div class="jauge"><i style="width:%s"></i></div>'
                         u'</div>' % e['part'])
            L.append(u'</div>')
        if b.get('tableau'):
            t = b['tableau']
            L.append(u'<div class="tab"><table><thead><tr>')
            L += [u'<th>%s</th>' % c for c in t['entetes']]
            L.append(u'</tr></thead><tbody>')
            for ligne in t['lignes']:
                L.append(u'<tr><th scope="row">%s</th>%s</tr>'
                         % (ligne[0], u''.join(u'<td>%s</td>' % c for c in ligne[1:])))
            L.append(u'</tbody></table></div>')
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

    if p.get('liste'):
        L.append(u'<section class="bloc"><div class="artl">')
        for a in [x for x in PAGES if x.get('parent') == 'blog']:
            L.append(u'<a href="/%s"><time datetime="%s">%s</time>'
                     u'<b>%s</b><span>%s</span></a>'
                     % (adr(a), a['date'], date_fr(a['date']),
                        a['h1'], a['resume']))
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
    url = RACINE + adr(p)
    blocs = [{
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': RACINE},
            {'@type': 'ListItem', 'position': 2, 'name': p['fil'], 'item': url}]}]

    if p.get('parent'):
        nom, href = PARENTS[p['parent']]
        blocs[0]['itemListElement'] = [
            {'@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': RACINE},
            {'@type': 'ListItem', 'position': 2, 'name': nom,
             'item': RACINE + href.lstrip('/')},
            {'@type': 'ListItem', 'position': 3, 'name': p['fil'], 'item': url}]

    if p.get('date'):
        # L'auteur declare est l'entite NAZAR, pas une personne : attribuer
        # un texte a quelqu'un qui ne l'a pas ecrit serait faux. Un auteur
        # nomme serait un signal plus fort, il demande un vrai nom.
        blocs.append({
            '@context': 'https://schema.org', '@type': 'Article',
            'headline': p['h1'],
            'description': p['desc'],
            'datePublished': p['date'],
            'dateModified': p.get('maj', p['date']),
            'inLanguage': 'fr-FR',
            'author': {'@id': ORG},
            'publisher': {'@id': ORG},
            'mainEntityOfPage': {'@type': 'WebPage', '@id': url}})

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
    entrees += [(adr(p), p['prio'], p['fil'], p['llms']) for p in PAGES]

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


def adresses():
    """Les reecritures d'URL sortent du registre, elles aussi.

    Sans cela une page peut exister dans nazar-site/ sans que son adresse
    sans extension reponde : le fichier est la, l'URL tombe en 404. On ne
    touche qu'au tableau rewrites, les redirections et les en-tetes sont
    maintenus a la main.
    """
    import collections
    chemin = os.path.join(SORTIE, 'vercel.json')
    c = json.load(io.open(chemin, encoding='utf-8'),
                  object_pairs_hook=collections.OrderedDict)
    nos = {adr(p) for p in PAGES}
    garde = []
    for r in c['rewrites']:
        cible = r['destination'].lstrip('/')
        if cible.replace('.html', '') in nos:
            continue                      # regeneree juste apres
        if not os.path.exists(os.path.join(SORTIE, cible)):
            continue                      # reecriture morte, on la laisse partir
        garde.append(r)
    neuves = []
    for p in PAGES:
        a = adr(p)
        for src in ('/' + a, '/' + a + '/'):
            neuves.append(collections.OrderedDict(
                [('source', src), ('destination', '/%s.html' % a)]))
    c['rewrites'] = garde + neuves
    io.open(chemin, 'w', encoding='utf-8').write(
        json.dumps(c, indent=2, ensure_ascii=False) + '\n')
    return len(c['rewrites'])


def main():
    jour = datetime.date.today().isoformat()
    for p in PAGES:
        chemin = os.path.join(SORTIE, adr(p) + '.html')
        d = os.path.dirname(chemin)
        if not os.path.isdir(d):
            os.makedirs(d)
        io.open(chemin, 'w', encoding='utf-8').write(page(p))
        print('  %-36s %6d octets' % (adr(p) + '.html',
                                      os.path.getsize(chemin)))
    entrees = plan(jour)
    print('  %-24s %6d reecritures' % ('vercel.json', adresses()))
    fiche(jour, entrees)
    print('  %-24s %6d octets' % ('sitemap.xml',
                                  os.path.getsize(os.path.join(SORTIE, 'sitemap.xml'))))
    print('  %-24s %6d octets' % ('llms.txt',
                                  os.path.getsize(os.path.join(SORTIE, 'llms.txt'))))


if __name__ == '__main__':
    main()
