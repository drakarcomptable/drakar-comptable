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
import hashlib
import hmac
from urllib.parse import quote
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn

import donnetadoc

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOTS = os.path.join(ICI, 'depots')
SORTIE = os.path.join(ICI, 'sortie')

# En local on ecoute sur la machine seule. Pour le mettre en ligne, on
# passe HOTE=0.0.0.0, et le mot de passe devient alors obligatoire : voir
# le garde-fou dans main().
PORT = int(os.environ.get('PORT', '8080'))
HOTE = os.environ.get('HOTE', '127.0.0.1')
MDP = os.environ.get('DONETADOC_MDP', '')
UTILISATEUR = os.environ.get('DONETADOC_UTILISATEUR', 'nazar')
# Ouvrir l'outil a tout le monde est un choix, pas un oubli : il faut le
# dire explicitement. Sans mot de passe ET sans cette declaration, le
# service refuse de demarrer sur une adresse reseau.
OUVERT = os.environ.get('DONETADOC_OUVERT', '').strip().lower() in ('oui', 'yes', '1', 'true')

TYPES = {'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp'}


def nom_telecharge(chemin_pdf):
    """Le nom que portera le fichier chez celui qui le telecharge.

    gen.py l'ecrit a cote du PDF. S'il manque, on retombe sur le nom du
    fichier : mieux vaut un telechargement banal qu'un telechargement rate.
    """
    cote = os.path.splitext(chemin_pdf)[0] + '.nom'
    if os.path.exists(cote):
        n = io.open(cote, encoding='utf-8').read().strip()
        if n:
            return n
    return os.path.basename(chemin_pdf)


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

    def _autorise(self):
        """Sans mot de passe configure, l'outil n'est ouvert qu'en local.

        Les documents qu'il fabrique portent des noms et des logos de
        clients : un lien ouvert a tout vent les donnerait a quiconque le
        devine.
        """
        if not MDP:
            return True
        attendu = 'Basic ' + base64.b64encode(
            ('%s:%s' % (UTILISATEUR, MDP)).encode('utf-8')).decode('ascii')
        recu = self.headers.get('Authorization', '')
        # comparaison a temps constant : sinon le temps de reponse trahit
        # combien de caracteres du mot de passe sont justes
        if hmac.compare_digest(recu, attendu):
            return True
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm="DONETADOC", charset="UTF-8"')
        self.send_header('Content-Length', '0')
        self.end_headers()
        return False

    def _envoie(self, code, type_, corps, nom=None):
        if isinstance(corps, str):
            corps = corps.encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', type_)
        self.send_header('Content-Length', str(len(corps)))
        # Rien ici ne gagne a etre garde par le navigateur, et beaucoup y
        # perd. Apres une remise en ligne, une page gardee en memoire
        # continue de faire tourner l'ancien code : on a vu un poste
        # rester sans le telechargement automatique alors qu'il etait
        # deja en service, et une page d'erreur revenir apres un clic qui
        # avait pourtant abouti. Les documents, eux, se prennent une fois.
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        if nom:
            # filename* porte les accents ; filename reste la pour les
            # clients qui ne connaissent pas la forme etendue.
            simple = nom.encode('ascii', 'replace').decode('ascii').replace('"', '')
            self.send_header('Content-Disposition',
                             'attachment; filename="%s"; filename*=UTF-8\'\'%s'
                             % (simple, quote(nom)))
        self.end_headers()
        self.wfile.write(corps)

    def log_message(self, *a):
        pass

    def _page(self, nom):
        p = io.open(os.path.join(ICI, 'outil', nom), encoding='utf-8').read()
        return self._envoie(200, 'text/html; charset=utf-8', p)

    def _json(self, code, obj):
        return self._envoie(code, 'application/json',
                            json.dumps(obj, ensure_ascii=False))

    def _lu(self):
        n = int(self.headers.get('Content-Length') or 0)
        return json.loads(self.rfile.read(n).decode('utf-8')) if n else {}

    def _captures(self, q, slug):
        """Range les images collees dans la requete et rend leurs chemins."""
        out = {}
        for role, champ in (('accueil', 'capture_accueil'),
                            ('analyse', 'capture_analyse')):
            val = q.get(champ) or ''
            if val.startswith('data:'):
                out[role] = ecrit_depot(slug, role, val)
        return out or None

    def do_GET(self):
        chemin = self.path.split('?')[0]
        # L'hebergeur verifie que le service est vivant : il ne peut pas
        # presenter de mot de passe, et cette reponse ne divulgue rien.
        if chemin == '/sante':
            return self._envoie(200, 'text/plain; charset=utf-8',
                                'ok ' + empreinte())
        if chemin.startswith('/icone-') and chemin.endswith('.png'):
            g = os.path.join(ICI, 'outil', nom_sur(chemin[1:]))
            if os.path.exists(g):
                with open(g, 'rb') as src:
                    return self._envoie(200, 'image/png', src.read())
        if not self._autorise():
            return
        if chemin in ('/', '/index.html'):
            return self._page('donetadoc.html')
        if chemin in ('/avance', '/avance.html'):
            return self._page('page.html')
        if chemin.startswith('/icone-') and chemin.endswith('.png'):
            f = os.path.join(ICI, 'outil', nom_sur(chemin[1:]))
            if not os.path.exists(f):
                return self._envoie(404, 'text/plain; charset=utf-8', 'absent')
            with open(f, 'rb') as src:
                return self._envoie(200, 'image/png', src.read())
        if chemin.startswith('/etat/'):
            t = donnetadoc.etat(chemin[6:])
            if not t:
                return self._json(404, {'erreur': 'Document inconnu.'})
            # on ne renvoie pas l'analyse brute : la page n'en a pas besoin
            t.pop('analyse', None)
            t.pop('donnees', None)
            return self._json(200, t)
        if chemin.startswith('/depot/'):
            f = os.path.join(DEPOTS, nom_sur(chemin[7:]))
            if not os.path.exists(f):
                return self._envoie(404, 'text/plain; charset=utf-8', 'absent')
            t = 'image/jpeg' if f.endswith(('.jpg', '.jpeg')) else 'image/png'
            with open(f, 'rb') as src:
                return self._envoie(200, t, src.read())
        if chemin.startswith('/pdf/'):
            f = os.path.join(SORTIE, nom_sur(chemin[5:]))
            if not os.path.exists(f):
                # « absent » sur fond blanc n'explique rien a la personne
                # qui voulait son document. Le disque du service est
                # efface a chaque mise en ligne : un lien garde d'un jour
                # sur l'autre ne vaut plus rien, et il faut le dire.
                return self._envoie(404, 'text/html; charset=utf-8', DISPARU)
            with open(f, 'rb') as src:
                corps = src.read()
            return self._envoie(200, 'application/pdf', corps,
                                nom=nom_telecharge(f))
        self._envoie(404, 'text/plain; charset=utf-8', 'absent')

    def do_POST(self):
        if not self._autorise():
            return
        if self.path == '/doc':
            return self._doc_lance()
        if self.path == '/doc/reprendre':
            return self._doc_reprend()
        if self.path == '/doc/modifier':
            return self._doc_modifie()
        if self.path == '/capturer':
            return self._capture()
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
                val = p.get(champ, '')
                if val.startswith('data:'):
                    p[champ] = ecrit_depot(slug, role, val)
                elif val.startswith('depot:'):
                    # vignette choisie : le fichier est deja range
                    f = os.path.join(DEPOTS, nom_sur(val[6:]))
                    if os.path.exists(f):
                        p[champ] = os.path.relpath(f, os.path.dirname(ICI))
                    else:
                        p.pop(champ, None)
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

    def _doc_lance(self):
        try:
            q = self._lu()
        except Exception as e:
            return self._json(400, {'erreur': 'données illisibles : %s' % e})
        url = str(q.get('url', '')).strip()
        if not re.match(r'^https?://[^\s/]+\.[^\s/]', url):
            if url and not url.startswith('http'):
                url = 'https://' + url
            if not re.match(r'^https?://[^\s/]+\.[^\s/]', url):
                return self._json(400, {'erreur':
                    'Adresse invalide. Exemple : https://www.exemple.fr'})
        ident = donnetadoc.lance(url)
        return self._json(200, {'id': ident})

    def _doc_reprend(self):
        try:
            q = self._lu()
        except Exception as e:
            return self._json(400, {'erreur': 'données illisibles : %s' % e})
        ident = str(q.get('id', ''))
        if not donnetadoc.etat(ident):
            return self._json(404, {'erreur': 'Document inconnu.'})
        url = str(q.get('url', '')).strip() or None
        if url and not url.startswith('http'):
            url = 'https://' + url
        try:
            caps = self._captures(q, 'doc-' + ident)
        except ValueError as e:
            return self._json(400, {'erreur': str(e)})
        donnetadoc.reprend(ident, url, caps)
        return self._json(200, {'id': ident})

    def _doc_modifie(self):
        try:
            q = self._lu()
        except Exception as e:
            return self._json(400, {'erreur': 'données illisibles : %s' % e})
        ident, cmd = str(q.get('id', '')), str(q.get('commande', '')).strip()
        if not cmd:
            return self._json(400, {'erreur': 'Écrivez ce qu’il faut changer.'})
        try:
            pdf, faits = donnetadoc.applique(ident, cmd)
        except KeyError:
            return self._json(404, {'erreur': 'Document inconnu.'})
        except Exception as e:
            return self._json(500, {'erreur': 'La refabrication a échoué.',
                                    'detail': str(e)[:400]})
        if not faits:
            return self._json(422, {
                'erreur': 'Je n’ai pas compris, et je préfère ne rien changer '
                          'plutôt que de deviner.',
                'exemples': donnetadoc.AIDE_COMMANDES})
        return self._json(200, {'pdf': pdf, 'faits': faits})

    def _capture(self):
        """Photographie le site du prospect, section par section.

        Le haut d'une page d'accueil est l'endroit ou un site est a son
        avantage. Les defauts qui nous interessent sont plus bas. On
        decoupe donc tout, et c'est le consultant qui choisit.
        """
        n = int(self.headers.get('Content-Length') or 0)
        try:
            q = json.loads(self.rfile.read(n).decode('utf-8'))
        except Exception as e:
            return self._envoie(400, 'application/json',
                                json.dumps({'erreur': 'données illisibles : %s' % e}))
        url = str(q.get('url', '')).strip()
        if not url.startswith(('http://', 'https://')):
            return self._envoie(400, 'application/json', json.dumps(
                {'erreur': 'Adresse invalide : il faut un http:// ou https://'},
                ensure_ascii=False))
        slug = ''.join(c if c.isalnum() else '-'
                       for c in str(q.get('entreprise', 'site')).lower()).strip('-') or 'site'
        if not os.path.isdir(DEPOTS):
            os.makedirs(DEPOTS)
        r = subprocess.run(
            ['node', os.path.join(ICI, 'sections.cjs'), url, DEPOTS, slug],
            capture_output=True, text=True, timeout=180)
        if r.returncode != 0:
            return self._envoie(502, 'application/json', json.dumps(
                {'erreur': 'Le site n’a pas pu être photographié.',
                 'detail': (r.stderr or r.stdout).strip()[-400:]}, ensure_ascii=False))
        try:
            vues = json.loads(r.stdout)
        except Exception:
            return self._envoie(502, 'application/json', json.dumps(
                {'erreur': 'Réponse illisible du photographe.',
                 'detail': r.stdout[-400:]}, ensure_ascii=False))
        for v in vues:
            v['depot'] = os.path.basename(v.pop('fichier'))
        return self._envoie(200, 'application/json',
                            json.dumps({'vues': vues}, ensure_ascii=False))


