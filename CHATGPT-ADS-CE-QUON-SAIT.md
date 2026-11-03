# ChatGPT Ads : tout ce qu'on a appris en production

Document de passation, rédigé le 3 novembre 2026 à partir d'une campagne
réellement diffusée du 29 octobre au 3 novembre 2026 sur le compte NAZAR.
Tout ce qui suit est observé sur un compte réel, pas lu dans une
documentation, sauf mention explicite du contraire.

But : servir de contexte à la conception d'un SaaS de pilotage de campagnes
ChatGPT Ads, avec un agent IA.

---

## 1. Les faits de la campagne

Compte de facturation « Expert en référencement IA », France, EUR.
Une campagne, un groupe d'annonces, une annonce.

| | |
|---|---|
| Période | 29 oct. 06 h 03 CET au 3 nov. |
| Budget | quotidien, 30 € puis 50 € |
| Enchère | automatique, optimisée sur les clics |
| Dépensé | 115,03 € |
| Impressions | 12 845 |
| Clics | 73 |
| CPC moyen | 1,58 € |
| CPM effectif | 9,18 € |
| Portée | 10 765 personnes uniques |
| Fréquence | 1,18 |
| CTR | 0,50 % à 0,60 % |
| Rendez-vous obtenus | 3, vérifiés dans le CRM |
| Coût par rendez-vous | 38 € |
| Clics transformés en rendez-vous | 4,2 % |

Impressions par jour :

| Jour | Impressions | Remarque |
|---|---|---|
| 29 oct. | 5 182 | lancement |
| 30 oct. | 2 054 | |
| 31 oct. | 3 134 | samedi, 2e meilleur jour |
| 1er nov. | 2 057 | dimanche férié |
| 2 nov. | ~1 400 | |
| 3 nov. | ~1 700 | |

Trois enseignements de ce tableau :

1. **Le week-end et les jours fériés ne pénalisent pas.** Le samedi est le
   deuxième meilleur jour. Deux des trois rendez-vous ont été pris un samedi
   et un dimanche férié. Contre-intuitif en B2B, à vérifier sur d'autres
   comptes, mais c'est ce qu'on observe.
2. **Le budget n'est jamais atteint.** 20,65 € dépensés par jour en moyenne
   contre un plafond à 30. Augmenter le plafond ne change rien : c'est
   l'inventaire ou l'enchère qui limitent, pas le budget.
3. **Le CPC est très volatil** : 1,15 € le 30 octobre, 1,61 € le 2 novembre,
   0,10 € le 3 novembre. Un facteur 16 en quatre jours, sans qu'on touche à
   l'enchère puisqu'elle est automatique.

---

## 2. Comment fonctionne Ads Manager, observé

### Structure

Campagne → groupe d'annonces → annonce. Les réglages se répartissent ainsi :

- **Campagne** : budget quotidien, dates de début et de fin, améliorations
  créatives, événements de conversion, publics personnalisés inclus et exclus.
- **Groupe d'annonces** : stratégie d'enchères, indices contextuels,
  paramètres de suivi d'URL.
- **Annonce** : visuel, titre, description, URL de destination.

### Le point structurant : il n'y a pas de mots-clés

Le champ s'appelle **« Indices contextuels »** et le libellé de l'interface
est sans ambiguïté :

> Décrivez les conversations, sujets ou mots-clés auxquels vos produits ou
> services peuvent être liés ; ces indices guident la mise en correspondance,
> **sans constituer des règles de ciblage par correspondance exacte**.

Conséquence majeure, et c'est de loin l'erreur la plus répandue : coller une
liste de mots-clés issue de Google Ads ne marche pas comme on croit. Sur ce
compte, la liste faisait 252 termes, dont **148 variantes de villes**
(« agence SEO Lyon », « agence SEO Nantes »...). En correspondance exacte ce
seraient 148 requêtes distinctes ; en appariement conversationnel c'est une
seule et même intention, déjà couverte par « agence SEO ».

