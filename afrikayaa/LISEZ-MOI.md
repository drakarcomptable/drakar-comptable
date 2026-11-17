# AFRIKAYAA & REVEAL — maquette du site de réservation

Site d'une seule page, sans serveur ni base de données. Tout tient dans `index.html`
et le dossier `assets/`.

```
afrikayaa/
├── index.html               ← tout le site
├── email-confirmation.html  ← modèle d'e-mail envoyé après réservation
├── build.py                 ← assemble le dossier site/ prêt à héberger
├── site/                    ← CE DOSSIER EST CELUI À METTRE EN LIGNE
├── assets/
│   ├── logo-lockup.png      ← logo complet, en pied de page
│   ├── logo-mark.png        ← scarabée seul (navigation et e-mail)
│   ├── hero.webp            ← photo d'accueil
│   ├── favicon-32.png, icon-192.png, icon-512.png, apple-touch-icon.png
│   ├── site.webmanifest     ← nom et icône quand le site est ajouté à l'écran d'accueil
│   ├── fondatrice.webp      ← portrait de la fondatrice
│   └── realisation-1…5.webp ← bandeau défilant des réalisations
└── LISEZ-MOI.md
```

## Avant de mettre en ligne : assembler le dossier `site/`

```bash
python3 build.py
```

`index.html` est écrit sans `<!doctype>` ni `<head>` : c'est le format attendu
par l'outil de prévisualisation. Un navigateur qui reçoit ce fichier tel quel
bascule en mode *quirks*, où la mise en page peut dériver. `build.py` enveloppe
donc le contenu dans un document complet, y ajoute les icônes, le manifeste et
les métadonnées de partage, puis recopie l'ensemble dans `site/`.

**C'est le dossier `site/` qu'on envoie à l'hébergeur, pas la racine.**
À relancer après chaque modification de `index.html`.

## L'icône de l'application

Le scarabée seul, sur fond noir, sert d'icône : onglet du navigateur, raccourci
sur l'écran d'accueil du téléphone, et vignette quand le lien est partagé.
Elle n'apparaît qu'une fois le site hébergé — l'outil de prévisualisation
impose la sienne.

Pour la régénérer après un changement de logo, relancer la fabrication des
icônes depuis `assets/logo-mark.png` aux tailles 32, 180, 192 et 512 pixels.

## Mettre le site en ligne

Trois possibilités, de la plus simple à la plus souple.

**Netlify Drop** — https://app.netlify.com/drop
Glisser le dossier `site/` dans la page. Le site est en ligne en moins d'une minute,
avec une adresse du type `nom-choisi.netlify.app`. Gratuit. Un nom de domaine personnel
(`afrikayaa.fr`) peut être rattaché ensuite depuis les réglages.

**Vercel** — https://vercel.com
Même principe, avec un historique des versions. Gratuit pour ce volume.

**Hébergement classique (OVH, Ionos, o2switch…)**
Envoyer le contenu de `site/` par FTP dans le répertoire `www`. À privilégier si un
nom de domaine et des adresses e-mail professionnelles sont déjà en place.

## Modifier le contenu

Tout se trouve dans `index.html`.

- **Prestations et tarifs** : bloc `var SERVICES = [...]` dans le script, en bas du fichier.
  Chaque ligne suit la forme `{id, n: nom, d: durée, p: prix, t: description}`.
- **Communes et frais de déplacement** : bloc `var COMMUNES = [...]`, juste en dessous.
  `f: null` signifie « sur devis ».
- **Acompte et frais** : `var FEE_TX = 4, DEPOSIT = 0.5;`
- **Horaires proposés** : `var TIMES = ['08:30','11:00','14:00','16:30'];`
- **Jours de fermeture** : fonction `openDay` — actuellement dimanche et lundi.
- **Textes, formules REVEAL, coordonnées** : directement dans le corps de la page.

## Ce qui reste à brancher pour un site réellement opérationnel

La maquette simule le paiement et l'envoi des demandes : rien n'est encaissé, rien n'est
transmis. Pour passer en production il faut ajouter :

1. **Le paiement de l'acompte** — compte Stripe, puis un lien de paiement généré à la
   validation. Stripe fonctionne en Guadeloupe et gère l'acompte puis le solde.
2. **L'enregistrement des rendez-vous** — une base de données, sans quoi deux clientes
   peuvent réserver le même créneau.
3. **Les confirmations automatiques** — e-mail et SMS à la cliente, notification à la
   coiffeuse.
4. **L'espace de suivi de la professionnelle** — retiré de cette maquette, qui ne
   montre que le parcours vu par les clientes. Reste à concevoir.
5. **Les mentions légales, les CGV et la politique de confidentialité** — obligatoires
   dès lors que le site encaisse un paiement et collecte des coordonnées.

## Le modèle d'e-mail

`email-confirmation.html` est l'e-mail reçu par la cliente après le paiement de
l'acompte. Il est écrit en tableaux avec des styles en ligne : c'est la seule
mise en page lisible dans Outlook, Gmail et Apple Mail.

Les valeurs entre doubles accolades sont remplacées à l'envoi :
`{{PRENOM}}` `{{DATE}}` `{{HEURE}}` `{{LIEU}}` `{{PRESTATIONS}}` `{{DUREE}}`
`{{TOTAL}}` `{{ACOMPTE}}` `{{SOLDE}}` `{{REFERENCE}}` `{{LOGO_URL}}`.

`{{LOGO_URL}}` doit pointer vers une adresse publique : un e-mail ne peut pas
afficher une image stockée sur l'ordinateur. Une fois le site en ligne, c'est
`https://votre-domaine/assets/logo-mark.png`.

Pour l'envoi, un service d'e-mails transactionnels est nécessaire (Brevo,
Resend, Postmark…). Envoyer depuis une simple boîte Gmail finit en spam.

## Remplacer la photo et le logo

Déposer les fichiers dans `assets/` en conservant exactement ces noms :

- `hero.webp` — photo d'accueil, format paysage
- `fondatrice.webp` — portrait, format portrait (3/4 ou 4/5)
- `realisation-1.webp` à `realisation-5.webp` — carrées, pour le bandeau défilant
- `logo-lockup.png` et `logo-mark.png` — fond transparent

Aucune autre modification n'est nécessaire : la page les reprend automatiquement.
