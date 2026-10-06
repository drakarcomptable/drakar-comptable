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

## Raccord de la photo de profil avec la bannière

`NAZAR-photo-profil.jpg` n'a pas un fond « dans les tons » de la bannière :
il reproduit **la portion exacte** de bannière que le disque recouvre, à
savoir x 54,0 à 360,3 et y 210,5 à 516,9 en coordonnées de bannière
1584 x 396. Les lignes de niveau traversent donc le liseré blanc sans
décalage. `apercu-raccord.jpg` montre le résultat.

Cette position a été relevée sur une capture du profil, par ajustement d'un
cercle sur le liseré blanc : centre (207,2 ; 363,7), rayon 153,2. 61 % du
disque est au-dessus du bord bas de la bannière, le reste tombe sur la carte
blanche.

Comme le navigateur ne sait dessiner que les 396 pixels de haut de la
bannière, `sources/fond_banniere.py` refait le fond en calcul (dégradé
radial, lignes de niveau, voile) pour pouvoir l'évaluer sous ce bord. La
formule est vérifiée contre le rendu de Chromium : écart moyen de 0,42
sur 255.

**Deux conséquences.** Le calage vaut pour l'affichage sur ordinateur ;
sur mobile LinkedIn place l'avatar ailleurs et le raccord n'y est
qu'approché. Et la photo est liée à la bannière **D** : changer de bannière
demande de régénérer le fond avec la nouvelle valeur de `BAN`.
