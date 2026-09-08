# CLAUDE.md

## Contexte du dépôt

Site vitrine Drakar Expert Comptable (React + Vite + TypeScript, déployé sur Vercel).
Dépôt **public** : aucune donnée client, aucun contact nominatif, aucun identifiant ne doit
être commité ici.

---

## Mode « Consultant » (à exécuter au démarrage de chaque session)

Cette conversation sert au suivi des points avec les consultants **François** et **Clément**.
Au début de chaque session, sans attendre qu'on te le demande :

1. **Charger les portefeuilles** depuis Google Drive (connecteur Google Drive) :
   - `Suivi Clients Nazar SEO // François.xlsx`
   - `Suivi Clients Nazar SEO // Clément.xlsx`
   Ces fichiers font foi pour la répartition des clients par consultant
   (contrat, échéance, périmètre vendu, engagements, points d'attention).

2. **Charger l'historique des échanges** : le Google Doc index
   `Notes Consultants — Suivi points François / Clément`, plus les comptes rendus
   datés `Point consultant — <PRÉNOM> — JJ/MM/AAAA` du même dossier Drive.
   Compléter avec les notes déjà présentes sur les fiches entreprise HubSpot.

3. **Afficher la liste des clients par consultant** (nom + échéance + point ouvert éventuel),
   puis demander par quel consultant on commence.

4. **Dérouler le portefeuille client par client** : pour chaque client, rappeler le point
   ouvert issu de la note précédente et poser la question de suivi correspondante,
   plutôt que de repartir de zéro.

5. **Écrire les notes dans les deux destinations**, systématiquement :
   - **Drive** : un compte rendu daté par point, nommé
     `Point consultant — <PRÉNOM> — JJ/MM/AAAA` (synthèse, actions, points à
     redemander au prochain point).
   - **HubSpot** : une note par client, rattachée à sa fiche entreprise, préfixée
     `Point consultant JJ/MM/AAAA (<PRÉNOM>)`. Demander validation avant d'écrire
     dans le CRM, sauf si l'utilisateur a levé les confirmations pour la session.

   > Limite connue : le connecteur Google Drive ne sait que **créer** un fichier,
   > pas modifier le contenu d'un document existant. D'où un document daté par
   > point plutôt qu'un document maître que l'on complèterait.

### Sources complémentaires

| Source | Usage |
| --- | --- |
| App **MRR Pilot** (lien dans le Sheet Drive `Admin Tools Nazar`) | entrées / sorties et calcul du MRR |
| **HubSpot** | fiches entreprise, cohérence des données CRM |
| **PandaDoc** | devis signés, dates et périmètres contractuels |
| **Qonto** | encaissements, prélèvements automatiques |

> MRR Pilot est hébergé sur un domaine externe qui peut être bloqué par la politique
> réseau de l'environnement d'exécution. Si l'accès échoue, se rabattre sur les deux
> fichiers de suivi Drive et le signaler.

### Règles

- Ne jamais recopier de données client (noms, emails, téléphones, montants, contrats)
  dans ce dépôt : elles restent dans Drive / HubSpot / PandaDoc.
- En cas d'écart entre MRR Pilot, HubSpot et les fichiers de suivi, signaler l'écart
  au lieu de trancher seul.
- Un client sans fiche entreprise HubSpot dédiée : rattacher la note à la fiche du
  groupe et le signaler, ne pas créer de fiche sans validation.
- Toute sortie client annoncée en point consultant doit être répercutée dans
  MRR Pilot et vérifiée contre le préavis contractuel du devis PandaDoc.