Ce qui crée du volume, ce n'est pas le nombre de termes, c'est le nombre
d'**intentions et de formulations distinctes**. Les 252 termes se
résumaient à trois intentions : trouver un prestataire, faire auditer son
site, connaître les prix.

Ce qui manquait, et qui est propre à ce canal : les formulations telles
qu'on parle à une IA. « quelle agence SEO choisir », « qui est le meilleur
consultant GEO », « peux-tu me recommander une agence », « classement des
agences SEO ». Ce sont des conversations où l'IA répond par une liste de
prestataires, donc où une annonce se place à côté d'une recommandation.
C'est le placement le plus qualifié du canal et il n'existe pas sur Google.

### Rapports

Trois niveaux : campagne, groupe d'annonces, annonce. Sept métriques natives :
impressions, clics, dépenses, CTR, CPC moyen, CPM moyen, conversions.

**Aucune donnée de requête ou de prompt, à aucun niveau.** Le grain le plus
fin est le groupe d'annonces. Pour savoir quelle intention produit des
résultats, il faut donc éclater en plusieurs groupes et comparer, il n'y a
pas d'autre moyen.

Les conversions post-affichage apparaissent en colonne séparée et ne sont
comptées dans le total que si la fenêtre post-affichage est réglée à 1 jour.

### Piège majeur : les données récentes sont fausses

La mention « Données préliminaires pour le [date] » en bas de page n'est pas
décorative. Les deux derniers jours sont systématiquement sous-estimés, puis
complétés. Sur ce compte, le 2 novembre affichait 224 impressions le 3 au
matin, et environ 1 400 après consolidation. Un facteur 6.

**Nous avons conclu deux fois à un arrêt de diffusion qui n'existait pas.**
Pour un produit qui pilote des campagnes, c'est le piège numéro un : toute
règle d'alerte ou d'automatisation lue sur moins de 48 heures produira des
faux positifs.

### Fuseaux horaires

Les rapports sont en heure d'Europe centrale, la facturation en UTC. Les
totaux des deux ne tombent donc jamais sur les mêmes bornes.

### Paramètres d'URL

Macros prises en charge, confirmées par l'interface et par le centre d'aide :
`{campaign_id}`, `{ad_group_id}`, `{ad_id}`, `{ad_account_id}`, `{oppref}`.

**Il n'existe aucune macro de mot-clé ou de requête.** Impossible de savoir
depuis quelle conversation vient un clic.

Hiérarchie de priorité, du plus fort au plus faible : URL de l'annonce,
puis annonce, puis groupe d'annonces, puis campagne. Un paramètre déjà posé
au niveau de l'URL n'est pas écrasé par les niveaux inférieurs.

### Améliorations créatives

Option au niveau de la campagne, **activée par défaut depuis le 29 ou 30
octobre 2026**. L'IA génère des versions personnalisées et traduites des
titres et descriptions, « susceptibles d'être affichées sans examen ni
approbation de votre part ».

Nous l'avons désactivée. Hypothèse non vérifiée, à tester : la désactiver
pourrait réduire le volume de conversations éligibles, puisque le système ne
peut plus adapter le message. C'est un arbitrage réel entre contrôle du
message et volume de diffusion.

### Revue et diffusion

Un changement de visuel peut repasser en revue. Pendant ce temps,
**l'ancien visuel approuvé continue d'être diffusé**. C'est documenté pour
le logo, observé pour le visuel : nous avons mis environ 24 heures à voir le
nouveau visuel servi, alors que l'interface l'affichait déjà.

Les contrôles sont indépendants : vérification du compte, approbation du
compte, revue de l'annonce, diffusion. Une annonce approuvée peut ne pas
diffuser pour une raison de facturation ou de réglage.

### Facturation

Paiement automatique postpayé, avec seuil. Le seuil monte au fil des
paiements réussis : 30 € au premier prélèvement, 65 € ensuite. Prélèvement
dès que le solde atteint le seuil, ou à date fixe mensuelle.

Le solde dû est un bon indicateur de la dépense réelle récente, plus fiable
que les rapports préliminaires : le solde court depuis le dernier
prélèvement et il est exact.

