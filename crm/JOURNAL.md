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
