# -*- coding: utf-8 -*-
"""Rend le bandeau a trois fois sa taille, puis le ramene au double : le CV
l'affiche sur 509 points de large, soit 290 points par pouce une fois reduit.
"""
import os, subprocess
from playwright.sync_api import sync_playwright
ICI = os.path.dirname(os.path.abspath(__file__))
FF = '/tmp/ffpkg/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
L, H = 1024, 123
with sync_playwright() as p:
    nav = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
                            args=['--no-sandbox', '--force-color-profile=srgb'])
    pg = nav.new_page(viewport={'width': L, 'height': H}, device_scale_factor=3)
    pg.goto('file://' + os.path.join(ICI, 'bandeau-cv.html'))
    pg.wait_for_timeout(500)
    pg.screenshot(path=os.path.join(ICI, 'bandeau@3x.png'))
    pg.close(); nav.close()
subprocess.check_call([FF, '-y', '-loglevel', 'error',
                       '-i', os.path.join(ICI, 'bandeau@3x.png'),
                       '-vf', 'scale=%d:%d:flags=lanczos' % (L * 2, H * 2),
                       os.path.join(ICI, 'bandeau-cv.png')])
print('bandeau-cv.png', os.path.getsize(os.path.join(ICI, 'bandeau-cv.png')) // 1024, 'Ko')