---

## 3. La mesure

### Le pixel

SDK à charger depuis `https://bzrcdn.openai.com/sdk/oaiq.min.js`.

```js
oaiq("init", { pixelId: "<ID>", debug: true });
oaiq("measure", "appointment_scheduled", { type: "customer_action" });
```

Douze événements standard : `app_installed`, `app_opened`,
`appointment_scheduled`, `checkout_started`, `contents_viewed`,
`items_added`, `lead_created`, `order_created`, `page_viewed`,
`registration_completed`, `subscription_created`, `trial_started`. Plus
`custom` avec un `custom_event_name`.

Quatre formes de données : `contents`, `customer_action`, `plan_enrollment`,
`custom`. Chaque événement impose la sienne.

**Le SDK ne déclenche pas `page_viewed` tout seul.** Il faut l'appeler. Nous
avons perdu du temps là-dessus.

Cookies première partie : `__oppref` 30 jours, qui stocke l'identifiant
d'attribution capté dans l'URL d'arrivée, et `__obref` 365 jours, référence
navigateur. Le SDK capte `oppref` depuis l'URL automatiquement.

CSP à prévoir : `bzrcdn.openai.com` en `script-src`, `bzr.openai.com` en
`connect-src` et `img-src`, `bzrcdn.openai.com` aussi en `connect-src`.

### Le consentement, et son coût

En Europe, ce pixel exige le consentement : c'est de la mesure publicitaire
partagée avec un tiers hors UE, donc hors exemption « mesure d'audience » de
la CNIL. Le SDK prévoit `oaiq("consent", false)` avant l'init.

Coût mesuré : sur 3 rendez-vous réels confirmés dans le CRM, **2 sont
remontés dans le pixel**, soit 67 % de couverture. La troisième personne a
selon toute vraisemblance refusé les cookies. L'API Conversions ne
rattraperait pas ce cas : envoyer l'événement côté serveur pour quelqu'un
qui a refusé serait un traitement sans consentement.

**À retenir pour un produit : l'écart entre le CRM et Ads Manager est
structurel en Europe, de l'ordre de 30 %. Un outil de pilotage doit
l'afficher comme une donnée, pas comme une anomalie.**

Autre conséquence : la rubrique Diagnostics signale une « couverture des
e-mails » faible, chez nous 5,5 %. C'est normal quand les conversions se
produisent dans un iframe tiers où l'on ne voit jamais l'adresse. Ce
n'est pas réparable côté site.

### Les événements de conversion

Un événement de conversion se crée avec : source de données (le pixel),
événement de base (un des douze), nom affiché, et deux fenêtres
d'attribution, 30 jours après clic et 1 jour après affichage.

**Trois subtilités qui nous ont coûté cher :**

1. **Attacher un événement à une campagne ne veut pas dire optimiser
   dessus.** L'avertissement « 0 % des campagnes actives sont optimisées pour
   les conversions » ne signifie pas que le champ est vide : il signifie que
   le type d'enchère reste « Clics ». L'événement sert alors uniquement à la
   mesure.
2. **Les événements sont enregistrés avant même d'exister comme
   conversion.** Le pixel envoyait `appointment_scheduled` depuis des jours ;
   en créant la conversion, les deux événements passés sont apparus
   rétroactivement. Donc : instrumenter d'abord, configurer ensuite, rien
   n'est perdu.
3. **Vérifier à quel événement de base une conversion est câblée.** Chez
   nous, la conversion « Demande d'audit » pointait sur `lead_created`,
   un événement que la page d'atterrissage ne pouvait pas produire. La
   campagne mesurait donc une action impossible. Zéro conversion affichée,
   trois rendez-vous réels.

### API Conversions

`POST https://bzr.openai.com/v1/events?pid=<PIXEL-ID>`, en-tête
`Authorization: Bearer <API-KEY>`. Clé à provisionner dans l'onglet
Conversions.

Lots de 1 000 événements maximum, et **si un événement du lot échoue, tout
le lot échoue**.

