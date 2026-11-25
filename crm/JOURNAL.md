# Journal des chantiers CRM

Dernière mise à jour : 16/11/2026.
Chaque entrée dit ce qui a été fait, ce qui est livré, et ce qui reste ouvert.

---

## Liste de suppression (clients / anciens clients / concurrents)

**But** : empêcher définitivement clients, anciens clients et concurrents de
retomber dans une séquence de prospection, via le mécanisme décrit au §3 de
`CLAUDE.md`.

**Livré — `crm/suppression/`**

| Fichier | Contenu |
|---|---|
| `SUPPRESSION-TOTALE.csv` | **717 contacts** : 156 clients, 30 anciens clients, 531 concurrents |
| `SUPPRESSION-IMPORT-HUBSPOT.csv` | les mêmes, format d'import contact (Record ID) |
| `IMPORT-ENTREPRISES-STATUT-PROSPECTION.csv` | **476 entreprises** à étiqueter : 469 `Concurrent`, 7 `Client` |
| `SUPPRESSION-CONCURRENTS-A-VALIDER.csv` | 196 cas capturés par un terme large, à trancher |

**Comment l'appliquer**
1. Import *Entreprises* : mapper `Record ID` et `Statut prospection`. Ne pas
   mapper les colonnes `..._ne_pas_importer`.
2. Import *Contacts* + cocher « Créer une liste à partir de cet import ».
3. Inscrire la liste dans la séquence d'appels de Maël (aucune étape e-mail).

**Reste ouvert**
- La liste des 469 concurrents n'a pas été relue ligne à ligne. Au moins un faux
  positif repéré : **ACBB Handball** (club sportif). La colonne `mots_cles`
  permet d'arbitrer vite.
- **73 contacts sont déjà marqués en séquence** et seront refusés : à
  désinscrire d'abord.
- Un segment **« NE PAS PROSPECTER »** existe déjà dans le portail (Franck
  Delaunay y a été ajouté le 15/10/2026). Son contenu n'a pas été inspecté —
  à réconcilier pour éviter deux listes de blocage divergentes.

---

## Clients MRR Pilot absents ou mal classés dans HubSpot

MRR Pilot est la source de vérité des clients actifs. 10 des 28 clients actifs
n'étaient pas marqués « Client » dans HubSpot — donc prospectables.

**Identifiés et rattachés**

| MRR Pilot | Réalité CRM | Contact |
|---|---|---|
| Junr Studio | Junr · `junr.studio` | Aline Gorce |
| Delauney Acoustique | **Delaunay** · `delaunay-acoustique.fr` | Franck Delaunay |
| Extense | **Excense** · `excense.fr` | Amandine Dupuydauby, Pascal Fresnay |
| D2 Holding | **Energywise** | Adrien Lafond (2 fiches en double) |
| Melly | **Meylly** · `meylly.com` | Alexandre Anitei |
| Cloud giraffe | **Cloud Ambiance** · `cloudambiance.com` | Anthony Kallassy |
| Cryo Mlv | **Cryotera** · `cryotera.fr` | Marion Arend (encore en *Lead*) |
| Isybot | Isybot · `isybot.com` | Yvan Measson, Philippe Van De Sompele (en *Opportunité*) |
| Euro info | Euro Informatique · `euroinfo.fr` | Pierre-Yves Lambelin (en *Lead*) |

**Reste ouvert** : `Le bon logiciel` et `Skapane` n'ont pas été vérifiés.

---

## Listes d'appel

**Livré — `crm/listes-appel/`**

| Fichier | Lignes | Contenu |
|---|---|---|
| `A1-VERIFIEE-A-APPELER.csv` | **68** | contacts certifiés encore en poste |
| `A1-A-SORTIR.csv` | 40 | partis, retraités, organismes, concurrents |
| `A1-NON-VERIFIABLES.csv` | 50 | profil LinkedIn introuvable |
| `A1-A-ARBITRER.csv` | 10 | cumul de mandats, à trancher |
| `LISTE-A2-DEJA-APPELES-SANS-REPONSE.csv` | 353 | déjà composés, sans réponse |
| `LISTE-B-A-ENRICHIR.csv` | 4 035 | dont 4 023 sans mots-clés |
| `LISTE-C-ECARTES.csv` | 386 | écartés, avec le motif |

**Résultat de la passe « encore en poste » sur A1** : 24 % de fiches mortes.

