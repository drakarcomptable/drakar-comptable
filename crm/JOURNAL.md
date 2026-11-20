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