Déduplication navigateur et serveur par la clé (Pixel ID, nom d'événement,
`id`). Le premier arrivé gagne.

Point important : **l'API ne capte pas `oppref`**, contrairement au pixel.
Il faut le lire côté navigateur, le transmettre à son serveur et le
renvoyer. Sans lui, l'appariement repose sur l'e-mail haché, ce qui est
moins précis.

Fenêtre d'envoi : horodatage dans les 7 derniers jours et pas plus de 10
minutes dans le futur.

Normalisation avant hachage SHA-256 : e-mail en minuscules et sans espaces ;
téléphone sans `+`, sans zéros initiaux, 8 à 15 chiffres ; prénom et nom en
minuscules, sans espaces ni ponctuation ASCII, **accents conservés**.
Maximum trois valeurs par liste.

---

## 4. Ce qui marche sur la page d'atterrissage

Observations issues d'une page construite et itérée en production, avec
mesure à l'appui.

- **Le calendrier intégré est le point de bascule.** Tant que la réservation
  se faisait sur une page HubSpot externe, aucune conversion n'était
  mesurable. En intégrant le calendrier dans la page, la conversion devient
  attribuable. Un lien sortant vers la page de réservation, même vers le même
  calendrier, casse la mesure.
- **Détecter une réservation dans un iframe tiers.** HubSpot parle à la page
  hôte par `postMessage`. Le nom du message n'est documenté nulle part. Un
  détecteur tolérant sur `/meetings?BookSucceeded|bookingSucceeded|meetingBooked/i`
  fonctionne : deux conversions captées. C'est du reverse engineering, donc
  fragile, mais c'est la seule façon de mesurer sans quitter le domaine.
- **Le script de la page ne doit pas bloquer le premier affichage.** Sorti
  en fichier différé, le premier rendu est passé de 160 à 68 ms, et les
  images du bandeau de preuve sociale de 1 386 à 351 ms sur connexion lente.
- **Preuve sociale avant tout sur mobile.** L'ordre qui a été retenu après
  itérations : logos clients, titre, calendrier, détail de l'offre, numéro de
  téléphone. La preuve d'abord, le détail pour ceux qui veulent comprendre
  avant de cliquer.
- **Un numéro de téléphone visible, avec un visage.** Le même que celui du
  calendrier, pour ne pas montrer deux personnes différentes sur la même page.

Ce qui n'a pas marché : une fenêtre de discussion scénarisée, construite
puis retirée faute de conviction. Le visiteur de ce canal veut réserver ou
appeler, pas écrire.

---

## 5. Les dix pièges, par ordre de coût

1. **Lire les chiffres des deux derniers jours.** Faux positifs garantis.
2. **Une conversion câblée sur un événement que la page ne produit pas.**
   Se vérifie en trente secondes, coûte des semaines de données.
3. **Croire qu'attacher un événement de conversion optimise dessus.**
4. **Coller une liste de mots-clés Google.** Le ciblage est conversationnel.
5. **Multiplier les variantes de ville.** Zéro volume supplémentaire.
6. **Augmenter le budget quand la dépense plafonne en dessous.** Sans effet.
7. **Laisser une réservation se faire hors du domaine.** Conversion perdue.
8. **Oublier que `page_viewed` doit être appelé explicitement.**
9. **Ignorer la bascule par défaut des améliorations créatives.** Vos titres
   sont réécrits sans validation si vous ne décochez pas.
10. **Confondre portée et inventaire.** Une fréquence à 1,18 veut dire que le
    système ne repasse pas sur les mêmes personnes : la portée est un stock,
    pas un flux.

---

## 6. Pistes pour le produit

### Ce qu'un agent peut réellement faire, vu les contraintes

Le canal a trois particularités qui définissent le produit :

- **Pas de données de requête.** Donc pas d'optimisation par mot-clé, pas de
  négatifs, pas de search terms report. Tout l'arbitrage se joue sur la
  formulation des indices contextuels et sur la structure en groupes.
- **Des rapports à grain grossier et retardés.** Donc une couche de
  consolidation et de détection d'anomalie fiable a une vraie valeur.
