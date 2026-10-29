# Reconstruire le site

Le site est un fichier unique, assemblé par un script. Rien à installer.

```
bash build.sh             # écrit nazar-site/index.html et nazar-site/sitemap.xml
python3 gen_legal.py      # écrit les deux pages légales
python3 gen_passerelle.py # écrit la page d'atterrissage publicitaire
```

| Fichier | Rôle |
|---|---|
| `nazar-geo.html` | la source unique : structure, styles et scripts de la page |
| `build.sh` | y ajoute l'en-tête (titre, métas, Open Graph) et le plan du site |
| `gen_legal.py` | génère les mentions légales et la politique de confidentialité |
| `gen_passerelle.py` | génère `audit-gratuit/`, la page d'atterrissage des publicités |
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

**Le parcours du formulaire se termine sur l'agenda HubSpot.** « Recevoir mon
audit » envoie la demande et emmène le visiteur sur le lien de prise de
rendez-vous dans le même geste, avec ses prénom, nom, e-mail, société et
téléphone repassés en paramètres pour qu'il n'ait rien à retaper. Aucun écran
intermédiaire : un panneau de confirmation entre les deux coûtait des
rendez-vous. Le lien est la constante `AGENDA` dans `nazar-geo.html` : c'est là
qu'il faut le changer si Maël en régénère un.

Le champ de nom demande « Prénom et nom » dans cet ordre, et pas l'inverse :
le premier mot saisi part en `firstName`, le reste en `lastName`. Changer le
libellé sans changer la découpe inverserait les deux chez HubSpot.

Trois garde-fous qui tiennent ensemble, à ne pas défaire séparément :

- l'envoi et la redirection sont **indépendants**. L'envoi porte
  `keepalive: true`, donc il arrive à destination même si la page est déjà en
  train de se décharger : une personne qui renonce au créneau laisse quand
  même ses coordonnées. C'est tout l'intérêt du dispositif, et ça se perdrait
  en attendant la réponse de FormSubmit avant de rediriger ;
- un minuteur de 600 ms borne cette attente, pour qu'un réseau lent ou un
  bloqueur de publicité ne retienne personne devant un bouton grisé ;
- un robot reconnu est envoyé sur l'agenda comme n'importe quel visiteur, mais
  rien ne nous est transmis : lui répondre une erreur l'inciterait à
  recommencer.

## Le pixel de mesure publicitaire

`nazar-site/mesure.js` est chargé dans l'en-tête des quatre pages. Il porte le
bandeau de consentement et le pixel de mesure d'OpenAI, et rien d'autre.

**Le SDK n'est téléchargé qu'après acceptation.** La documentation d'OpenAI
propose une autre voie, `oaiq("consent", false)` avant l'initialisation puis
`oaiq("consent", true)` après accord : le pixel est alors chargé mais muet.
Nous avons retenu la voie plus stricte, aucune requête vers openai.com tant que
le visiteur n'a pas répondu. Un refus est conservé aussi longtemps qu'un
accord, sans quoi le bandeau reviendrait à chaque page et le refus ne vaudrait
rien.

**Le SDK ne compte pas les pages vues de lui-même.** C'est le piège de
l'intégration : installer le script et s'arrêter là ne produit aucun
événement, le flux d'Ads Manager reste vide et la vérification de
l'intégration ne passe jamais. D'où l'appel `page_viewed` à chaque chargement.

Les deux événements envoyés :

| Événement | Déclencheur | Conversion côté Ads Manager |
|---|---|---|
| `page_viewed` | chaque chargement de page | aucune, sert de preuve de vie |
| `lead_created` | clic sur « Recevoir mon audit » | Demande d'audit |

`appointment_scheduled` est le nom à utiliser le jour où une page de
remerciement mesurera les rendez-vous réellement pris. Il attend que HubSpot
redirige vers une page du domaine après réservation.

Pour diagnostiquer, ajouter `?pixeldebug=1` à l'adresse : le SDK écrit alors
son activité dans la console. L'option reste éteinte pour les visiteurs.

Le trafic publicitaire n'est pas mesuré par ce pixel, et c'est voulu : la
passerelle repart sur HubSpot au bout de deux secondes, personne n'accepte des
cookies dans ce laps de temps, et la réservation a lieu sur un domaine que nous
ne contrôlons pas. Les rendez-vous venus des annonces se comptent dans HubSpot,
grâce aux UTM que la passerelle transmet. Le correctif propre, le jour où le
budget le justifiera, est d'intégrer le calendrier HubSpot directement dans
`/audit-gratuit` au lieu de rediriger.

## La passerelle publicitaire

`nazar-seo.fr/audit-gratuit` est la page d'atterrissage des campagnes : le
logo, « Recevoir mon audit GEO gratuit » et trois points qui pulsent, puis
l'agenda au bout de 2 secondes.

La première version portait un titre, un paragraphe et trois arguments. C'était
une faute : dans une fenêtre de deux secondes, du texte qu'on n'a pas le temps
de lire donne l'impression de rater quelque chose. Une passerelle ne doit rien
demander. Deux variantes ont ensuite été comparées en ligne, l'écran de marque
muet et celle-ci ; celle-ci l'emporte, parce que l'animation annonce qu'il se
passe quelque chose et que l'attente est donc comprise au lieu d'être subie.

**Pourquoi ne pas envoyer la publicité directement sur l'agenda.** Un clic
depuis une réponse de ChatGPT arrive froid : tomber sans transition sur une
grille de créneaux d'un domaine inconnu fait repartir. Et le trafic payant
passe ainsi par le domaine, donc il se mesure là où le reste se mesure.

**Les paramètres de campagne suivent jusqu'à HubSpot.** Tout ce qui arrive
dans l'URL (`utm_source`, `utm_medium`, `utm_campaign`…) est recopié sur le
lien de rendez-vous, à l'exception d'un `uuid` parasite qui écraserait celui
du lien. Sans cela, un rendez-vous venu de la publicité serait indiscernable
d'un autre et le budget se piloterait à l'aveugle.

**Le lien de rendez-vous n'est pas le même que celui du formulaire.** Deux
liens, deux sources : `auditnazargeo` pour la publicité, `auditgeonazar` pour
le formulaire du site. L'agenda dit alors de lui-même d'où vient chaque prise
de rendez-vous. Les deux sont des constantes, `AGENDA` dans
`gen_passerelle.py` et `AGENDA` dans `nazar-geo.html`.

**Aucun script tiers sur la page.** Le module de prise de rendez-vous HubSpot
n'y est pas embarqué : il poserait des cookies de suivi sur le domaine et
imposerait une bannière de consentement à un site qui n'en a pas besoin. Le
calendrier reste chez HubSpot, où sa propre information s'applique.

La page est en `noindex` et absente du plan du site. Comme les visuels
clients, elle ne doit pas être bloquée dans `robots.txt` : Google doit
pouvoir la télécharger pour lire la balise.

Pour en faire une vraie page d'atterrissage, sans ouverture automatique,
mettre `DELAI = 0` dans `gen_passerelle.py`. C'est la version à tester si le
taux de prise de rendez-vous déçoit.
