# Mémoire de travail — Nazar SEO

Ce fichier est lu automatiquement par Claude Code au démarrage de chaque session
ouverte sur ce dépôt. Il contient ce qu'il faut savoir pour reprendre le travail
sans avoir à tout réexpliquer. **À tenir à jour** : si une règle change ou si un
chantier avance, modifier ce fichier et committer.

---

## 1. Contexte

- **Nazar SEO** — agence SEO / GEO française. Site et outils dans ce dépôt.
- **Brice Volet** — dirigeant, l'interlocuteur principal.
- **Maël Gallais** — associé. N'utilise jamais HubSpot et ne voit pas ses tâches
  (c'est volontaire et c'est utilisé comme mécanisme, voir §3).
- **Commerciaux** : Adam Hawa-Nide, Charles Letellier.
- **Tyliann Tyrakowski a quitté la société.** Il reste propriétaire de nombreux
  contacts et transactions — à réattribuer avant toute séquence.
- **Drakar Expert Comptable** est une autre entité du même dirigeant (d'où
  l'adresse `contact@drakarexpertcomptable.fr`). Les cabinets d'expertise
  comptable croisés en prospection sont donc des concurrents potentiels sur
  cette activité-là : à signaler, pas à trancher seul.
- **MRR Pilot** — outil externe de suivi du chiffre récurrent. C'est la source
  de vérité des clients actifs, **pas** HubSpot (voir §6).

---

## 2. Règles permanentes données par Brice

1. **Concurrent** = toute société dont le nom *ou* les mots-clés contiennent
   `agence`, `marketing`, `communication`, `publicité`, `SEO`, `référencement`,
   `growth`, `webdesign`, `community management`, `content marketing`.
   À écarter systématiquement de la prospection.
   **Faux positifs déjà tranchés — ce ne sont PAS des concurrents :**
   agences immobilières · `agencement` (menuiserie) · agences d'emploi et
   d'intérim · agences de voyage · `géoréférencement` (topographie) ·
   `référencement fournisseurs` (centrale d'achat).
2. **Hors cible** : organismes, fédérations, syndicats, CCI, associations,
   clubs, ordres professionnels. Et les **ESN**.
3. **Jamais de clé API dans le chat.** Elles passent par les variables
   d'environnement ou les secrets réseau de l'environnement.
4. **Ne jamais utiliser l'import « Liste de désinscription » de HubSpot** :
   l'opération est irréversible, même pour le propriétaire du compte.
5. **FullEnrich** : n'enrichir que `contact.phones`.
6. Cible de prospection : dirigeants / C-level, sociétés d'environ 3 à 60
   salariés.
7. **Finance — à écarter** : banque d'affaires, conseil en fusion-acquisition
   (M&A), capital-investissement / private equity / LBO, capital-risque,
   family office « pur ». Ces métiers ne recrutent pas par le référencement.
   **À garder** : la gestion de patrimoine (CGP, gestion privée, courtage,
   placements, défiscalisation, expertise comptable) **et toute boîte tech du
   secteur** — éditeur de logiciel, plateforme ou SaaS financier, service
   financier digitalisé. Celles-là ont un vrai besoin de leads SEO / GEO.
   Le marqueur qui tranche : *éditeur d'un outil pour le secteur* → garder ;
   *cabinet qui conseille sur des opérations* → écarter.
   Exemples arbitrés : Eurostep Digital, PE Cube et Edda (logiciels pour fonds)
   sont **gardés** ; Canovia, Sycomore Corporate Finance, LT Capital et MGT
   Partners sont **écartés**.

---

## 3. Le mécanisme de blocage de la prospection

Brice bloque clients, anciens clients et concurrents en les **inscrivant dans
une séquence d'appels attribuée à Maël**, qui ne consulte jamais HubSpot. Comme
**un contact ne peut être inscrit que dans une seule séquence à la fois**, ils
deviennent définitivement non-inscriptibles ailleurs.

C'est volontaire et c'est le bon choix : un filtre ou une liste d'exclusion peut
être oublié au moment de construire une liste, et le commercial ne voit la
bannière « Client » qu'une fois au téléphone — trop tard. **Ne pas lui proposer
de remplacer ça par une liste d'exclusion.**

Corollaire : la séquence ne doit contenir **aucune étape d'envoi d'e-mail**.

---

## 4. HubSpot — repères vérifiés

### Étiquetage client / concurrent
Propriété **sur l'ENTREPRISE**, pas sur le contact :

| Propriété | `statut_prospection` — « Statut prospection » |
|---|---|
| Valeurs | `Prospect OK` · `Client` · `Concurrent` · `Ne jamais recontacter` |

⚠️ **La casse doit être exacte.** Une valeur mal orthographiée est acceptée par
l'import sans erreur mais n'écrit rien : le champ reste vide.

`Nazar-Seo` et `Nazar SEO` (les fiches de la boîte elle-même) sont en
`Ne jamais recontacter` — ne jamais les écraser.

### Pipelines
| Pipeline | ID |
|---|---|
| CA Nazar 2023-2024 | `default` |
| CA Nazar 2024-2025 | `559234754` |
| CA Nazar 2025-2026 | `2288607439` |
| CA Nazar 2026-2027 | `4163714248` |
| Rétention Client | `598723544` |

### Étapes qui comptent
| Étape | ID | Sens |
|---|---|---|
| Deal WON | `qualifiedtobuy`, `839540217`, `889956842`, `3128920294`, `6093231346` | client gagné |
| **Client stopper** | `3128920295` | **ancien client** |
| Oui sans contrat / Oui en pause | `839540216` / `878600677` | **pas** des clients |
| **Concu relance / Concu 2026** | `839540410` / `3128920296` | **prospect parti chez un concurrent — PAS un concurrent.** Ne pas bloquer : ce sont des cibles de relance. |
| Mbrice | `6295228627` | étape de travail de Brice |

### Propriétaires
Brice Volet `1139387944` · Maël Gallais `897604073` ·
Charles Letellier `811240668` · Tyliann Tyrakowski `1793453769`

### Propriétés contact utiles
- `hs_content_membership_notes` = « Notes sur l'inscription » = **les mots-clés**
  du prospect. C'est le meilleur signal pour classer une société.
- `hs_sequences_is_enrolled` — calculée, **non modifiable par API**.
- `hs_latest_sequence_enrolled` (+ `_formatted` pour le nom, uniquement en
  réponse « record »).
- `notes_last_contacted`, `num_contacted_notes` (compte les e-mails de séquence,
  pas les appels).
- Dispositions d'appel : Mauvais numéro `17b47fee-58de-441e-a44c-c6300d46f273` ·
  Plus dans l'entreprise `593a7f34-282a-40d1-987f-3b86f92e70d7` ·
  Société fermée `6ba92ea8-845c-49ca-b8ce-aeb4fea6fc75`

### Pièges mesurés sur le connecteur MCP
- `LIKE` fonctionne, `CONTAINS` **non**. Les `OR` multiples passent.
- `LIMIT` max **500**. `GROUP BY` max **2 dimensions**.
- `OFFSET` fonctionne sur une requête mono-objet, **silencieusement ignoré** sur
  une requête croisée (ex. CONTACT × TASK) : deux pages renvoient la même chose.
- `COUNT()` est restitué en **« (Somme) »** dans la sortie TSV : la valeur est la
  somme des `hs_object_id`, pas un décompte. Ne jamais la lire comme un total.
  Pour un vrai total, lire la ligne « Showing N of N total results ».
- Le connecteur **n'a pas le droit de créer ou modifier les listes**
  (`manage_segment` → *requires additional permissions*). Tout passe par un
  import CSV fait à la main.
- Les requêtes larges dépassent la limite de tokens et sont sauvegardées dans un
  fichier : les parser en Python plutôt que de les lire.

### Une séquence « Interrompue » ne libère pas le contact
HubSpot marque l'inscription interrompue **sans écrire**
`hs_latest_sequence_enrolled_date` de fin. Résultat :
`hs_sequences_is_enrolled` reste `true` indéfiniment et le contact est invisible
pour les listes dynamiques. Vérifié : sur 314 contacts, les 53 ayant une date de
fin étaient bien `false`, et 260 des 261 `true` n'en avaient aucune.

### Rejets d'inscription en séquence
Un contact refusé avec le motif *« les précédents e-mails envoyés à ce contact à
partir d'autres comptes HubSpot ont été rejetés »* est sur la **liste noire
globale HubSpot**, pas sur une liste du portail — aucune propriété locale ne
l'indique. **C'est un marqueur fiable de fiche morte** : sur 6 cas testés, 4 ont
été confirmés partis ou retraités.

---

## 5. Défauts connus de la donnée

- **~70 contacts ont un e-mail `@fake-linkedin.com`** — adresses fabriquées lors
  d'un import LinkedIn.
- **Le champ `phone` contient parfois le nom de la société** (Opscidia, Wisetax,
  Cognitive Design Systems…).
- **`statut_du_lead` est pollué par des numéros de téléphone** — inutilisable.
- **Mojibake** (`Ã©` au lieu de `é`) : réparer avec
  `s.encode('latin-1').decode('utf-8')`.
- Fiches avec nom tronqué (`Arnaud T.`), prénom dupliqué
  (`Isabelle Isabelle Villey`), ou société dans le champ prénom (`Tsb Énergie`).
- Doublons d'entreprises (`410-Gone` / `410-Gone.fr`) et de contacts
  (Adrien Lafond : `@foobot.io` et `@energywise.fr`).

---

## 6. Vérifier qu'un contact est encore en poste

Le registre SIREN (`recherche-entreprises.api.gouv.fr`, libre et sans clé) dit
seulement si **la société** est radiée, et **ne couvre pas l'étranger**. Il ne
dit rien sur le fait que l'interlocuteur y soit encore.

Pour ça, utiliser **`mcp__FullEnrich__search_people`** : la *recherche* ne
consomme aucun crédit et renvoie le poste actuel. Sur les 168 contacts de la
liste A1, cette passe a sorti **40 fiches mortes (24 %)**.

⚠️ Le solde de crédits FullEnrich est à **0** — l'enrichissement payant est
indisponible, seule la recherche fonctionne.

---

## 7. Où sont les données

| Dossier | Contenu |
|---|---|
| `crm/suppression/` | Clients, anciens clients, concurrents à bloquer + les 2 fichiers d'import |
| `crm/listes-appel/` | Listes A1 / A2 / B / C et la passe de vérification « encore en poste » |
| `crm/mbrice/` | Les 31 contacts de l'étape Mbrice |
| `crm/taches-000/` | Chantier des tâches « 000 » et les désinscriptions |
| `crm/ads/` | Annonceurs Google Ads (BigQuery) croisés avec le CRM |
| `crm/equipe/` | Reliquats Tyliann et Maël |

`crm/JOURNAL.md` retrace chaque chantier, ce qui est livré et ce qui reste.

---

## 8. Clients NON protégés par la séquence — ne jamais prospecter

Le blocage décrit au §3 repose sur l'inscription en séquence. **Onze contacts,
chez neuf entreprises, n'ont pas pu y être inscrits** : soit leur adresse est
sur la liste noire globale de HubSpot, soit ils étaient déjà dans une autre
séquence. Ils sont donc **invisibles au mécanisme de blocage**.

**Ces entreprises sont des clients ou d'anciens clients. Elles ne doivent
jamais ressortir en prospection, quelle que soit la liste construite.**

| Entreprise | Contact | Statut |
|---|---|---|
| Frames Dealer | Nicolas Meliand | client |
| Energy Way | Florent Brecy | client |
| Eventtia | Mauricio Palacio | client |
| **Ideta** | Yanis Kerdjana | **ancien client** |
| Kairntech | Bruno Freudensprung | client |
| Publidata | Julian Nacci | client |
| Skyted | Stéphane Hersen (2 fiches, dont une sans e-mail) | client |
| Spinalcom | Jérémie Bellec | client |
| **Ubigreen** | Caroline Vong Legrand (**ancienne cliente**) et Julien Meriaudeau (client) | les deux |

Détail et motif de rejet pour chacun : `crm/suppression/CLIENTS-NON-PROTEGES.csv`.

Avant d'envoyer une liste d'appel, **croiser avec ce tableau**. C'est le seul
garde-fou pour ces neuf-là.
