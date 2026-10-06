set -e
SP=/tmp/claude-0/-home-user-drakar-comptable/053d6a3d-6ce3-51d7-a083-05ef634a21f1/scratchpad
OUT=$SP/deploy
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
# plan du site, pour Google et pour les moteurs generatifs
python3 - <<'SITEMAP'
import datetime, io
j = datetime.date.today().isoformat()
# les pages legales portent une balise noindex : les annoncer ici reviendrait
# a demander a Google d'indexer ce qu'on lui demande d'ignorer
pages = [('', '1.0')]
x = ['<?xml version="1.0" encoding="UTF-8"?>',
     '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for p, pr in pages:
    x += ['  <url>', '    <loc>https://nazar-seo.fr/' + p + '</loc>',
          '    <lastmod>' + j + '</lastmod>', '    <priority>' + pr + '</priority>', '  </url>']
x.append('</urlset>')
io.open('sitemap.xml', 'w', encoding='utf-8').write('\n'.join(x) + '\n')
SITEMAP
