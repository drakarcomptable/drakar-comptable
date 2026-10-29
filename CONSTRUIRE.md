# Reconstruire le site

Le site est un fichier unique, assemblé par un script. Rien à installer.

```
bash build.sh        # écrit nazar-site/index.html et nazar-site/sitemap.xml
python3 gen_legal.py # écrit les deux pages légales
```

| Fichier | Rôle |
|---|---|
| `nazar-geo.html` | la source unique : structure, styles et scripts de la page |
| `build.sh` | y ajoute l'en-tête (titre, métas, Open Graph) et le plan du site |
| `gen_legal.py` | génère les mentions légales et la politique de confidentialité |
| `nazar-site/` | la sortie, et la racine de déploiement déclarée dans Vercel |

Ne pas modifier `nazar-site/index.html` à la main : il est réécrit au prochain
build. Toute modification de la page se fait dans `nazar-geo.html`.

Le déploiement est automatique : Vercel suit la branche `main` et publie
`nazar-site/` à chaque push.

## À savoir

`nazar-site/vercel.json` sort de Google Images les visuels clients
(`ref-*`, `cas-0*`, `cas-logo-*`) et les captures Search Console des avis
(`avis-sc-*`), au moyen d'un en-tête `X-Robots-Tag`. Ces fichiers ne doivent
surtout pas être bloqués dans `robots.txt` : Google doit pouvoir les
télécharger pour lire cet en-tête, sans quoi il ne les désindexe jamais.

Les polices sont hébergées ici (`nazar-site/police-*.woff2`) et mises en cache
un an. Les remplacer demande de les renommer, sinon les visiteurs garderont
l'ancienne version.

Le formulaire passe par FormSubmit, avec la clé qui désigne la boîte de Maël.
L'adresse elle-même ne figure pas dans le code.

**Le parcours du formulaire se termine sur l'agenda HubSpot.** Une fois la
demande partie, le visiteur est redirigé vers le lien de prise de rendez-vous,
avec ses nom, prénom, e-mail, société et téléphone repassés en paramètres pour
qu'il n'ait pas à les retaper. Le lien est la constante `AGENDA` dans
`nazar-geo.html` : c'est là qu'il faut le changer si Maël en régénère un.

Trois garde-fous qui tiennent ensemble, à ne pas défaire séparément :

- la redirection ne part **que** si l'envoi a abouti. Sinon le récapitulatif à
  recopier reste à l'écran, sans quoi une demande déjà saisie serait perdue ;
- un robot reconnu voit la même confirmation qu'un visiteur mais n'est pas
  redirigé : son trafic n'a rien à faire sur la page de rendez-vous ;
- le panneau de confirmation porte le lien en clair, cliquable, au cas où la
  redirection ne partirait pas.