**Reste ouvert**
- **A2 (353 contacts) n'a pas eu cette passe.** 155 étaient déjà introuvables au
  SIREN ; au taux constaté, ~85 fiches mortes attendues.
- Liste B : 4 023 contacts sans mots-clés, gros chantier d'enrichissement.

---

## Étape Mbrice — pipeline CA Nazar 2026-2027

**Livré — `crm/mbrice/`** : les **31 transactions ont chacune un contact**,
aucun orphelin. 27 ont un mobile valide. 11 fiches ont un défaut bloquant
(2 e-mails `@fake-linkedin.com`, 3 champs téléphone contenant un nom de société,
1 fiche quasi vide, 13 contacts encore attribués à Tyliann).

---

## Tâches « 000 » et désinscriptions

**Livré — `crm/taches-000/`**

Établi que ces tâches n'ont jamais été une campagne d'appels : seulement 30
appels avec disposition sur 314 contacts. Diagnostic de la panne de séquences
(§4 de `CLAUDE.md`) : ~6 000 contacts étaient invisibles aux listes dynamiques.

---

## Annonceurs Google Ads

**Livré — `crm/ads/`**

3 000 annonceurs extraits de BigQuery
(`bigquery-public-data.google_ads_transparency_center.creative_stats`), croisés
avec les 32 598 entreprises du CRM, puis enrichis au SIREN.

**Vérification** : 42 des 44 domaines du CRM confirmés comme annonceurs actifs
via SerpApi. 4 domaines sont annoncés par un tiers (une agence détient déjà le
budget) — information commercialement utile.

**Reste ouvert** : `GCP_SA_KEY_B64` est corrompue (ni base64 ni JSON valide), donc
BigQuery reste manuel. La limite de 3 000 lignes n'a pas été dépassée ; le TAM
estimé est de 3 800 à 4 500 annonceurs sur la liste de mots-clés actuelle.

---

## Reliquats équipe

**Livré — `crm/equipe/`** : 178 tâches d'appel jamais faites par Tyliann
(100 % mobiles, 96 % dirigeants, 10 opportunités) et les 3 listes issues de la
séquence de Maël.

---

## Les listes HubSpot existent déjà — mais c'est la version non vérifiée

**Question posée** : les contacts sont-ils déjà inscrits dans des listes ? Si oui,
la mission « OKAY PROSP » est-elle déjà faite ?

**Réponse : à moitié.** La liste existe et les commerciaux travaillent dessus,
mais c'est la version **d'avant** la passe « encore en poste ».

### Ce qui existe dans le portail

| ID | Liste | Type | Taille |
|---|---|---|---|
| 318 | `LISTE-A1-JAMAIS-APPELES.csv` | DYNAMIQUE | **125** |
| 240 | `OKAY Prosp Nazar From Scratch to 30 juin 2025` | DYNAMIQUE | **4 068** |
| 311–316 | `OKP-P1` à `OKP-P6` | DYNAMIQUES | — |
| 323 | `DON'T TOUCH-LISTE-1-CLIENTS-ET-ANCIENS` | STATIQUE | importée |
| 284 | `NE PAS PROSPECTER` | DYNAMIQUE | — |

`LISTE-2-CONCURRENTS` n'est **pas** encore importée.

Filtre de la 318 : `IN_LIST(import = '180801297')` + pas d'inscription en séquence
en cours. L'import 180801297, c'est **les 168 contacts non vérifiés**, pas les 68
certifiés. D'où le problème.

### Décomposition exacte des 125 membres de la liste 318

| Origine | Dans la 318 | Absents |
|---|---|---|
| `A1-VERIFIEE-A-APPELER.csv` (68) | **53** | 15 |
| `A1-A-SORTIR.csv` (40) | **32** | 8 |
| `A1-NON-VERIFIABLES.csv` (50) | 32 | 18 |
| `A1-A-ARBITRER.csv` (10) | 8 | 2 |

53 + 32 + 32 + 8 = 125. Tout est tracé, rien d'inexpliqué.

Les **15 bons contacts absents** ne sont pas perdus : ils ont tous été inscrits
dans une séquence le **10/11/2026**, donc le filtre dynamique les sort. Ils sont
déjà travaillés.

### Ce qui reste à faire

**32 fiches mortes sont dans la liste que les commerciaux appellent.**
Livré : `crm/listes-appel/A1-FICHES-MORTES-ENCORE-DANS-LES-LISTES.csv`.

