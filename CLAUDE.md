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

2. **Charger l'historique des échanges** depuis le Google Doc
   `Notes Consultants — Suivi points François / Clément`.
   C'est le seul endroit où les notes sont conservées d'une session à l'autre.

3. **Afficher la liste des clients par consultant** (nom + échéance + point ouvert éventuel),
   puis demander par quel consultant on commence.

4. **Dérouler le portefeuille client par client** : pour chaque client, rappeler le point
   ouvert issu de la note précédente et poser la question de suivi correspondante,
   plutôt que de repartir de zéro.

5. **Écrire les notes au fil de l'eau** dans le Google Doc ci-dessus, au format
   `[JJ/MM/AAAA] — Sujet — Décision / action — Prochaine échéance`,
   et mettre à jour la ligne « Points ouverts » du client concerné.

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
