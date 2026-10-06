# Site NAZAR — ce qui reste à faire

Dernière mise à jour : 6 octobre 2026
En ligne : **https://nazar-seo.fr**
Projet Vercel : `nazar-seo-site` (équipe Drakar Comptable)
Code : branche `claude/youthful-dirac-hq8gun`, dossier `nazar-site/`

---

## Fait

- Site déployé sur Vercel, domaine `nazar-seo.fr` en production,
  `www` en redirection 308 vers le domaine nu, certificats HTTPS émis.
- DNS OVH : `@ A 216.198.79.1` et `www CNAME 64a6ca61b0e69c60.vercel-dns-017.com.`
  Ancienne valeur WordPress, à garder sous le coude en cas de retour arrière :
  **46.105.204.29**.
- Les sept appels à l'action pointent vers l'agenda HubSpot de Maël.
- Le formulaire envoie la demande à `mael@nazar-seo.fr`.
- Bandeau de dix avis Google, note 4,9 sur 36.
- Mentions légales et politique de confidentialité en ligne.

---

## 1. À faire maintenant que le site est en ligne

### Activer la boîte du formulaire
Remplis le formulaire une fois toi-même. Maël recevra un mail de
confirmation du service d'envoi, avec un lien à cliquer. **Tant qu'il ne
l'a pas fait, aucune demande n'arrive.** Une fois activé, le service
fournit une clé aléatoire à mettre à la place de son adresse dans le code,
pour qu'elle ne soit plus visible des robots à spam. Transmets-la à Claude.

### Vérifier la bascule
- `https://nazar-seo.fr` affiche le nouveau site, en navigation privée
- `https://www.nazar-seo.fr` redirige bien vers le domaine nu
- `audit.nazar-seo.fr` fonctionne toujours (autre projet Vercel)
- les mails arrivent toujours sur `mael@nazar-seo.fr`
- le bouton d'audit ouvre l'agenda et le workflow HubSpot se déclenche

### Search Console
Ajoute `https://nazar-seo.fr` comme propriété. C'est ce qui débloque la
désindexation des logos clients de Google Images : l'en-tête
`X-Robots-Tag: noindex` est déjà posé sur les fichiers `ref-*`, `cas-0*` et
`cas-logo-*` dans `vercel.json`, mais Google doit repasser dessus.
Soumets aussi `https://nazar-seo.fr/sitemap.xml`.

---

## 2. Redirections des anciennes URL — le point qui coûte cher

L'ancien WordPress avait des pages indexées depuis des années. Elles
renvoient maintenant une erreur 404. Il faut rediriger chacune vers la
nouvelle page, sinon l'autorité accumulée est perdue.

**Ce qu'il faut récupérer** : la liste des anciennes adresses. Trois
sources, de la plus simple à la plus lourde :
1. Search Console, rubrique Indexation puis Pages
2. l'ancien sitemap, souvent `/sitemap_index.xml`
3. l'admin WordPress, Articles et Pages

Envoie la liste à Claude, le fichier de redirections se écrit en dix
minutes.

**Garde le WordPress en vie quelques semaines.** C'est la sauvegarde et la
source des contenus.

---

## 3. Compte Vercel

Le plan est **Hobby**, réservé à un usage non commercial. Un site vitrine
d'agence sur un domaine de marque n'en fait pas partie. Passer en Pro, à
20 $ par mois, avant que Vercel ne le remarque.

---

## 4. Contenu encore en attente

- **Avis Gok** (21 juillet) et **IA Collectif** (28 août) : textes jamais
  récupérés, ils complèteraient le bandeau à douze.
- **Captures Search Console** de Keita et Sylvain en version téléchargée
  depuis Google, les versions actuelles sont recadrées dans une capture
  d'écran.
- **Société d'Imane Aitbaady** : affichée en « Head of Marketing,
  équipements du bâtiment », tiré de son propre avis faute du vrai nom.
- **Poste de Philippe Lacombe** : « Head of Marketing » par défaut, non
  confirmé.
- **Favicon** : le logo nu se fond dans une barre d'onglets sombre. Une
  variante sur tuile claire est prête, décision à prendre.

---

## 5. Opérations

- Créer un numéro en 01 renvoyant vers le 07, pour la crédibilité.
- Connecter `contact@seo-nazar.fr` à HubSpot et à Slack.
- Vérifier le numéro de TVA FR17 931 478 812 dans les mentions légales.
- Compléter l'adresse postale de l'hébergeur dans les mentions légales.
- Faire relire la politique de confidentialité par un juriste.
- Deux lignes sur l'activité de Business IoT et de Whentocop pour les
  cartes de résultats.

---

## 6. Déploiement continu, optionnel

Aujourd'hui le site a été déposé en glisser-déposer : chaque mise à jour
demande un nouveau dépôt manuel. Pour que les modifications de Claude
partent toutes seules, il faut fusionner `claude/youthful-dirac-hq8gun`
dans `main`, puis connecter le dépôt GitHub au projet Vercel avec
**Root Directory = `nazar-site`**. Claude attend ton accord pour la fusion.
