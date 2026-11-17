const d = require('docx');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
        ShadingType, BorderStyle, AlignmentType, HeadingLevel, VerticalAlign } = d;

const W = 9638;                 // largeur utile en DXA (A4 moins les marges)
const GOLD = "A8761F";
const INK  = "1A1620";
const GREY = "6B6459";
const FILL = "F4F1EC";          // fond des cases a remplir
const LINE = "D8D2C8";

const bd = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: bd, bottom: bd, left: bd, right: bd,
                  insideHorizontal: bd, insideVertical: bd };

const txt = (t, o = {}) => new TextRun({ text: t, font: "Arial", size: o.size || 20,
  bold: !!o.bold, italics: !!o.italics, color: o.color || INK });

const p = (t, o = {}) => new Paragraph({
  alignment: o.align, spacing: { before: o.before === undefined ? 0 : o.before,
                                 after: o.after === undefined ? 100 : o.after },
  children: Array.isArray(t) ? t : [txt(t, o)] });

const cell = (children, width, o = {}) => new TableCell({
  width: { size: width, type: WidthType.DXA },
  shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: "auto" } : undefined,
  margins: { top: 90, bottom: 90, left: 110, right: 110 },
  verticalAlign: VerticalAlign.CENTER,
  children });

// une question : libelle a gauche, case a remplir a droite
const ask = (label, hint) => new TableRow({ children: [
  cell([p([txt(label, { bold: true })], { after: hint ? 40 : 0 }),
        ...(hint ? [p([txt(hint, { size: 17, italics: true, color: GREY })], { after: 0 })] : [])], 4100),
  cell([p("", { after: 0 })], W - 4100, { fill: FILL }) ] });

const qTable = rows => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [4100, W - 4100], borders, rows });

// un tableau a remplir ligne par ligne
const grid = (heads, widths, nRows, seed) => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: widths, borders,
  rows: [
    new TableRow({ tableHeader: true, children: heads.map((h, i) =>
      cell([p([txt(h, { bold: true, size: 18, color: "FFFFFF" })], { after: 0 })], widths[i],
           { fill: "2B2233" })) }),
    ...Array.from({ length: nRows }, (_, r) => new TableRow({ children: widths.map((w, i) =>
      cell([p([txt((seed && seed[r] && seed[r][i]) || "",
                   { color: GREY, italics: true })], { after: 0 })], w, { fill: FILL }) ) }))
  ] });

const h1 = t => new Paragraph({
  spacing: { before: 380, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 6 } },
  keepNext: true,
  children: [new TextRun({ text: t, font: "Arial", size: 26, bold: true, color: INK })] });

const note = t => p([txt(t, { size: 18, color: GREY, italics: true })], { after: 180 });

const part = (num, title, sub) => ([
  new Paragraph({ pageBreakBefore: num === 2, spacing: { before: num === 2 ? 0 : 400, after: 0 },
    children: [new TextRun({ text: "PARTIE " + num, font: "Arial", size: 18, bold: true, color: GOLD })] }),
  new Paragraph({ spacing: { before: 60, after: 60 }, keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: GOLD, space: 8 } },
    children: [new TextRun({ text: title, font: "Arial", size: 34, bold: true, color: INK })] }),
  p([txt(sub, { size: 20, color: GREY })], { before: 120, after: 220 }),
]);

// tableau deja rempli, pour expliquer plutot que pour recolter
const info = rows => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [4600, W - 4600], borders,
  rows: rows.map(([a, b, strong]) => new TableRow({ children: [
    cell([p([txt(a, { bold: true, size: strong ? 20 : 19 })], { after: 0 })], 4600,
         { fill: strong ? "EFE9DC" : undefined }),
    cell([p([txt(b, { size: strong ? 20 : 19, bold: !!strong })], { after: 0 })], W - 4600,
         { fill: strong ? "EFE9DC" : undefined }) ] })) });