- **16 d'entre elles sont aussi dans la liste 240** (4 068 contacts) — donc elles
  circulent dans plus d'une liste de travail.
- **7 ne sont pas inscriptibles en séquence** (e-mail `@fake-linkedin.com`).

**Le levier** : les listes 318 et OKP-P1→P6 excluent les contacts inscrits en
séquence. Inscrire ces fiches dans la séquence de blocage de Maël (§3 de
`CLAUDE.md`) les fait **tomber automatiquement** de ces listes — vérifié par
simulation : la 318 passerait de 125 à 93.

⚠️ **La liste 240 ne se nettoie pas comme ça** : son filtre est
`notes_last_updated < '2025-07-02' AND IN_LIST(import = '176883042')`, il ne
regarde pas les séquences. Les 16 doivent y être retirées à la main
(exclusion de fiches dans les réglages de la liste).

Les 7 fiches à e-mail bidon ne sont joignables par aucun des deux mécanismes :
elles demandent une décision (suppression de la fiche, ou exclusion manuelle).

---

## Liste d'emailing — 1 062 adresses prêtes

**Demande** : 1 000 à 1 200 adresses e-mail pour une campagne, tirées de la data
la plus récente, dans les secteurs cibles, en évitant les concurrents, les
clients et les `@fake-linkedin.com`.

### Correction d'une prémisse

La consigne de départ était « des contacts frais, **sans numéro de téléphone** ».
Mesuré : **sur les 14 961 contacts du CRM qui ont un e-mail et aucun téléphone,
32 seulement ont été créés dans les 12 derniers mois — et 1 seul dans les 60
derniers jours.** Le « sans téléphone » ne sélectionne pas la data fraîche, il
sélectionne la plus vieille. Les scrapes récents sont **tous** livrés avec un
mobile, parce qu'ils ont été faits pour le cold call.

Le bon critère de fraîcheur, c'est la date de création de la fiche et la date du
dernier appel, pas l'absence de téléphone.

### Source retenue

Les 7 listes travaillées depuis septembre (hors OKAY Prosp, qui est de la vieille
data — sauf OKP-P2 qui a été retravaillée) :

`301` LISTE-A-TECH-SAAS-B2B · `302` LISTE-B-FINTECH-FINANCE · `303` LISTE-C-ENERGIE ·
`304` LISTE-D-ALARME-SECURITE · `291` Data Tech B2B + autres · `281` SaaS et Tech ·
`312` OKP-P2-Tech-SaaS

**2 420 contacts**, dont 974 créés en novembre 2026. Aucun n'a jamais reçu
d'e-mail de notre part et aucun n'est désinscrit.

### Filtrage

| Écarté | Nombre |
|---|---|
| e-mail `@fake-linkedin.com` | 173 |
| aucun e-mail | 138 |
| mots-clés = concurrent | 68 |
| fiche de la liste de suppression (client / ancien / concurrent) | 29 |
| fiche morte identifiée sur A1 | 12 |
| société cliente ou concurrente | 5 |
| hors cible (fédération, association, ordre…) | 5 |
| **a déjà décroché** (appel connecté entre le 01/09 et le 18/11/2026) | 112 |

Reste **1 878**, répartis en trois lots par fraîcheur.

### Livré — `crm/emailing/`

| Fichier | Lignes | Contenu |
|---|---|---|
| `EMAIL-LOT1-1062-PRETS.csv` | **1 062** | prêts à shooter |
| `EMAIL-LOT2-816-A-VERIFIER.csv` | 816 | réserve, dernier contact avril–juin 2025 |

Lot 1 = **A** (759 fiches créées en oct/nov 2026) + **B** (303 fiches plus
anciennes mais rappelées entre le 01/09 et le 18/11/2026 sans jamais décrocher).
Dans les deux cas la fiche a été touchée il y a moins de trois mois.

1 049 domaines distincts sur 1 062 adresses, 3 adresses génériques seulement.

Répartition : Industrie/Services 508 · Tech/SaaS/B2B 370 · Formation 99 ·
Énergie/Renouvelable 54 · Sécurité/Alarme 31.

### Reste ouvert

Le **lot 2 (816)** n'a pas eu la passe « encore en poste ». Dernier contact
avril–juin 2025 : au taux constaté sur A1 (24 % de fiches mortes), il faut
compter ~200 fiches à sortir avant de s'en servir.