- **Un écart structurel entre le CRM et la plateforme.** Donc la
  réconciliation est un produit en soi.

### Six fonctions qui tiennent debout

**1. Le générateur d'indices contextuels.**
Le cœur du produit. À partir d'une URL et d'une description d'offre, générer
des formulations conversationnelles d'intention d'achat, classées par
intention, et surtout détecter les redondances : dire à l'utilisateur que ses
148 variantes de villes ne décrivent qu'une intention. C'est exactement le
travail qu'on vient de faire à la main, et il est automatisable.

**2. Le consolidateur de données.**
Récupérer les rapports chaque jour, garder l'historique, et ne jamais
présenter un chiffre préliminaire sans le marquer comme tel. Reconstituer
les séries consolidées que la plateforme n'expose pas. C'est modeste mais
c'est ce qui rend toute alerte crédible.

**3. Le réconciliateur CRM.**
Brancher HubSpot, Pipedrive, Salesforce, et rapprocher les conversions
mesurées des affaires réelles. Afficher les deux, et le taux de couverture.
Calculer un vrai coût par rendez-vous et par client signé, pas un coût par
conversion pixel. C'est ce que personne ne fait et c'est ce que le dirigeant
veut voir.

**4. L'assistant de structure.**
Recommander quand éclater en groupes d'annonces, avec le seuil de volume
nécessaire pour que la comparaison ait un sens. Chez nous, éclater à 71
clics aurait produit du bruit ; le dire est aussi utile que de le faire.

**5. Le gardien de la mesure.**
Vérifier en continu que le pixel est posé, que les événements remontent, que
la conversion est câblée sur le bon événement de base, que la page
d'atterrissage ne bloque pas OAI-AdsBot, que la réservation reste sur le
domaine. Un audit technique automatisé, répété chaque jour. La plupart des
pannes qu'on a vécues auraient été détectées par cinq règles.

**6. Le conseiller d'enchère et de budget.**
Le moins différenciant, parce que l'enchère est automatique et que le budget
n'est pas le facteur limitant. À ne pas mettre en avant : ce serait vendre
un levier qui n'en est pas un.

### Ce qui fait la défense

Pas la technologie : l'API est publique et le pixel tient en quinze lignes.
Ce qui se défend, c'est **la bibliothèque d'indices contextuels par métier**,
construite à partir des comptes gérés, et **les repères de performance par
secteur**. Un CPC à 1,58 € et un coût par rendez-vous à 38 € ne veulent rien
dire seuls ; comparés à cinquante comptes du même secteur, ils deviennent un
produit.

### Les risques à regarder en face

- **La plateforme est en bêta.** Les fonctions bougent, les macros peuvent
  apparaître ou disparaître. Un produit entièrement adossé à cette API est
  exposé.
- **OpenAI construira ces fonctions.** Les améliorations créatives
  automatiques sont déjà là. L'assistant d'analyse existe déjà en extension.
  Tout ce qui est purement « pilotage de campagne » sera probablement absorbé.
  Ce qui restera dehors, c'est la réconciliation avec le CRM et la
  connaissance métier.
- **Le volume du canal.** Sur une niche B2B française, 10 765 personnes
  uniques touchées en trois jours, et un plafond de dépense jamais atteint. Si
  le marché adressable par compte est de cet ordre, le panier moyen d'un SaaS
  de pilotage est contraint par le budget publicitaire de ses clients.

---

## 7. Chiffres de référence, à comparer

À manier avec prudence, c'est un seul compte, une seule niche, six jours.

| Repère | Valeur |
|---|---|
| CPM effectif | 9,18 € |
| CPC | 1,15 € à 1,61 €, avec un passage à 0,10 € |
| CTR | 0,50 % à 0,60 % |
| Fréquence | 1,18 |
| Clic vers rendez-vous | 4,2 % |
| Coût par rendez-vous | 38 € |
| Couverture de mesure, Europe avec consentement | 67 % |
| Portée atteignable, niche B2B France | ~11 000 personnes en 3 jours |
