#!/usr/bin/env python3
"""Assemble la version du site prete a etre mise en ligne.

index.html est ecrit sans <!doctype>, <html> ni <head> : c'est ce qu'attend
l'outil de previsualisation. Un navigateur qui recoit ce fichier tel quel
bascule en mode quirks, ou la mise en page peut deriver. Ce script enveloppe
donc le contenu dans un document complet, y ajoute les icones et le
manifeste, puis recopie le tout dans site/.

    python3 build.py

Le dossier site/ est ce qu'on envoie a l'hebergeur.
"""
import io, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'site')

HEAD = '''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="AFRIKAYAA — coiffure cheveux naturels afro a Sainte-Rose et a domicile en Guadeloupe. REVEAL, relooking et estime de soi. Reservation en ligne.">
<meta name="theme-color" content="#09080c">
<meta property="og:type" content="website">
<meta property="og:title" content="AFRIKAYAA &amp; REVEAL">
<meta property="og:description" content="Coiffure cheveux naturels afro et relooking, en Guadeloupe.">
<meta property="og:image" content="assets/hero.webp">
<link rel="icon" href="assets/favicon-32.png" sizes="32x32">
<link rel="icon" href="assets/icon-192.png" sizes="192x192">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="manifest" href="assets/site.webmanifest">
<style>html{color-scheme:light}:root{padding-top:env(safe-area-inset-top,0);padding-bottom:env(safe-area-inset-bottom,0)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
'''

FOOT = '''
</body>
</html>
'''

def main():
    src = os.path.join(HERE, 'index.html')
    if not os.path.exists(src):
        sys.exit('index.html introuvable')

    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)

    body = io.open(src, encoding='utf-8').read()
    io.open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(HEAD + body + FOOT)

    shutil.copytree(os.path.join(HERE, 'assets'), os.path.join(OUT, 'assets'))
    for name in ('email-confirmation.html',):
        if os.path.exists(os.path.join(HERE, name)):
            shutil.copy2(os.path.join(HERE, name), os.path.join(OUT, name))

    total = sum(
        os.path.getsize(os.path.join(root, f))
        for root, _, files in os.walk(OUT) for f in files
    )
    print('site/ pret — %.1f Mo' % (total / 1048576))
    print('Glissez ce dossier sur https://app.netlify.com/drop')

if __name__ == '__main__':
    main()