### Limite de méthode à connaître

Le filtre « a déjà décroché » couvre les appels connectés du **01/09 au
18/11/2026**. Pour le lot 1 c'est complet (les fiches sont plus récentes que ça
ou ont été rappelées dans cette fenêtre). Pour le lot 2, un contact qui aurait
décroché avant septembre 2026 n'est pas détecté.

---

## Taxonomie de mots-clés et références clients

**But** : qu'un commercial en call puisse dire « on travaille déjà là-dessus, par
exemple avec X » dès que le prospect se décrit avec un mot-clé donné.

**Livré — `crm/references/REFERENCES-CLIENTS-PAR-MOT-CLE.xlsx`**

**20 catégories chapeau**, construites sur le comptage réel des mots-clés des
2 420 contacts des listes scrapées (A, B, C, D, Data Tech B2B, SaaS et Tech,
OKP-P2), pas sur une intuition. Pour chacune : les mots-clés qui la déclenchent,
la fréquence à laquelle le sujet tombe en prospection, et **31 clients à citer**
(actifs et anciens), avec leur activité.

Le fichier ne contient **aucun montant** : c'est un outil de call, pas un reporting.

### Les quatre trous

Quatre catégories n'ont aucune référence client identifiée :

| Catégorie | Fréquence en prospection |
|---|---|
| **Formation professionnelle** | **247** |
| **Cybersécurité** | **184** |
| Sûreté & sécurité des sites | 93 |
| (Cloud, couvert seulement via Allance) | 166 |

La formation est le 4ᵉ sujet le plus fréquent dans la data et on n'a rien à
citer dessus. C'est le trou le plus coûteux.

### Pourquoi ce n'est pas plus complet

**54 des 76 lignes de MRR Pilot n'ont aucun mot-clé dans HubSpot.** Rien n'a été
inventé pour combler : un commercial qui cite une référence à côté se fait
reprendre. Pour les compléter il faut ouvrir les sites un par un.

Host ajouté à l'allowlist de l'environnement : `mrr-pilot.onrender.com`.
Un point de sécurité sur cet outil a été signalé directement à Brice.

---

## OKAY PROSP : les 68 répartis par industrie

**Demande** : caler les 68 contacts vérifiés sur le découpage OKP-P2 à P6 déjà en
place dans le portail.

**Livré — `crm/okay-prosp/`**

| Fichier | Contacts |
|---|---|
| `OKP-P2-Tech-SaaS-68.csv` | 21 |
| `OKP-P3-Formation-68.csv` | **1** |
| `OKP-P4-Services-entreprises-68.csv` | 17 |
| `OKP-P5-Industrie-Energie-68.csv` | 11 |
| `OKP-P6-B2C-Commerce-68.csv` | 18 |

Chaque ligne porte le mobile, les mots-clés, le poste vérifié et la provenance
(tâche 000 / ColdCall-Charles / ColdCall-Tyliann / ColdCall-Maël).

**La colonne `secteur` du fichier source était fausse sur 11 fiches** et a été
reprise à la main : Deyrolle et Murati Merchandising étaient classés en
« Formation », Aktea et Medecom en « Tech-SaaS », Beau Comme Un Camion en
« Industrie-Énergie »… Les cas réellement limites (biotech, medtech, financement
auto, promotion immobilière, gestion de flotte) portent « à confirmer » dans la
colonne `Note de classement` : 5 fiches.

**P3-Formation ne contient qu'un seul contact.** Cohérent avec le constat fait sur
les références clients : la formation est le 4ᵉ sujet le plus fréquent de la data
de prospection et c'est le secteur où l'on est le plus démuni.

**Point de vigilance** : Hello Business (`hellobusiness.agency`) a un domaine en
`.agency`. Ses mots-clés parlent de prospection commerciale et de closing, pas de
marketing ni de SEO — ce n'est donc pas un concurrent au sens de la règle, mais la
fiche mérite un coup d'œil avant l'appel.

**Reste ouvert** : les **9 contacts encore attribués à Tyliann** (2 en P2, 1 en P4,
1 en P5, 5 en P6) doivent être réattribués, il a quitté la société.

---

## Règle finance appliquée aux lots d'emailing

Nouvelle règle permanente (§2.7 de `CLAUDE.md`) : en finance, écarter banque
d'affaires, M&A, capital-investissement, capital-risque et family office pur ;
garder la gestion de patrimoine et toute boîte tech / SaaS du secteur.

