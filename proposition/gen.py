# -*- coding: utf-8 -*-
"""Proposition d'audit GEO : quatre pages, une par prospect.

Le contenu vient d'un fichier JSON. Rien n'est ecrit en dur ici sauf ce
qui concerne NAZAR, qui ne change pas d'un prospect a l'autre.

Le nombre de demandes par mois est CALCULE a partir des volumes saisis et
du taux de prise de contact, et les deux sont imprimes sur la page. Un
chiffre pose a la main serait une promesse inventee ; un chiffre dont
l'hypothese est visible est une estimation qu'on peut discuter.
"""

import datetime
import io
import json
import os
import subprocess
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
SORTIE = os.path.join(ICI, 'sortie')

MOIS = ('janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
        'août', 'septembre', 'octobre', 'novembre', 'décembre')

# Ce que NAZAR dit d'elle-meme. Identique sur toutes les propositions.
NAZAR = {
    'annees': 'plus de 4 ans',
    'experience': '10 ans d’expérience en interne',
    'maisons': ['Welcome to the Jungle', 'Sanofi', 'Yateo', 'Canal+'],
    'mail': 'contact@seo-nazar.fr',
    'tel': '+33 7 43 39 25 74',
    'site': 'nazar-seo.fr',
    'linkedin_mael': 'https://www.linkedin.com/in/mael-gallais-0b0a031ba/',
    'agenda': 'https://meetings-eu1.hubspot.com/mael-gallais'
              '?uuid=4a220f85-6a7a-4e61-91e9-c2908eca8f75',
}


def date_fr(d):
    return u'%d %s %d' % (d.day, MOIS[d.month - 1], d.year)


def estime(p):
    """Volume total, et le nombre de demandes qui en decoule.

    Le taux de prise de contact est une hypothese, pas une mesure. Il est
    rendu avec le resultat pour que le lecteur puisse la contester.
    """
    volume = sum(r['volume'] for r in p['requetes'])
    taux = p.get('taux_contact', 0.005)
    n = volume * taux
    # une fourchette, parce qu'un chiffre unique sur une hypothese serait
    # une precision que la methode n'a pas
    bas, haut = int(round(n * 0.85)), int(round(n * 1.15))
    if bas == haut:
        haut = bas + 1
    return {'volume': volume, 'taux': taux, 'bas': max(bas, 1), 'haut': max(haut, 2)}


def main(chemin):
    p = json.load(io.open(chemin, encoding='utf-8'))
    for champ in ('entreprise', 'url', 'requetes'):
        if not p.get(champ):
            raise SystemExit('Champ obligatoire manquant : %s' % champ)

    p['estimation'] = estime(p)
    p['date'] = date_fr(datetime.date.today())
    p['nazar'] = NAZAR
    p.setdefault('marche', 'B2B')
    p.setdefault('agenda', NAZAR['agenda'])
    p.setdefault('exemple', False)
    p['slug'] = ''.join(c if c.isalnum() else '-'
                        for c in p['entreprise'].lower()).strip('-')

    if not os.path.isdir(SORTIE):
        os.makedirs(SORTIE)
    tmp = os.path.join(ICI, '.donnees-rendu.json')
    io.open(tmp, 'w', encoding='utf-8').write(
        json.dumps(p, ensure_ascii=False))
    try:
        subprocess.check_call(['node', os.path.join(ICI, 'rendu.cjs'), tmp])
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)

    f = os.path.join(SORTIE, p['slug'] + '.pdf')
    e = p['estimation']
    print('')
    print('  %s' % f)
    print('  %d octets' % os.path.getsize(f))
    print('  %d requêtes, %d recherches/mois, taux %.2f%% -> %d à %d demandes'
          % (len(p['requetes']), e['volume'], e['taux'] * 100,
             e['bas'], e['haut']))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('usage : python3 proposition/gen.py <fichier.json>')
    main(sys.argv[1])