_EMPREINTE = None
_SOURCES = ('donnetadoc.py', 'sections.cjs', 'rendu.cjs', 'gen.py',
            'analyse.cjs', 'requetes.py', 'navigateur.cjs', 'outil.py',
            'outil/donetadoc.html')


def empreinte():
    """Les huit premiers caracteres d'une empreinte des sources.

    « Je ne sais pas si la derniere mise a jour est passee » n'a pas de
    reponse quand la seule facon de le savoir est de fabriquer un document
    entier et d'en lire le journal. /sante la donne en une requete : si
    l'empreinte en ligne est celle du depot, le code est a jour.
    """
    global _EMPREINTE
    if _EMPREINTE is None:
        h = hashlib.sha256()
        for nom in _SOURCES:
            c = os.path.join(ICI, nom)
            try:
                with open(c, 'rb') as src:
                    h.update(src.read())
            except OSError:
                h.update(b'absent')
        _EMPREINTE = h.hexdigest()[:8]
    return _EMPREINTE


DISPARU = """<!doctype html><html lang="fr"><meta charset="utf-8">
<title>Document introuvable</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;
background:#f5f3ff;color:#1b1340;font:16px/1.6 system-ui,sans-serif}
.c{max-width:30rem;padding:2rem;text-align:center}
h1{font-size:1.35rem;margin:0 0 .8rem}p{margin:.6rem 0;color:#4a4066}
button{display:inline-block;margin-top:1rem;background:#6d4aff;color:#fff;border:0;
font:inherit;padding:.7rem 1.4rem;border-radius:999px;font-weight:700;cursor:pointer}
input:focus{outline:2px solid #6d4aff;outline-offset:1px}
</style><div class="c"><h1>Ce document n\u2019existe plus sur le serveur</h1>
<p>Les documents ne sont pas conserv\u00e9s&nbsp;: ils sont effac\u00e9s \u00e0 chaque
remise en ligne de l\u2019outil. Un lien gard\u00e9 d\u2019un jour sur l\u2019autre ne
fonctionne donc plus.</p>
<p>Il n\u2019est pas perdu pour autant&nbsp;: collez l\u2019adresse du site ci-dessous
et il se refabrique en une \u00e0 deux minutes.</p>
<form onsubmit="location=\'/?url=\'+encodeURIComponent(this.u.value.trim());return false">
<input name="u" type="url" required placeholder="https://www.exemple.fr"
 style="width:100%;box-sizing:border-box;padding:.7rem .9rem;font:inherit;
 border:1px solid #d6cffa;border-radius:10px;margin-top:.9rem">
<button type="submit">Refaire le document</button></form></div></html>"""


