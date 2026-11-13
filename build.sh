set -e
# Les chemins sont relatifs au depot : le dossier de travail d'une session
# disparait avec son conteneur, le script ne doit pas en dependre.
# nazar-geo.html est la source unique du site, nazar-site/ sa sortie, qui
# est aussi la racine de deploiement declaree dans Vercel.
SP="$(cd "$(dirname "$0")" && pwd)"
OUT="$SP/nazar-site"
mkdir -p "$OUT"
cat > "$OUT/index.html" <<'HEAD'
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="NAZAR place votre entreprise dans les réponses de ChatGPT, Perplexity, Gemini et sur Google. Collectif de consultants SEO et GEO. Audit gratuit en 9 minutes.">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:title" content="Nazar SEO &amp; GEO : Expert en référencement sur les IA">
<meta property="og:description" content="NAZAR place votre entreprise dans les réponses de ChatGPT, Perplexity, Gemini et sur Google. Collectif de consultants SEO et GEO. Audit gratuit en 9 minutes.">
<meta property="og:image" content="https://nazar-seo.fr/logo-partage.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="1200">
<meta property="og:url" content="https://nazar-seo.fr/">
<meta property="og:site_name" content="NAZAR">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="https://nazar-seo.fr/">
<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" href="logo.png" sizes="192x192">
<link rel="apple-touch-icon" href="apple-touch-icon.png" sizes="180x180">
<!-- mesure publicitaire : le pixel n'est charge qu'apres
     acceptation du bandeau, voir nazar-site/mesure.js -->
<script src="/mesure.js" defer></script>
HEAD
python3 - "$SP/nazar-geo.html" "$OUT/index.html" <<'TITRE'
import io, sys
src, dst = sys.argv[1], sys.argv[2]
lignes = io.open(src, encoding='utf-8').read().split('\n')
lignes[0] = '<title>Nazar SEO &amp; GEO : Expert en r\u00e9f\u00e9rencement sur les IA</title>'
io.open(dst, 'a', encoding='utf-8').write('\n'.join(lignes))
TITRE
printf '\n</body>\n</html>\n' >> "$OUT/index.html"
python3 - "$OUT/index.html" <<'PY'
import sys
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
first=min([x for x in [s.find('\n<nav'), s.find('\n<header'), s.find('\n<section'), s.find('\n<div')] if x>0])
cut=s.rfind('</style>',0,first)+len('</style>')
open(p,'w',encoding='utf-8').write(s[:cut]+'\n</head>\n<body>'+s[cut:])
PY
cd "$OUT"
# plan du site et fiche de lecture pour les moteurs
# Les deux fichiers sortent de la meme liste : ils ne peuvent pas diverger.
# Les pages legales portent une balise noindex : les annoncer reviendrait
# a demander a Google d'indexer ce qu'on lui demande d'ignorer.
python3 - <<'PLAN'
# -*- coding: utf-8 -*-
import datetime, io
j = datetime.date.today().isoformat()

# (chemin, priorite, titre, description) : une seule source pour sitemap.xml
# et llms.txt. Ajouter une page ici la publie dans les deux.
pages = [
    (u'', u'1.0', u'NAZAR SEO & GEO',
     u'Collectif de consultants en r\u00e9f\u00e9rencement sur Google et sur les IA g\u00e9n\u00e9ratives. Audit GEO gratuit en 9 minutes.'),
]

x = [u'<?xml version="1.0" encoding="UTF-8"?>',
     u'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for p, pr, _t, _d in pages:
    x += [u'  <url>', u'    <loc>https://nazar-seo.fr/' + p + u'</loc>',
          u'    <lastmod>' + j + u'</lastmod>',
          u'    <priority>' + pr + u'</priority>', u'  </url>']
x.append(u'</urlset>')
io.open('sitemap.xml', 'w', encoding='utf-8').write(u'\n'.join(x) + u'\n')

# llms.txt : convention llmstxt.org. Ce fichier existe pour qu'un moteur
# generatif puisse citer NAZAR sans avoir a interpreter la mise en page.
# Il ne contient aucun nom de client : une recherche sur la marque d'un
# client ne doit pas pouvoir remonter jusqu'ici.
L = []
L.append(u'# NAZAR SEO & GEO')
L.append(u'')
L.append(u'> NAZAR est un collectif fran\u00e7ais de consultants en r\u00e9f\u00e9rencement naturel')
L.append(u'> (SEO) et en r\u00e9f\u00e9rencement dans les intelligences artificielles g\u00e9n\u00e9ratives')
L.append(u'> (GEO, pour generative engine optimization). NAZAR travaille la visibilit\u00e9')
L.append(u'> des entreprises dans les r\u00e9ponses de ChatGPT, Perplexity, Gemini et Claude,')
L.append(u'> dans les AI Overviews de Google, et leur position dans les r\u00e9sultats de')
L.append(u'> recherche classiques. Bas\u00e9 \u00e0 Paris, le collectif intervient partout en France.')
L.append(u'')
L.append(u'## D\u00e9finitions')
L.append(u'')
L.append(u"- **GEO (generative engine optimization)** : l'ensemble des techniques qui")
L.append(u'  rendent une entreprise citable par les moteurs g\u00e9n\u00e9ratifs. L\u00e0 o\u00f9 le SEO vise')
L.append(u'  une position dans une liste de liens, le GEO vise la pr\u00e9sence dans une')
L.append(u'  r\u00e9ponse r\u00e9dig\u00e9e, o\u00f9 un seul acteur est souvent nomm\u00e9.')
L.append(u'- **AEO (answer engine optimization)** : terme employ\u00e9 comme synonyme de GEO')
L.append(u"  par une partie du march\u00e9. L'objet est le m\u00eame : \u00eatre la r\u00e9ponse.")
L.append(u'- **LLMO (large language model optimization)** : autre synonyme en circulation.')
L.append(u'')
L.append(u'## Offre')
L.append(u'')
L.append(u'- **Audit GEO gratuit** : un consultant NAZAR audite le site en direct et remet')
L.append(u'  une feuille de route de visibilit\u00e9 dans les IA. L\u2019audit lui-m\u00eame prend neuf')
L.append(u'  minutes ; le cr\u00e9neau r\u00e9serv\u00e9 est de trente minutes, pour laisser la place aux')
L.append(u'  questions. En visioconf\u00e9rence, sans engagement.')
L.append(u'- **Accompagnement GEO et SEO** : travail continu sur la citabilit\u00e9 du site, le')
L.append(u'  contenu, les donn\u00e9es structur\u00e9es et la notori\u00e9t\u00e9 de la marque.')
L.append(u'')
L.append(u'## Pages')
L.append(u'')
for p, _pr, t, d in pages:
    L.append(u'- [' + t + u'](https://nazar-seo.fr/' + p + u') : ' + d)
L.append(u'')
L.append(u'## Contact')
L.append(u'')
L.append(u'- Site : https://nazar-seo.fr/')
L.append(u'- LinkedIn : https://www.linkedin.com/company/nazar-seo/')
L.append(u'- Adresse : 10 rue de Penthi\u00e8vre, 75008 Paris, France')
L.append(u'')
L.append(u'Derni\u00e8re mise \u00e0 jour : ' + j)
io.open('llms.txt', 'w', encoding='utf-8').write(u'\n'.join(L) + u'\n')
PLAN
