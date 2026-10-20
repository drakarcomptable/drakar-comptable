# -*- coding: utf-8 -*-
"""Imprime le CV en PDF A4, puis en PNG pour comparaison a l'oeil."""
import os, sys
from playwright.sync_api import sync_playwright
ICI = os.path.dirname(os.path.abspath(__file__))
NOM = sys.argv[1] if len(sys.argv) > 1 else 'CV-Clement-Marinho'
with sync_playwright() as p:
    nav = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
                            args=['--no-sandbox', '--force-color-profile=srgb'])
    pg = nav.new_page(viewport={'width': 794, 'height': 1123})
    pg.goto('file://' + os.path.join(ICI, NOM + '.html'))
    pg.wait_for_timeout(400)
    pg.pdf(path=os.path.join(ICI, NOM + '.pdf'), format='A4',
           print_background=True, prefer_css_page_size=True,
           margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
    pg.close(); nav.close()
print(NOM + '.pdf', os.path.getsize(os.path.join(ICI, NOM + '.pdf')) // 1024, 'Ko')