class Serveur(ThreadingMixIn, HTTPServer):
    """Le travail dure une a deux minutes : sans fils separes, la page ne
    pourrait pas demander ou il en est pendant qu'il tourne."""
    daemon_threads = True


def main():
    # Garde-fou : ouvert sur le reseau sans mot de passe, l'outil donnerait
    # a n'importe qui les propositions, et donc les noms et les logos des
    # clients. On refuse de demarrer plutot que de le laisser faire.
    if HOTE not in ('127.0.0.1', 'localhost', '::1') and not MDP and not OUVERT:
        raise SystemExit(
            'Refus de démarrer : HOTE=%s expose l’outil sur le réseau alors '
            'qu’aucun mot de passe n’est défini.\n'
            'Donnez DONETADOC_MDP, ou DONETADOC_OUVERT=oui pour assumer un '
            'accès libre, ou laissez HOTE sur 127.0.0.1.' % HOTE)
    srv = Serveur((HOTE, PORT), Poste)
    print('')
    print('  DONETADOC  ->  http://%s:%d' % (HOTE, PORT))
    if MDP:
        acces = 'par mot de passe'
    elif OUVERT:
        acces = 'LIBRE : quiconque a l’adresse peut fabriquer des documents'
    else:
        acces = 'libre, machine locale seule'
    print('  accès %s' % acces)
    print('  Ctrl+C pour arrêter.')
    print('')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print('  arrêté.')


if __name__ == '__main__':
    main()
