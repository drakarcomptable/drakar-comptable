# Bannières LinkedIn NAZAR

Ce dossier n'est **pas** publié : le site déployé sur Vercel a pour racine
`nazar-site/`, tout ce qui est ici reste dans le dépôt.

| Fichier | Dimensions | Destination |
|---|---|---|
| `NAZAR-profil-A/B/C.png` | 1584 x 396 | Couverture du profil, texte sur deux lignes pleine largeur |
| `NAZAR-profil-D/E/F.png` | 1584 x 396 | Couverture du profil, composition horizontale avec filet et logos |
| `NAZAR-entreprise-A/B/C.png` | 1128 x 191 | Couverture de la page entreprise |

Les textes qui vont avec sont dans `../NAZAR-LINKEDIN.md`.

## Régénérer

`sources/gen.py` lit les logos officiels directement dans le code du site, pour
qu'une mise à jour d'un logo sur nazar-seo.fr se répercute ici sans recopie.

```
cd sources
python3 gen.py                       # écrit les HTML
PYTHONPATH=/tmp/pw python3 shot.py   # rend les PNG, suréchantillonnés puis réduits
```

`pjs.b64` est la Plus Jakarta Sans (licence SIL OFL), embarquée en base64 pour
que le rendu ne dépende pas d'un accès réseau au moment de la capture.
