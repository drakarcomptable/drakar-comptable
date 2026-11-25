# -*- coding: utf-8 -*-
"""Interface locale pour fabriquer une proposition.

La capture automatique du site du prospect echoue des que la machine qui
fait tourner l'outil n'a pas acces au site : reseau filtre, site derriere
un mot de passe, page qui refuse les robots. Dans ce cas la proposition
sortait sans visuel. Cette interface permet de deposer les deux captures
a la main, et de tracer les reperes rouges directement sur la seconde.

Lancement :  python3 proposition/outil.py
Puis ouvrir http://127.0.0.1:8080
"""

import io
import json
import os
import re
import subprocess
import sys
import base64
from http.server import BaseHTTPRequestHandler, HTTPServer

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOTS = os.path.join(ICI, 'depots')
SORTIE = os.path.join(ICI, 'sortie')
PORT = 8080

TYPES = {'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp'}


def nom_sur(nom):
    """Un nom de fichier qu'on peut poser sur un disque sans surprise."""
    base = os.path.basename(nom.replace('\\', '/'))
    base = re.sub(r'[^A-Za-z0-9._-]', '-', base).strip('.-')
    return base[:80] or 'depot'


def ecrit_depot(slug, role, donnee):
    """Range une image deposee et rend son chemin relatif au depot."""
    tete, _, corps = donnee.partition(',')
    m = re.match(r'data:([^;]+);base64$', tete)
    if not m or m.group(1) not in TYPES:
        raise ValueError('format d’image non accepté : %s' % tete[:40])
    if not os.path.isdir(DEPOTS):
        os.makedirs(DEPOTS)
    f = os.path.join(DEPOTS, '%s-%s%s' % (slug, role, TYPES[m.group(1)]))
    with open(f, 'wb') as s:
        s.write(base64.b64decode(corps))
    return os.path.relpath(f, os.path.dirname(ICI))


class Poste(BaseHTTPRequestHandler):

    def _envoie(self, code, type_, corps):
        if isinstance(corps, str):
            corps = corps.encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', type_)
        self.send_header('Content-Length', str(len(corps)))
        self.end_headers()
        self.wfile.write(corps)

    def log_message(self, *a):
        pass

    def do_GET(self):
        chemin = self.path.split('?')[0]
        if chemin in ('/', '/index.html'):
            page = io.open(os.path.join(ICI, 'outil', 'page.html'),
                           encoding='utf-8').read()
            return self._envoie(200, 'text/html; charset=utf-8', page)
        if chemin.startswith('/pdf/'):
            f = os.path.join(SORTIE, nom_sur(chemin[5:]))
            if not os.path.exists(f):
                return self._envoie(404, 'text/plain; charset=utf-8', 'absent')
            with open(f, 'rb') as s:
                return self._envoie(200, 'application/pdf', s.read())
        self._envoie(404, 'text/plain; charset=utf-8', 'absent')

    def do_POST(self):
        if self.path != '/fabrique':
            return self._envoie(404, 'text/plain; charset=utf-8', 'absent')
        n = int(self.headers.get('Content-Length') or 0)
        try:
            p = json.loads(self.rfile.read(n).decode('utf-8'))
        except Exception as e:
            return self._envoie(400, 'application/json',
                                json.dumps({'erreur': 'données illisibles : %s' % e}))

        manque = [c for c in ('entreprise', 'url') if not str(p.get(c, '')).strip()]
        if not p.get('requetes'):
            manque.append('au moins une requête')
        if manque:
            return self._envoie(400, 'application/json', json.dumps(
                {'erreur': 'Il manque : ' + ', '.join(manque)}, ensure_ascii=False))

        slug = ''.join(c if c.isalnum() else '-'
                       for c in p['entreprise'].lower()).strip('-') or 'prospect'
        try:
            for role, champ in (('accueil', 'capture_accueil'),
                                ('analyse', 'capture_analyse')):
                if p.get(champ, '').startswith('data:'):
                    p[champ] = ecrit_depot(slug, role, p[champ])
                else:
                    p.pop(champ, None)
        except ValueError as e:
            return self._envoie(400, 'application/json',
                                json.dumps({'erreur': str(e)}, ensure_ascii=False))

        fiche = os.path.join(DEPOTS, slug + '.json')
        if not os.path.isdir(DEPOTS):
            os.makedirs(DEPOTS)
        io.open(fiche, 'w', encoding='utf-8').write(
            json.dumps(p, ensure_ascii=False, indent=2))

        r = subprocess.run([sys.executable, os.path.join(ICI, 'gen.py'), fiche],
                           capture_output=True, text=True)
        if r.returncode != 0:
            detail = (r.stderr or r.stdout or '').strip()[-900:]
            return self._envoie(500, 'application/json', json.dumps(
                {'erreur': 'La fabrication a échoué.', 'detail': detail},
                ensure_ascii=False))

        return self._envoie(200, 'application/json', json.dumps(
            {'pdf': '/pdf/' + slug + '.pdf', 'journal': r.stdout.strip(),
             'fiche': os.path.relpath(fiche, os.path.dirname(ICI))},
            ensure_ascii=False))


def main():
    srv = HTTPServer(('127.0.0.1', PORT), Poste)
    print('')
    print('  Outil de proposition  ->  http://127.0.0.1:%d' % PORT)
    print('  Ctrl+C pour arrêter.')
    print('')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print('  arrêté.')


if __name__ == '__main__':
    main()