Appliquée aux deux lots. **9 fiches sorties du lot 1**, toutes des cabinets de
conseil en opérations : Canovia, Sycomore Corporate Finance, Trianon Corporate
Finance, MGT Partners, LT Capital, La Baume Finance, Euro Latina Finance,
Aertus Finance, Arlane.

**Gardés volontairement** parce que ce sont des éditeurs de logiciel qui servent
ce secteur, pas des conseils : Eurostep Digital et PE Cube (plateformes de
gestion de fonds), Edda (gestion de dealflow). Même logique pour Champeil
(gestion de portefeuille) et Sydel, qui relèvent de la gestion de patrimoine.

**6 fiches en arbitrage** (`FINANCE-ECARTES-LOT1.csv` / `-LOT2.csv`, colonne
`Décision`) : Eurallia Finance, Delta Alternative Management, Fin'Up,
Baseqamper, Gololutic, Arcéane. Elles parlent de levée de fonds ou de
transmission sans être clairement des banques d'affaires. Elles sont **hors**
des lots à shooter tant que ce n'est pas tranché.

| Fichier | Avant | Après |
|---|---|---|
| `EMAIL-LOT1-1048-PRETS.csv` | 1 062 | **1 048** |
| `EMAIL-LOT2-815-A-VERIFIER.csv` | 816 | 815 |

---

## Quelle liste produit réellement des transactions

**Mesure sur les 22 transactions créées du 17 au 23 novembre 2026.**

| Liste | Taille | Transactions | Taux |
|---|---|---|---|
| **`LISTE-A-TECH-SAAS-B2B` (301)** | 533 | **12** | **2,25 %** |
| Les 5 autres listes récentes, hors doublons avec la 301 | 1 096 | 3 | 0,27 % |
| `OKP-P2-Tech-SaaS` (312) | 768 | 0 | 0 % |
| `OKAY Prosp Nazar` (240) | 4 068 | 0 | 0 % |

**La 301 porte 55 % des transactions de la semaine et convertit 8 fois mieux
que les autres listes récentes.** Les deux gros stocks n'ont rien produit :
OKAY Prosp et ses 4 068 contacts ont fait zéro.

Les 7 transactions restantes viennent d'ailleurs : Bsecure et Beapi par mail,
Damien Féraud via ChatGPT Ads, plus Hyperion, Contours, Micelia et Blitz.

**Réserves** : « transaction créée » = rendez-vous pris, pas affaire signée —
sur les 12 il y a déjà 3 no-shows. Et une semaine de 22 transactions reste un
petit échantillon : le chiffre peut bouger nettement la semaine suivante.

**Conséquence pratique** : pour refaire du volume, relancer un scrape du même
type que la 301 (novembre 2026, mots-clés propres sur chaque fiche) plutôt que
de puiser dans les anciens stocks.

---

## Transactions No Show 2024-2025 à rappeler

**Demande** : les transactions encore en phase No Show sur les pipelines
antérieurs, avec le contact rattaché et son numéro, filtrées par tous les
critères en vigueur, et en sachant qui est encore en poste.

**Périmètre** : phases `No Show` (`1556262136`, `3127957711`) et `R2 No Show`
(`1750771918`, `3127957713`) sur les pipelines CA Nazar 2023-2024, 2024-2025 et
2025-2026. **226 transactions**, 155 sur le pipeline 2025-2026 et 71 sur
2024-2025. Aucune sur 2023-2024.

### Filtrage

| Écarté | |
|---|---|
| e-mail `@fake-linkedin.com` | 17 |
| concurrent (règle mots-clés) | 9 |
| pas de numéro de téléphone | 7 |
| client, ancien client ou concurrent déjà listé | 3 |
| hors cible (organisme, ESN) | 1 |
| transaction sans contact rattaché | 14 |

Après dédoublonnage par contact (la transaction la plus récente est conservée) :
**176 contacts rappelables**.

### Classement

Le rang A reprend le profil qui a réellement converti la semaine du 17 au 23
novembre sur la liste 301 : infogérance, maintenance informatique,
cybersécurité, télécom, cloud, développement logiciel sur mesure, transformation
digitale, formation professionnelle, paie et facturation.

| Rang | Contacts |
|---|---|
| **A — profil qui convertit + dirigeant** | 12 |
| **A — profil qui convertit** | 3 |
| B — dirigeant, autre secteur | 89 |
| B — autre | 8 |
| C — mots-clés manquants dans le CRM | 64 |

