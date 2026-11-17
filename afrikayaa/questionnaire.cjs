// Genere AFRIKAYAA-informations-a-completer.docx
//   node questionnaire.cjs
// Un document volontairement simple : une question, puis une ligne pour repondre.
const d = require('docx');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = d;

const GOLD = "A8761F", INK = "1A1620", GREY = "6E675C", RULE = "C7C0B4";

const txt = (t, o = {}) => new TextRun({ text: t, font: "Arial", size: o.size || 21,
  bold: !!o.bold, italics: !!o.italics, color: o.color || INK });

const p = (t, o = {}) => new Paragraph({
  alignment: o.align,
  spacing: { before: o.before || 0, after: o.after === undefined ? 120 : o.after },
  children: Array.isArray(t) ? t : [txt(t, o)] });

// La ligne sur laquelle elle ecrit.
// Word fusionne en un seul cadre deux paragraphes dont la bordure est
// identique : une nuance imperceptible alternee suffit a les separer.
const RULES = ["C7C0B4", "C8C1B5"];
let seq = 0;
const line = (o = {}) => new Paragraph({
  spacing: { before: o.before === undefined ? 70 : o.before, after: o.after === undefined ? 40 : o.after },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULES[seq++ % 2], space: 3 } },
  children: [txt(" ")] });

// une question suivie de ses lignes
const q = (label, hint, n) => {
  const out = [new Paragraph({ spacing: { before: 190, after: hint ? 20 : 0 }, keepNext: true,
    children: [txt(label, { bold: true })] })];
  if (hint) out.push(new Paragraph({ spacing: { after: 0 }, keepNext: true,
    children: [txt(hint, { size: 18, italics: true, color: GREY })] }));
  for (let i = 0; i < (n || 1); i++) out.push(line());
  return out;
};

// des lignes seules, pour une liste libre
const lines = n => Array.from({ length: n }, () => line());

const h1 = t => new Paragraph({
  spacing: { before: 420, after: 60 }, keepNext: true,
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 6 } },
  children: [txt(t, { bold: true, size: 27 })] });

const h2 = t => new Paragraph({
  spacing: { before: 300, after: 80 }, keepNext: true,
  children: [txt(t, { bold: true, size: 23 })] });

const note = t => p([txt(t, { size: 18, italics: true, color: GREY })], { after: 60 });

const part = (num, title, sub) => ([
  new Paragraph({ pageBreakBefore: num === 2, spacing: { before: num === 2 ? 0 : 420, after: 0 },
    children: [txt("PARTIE " + num, { bold: true, size: 18, color: GOLD })] }),
  new Paragraph({ spacing: { before: 60, after: 60 }, keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: GOLD, space: 8 } },
    children: [txt(title, { bold: true, size: 34 })] }),
  p([txt(sub, { size: 20, color: GREY })], { before: 120, after: 160 }),
]);

