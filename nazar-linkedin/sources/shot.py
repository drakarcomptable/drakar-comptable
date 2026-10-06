# -*- coding: utf-8 -*-
"""Rend chaque bannière en suréchantillonnage x2, puis la ramène a la taille
exacte attendue par LinkedIn : l'antialiasing y gagne sans que le fichier
dépasse les dimensions recommandées."""
import os, subprocess
from playwright.sync_api import sync_playwright

ICI = os.path.dirname(os.path.abspath(__file__))
FF = '/tmp/ffpkg/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
JEUX = [('profil-D',1584,396),('profil-E',1584,396),('profil-F',1584,396),('profil-A',1584,396),('profil-B',1584,396),('profil-C',1584,396),
        ('entreprise-A',1128,191),('entreprise-B',1128,191),('entreprise-C',1128,191)]

with sync_playwright() as p:
    nav = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
                            args=['--no-sandbox','--force-color-profile=srgb'])
    for nom, L, H in JEUX:
        pg = nav.new_page(viewport={'width':L,'height':H}, device_scale_factor=2)
        pg.goto('file://' + os.path.join(ICI, nom + '.html'))
        pg.wait_for_timeout(450)
        brut = os.path.join(ICI, nom + '@2x.png')
        pg.screenshot(path=brut)
        pg.close()
        final = os.path.join(ICI, 'NAZAR-' + nom + '.png')
        subprocess.check_call([FF,'-y','-loglevel','error','-i',brut,
            '-vf','scale=%d:%d:flags=lanczos'%(L,H),final])
        print(nom, os.path.getsize(final)//1024, 'Ko')
    nav.close()