Répartition OKP : P4 Services-entreprises 106 · P2 Tech-SaaS 46 ·
P5 Industrie-Énergie 12 · P3 Formation 8 · P6 B2C-Commerce 4.

### Vérification « encore en poste »

Passe FullEnrich sur le rang A : **15 sur 15 encore en poste**, aucune fiche
morte. Cohérent avec l'âge des transactions (2025-2026), bien plus récentes que
la liste A1 où le taux de mortalité était de 24 %.

Deux corrections de données au passage : le domaine réel d'Optimistik est
`optimistik.com` et non `.fr`, celui de Smart Booster est `smartbooster.io`.

**Reste ouvert** : les rangs B (97) et C (64) n'ont pas eu la passe « encore en
poste ». Et les 64 du rang C n'ont aucun mot-clé dans HubSpot, donc aucun angle
d'accroche : il faut les enrichir avant de les appeler.

**Livré** (hors dépôt, fichiers nominatifs) : `NO-SHOW-A-RAPPELER-176.csv` et
`NO-SHOW-RANG-A-15-VERIFIES.csv`.

---

## No Show : contrôle « indépendants » et taille d'entreprise

Remontée terrain : sur la liste OKP Formation, les commerciaux sont tombés sur
beaucoup de coachs en bien-être et de praticiens isolés — hors cible, temps
perdu. Règle ajoutée en §2.8 et §2.9 de `CLAUDE.md`, puis appliquée aux no-shows.

| | |
|---|---|
| Appelables (numéro valide) | 166 |
| **Dans la cible** | **150** |
| Écartés : indépendant ou structure solo | 3 |
| Écartés : plus de 60 salariés | 13 |
| Numéro à retrouver | 10 |

Les 13 au-delà de 60 salariés seraient passées sans ce contrôle : Wakam (1 000),
Soraia (625), Thecodingmachine (250), Kali Group (250), Blunomy (250),
Isp System (250), Cuisines Elite (250), Vega IM (200), Systemis (200),
ABCD International (130), Martineau (64), et deux fiches sans nom.

**Méthode qui ne marche pas** : chercher les termes « bien-être », « indépendant »
ou « freelance » dans la `description` de l'entreprise. Essayé, quatre faux
positifs sur quatre (Ecomac Construction, ABCD International, ForTeam IT,
Gym Compagnie). Seuls l'intitulé de poste, les mots-clés du contact et
l'effectif sont exploitables.

**Erreur de rattachement repérée** : le contact de Corepulse (Hakim Merchichi,
rang A) est relié dans HubSpot à une fiche entreprise « New Brands », domaine
`prnewswire.com`, 5 000 salariés. L'effectif affiché sur cette fiche est faux.

**Reste ouvert** : l'effectif est inconnu pour 17 fiches, et la vérification
« encore en poste » n'a été faite que sur le rang A. Les rangs B et C
(130 contacts) restent à vérifier.

---

## Modèle de priorisation à trois degrés

**Demande** : combien de degrés de priorité peut-on faire, et sur quelle base ?
Réponse mesurée plutôt que supposée — détail complet au §2bis de `CLAUDE.md`.

Population : les 2 420 contacts des sept listes travaillées. Résultat observé :
une transaction créée entre le 1er septembre et le 25 novembre 2026. 33 au total.

| Degré | Vivier | Transactions | Taux |
|---|---|---|---|
| **P1** — fiche d'octobre 2026 ou après, famille porteuse | 386 | **20** | **5,2 %** |
| **P2** — fiche récente, autre secteur | 590 | 7 | 1,2 % |
| **P3** — fiche antérieure à octobre | 1 444 | 6 | 0,4 % |

**Trois degrés, pas plus** : au-delà, les effectifs deviennent trop petits pour
que les écarts veuillent dire quelque chose.

Deux enseignements qui vont contre ce qu'on pensait :

1. **La fraîcheur de la fiche pèse ×6,6**, bien plus que n'importe quel critère
   de secteur. C'est le premier axe de tri.
2. **La formation convertit le mieux : 3,2 %**, devant le patrimoine (1,8 %) et
   l'IT (1,5 %). On avait annoncé l'inverse en se fiant au volume.

**Règle corrigée** : au-delà de 60 salariés n'est plus bloquant, c'est un signal
de priorité basse. Brice a tranché.

