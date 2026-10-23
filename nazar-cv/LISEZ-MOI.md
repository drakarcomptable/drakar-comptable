# CV NAZAR

Le CV de Clément, refabriqué à l'identique à partir du PDF reçu, en HTML puis
en PDF A4. Ce dossier n'est pas publié : la racine du site déployé sur Vercel
est `nazar-site/`.

| Fichier | Rôle |
|---|---|
| `contenu.py` | le contenu, un consultant par dictionnaire |
| `cv.py` | la mise en page, cotes du PDF d'origine converties en pixels CSS |
| `bandeau.py` | le bandeau de tête, bâti sur le socle des bannières LinkedIn |
| `shotban.py` | rend le bandeau en PNG, trois fois la taille puis réduit au double |
| `rend.py` | imprime le CV en PDF A4 |
| `verif.py` | compare la refabrication au PDF d'origine, ligne par ligne |

## Refaire le CV

```
python3 cv.py                           # écrit le HTML
PYTHONPATH=/tmp/pw python3 rend.py      # imprime le PDF
```

Le bandeau n'a besoin d'être refait que si la charte change :

```
python3 bandeau.py && PYTHONPATH=/tmp/pw python3 shotban.py
```

## Pourquoi repartir de zéro

Le PDF reçu était un cul-de-sac. Ses polices sont de **type 3**, donc sans nom
ni métrique exploitable : impossible de savoir quelle fonte avait servi, et
impossible de modifier le texte. Toutes les coordonnées y sont des multiples
de 0,75 point, c'est-à-dire des pixels CSS entiers : la page avait été
composée en HTML à 96 points par pouce, puis imprimée en calant chaque glyphe
sur le pixel. C'est de là que vient le format de page, 595,92 x 842,88 points
au lieu des 595,28 x 841,89 d'un A4 strict.

Les cotes ci-dessous ont donc été relevées dans le PDF et reconverties en
pixels CSS (1 px = 0,75 pt).

| Élément | Valeur |
|---|---|
| Page | 794 x 1123 px |
| Marges gauche et droite | 57 px |
| Bandeau | 681 x 82 px, coins à 4 px, filet de 1 px |
| Photo | 56 x 56 px, en haut à droite |
| Colonnes | 421 px, gouttière de 12, 248 px |
| Filet épais sous l'en-tête | 2 px |
| Filets sous les titres | 1 px |
| Encre | `#111827` titres et filets, `#1f2937` texte, `#374151` ligne de contact |

## Ce qui est mieux que l'original

Le bandeau de tête était une image de 1024 px affichée sur 509 points, soit
145 points par pouce : visiblement mou à l'impression. Il est maintenant
refabriqué à partir du **même socle que les bannières LinkedIn**, donc le
dégradé, les lignes de niveau et les logos des moteurs viennent du code du
site, et il est rendu à 2048 px, soit 290 points par pouce.

Les cotes du bandeau ont été relevées sur celui d'origine, pixel par pixel :
filet turquoise aux colonnes 731-732, pastilles de 36 espacées de 9, texte
finissant à 712, marge droite de 56. La refabrication retombe à un pixel près
sur chacune.

## Ce qui ne peut pas être identique

La fonte d'origine est inconnue, et ses glyphes ne sont pas récupérables
depuis un type 3. Le CV est donc composé en Arial / Helvetica, sur lesquelles
les mesures du PDF collent à mieux que 2 % pour le texte courant. Le gras de
la fonte d'origine est en revanche 5 à 8 % plus étroit que celui d'Arial, ce
qui déplace **un mot sur trois lignes** du document, toujours dans les
intitulés en gras :

- « ...sur sites >100k pages | et gestion du JS SEO. »
- « ...sur 5 pays (FR, UK, | DE, ES, IT)... »
- « Log Analysis, Crawl JS, | Schema.org... »

Rien d'autre ne bouge. `verif.py` mesure l'écart sur les 78 lignes communes
aux deux documents :

| Mesure | Écart médian | Pire cas |
|---|---|---|
| Largeur de ligne | +0,09 % | +5,4 % |
| Position verticale | +0,2 pt | +3,4 pt |
| Bord gauche | +0,2 pt | −3,8 pt |

Un demi-millimètre au pire, sur une page A4.

## Pour un autre consultant

Copier le dictionnaire de `contenu.py`, changer le contenu, la photo (celles
de `../nazar-linkedin/`) et `fichier`, puis relancer `cv.py` et `rend.py`.
La mise en page ne bouge pas.

**Attention aux noms de clients.** Ce CV en cite, ce qui est normal dans un
CV, mais c'est l'inverse de la règle tenue sur le site : là-bas aucun nom de
client n'apparaît dans le code, pour qu'une recherche sur la marque d'un
client ne ramène pas au site. Un CV se transmet à la main, pas par un moteur ;
si ce PDF devait un jour être mis en ligne, la question se reposerait.

## Deuxième CV : François Chauvin

Même gabarit, contenu dans `contenu.py` sous `FRANCOIS`, photo
`../nazar-linkedin/NAZAR-photo-profil-8.jpg`.

```
python3 cv.py FRANCOIS
PYTHONPATH=/tmp/pw python3 rend.py CV-Francois-Chauvin
```

Deux différences tenant au contenu, pas à la mise en page :

- six expériences au lieu de quatre, donc des puces plus courtes. Le texte
  descend à 798 points, pour un filet de pied à 805,5 : une page pleine ;
- la dernière rubrique de la colonne de droite s'intitule **ENGAGEMENTS** et
  non CERTIFICATIONS. La clé `titre_certifications` permet de la renommer.

Le bloc NAZAR porte une puce par compte, avec son secteur, les optimisations
déployées et le résultat chiffré. C'est le bloc le plus long du CV, et c'est
voulu : c'est le travail en cours. Les chiffres viennent des relevés fournis
par NAZAR, aucun n'est estimé.

## Troisième CV : Maël Gallais

`contenu.py` sous `MAEL`, photo `../nazar-linkedin/NAZAR-photo-profil-7.jpg`.

```
python3 cv.py MAEL
PYTHONPATH=/tmp/pw python3 rend.py CV-Mael-Gallais
```

Six expériences et six comptes NAZAR tiennent sur la page sans rien raccourcir :
le texte descend à 755 points à gauche et 785 à droite, pour un filet de pied à
805,5. Les comptes NAZAR portent le nom du client en gras, comme sur le CV de
François, et non en italique comme les marques simplement citées sur celui de
Clément.

**L'adresse LinkedIn n'y figure pas.** Celle fournie,
`linkedin.com/in/florian-marinho/`, n'est pas la sienne : c'est un profil au nom
de Florian Marinho. La troisième entrée de la ligne de contact porte « Permis B »
en attendant la bonne adresse.