const doc = new Document({
  creator: "AFRIKAYAA",
  title: "AFRIKAYAA — informations à compléter",
  description: "Questionnaire préalable à la mise en ligne du site de réservation",
  styles: { default: { document: { run: { font: "Arial", size: 21, color: INK },
                                   paragraph: { spacing: { line: 288, after: 120 } } } } },
  sections: [{
    properties: { page: { margin: { top: 1134, bottom: 1134, left: 1247, right: 1247 } } },
    children: [

p([txt("AFRIKAYAA", { bold: true, size: 20, color: GOLD })], { after: 40 }),
p([txt("Informations à compléter", { bold: true, size: 46 })], { after: 70 }),
p([txt("Questionnaire pour la mise en ligne de votre site de réservation", { size: 22, color: GREY })], { after: 240 }),

p("Le site est prêt dans sa forme. Pour le mettre en ligne, il manque les informations réelles de votre métier : il affiche pour l'instant des prestations et des tarifs donnés en exemple."),
p("Écrivez directement sur les lignes. Laissez vide ce qui ne vous concerne pas, et écrivez « à voir » là où vous hésitez. Enregistrez le document et renvoyez-le."),
note("Ce que vous nous avez déjà transmis n'est pas redemandé ici : votre grille de frais de déplacement par commune, l'acompte de 50 %, le solde la veille, la consultation obligatoire pour une nouvelle cliente et les tarifs REVEAL sont en place."),

...q("Rempli par", null, 1),
...q("Date", null, 1),

...part(1, "Votre métier et votre organisation",
  "Ce que le site doit savoir pour proposer les bons créneaux, les bons prix et les bons mots."),

h1("1. Vos prestations de coiffure"),
note("Une par ligne : le nom, la durée que vous bloquez vraiment dans votre agenda, le prix. Par exemple : Soin profond, 1 h 30, 55 €."),
...lines(18),
...q("Quelles sont vos spécialités, celles pour lesquelles on vient vous voir ?", null, 2),
...q("Travaillez-vous aussi sur cheveux défrisés, locks, extensions ?", null, 2),
...q("Coiffez-vous les enfants ? les hommes ?", "Et à quels tarifs", 2),
...q("Les mèches sont-elles fournies par vous ou par la cliente ?", "Et si vous les fournissez, à quel prix", 2),
...q("Des suppléments s'appliquent-ils ?", "Longueur, épaisseur, densité, retrait d'une pose précédente", 2),
...q("Y a-t-il des prestations que vous ne faites pas ?", "Pour éviter qu'on vous les demande", 2),
...q("Proposez-vous des forfaits ou des entretiens réguliers ?",
     "Par exemple un entretien de locks tous les deux mois à tarif préférentiel", 2),
...q("Vendez-vous des produits de soin à vos clientes ?", null, 2),

h1("2. La consultation préalable"),
...q("Combien de temps dure-t-elle ?", null, 1),
...q("Combien coûte-t-elle ?", "Gratuite, offerte si la prestation suit, ou payante", 1),
...q("Que s'y passe-t-il, concrètement ?", "Pour pouvoir l'expliquer aux clientes sur le site", 3),
...q("Peut-elle se tenir le même jour que la prestation ?", null, 1),
...q("Se fait-elle aussi à domicile, ou en visio ?", null, 1),

h1("3. Votre accompagnement"),
...q("Que doit faire la cliente avant de venir ?",
     "Cheveux lavés, démêlés, sans produit, mèches apportées…", 3),
...q("Que lui donnez-vous après le rendez-vous ?",
     "Conseils d'entretien, routine à suivre, produits recommandés", 3),
...q("Revoyez-vous la cliente entre deux prestations ?",
     "Retouche offerte, contrôle de la pose, suivi d'une routine", 2),
...q("Comment répondez-vous aux questions entre deux rendez-vous ?", "WhatsApp, téléphone, messages", 2),

h1("4. Vos journées"),
note("Le site ne proposera que des créneaux que vous pouvez honorer."),
...q("Lundi", null, 1),
...q("Mardi", null, 1),
...q("Mercredi", null, 1),
...q("Jeudi", null, 1),
...q("Vendredi", null, 1),
...q("Samedi", null, 1),
...q("Dimanche", null, 1),
...q("Votre pause dans la journée", null, 1),
...q("Combien de clientes pouvez-vous prendre dans une journée ?", null, 1),
...q("Coiffez-vous plusieurs clientes en même temps ?",
     "Par exemple pendant qu'un soin pose", 2),
...q("Combien de temps faut-il prévoir entre deux rendez-vous à domicile ?",
     "Pour que le site n'enchaîne pas deux déplacements impossibles", 1),
...q("Combien de temps à l'avance faut-il réserver, au minimum ?", null, 1),
...q("Jusqu'à combien de semaines à l'avance ouvrir l'agenda ?", null, 1),
...q("Vos fermetures déjà connues", "Congés, jours fériés travaillés ou non", 2),

h1("5. L'acompte et le solde"),
...q("Les 50 % d'acompte se calculent sur quoi ?",
     "Sur la prestation seule, ou sur la prestation plus les frais de déplacement", 1),
...q("L'acompte est-il remboursable, et dans quels cas ?", null, 2),
...q("Comment se règle le solde la veille ?",
     "Lien de paiement envoyé automatiquement, virement, ou sur place le jour même", 2),
...q("Quels moyens de paiement acceptez-vous sur place ?", null, 1),

h1("6. Annulation, retard, absence"),
note("Ces règles figureront dans l'e-mail de confirmation que recevra la cliente."),
...q("Jusqu'à quand peut-on annuler sans perdre l'acompte ?", null, 1),
...q("Jusqu'à quand peut-on décaler un rendez-vous ?", null, 1),
...q("Quel retard tolérez-vous avant que la place soit perdue ?", null, 1),
...q("Que se passe-t-il si la cliente ne vient pas ?", null, 2),

h1("7. Les déplacements à domicile"),
note("Votre grille par commune est déjà en place. Il reste trois points à trancher."),
...q("Petit-Bourg",
     "Le tarif est bien de 20 € en zone 3. Dans quel secteur la classez-vous : Nord Basse-Terre ou Sud Basse-Terre ?", 1),
...q("Sainte-Anne et Le Moule",
     "Votre document les plaçait à l'ouest. Elles sont en Grande-Terre, à l'est. Confirmez-vous la correction ?", 1),
...q("Les Saintes et Marie-Galante",
     "Comment établissez-vous le devis : forfait, bateau facturé en plus, journée entière ?", 2),
...q("Y a-t-il un montant minimum pour un déplacement ?",
     "Par exemple : pas de déplacement en dessous de 60 € de prestation", 1),
...q("De quoi avez-vous besoin sur place ?",
     "Point d'eau, prise, chaise, éclairage : à dire à la cliente avant qu'elle réserve", 2),
...q("Des communes à ajouter ou à retirer de la grille ?", null, 2),

h1("8. REVEAL"),
note("Les formules Simple à 320 € et Premium à 370 € sont en place, ainsi que l'option shopping à 50 €."),
...q("À qui s'adresse REVEAL ?", "Dans vos mots, pour l'écrire sur le site", 3),
...q("Comment se déroule une journée REVEAL, de l'arrivée au départ ?", null, 5),
...q("Que comprend exactement la formule Simple ?", null, 3),
...q("Que comprend la formule Premium en plus ?", null, 2),
...q("Combien de temps dure une séance ?", null, 1),
...q("Travaillez-vous avec quelqu'un ?", "Maquilleuse, photographe : leurs noms, pour les citer", 2),
...q("Peut-on offrir REVEAL à quelqu'un ?", "Un bon cadeau, par exemple", 1),
...q("Demandez-vous un acompte pour REVEAL ?", null, 1),
...q("Vos frais de déplacement REVEAL, pour deux personnes",
     "Une commune et son montant par ligne, ou la règle à appliquer. Cette grille n'a pas encore été fournie.", 7),

h1("9. Vos coordonnées publiques"),
...q("Téléphone affiché sur le site", "0690 96 43 92 pour l'instant", 1),
...q("Numéro WhatsApp", "S'il est différent", 1),
...q("E-mail professionnel", "C'est de là que partiront les confirmations", 1),
...q("Instagram", null, 1),
...q("Facebook", null, 1),
...q("Votre fiche Google", null, 1),
...q("Adresse du salon à Sainte-Rose", "Telle qu'elle doit s'afficher", 2),

h1("10. Le site"),
...q("Quel nom de domaine souhaitez-vous ?", "Par exemple afrikayaa.fr ou afrikayaa.com", 1),
...q("Avez-vous le logo dans son fichier d'origine ?",
     "Un fichier vectoriel, en .ai, .eps, .svg ou .pdf, donnerait un rendu parfaitement net", 1),
...q("D'autres photos de réalisations à ajouter ?", null, 2),
...q("Un texte que vous tenez à voir figurer", null, 4),

h1("11. Ce que vous voulez ajouter"),
...lines(7),

...part(2, "Comment l'outil fonctionnera de votre côté",
  "Ce qui se passe, concrètement, quand une cliente réserve sur le site."),

h2("Votre agenda sera votre tableau de bord"),
p("Plutôt que de vous faire apprendre un outil de plus, le site se branchera sur votre Google Agenda. Vous l'avez déjà sur votre téléphone et vous savez vous en servir."),
p("Vous y bloquez vos indisponibilités comme d'habitude : le site cesse aussitôt de proposer ces créneaux."),
p("Chaque rendez-vous confirmé s'ajoute tout seul, avec le nom de la cliente, la prestation, le lieu et le montant qui reste à régler."),
p("Votre téléphone vous prévient à chaque nouvelle réservation, et la veille de chaque rendez-vous."),
p("Vous gardez votre historique même si le site change un jour."),

h2("Ce que reçoit la cliente"),
p("Dès que l'acompte est validé, elle reçoit un e-mail de confirmation à votre nom : la date, l'heure, le lieu, la prestation, la durée prévue, le montant réglé et le solde à prévoir la veille."),
p("Tant que l'acompte n'est pas réglé, le rendez-vous n'existe pas et le créneau reste libre pour quelqu'un d'autre."),

h2("On peut y aller en deux temps"),
p([txt("Pour démarrer. ", { bold: true }),
   txt("Le site est en ligne, la demande de rendez-vous vous arrive par e-mail, vous la notez dans votre agenda et vous envoyez un lien de paiement. Rien d'automatique, et vous gardez la main sur tout.")]),
p([txt("Ensuite, quand vous le sentez. ", { bold: true }),
   txt("Le site lit vos disponibilités, encaisse l'acompte et remplit votre agenda sans vous.")]),

h2("Les comptes clientes et les points de fidélité"),
p("C'est faisable, mais c'est la partie la plus lourde à mettre en place : il faut conserver des données personnelles et gérer des mots de passe. La proposition est de le garder pour plus tard, et de s'en occuper quand les réservations auront pris."),

h2("La notification WhatsApp"),
p("Envoyer un message WhatsApp automatique demande un compte Meta Business vérifié et passe par un prestataire extérieur. Comme votre agenda vous prévient déjà sur votre téléphone, cela ferait une complication pour la même information."),
p("Le bouton WhatsApp du site reste, lui, pour que les clientes vous écrivent directement."),

h1("12. Vos outils"),
...q("Utilisez-vous déjà Google Agenda ?", "Si oui, sur quelle adresse Gmail", 1),
...q("Sur quelle adresse e-mail voulez-vous recevoir les demandes ?", null, 1),
...q("Tenez-vous votre agenda sur papier, sur téléphone, ou les deux ?", null, 1),
...q("Comment vos clientes vous contactent-elles aujourd'hui ?",
     "Téléphone, WhatsApp, Instagram : pour savoir ce qu'il faut garder", 2),

h1("13. Vos choix"),
...q("Préférez-vous démarrer en mode simple, ou directement en automatique ?", null, 2),
...q("Les comptes clientes et les points de fidélité", "Maintenant, plus tard, ou jamais", 1),
...q("Autre chose que vous aimeriez faire depuis votre téléphone ?", null, 3),

p([txt("AFRIKAYAA — Coiffure cheveux naturels afro, Sainte-Rose, Guadeloupe", { size: 17, color: GREY })],
  { before: 420, align: AlignmentType.CENTER, after: 0 }),
    ]
  }]
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync('AFRIKAYAA-informations-a-completer.docx', b);
  console.log('ecrit', b.length, 'octets');
});
