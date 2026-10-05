# Site NAZAR — ce qui reste à faire côté Brice

Dernière mise à jour : 5 octobre 2026 (seconde passe)
Code : branche `claude/youthful-dirac-hq8gun`, dossier `nazar-site/`
Aperçu : https://claude.ai/artifact/HFyoqgEKaM4RhSLbNaRFb1

---

## 1. Mise en ligne (bloquant pour presque tout le reste)

Le connecteur Vercel de la session Claude peut déployer sur un projet
existant mais **ne peut pas en créer un** (erreur 403 « You don't have
permission to create the project »).

Deux sorties, au choix :

- **Tu importes le projet toi-même.** Vercel → *Add New* → *Project* →
  importer `drakarcomptable/drakar-comptable` → **Root Directory =
  `nazar-site`**, **Framework Preset = Other** → déployer depuis la branche
  `claude/youthful-dirac-hq8gun`.
- **Tu crées un projet Vercel vide nommé `nazar-geo`** et Claude finit le
  déploiement.

---

## 2. Logos clients hors de Google Images

**Déjà fait dans le code**, rien à toucher :

- les 14 fichiers sont renommés `ref-01` à `ref-14`, aucun nom de marque
  dans les URL ;
- `vercel.json` sert `X-Robots-Tag: noindex, noimageindex, noarchive` sur
  toutes les URL `/ref-*` ;
- `robots.txt` laisse volontairement ces fichiers crawlables. **Ne pas y
  ajouter de `Disallow`** : Google doit pouvoir télécharger l'image pour
  lire l'en-tête `noindex`. Un blocage robots.txt empêche la désindexation
  au lieu de la provoquer. C'est l'erreur classique sur ce sujet.

**À faire par toi, dans cet ordre :**

- [ ] **Attendre la mise en ligne.** L'en-tête ne vit que sur un vrai
      serveur ; sur l'aperçu Claude il n'existe pas.
- [ ] **Vérifier l'en-tête** une fois en ligne :
      `curl -I https://<domaine>/ref-01.webp | grep -i x-robots-tag`
      doit renvoyer `noindex, noimageindex, noarchive`.
- [ ] **Search Console** : ajouter et valider la propriété du domaine.
- [ ] **Vérifier s'il y a quelque chose à supprimer.** Tant que le site
      n'a jamais été en ligne, aucune de ces images n'est indexée : le
      `noindex` suffit et il n'y a rien à faire de plus. L'étape ci-dessous
      ne sert que si des logos sont déjà indexés (ancien site, autre
      domaine).
- [ ] **Si des images sont déjà indexées** : Search Console →
      **Suppressions** → *Nouvelle demande* → *Supprimer temporairement
      l'URL*, avec l'option *Supprimer toutes les URL avec ce préfixe*.
      Effet sous quelques heures, pour environ six mois — le temps que le
      `noindex` rende la suppression définitive.

**Ce qui ne marche pas, pour mémoire :** l'outil de désaveu ne concerne que
les liens entrants, jamais les images. Et renommer un fichier ne désindexe
rien : ça change seulement les requêtes sur lesquelles il peut remonter.

---

## 3. Contenu à remplacer avant de montrer le site à un prospect

- [ ] **Témoignage** : encore « Prénom Nom / CEO de Société » avec une bulle
      d'initiales. Il faut un vrai nom, une vraie société, une photo.
- [ ] **Coordonnées fictives** : `bonjour@nazar-geo.fr` et `01 23 45 67 89`.
- [ ] **Chiffres des cas clients** : présentés comme illustratifs.
- [ ] **Maquette de la plateforme** : les trois requêtes de démo, le score
      GEO de 84 et les noms des quatre modules sont inventés. À confirmer
      ou à remplacer par de vrais exemples.

---

## 4. Logos

- [ ] **« Logo blanc 250x139 » du Drive** : fichier blanc sur fond
      transparent, donc invisible sur le bandeau blanc. Il faut la version
      couleur — et savoir de quelle marque il s'agit.
- [x] Orange, Sanofi, Welcome to the Jungle : clients sous l'ancien nom,
      accord obtenu. Validé le 5 octobre 2026.

---

## 5. Base HubSpot

- [ ] **50 fiches sur 98 sont en statut « client » avec 0 € de deal gagné.**
      À nettoyer : le statut ne veut plus rien dire en l'état.
- [ ] **La fiche `idun-group.com` n'a pas de nom renseigné**, alors que
      c'est le plus gros effectif du portefeuille (494 salariés).

---

## 6. Brancher le formulaire, l'email et le téléphone

- [ ] **Créer le formulaire côté HubSpot** et me donner son identifiant.
      La page postera dessus directement, sans serveur à maintenir. Je ne
      peux pas le créer moi-même : le connecteur HubSpot de la session a la
      lecture mais pas l'écriture sur les formulaires.
- [ ] **Brancher les notifications Slack** depuis HubSpot, qui a une
      intégration native. Rien à coder.
- [ ] **Connecter l'email entrant** `contact@seo-nazar.fr` à HubSpot et à
      Slack, pour voir arriver les demandes.
- [ ] **Créer un numéro en 01 renvoyé vers le 07** affiché sur le site,
      pour recevoir les appels sur une ligne fixe.

---

## 7. À vérifier dans les pages légales

- [ ] **Numéro de TVA** : j'ai écrit `FR17 931 478 812`, calculé à partir du
      SIREN par l'algorithme officiel. Vérifie-le sur un document comptable.
- [ ] **Adresse postale et téléphone de l'hébergeur** : les mentions légales
      citent Vercel Inc. sans adresse complète, puisque l'hébergement n'est
      pas encore en place. À compléter à la mise en ligne.
- [ ] **Faire relire la politique de confidentialité**, en particulier la
      durée de conservation (j'ai mis trois ans après le dernier contact) et
      la base légale de la prospection. Je ne suis pas juriste.

---

## 8. Logos et contenus manquants

- [x] **Logo Whentocop** : reçu et intégré, passé en blanc pour le voile.
- [ ] **Kairntech** est un vrai client (18 000 € de deals gagnés) et son logo
      blanc est disponible. À ajouter au bandeau si tu veux.
- [ ] **Business IoT** : deux lignes sur leur activité réelle. La page ne dit
      aujourd'hui que ce qui est vérifiable.
- [ ] **Whentocop** : idem, deux lignes sur leur positionnement.
- [x] **Témoignage** : signé Isabelle Cosijnse, Chief Marketing Officer de
      Business IoT, avec sa photo.
- [ ] **Faire valider le texte du témoignage par Isabelle Cosijnse.** La
      citation affichée est celle rédigée en interne, pas une phrase qu'elle
      a écrite. Son nom et sa photo y sont associés : il lui faut un accord
      écrit sur le libellé exact.
- [ ] **Confirmer « premier échange de 9 minutes »** au-dessus du
      formulaire. C'est le chiffre dicté, mais il détonne avec les trente
      minutes évoquées plus tôt.