**Réserve de méthode** : la fraîcheur est confondue avec l'effort commercial —
les listes récentes ont été travaillées en priorité. Il faudra refaire la mesure
dans un mois, quand les mêmes listes auront vieilli, pour séparer les deux.

---

## Correction de comptage + découpage P1/P2/P3 des no-shows

### Le bug

`CONTAINS 'formation'` dans HubSpot est une recherche de sous-chaîne : il
capture **trans**formation et in**formation**s. Le vivier « formation » était
donc compté à 348 au lieu de 224. Corrigé au §2bis de `CLAUDE.md` : la famille
formation passe de 3,2 % à **4,0 %**, soit trois fois la moyenne du vivier.
Le bug jouait donc *contre* la conclusion, qui en sort renforcée.

Même piège sur « placement » : Bluecoders (recrutement de développeurs) était
classé en patrimoine à cause de « Placement profils data ».

### Les 150 no-shows découpés

| Degré | Contacts | dont R2 No Show |
|---|---|---|
| **P1** — les trois signaux | **8** | 2 |
| **P2** — deux signaux sur trois | **47** | 9 |
| **P3** — un seul ou aucun | **95** | 25 |

Les trois signaux : famille porteuse (formation, patrimoine/compta, IT) ·
dirigeant · rendez-vous manqué en 2026.

**P1** : Geocom Networks, SIG-Image, 6netic, Addixi, Kytl Security,
Smart Booster, Pédagogie Plus École, Urban Gaming.

**Le vrai frein, c'est les mots-clés** : 121 des 150 n'ont aucune famille
identifiable, dont 64 sans le moindre mot-clé dans HubSpot. Impossible de les
prioriser autrement que par défaut. Les enrichir ferait remonter une partie du
P3 vers le P2.

⚠️ Ce découpage n'a **pas** la même valeur prédictive que celui du §2bis : le
critère de fraîcheur de fiche, qui est le plus fort (×6,6), ne s'applique pas
ici puisque tous les no-shows sont des fiches anciennes par construction. Il a
été remplacé par la date du rendez-vous manqué, qui n'a pas été validée comme
prédicteur.

---

## No Show : reclassement par secteur (et non par date)

Brice a tranché : **la date du rendez-vous manqué ne compte pas**, seul le type
d'entreprise compte. P1 = tech, SaaS, logiciel, data, service tech B2B et
formation. P3 = finance, énergies renouvelables, construction, B2C. Et un P3
doit rester prospectable, pas hors cible.

| Degré | Contacts | dont R2 No Show |
|---|---|---|
| **P1** — tech / SaaS / data / formation | **71** | 16 |
| **P2** — B2B à trancher | **29** | 7 |
| **P3** — finance, énergie, construction, B2C | **50** | 13 |

### Sur quoi repose le classement

Trois sources, dans cet ordre : mots-clés du contact, puis `industry` de
l'entreprise dans HubSpot, puis sa `description`.

| Source | P1 | P3 |
|---|---|---|
| mots-clés du contact | 41 | 16 |
| secteur HubSpot | 20 | 29 |
| description de la société | 6 | 1 |
| relecture manuelle | 4 | — |
| aucune information | — | 4 |

**Seules 4 fiches sur 150 n'ont aucune des trois sources** : Q7leader,
Kaba Impact et deux fiches sans nom de société. Elles sont en P3 par défaut,
signalées comme telles dans la colonne `Base du classement` — ce n'est pas un
jugement sur elles.

Le chiffre de « 121 non classables » annoncé la veille était faux : il ne
regardait que les mots-clés du contact et ignorait les deux autres sources.

### Composition du P3

Construction 10 · Vêtements et mode 5 · Génie mécanique 5 · Immobilier 3 ·
Services financiers 3 · Assurance 2 · Tourisme 2 · Génie civil 2 ·
secteur non renseigné 8 · divers 8.

Aucun concurrent, aucun organisme, aucun indépendant : ils ont été écartés en
amont. **Le P3 reste intégralement prospectable**, il est juste plus loin du
profil qui convertit.

### Défaut de données repéré

Quelques fiches ont un champ mots-clés contenant une phrase d'IA au lieu de
mots-clés (« Je ne dispose pas d'informations suffisantes sur… » — Robinswood).
Colonne `Mots-clés cassés` dans les fichiers livrés.