const doc = new Document({
  creator: "AFRIKAYAA",
  title: "AFRIKAYAA — informations à compléter",
  description: "Questionnaire préalable à la mise en ligne du site de réservation",
  styles: { default: {
    document: { run: { font: "Arial", size: 20, color: INK },
                paragraph: { spacing: { line: 276, after: 100 } } } } },
  sections: [{
    properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: [

p([txt("AFRIKAYAA", { bold: true, size: 20, color: GOLD })], { after: 40 }),
p([txt("Informations à compléter", { bold: true, size: 44 })], { after: 80 }),
p([txt("Questionnaire préalable à la mise en ligne du site de réservation", { size: 22, color: GREY })], { after: 240 }),

p([txt("Le site de réservation est prêt dans sa forme. Pour le mettre en ligne, il manque les informations réelles de votre activité : la maquette affiche pour l'instant des prestations et des tarifs donnés en exemple.")], { after: 120 }),
p([txt("Écrivez directement dans les cases grises. Tout ne vous concerne peut-être pas : laissez vide ce qui ne s'applique pas, et écrivez « à voir » là où vous hésitez. Enregistrez le document et renvoyez-le.")], { after: 160 }),

qTable([ ask("Rempli par"), ask("Date") ]),

...part(1, "Ce qu'il nous faut pour compléter le site",
  "Les informations réelles de votre activité, qui remplaceront les exemples affichés aujourd'hui."),

h1("1. Vos prestations de coiffure"),
note("La liste complète, avec la durée que vous bloquez réellement dans votre agenda et le prix que paie la cliente. Ajoutez autant de lignes que nécessaire."),
grid(["Prestation", "Durée", "Prix", "Précisions (ce qui est compris, suppléments)"],
     [3000, 1200, 1200, 4238], 16,
     [["Consultation préalable", "", "", ""]]),
p("", { after: 120 }),
qTable([
  ask("Des suppléments s'appliquent-ils ?", "Longueur, épaisseur, mèches fournies ou non…"),
  ask("Des prestations se combinent-elles ?", "Par exemple soin + coupe le même jour"),
]),

h1("2. La consultation préalable"),
qTable([
  ask("Durée"),
  ask("Tarif", "Gratuite, offerte si la prestation suit, ou payante"),
  ask("Peut-elle se tenir le jour même que la prestation ?"),
  ask("Se fait-elle aussi à domicile ou en visio ?"),
  ask("Est-elle vraiment obligatoire pour toute nouvelle cliente ?"),
]),

h1("3. Vos horaires"),
note("Le site ne proposera que des créneaux que vous pouvez honorer."),
grid(["Jour", "Ouvert", "De", "À"], [2400, 1800, 2719, 2719], 7,
     [["Lundi"], ["Mardi"], ["Mercredi"], ["Jeudi"], ["Vendredi"], ["Samedi"], ["Dimanche"]]),
p("", { after: 120 }),
qTable([
  ask("Pause déjeuner"),
  ask("Temps de trajet à prévoir entre deux rendez-vous à domicile", "Pour que le site n'enchaîne pas deux déplacements impossibles"),
  ask("Combien de temps à l'avance faut-il réserver ?", "Délai minimum avant un rendez-vous"),
  ask("Jusqu'à combien de semaines à l'avance ouvrir l'agenda ?"),
  ask("Fermetures annuelles connues", "Congés, jours fériés travaillés ou non"),
]),

h1("4. L'acompte et le paiement"),
qTable([
  ask("Les 50 % d'acompte se calculent sur quoi ?", "Sur la prestation seule, ou sur la prestation plus les frais de déplacement"),
  ask("L'acompte est-il remboursable ?", "Et dans quelles conditions"),
  ask("Comment se règle le solde la veille ?", "Lien de paiement envoyé automatiquement, virement, ou sur place le jour même"),
  ask("Moyens de paiement acceptés sur place"),
  ask("Les 4 € de frais de transaction", "Point à vérifier : en France, refacturer des frais pour un paiement par carte grand public est interdit. Souhaitez-vous les intégrer au prix des prestations ?"),
]),

h1("5. Annulation, retard, absence"),
note("Ces règles apparaîtront dans les conditions générales et dans l'e-mail de confirmation."),
qTable([
  ask("Jusqu'à quand peut-on annuler sans perdre l'acompte ?"),
  ask("Jusqu'à quand peut-on décaler un rendez-vous ?"),
  ask("Retard toléré avant que la place soit perdue"),
  ask("Que se passe-t-il si la cliente ne vient pas ?"),
]),

h1("6. Les déplacements à domicile"),
note("La grille des frais par commune est déjà en place. Il reste trois points."),
qTable([
  ask("Petit-Bourg", "Le tarif est bien de 20 € en zone 3. Dans quel secteur la classez-vous : Nord Basse-Terre ou Sud Basse-Terre ?"),
  ask("Sainte-Anne et Le Moule", "Votre document les plaçait à l'ouest. Elles sont en Grande-Terre, à l'est. Confirmez-vous la correction ?"),
  ask("Les Saintes et Marie-Galante", "Comment établissez-vous le devis : forfait, bateau facturé en plus, journée entière ?"),
  ask("Montant minimum pour un déplacement ?", "Par exemple : pas de déplacement en dessous de 60 € de prestation"),
  ask("Des communes à ajouter ou à retirer de la grille ?"),
]),

h1("7. REVEAL"),
note("Les formules Simple à 320 € et Premium à 370 € sont en place, ainsi que l'option shopping à 50 €."),
qTable([
  ask("Que comprend exactement la formule Simple ?", "Étape par étape, pour l'afficher sur le site"),
  ask("Que comprend la formule Premium en plus ?"),
  ask("Durée d'une séance REVEAL"),
  ask("Un acompte est-il demandé pour REVEAL ?"),
]),
p("", { after: 120 }),
note("Les frais de déplacement REVEAL se calculent pour deux personnes, mais la grille n'a pas été fournie. Indiquez les montants par commune, ou la règle à appliquer."),
grid(["Commune ou zone", "Frais de déplacement REVEAL (2 personnes)"], [4800, 4838], 8),

h1("8. Votre entreprise"),
note("Obligatoire dès lors que le site encaisse un paiement : mentions légales et conditions générales de vente."),
qTable([
  ask("Dénomination"),
  ask("Forme juridique", "Micro-entreprise, EI, SASU…"),
  ask("Numéro SIRET"),
  ask("Adresse du siège"),
  ask("Adresse du salon", "Si elle est différente"),
  ask("Assujettie à la TVA ?", "Et sous quel numéro le cas échéant"),
  ask("Assurance responsabilité civile professionnelle", "Compagnie et numéro de contrat"),
  ask("Médiateur de la consommation", "Obligatoire pour vendre à des particuliers"),
]),

h1("9. Vos coordonnées publiques"),
qTable([
  ask("Téléphone affiché", "0690 96 43 92 pour l'instant"),
  ask("Numéro WhatsApp", "Si différent"),
  ask("E-mail professionnel", "C'est de là que partiront les confirmations"),
  ask("Instagram"),
  ask("Facebook"),
  ask("Fiche Google de l'établissement"),
]),

h1("10. Le site"),
qTable([
  ask("Nom de domaine souhaité", "Par exemple afrikayaa.fr ou afrikayaa.com"),
  ask("Avez-vous le logo en fichier d'origine ?", "Un fichier vectoriel, en .ai, .eps, .svg ou .pdf, donnerait un rendu parfaitement net"),
  ask("Autres photos de réalisations à ajouter"),
  ask("Un texte de présentation que vous tenez à voir figurer"),
]),

h1("11. Ce que vous voulez ajouter"),
qTable([ ask("Remarques, demandes, ce qui manque") ]),
p("", { before: 60, after: 0 }),
qTable([ ask("Remarques (suite)") ]),

...part(2, "Comment l'outil fonctionnera de votre côté",
  "Aucun abonnement mensuel. Voici ce qui se passe quand une cliente réserve, et ce que cela coûte réellement."),

h1("Votre agenda sera votre tableau de bord"),
p("Plutôt que de vous faire apprendre un outil de plus, le site se branche directement sur votre Google Agenda. Vous l'avez déjà sur votre téléphone, et vous savez vous en servir."),
p("Vous y bloquez vos indisponibilités comme d'habitude : le site cesse aussitôt de proposer ces créneaux aux clientes."),
p("Chaque rendez-vous confirmé s'ajoute tout seul à votre agenda, avec le nom de la cliente, la prestation, le lieu et le montant qui reste à régler."),
p("Votre téléphone vous prévient à chaque nouvelle réservation, et la veille de chaque rendez-vous."),
p("C'est gratuit, et vous gardez tout votre historique même si le site change un jour."),

h1("L'acompte"),
p("Stripe encaisse le paiement. Pas d'abonnement, pas de frais fixes : vous ne payez que lorsque vous encaissez, de l'ordre de 1,5 % plus 0,25 € par paiement avec une carte européenne. Sur un acompte de 50 €, cela représente environ 1 €. L'argent arrive sur votre compte bancaire quelques jours après."),
note("Tarif à vérifier à l'ouverture du compte : Stripe ajuste ses grilles."),

h1("Ce que cela coûte par an"),
info([
  ["Nom de domaine (afrikayaa.fr)", "environ 10 à 15 € par an"],
  ["Hébergement du site", "gratuit"],
  ["Envoi automatique des e-mails", "gratuit à votre volume"],
  ["Google Agenda", "gratuit"],
  ["Stripe", "aucun abonnement, environ 1 € sur un acompte de 50 €"],
  ["Total", "environ 1 € par mois, plus les frais sur ce que vous encaissez", true],
]),

h1("On peut y aller en deux temps"),
p([txt("Pour démarrer. ", { bold: true }),
   txt("Le site est en ligne, la demande de rendez-vous vous arrive par e-mail, vous la notez dans votre agenda et vous envoyez un lien de paiement Stripe créé en trois clics. Rien d'automatique, rien à régler, et vous gardez la main sur tout.")]),
p([txt("Ensuite, quand vous le sentez. ", { bold: true }),
   txt("Le site lit vos disponibilités, encaisse l'acompte et remplit votre agenda sans vous. Le coût ne bouge pas.")]),

h1("Les comptes clientes et les points de fidélité"),
p("C'est faisable, mais c'est la partie la plus lourde : il faut conserver des données personnelles, gérer des mots de passe et respecter le RGPD. Beaucoup de travail pour peu d'effet tant que le volume est faible. La proposition est de le garder pour plus tard, et de le mettre en place quand les réservations auront pris."),

h1("La notification WhatsApp"),
p("Envoyer un message WhatsApp automatique demande un compte Meta Business vérifié et un prestataire qui facture chaque message. Comme votre agenda vous prévient déjà sur votre téléphone, ce serait un coût et une complication pour la même information."),
p("Le bouton WhatsApp du site reste, lui, pour que les clientes vous écrivent directement."),

h1("12. Vos outils"),
qTable([
  ask("Utilisez-vous déjà Google Agenda ?", "Si oui, sur quelle adresse Gmail"),
  ask("Adresse e-mail où recevoir les demandes de rendez-vous"),
  ask("Avez-vous déjà un compte Stripe ?"),
  ask("Compte bancaire sur lequel recevoir les acomptes", "Le nom de la banque suffit ici, pas le numéro"),
  ask("Qui achète le nom de domaine ?", "Vous, ou nous pour votre compte"),
]),

h1("13. Vos choix"),
qTable([
  ask("Démarrer en mode simple, ou directement en automatique ?"),
  ask("Les comptes clientes et les points de fidélité", "Maintenant, plus tard, ou jamais"),
  ask("La notification WhatsApp malgré son coût par message ?"),
  ask("Autre chose que vous aimeriez faire depuis votre téléphone ?"),
]),

p([txt("AFRIKAYAA — Coiffure cheveux naturels afro, Sainte-Rose, Guadeloupe", { size: 17, color: GREY })],
  { before: 400, align: AlignmentType.CENTER, after: 0 }),
    ]
  }]
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync('AFRIKAYAA-informations-a-completer.docx', b);
  console.log('ecrit', b.length, 'octets');
});
