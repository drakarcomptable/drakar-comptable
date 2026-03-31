export interface SEOSection {
  title: string;
  content?: string;
  subSections?: { title: string; content: string }[];
  list?: string[];
}

export interface SEOServicePageData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: SEOSection[];
  faq: { question: string; answer: string }[];
  relatedLinks: { label: string; to: string }[];
}

export const SEO_SERVICE_PAGES: Record<string, SEOServicePageData> = {
  comptabilite: {
    slug: 'comptabilite',
    metaTitle: 'Tenue de Comptabilit\u00e9 & Bilan | Cabinet Drakar Normandie',
    metaDescription:
      'Cabinet Drakar prend en charge toute votre comptabilit\u00e9 en Normandie : saisie, bilan, liasse fiscale. Solutions digitales pour TPE et PME. Devis gratuit.',
    h1: 'Tenue de comptabilit\u00e9 et \u00e9tablissement du bilan en Normandie',
    intro:
      'La comptabilit\u00e9 est le pilier de toute entreprise saine. Confiez votre tenue de comptabilit\u00e9 au cabinet Drakar Expert Comptable et b\u00e9n\u00e9ficiez d\'un suivi rigoureux, de comptes toujours \u00e0 jour et d\'une vision financi\u00e8re claire pour piloter votre activit\u00e9. Nous accompagnons les TPE, PME, ind\u00e9pendants et professions lib\u00e9rales en Normandie et dans le Calvados.',
    sections: [
      {
        title: 'Pourquoi externaliser votre comptabilit\u00e9 \u00e0 un expert-comptable ?',
        list: [
          'Gagner du temps pour vous concentrer sur votre c\u0153ur de m\u00e9tier',
          'Garantir la conformit\u00e9 de vos comptes aux normes comptables fran\u00e7aises',
          'Disposer en temps r\u00e9el d\'indicateurs financiers fiables pour vos d\u00e9cisions',
          'Anticiper les \u00e9ch\u00e9ances fiscales et sociales sans mauvaise surprise',
          'B\u00e9n\u00e9ficier de conseils proactifs d\'un expert qui conna\u00eet votre activit\u00e9',
        ],
      },
      {
        title: 'Notre mission comptabilit\u00e9 : ce que nous faisons concr\u00e8tement',
        subSections: [
          {
            title: '1. Saisie comptable et lettrage',
            content:
              'Nous collectons vos pi\u00e8ces comptables (factures, relev\u00e9s bancaires, notes de frais) via nos outils digitaux connect\u00e9s \u2014 Pennylane, iBanFirst ou votre logiciel existant \u2014 et assurons une saisie exhaustive et contr\u00f4l\u00e9e. Le lettrage des comptes est r\u00e9alis\u00e9 mensuellement pour garantir une image fid\u00e8le de votre tr\u00e9sorerie.',
          },
          {
            title: '2. Rapprochement bancaire mensuel',
            content:
              'Chaque mois, nous rapprochons vos relev\u00e9s bancaires avec les \u00e9critures comptables enregistr\u00e9es. Cette v\u00e9rification crois\u00e9e d\u00e9tecte toute anomalie, \u00e9vite les \u00e9carts et s\u00e9curise l\'int\u00e9grit\u00e9 de vos comptes.',
          },
          {
            title: '3. D\u00e9clarations de TVA',
            content:
              'Selon votre r\u00e9gime (mensuel, trimestriel, annuel), nous pr\u00e9parons et t\u00e9l\u00e9transmettons vos d\u00e9clarations de TVA dans les d\u00e9lais l\u00e9gaux. Nous v\u00e9rifions les taux applicables \u00e0 vos op\u00e9rations et optimisons les d\u00e9ductions possibles.',
          },
          {
            title: '4. \u00c9tablissement du bilan et du compte de r\u00e9sultat',
            content:
              'En fin d\'exercice, nous \u00e9tablissons l\'ensemble de vos \u00e9tats financiers annuels : bilan comptable, compte de r\u00e9sultat, annexes. Ces documents sont certifi\u00e9s et pr\u00e9sent\u00e9s de mani\u00e8re p\u00e9dagogique pour que vous compreniez la situation r\u00e9elle de votre entreprise.',
          },
          {
            title: '5. Liasse fiscale et d\u00e9p\u00f4t des comptes',
            content:
              'Nous pr\u00e9parons la liasse fiscale compl\u00e8te (formulaires 2031, 2065 selon votre forme juridique), la t\u00e9l\u00e9transmettons \u00e0 l\'administration fiscale et proc\u00e9dons au d\u00e9p\u00f4t des comptes au greffe du tribunal de commerce le cas \u00e9ch\u00e9ant.',
          },
        ],
      },
      {
        title: 'Nos outils digitaux pour une comptabilit\u00e9 en temps r\u00e9el',
        content:
          'Le cabinet Drakar s\'appuie sur des solutions technologiques de pointe pour offrir une comptabilit\u00e9 100 % connect\u00e9e et accessible \u00e0 tout moment :',
        list: [
          'Pennylane : synchronisation bancaire automatique, facturation int\u00e9gr\u00e9e, tableau de bord en temps r\u00e9el',
          'D\u00e9p\u00f4t d\u00e9mat\u00e9rialis\u00e9 de vos pi\u00e8ces comptables (scan, photo, import CSV)',
          'Acc\u00e8s client s\u00e9curis\u00e9 \u00e0 vos comptes 24h/24, depuis n\'importe quel appareil',
          'Alertes automatiques sur les \u00e9ch\u00e9ances importantes (TVA, cl\u00f4ture, liasse)',
        ],
      },
      {
        title: 'Ce que vous obtenez avec notre mission comptabilit\u00e9',
        list: [
          'Des comptes \u00e0 jour chaque mois, sans retard ni rattrapage',
          'Un bilan annuel certifi\u00e9, conforme et pr\u00e9sent\u00e9 de fa\u00e7on claire',
          'Une liasse fiscale d\u00e9pos\u00e9e dans les d\u00e9lais, sans risque de p\u00e9nalit\u00e9s',
          'Un acc\u00e8s permanent \u00e0 vos donn\u00e9es financi\u00e8res via notre espace client digital',
          'Un interlocuteur d\u00e9di\u00e9 qui conna\u00eet votre dossier et vous conseille au quotidien',
        ],
      },
      {
        title: 'Qui est concern\u00e9 par notre mission comptabilit\u00e9 ?',
        list: [
          'Micro-entrepreneurs et auto-entrepreneurs souhaitant un suivi professionnel',
          'TPE (artisans, commer\u00e7ants, prestataires de services)',
          'PME de 10 \u00e0 250 salari\u00e9s, tous secteurs confondus',
          'Professions lib\u00e9rales (BNC, BIC) : m\u00e9decins, avocats, consultants, architectes',
          'SCI, LMNP et investisseurs immobiliers',
          'Associations et structures de l\'ESS',
        ],
      },
    ],
    faq: [
      {
        question: 'Puis-je garder mon logiciel comptable actuel ?',
        answer:
          'Dans la plupart des cas, oui. Nous intervenons sur les principaux logiciels du march\u00e9 (Sage, Cegid, EBP, Pennylane, QuickBooks\u2026). Lors de notre premier \u00e9change, nous analysons votre environnement existant et vous proposons la solution la plus adapt\u00e9e \u00e0 votre organisation.',
      },
      {
        question: '\u00c0 quelle fr\u00e9quence transmettez-vous les documents comptables ?',
        answer:
          'Selon votre formule, nous pouvons travailler en mensuel, trimestriel ou en quasi temps r\u00e9el gr\u00e2ce \u00e0 la synchronisation bancaire automatique. Nos clients ont acc\u00e8s \u00e0 leurs indicateurs cl\u00e9s \u00e0 tout moment via l\'espace client digital.',
      },
      {
        question: 'Quel est le tarif pour la tenue de comptabilit\u00e9 d\'une TPE ?',
        answer:
          'Les honoraires d\u00e9pendent du volume de pi\u00e8ces \u00e0 traiter, de la forme juridique et des services inclus. Pour une TPE avec une activit\u00e9 standard, comptez g\u00e9n\u00e9ralement entre 150 et 400 \u20ac HT par mois pour une mission compl\u00e8te (comptabilit\u00e9, TVA, bilan, liasse). Nous \u00e9tablissons un devis personnalis\u00e9 et transparent \u2014 contactez-nous pour une estimation gratuite.',
      },
      {
        question: 'Dois-je me d\u00e9placer dans vos bureaux ?',
        answer:
          'Non, notre organisation 100 % digitale vous permet d\'interagir avec nous \u00e0 distance. Cela dit, nous sommes bas\u00e9s en Normandie et un rendez-vous physique reste toujours possible si vous le pr\u00e9f\u00e9rez.',
      },
    ],
    relatedLinks: [
      { label: 'Conseil fiscal & Optimisation', to: '/fiscalite' },
      { label: 'Gestion sociale & Paie', to: '/gestion-sociale-paie' },
      { label: 'Expert-comptable \u00e0 Caen', to: '/expert-comptable-caen' },
      { label: 'Expert-comptable \u00e0 Rouen', to: '/expert-comptable-rouen' },
    ],
  },

  fiscalite: {
    slug: 'fiscalite',
    metaTitle: 'Conseil Fiscal & Optimisation Fiscale | Cabinet Drakar Normandie',
    metaDescription:
      'R\u00e9duisez votre charge fiscale l\u00e9galement avec Drakar Expert Comptable en Normandie. Optimisation fiscale, choix du r\u00e9gime, cr\u00e9dits d\'imp\u00f4t pour TPE et PME. Devis gratuit.',
    h1: 'Conseil fiscal et optimisation fiscale pour les entreprises en Normandie',
    intro:
      'La fiscalit\u00e9 des entreprises est un levier puissant, souvent sous-exploit\u00e9. Le cabinet Drakar Expert Comptable vous accompagne dans une strat\u00e9gie fiscale sur mesure : choix du bon r\u00e9gime d\'imposition, exploitation de tous les cr\u00e9dits d\'imp\u00f4t, optimisation de la r\u00e9mun\u00e9ration du dirigeant. L\'objectif : payer le juste imp\u00f4t, pas un centime de plus.',
    sections: [
      {
        title: 'Pourquoi l\'optimisation fiscale est-elle indispensable pour votre entreprise ?',
        content:
          'Beaucoup de dirigeants paient trop d\'imp\u00f4ts, non par manque de revenus, mais par manque d\'accompagnement. Une strat\u00e9gie fiscale bien construite peut repr\u00e9senter plusieurs milliers d\'euros d\'\u00e9conomies annuelles, sans aucune irr\u00e9gularit\u00e9. Voici pourquoi faire appel \u00e0 un expert-comptable sp\u00e9cialis\u00e9 en fiscalit\u00e9 est un investissement rentable :',
        list: [
          'Chaque euro \u00e9conomis\u00e9 l\u00e9galement est un euro r\u00e9investi dans votre d\u00e9veloppement',
          'La r\u00e9glementation fiscale \u00e9volue chaque ann\u00e9e : un expert vous tient inform\u00e9 des nouvelles opportunit\u00e9s',
          'Un dossier fiscal bien document\u00e9 limite les risques en cas de contr\u00f4le',
          'L\'optimisation se construit sur le long terme : anticiper vaut mieux que subir',
        ],
      },
      {
        title: 'Nos missions de conseil fiscal : comment \u00e7a marche',
        subSections: [
          {
            title: '1. Diagnostic fiscal initial',
            content:
              'Nous commen\u00e7ons par un audit de votre situation actuelle : forme juridique, r\u00e9gime d\'imposition, structure de r\u00e9mun\u00e9ration, d\u00e9penses d\u00e9ductibles non exploit\u00e9es, cr\u00e9dits d\'imp\u00f4t potentiels. Ce diagnostic de 1 \u00e0 2 heures identifie les premi\u00e8res pistes d\'optimisation imm\u00e9diates.',
          },
          {
            title: '2. Choix et optimisation du r\u00e9gime d\'imposition',
            content:
              'IS ou IR ? R\u00e9el simplifi\u00e9 ou r\u00e9el normal ? Micro-entreprise ou r\u00e9gime de droit commun ? Le bon r\u00e9gime d\u00e9pend de votre activit\u00e9, de votre niveau de revenus et de votre strat\u00e9gie patrimoniale. Nous simulons chaque sc\u00e9nario chiffr\u00e9 avant toute d\u00e9cision.',
          },
          {
            title: '3. Exploitation des cr\u00e9dits et r\u00e9ductions d\'imp\u00f4t',
            content:
              'De nombreux dispositifs fiscaux sont m\u00e9connus ou sous-utilis\u00e9s par les PME normandes : CIR (Cr\u00e9dit Imp\u00f4t Recherche) jusqu\'\u00e0 30 % des d\u00e9penses R&D \u00e9ligibles, CII (Cr\u00e9dit Imp\u00f4t Innovation) pour les PME innovantes, Cr\u00e9dit d\'imp\u00f4t apprentissage et formation, Dispositifs ZFU, ZRR, QPV selon votre localisation en Normandie, Amortissement acc\u00e9l\u00e9r\u00e9 du mat\u00e9riel professionnel.',
          },
          {
            title: '4. Optimisation de la r\u00e9mun\u00e9ration du dirigeant',
            content:
              'Dividendes ou salaire ? La question est centrale pour tout dirigeant de SARL, SAS ou EURL. Nous mod\u00e9lisons l\'arbitrage optimal en tenant compte de votre taux marginal d\'imposition, de vos cotisations sociales (statut TNS ou assimil\u00e9-salari\u00e9) et de vos objectifs patrimoniaux.',
          },
          {
            title: '5. Transmission et restructuration',
            content:
              'Anticipation de la transmission d\'entreprise, apport-cession, holding patrimoniale, Pacte Dutreil : nous structurons votre patrimoine professionnel en amont pour minimiser l\'impact fiscal des grandes \u00e9tapes de vie de votre entreprise.',
          },
        ],
      },
      {
        title: 'Ce que vous obtenez avec notre mission fiscale',
        list: [
          'Un plan fiscal personnalis\u00e9 mis \u00e0 jour chaque ann\u00e9e',
          'Des simulations chiffr\u00e9es avant chaque d\u00e9cision importante',
          'Une veille continue sur les \u00e9volutions l\u00e9gislatives qui vous concernent',
          'Un dossier fiscal document\u00e9 et d\u00e9fendable en cas de contr\u00f4le',
          'Des \u00e9conomies concr\u00e8tes et l\u00e9gales, sans prise de risque',
        ],
      },
      {
        title: 'Qui peut b\u00e9n\u00e9ficier de notre conseil en optimisation fiscale ?',
        list: [
          'Dirigeants de SARL, SAS, EURL et SA souhaitant optimiser leur r\u00e9mun\u00e9ration',
          'Entrepreneurs individuels et professions lib\u00e9rales (IR/IS)',
          'PME investissant dans la R&D ou l\'innovation',
          'Investisseurs immobiliers (SCI \u00e0 l\'IS, LMNP, LMP)',
          'Entreprises en phase de croissance, de cession ou de transmission',
        ],
      },
    ],
    faq: [
      {
        question: 'Quelle est la diff\u00e9rence entre \u00e9vasion fiscale et optimisation fiscale ?',
        answer:
          'L\'optimisation fiscale (ou planification fiscale) consiste \u00e0 utiliser l\u00e9galement tous les dispositifs pr\u00e9vus par la loi pour r\u00e9duire sa charge d\'imposition. Elle est parfaitement l\u00e9gale et encourag\u00e9e. L\'\u00e9vasion fiscale, \u00e0 l\'inverse, consiste \u00e0 contourner ill\u00e9galement la loi. Chez Drakar, nous pratiquons exclusivement l\'optimisation dans le strict cadre l\u00e9gal.',
      },
      {
        question: 'Puis-je passer \u00e0 l\'IS si je suis en nom propre ?',
        answer:
          'Oui, sous certaines conditions. Un entrepreneur individuel peut opter pour l\'assimilation \u00e0 l\'EURL et ainsi \u00eatre soumis \u00e0 l\'IS. Cette d\u00e9cision doit \u00eatre analys\u00e9e en fonction de votre situation personnelle, de vos revenus et de vos projets. Nous r\u00e9alisons une simulation compl\u00e8te avant toute option irr\u00e9vocable.',
      },
      {
        question: 'Comment savoir si je b\u00e9n\u00e9ficie du Cr\u00e9dit Imp\u00f4t Recherche ?',
        answer:
          'Le CIR est accessible \u00e0 toute entreprise r\u00e9alisant des d\u00e9penses de R&D (prototypes, projets d\'innovation, brevets, travaux de recherche\u2026). De nombreuses PME \u00e9ligibles n\'en b\u00e9n\u00e9ficient pas faute d\'accompagnement. Nous r\u00e9alisons un audit d\'\u00e9ligibilit\u00e9 gratuit lors de votre premier rendez-vous.',
      },
      {
        question: 'L\'optimisation fiscale est-elle risqu\u00e9e en cas de contr\u00f4le ?',
        answer:
          'Toute optimisation r\u00e9alis\u00e9e par notre cabinet est document\u00e9e, justifiable et bas\u00e9e sur des textes de loi explicites. Nous constituons un dossier de justification complet. Si vous faites l\'objet d\'un contr\u00f4le fiscal, nous vous assistons \u00e0 chaque \u00e9tape de la proc\u00e9dure.',
      },
    ],
    relatedLinks: [
      { label: 'Tenue de comptabilit\u00e9 & Bilan', to: '/comptabilite' },
      { label: 'Gestion de patrimoine', to: '/gestion-patrimoine' },
      { label: 'Expert-comptable \u00e0 Caen', to: '/expert-comptable-caen' },
      { label: 'Expert-comptable \u00e0 Rouen', to: '/expert-comptable-rouen' },
    ],
  },

  'conseil-gestion': {
    slug: 'conseil-gestion',
    metaTitle: 'Conseil en Gestion & Pilotage d\'Entreprise | Cabinet Drakar Normandie',
    metaDescription:
      'Pilotez votre entreprise avec des tableaux de bord sur mesure. Cabinet Drakar Expert Comptable en Normandie : contr\u00f4le de gestion, budget, KPI dirigeant. Devis gratuit.',
    h1: 'Conseil en gestion et pilotage financier pour les dirigeants de PME en Normandie',
    intro:
      'Bien g\u00e9rer une entreprise ne se r\u00e9sume pas \u00e0 tenir une comptabilit\u00e9 correcte. C\'est aussi piloter l\'activit\u00e9 avec des indicateurs pertinents, anticiper les tensions de tr\u00e9sorerie, comprendre sa rentabilit\u00e9 par activit\u00e9 et prendre des d\u00e9cisions \u00e9clair\u00e9es. Le cabinet Drakar Expert Comptable vous accompagne dans la mise en place d\'un v\u00e9ritable pilotage de gestion adapt\u00e9 \u00e0 votre entreprise normande.',
    sections: [
      {
        title: 'Pourquoi mettre en place un pilotage de gestion dans votre entreprise ?',
        content:
          'La comptabilit\u00e9 l\u00e9gale vous dit ce qui s\'est pass\u00e9. Le contr\u00f4le de gestion vous dit pourquoi et vous aide \u00e0 d\u00e9cider ce que vous allez faire. Pour un dirigeant de PME, disposer de tableaux de bord fiables change tout :',
        list: [
          'Vous prenez des d\u00e9cisions bas\u00e9es sur des donn\u00e9es r\u00e9elles, pas sur des impressions',
          'Vous anticipez les probl\u00e8mes de tr\u00e9sorerie avant qu\'ils deviennent des crises',
          'Vous identifiez vos produits, clients ou march\u00e9s les plus rentables',
          'Vous fixez des objectifs r\u00e9alistes et mesurez votre progression',
          'Vous \u00eates plus convaincant aupr\u00e8s de vos banques et investisseurs',
        ],
      },
      {
        title: 'Nos missions de conseil en gestion',
        subSections: [
          {
            title: '1. Mise en place de tableaux de bord dirigeant',
            content:
              'Nous construisons avec vous un tableau de bord mensuel (ou hebdomadaire selon votre activit\u00e9) synth\u00e9tisant vos indicateurs cl\u00e9s de performance : chiffre d\'affaires r\u00e9alis\u00e9 vs objectif, marge brute par activit\u00e9, \u00e9volution des charges, besoin en fonds de roulement, tr\u00e9sorerie disponible. Simple, visuel, actionnable.',
          },
          {
            title: '2. Analyse de rentabilit\u00e9 par produit, service ou client',
            content:
              'Certaines activit\u00e9s vous font perdre de l\'argent sans que vous le sachiez. Nous r\u00e9alisons une analyse de contribution par segment (produit, march\u00e9, client, point de vente) pour identifier vos vrais leviers de rentabilit\u00e9 et les activit\u00e9s \u00e0 d\u00e9velopper, restructurer ou abandonner.',
          },
          {
            title: '3. Budget et pr\u00e9visionnel financier',
            content:
              'Nous \u00e9laborons votre budget annuel en collaboration avec vous : objectifs de chiffre d\'affaires, planification des charges, investissements pr\u00e9vus, besoin de financement. Chaque mois, nous suivons les \u00e9carts budget/r\u00e9alis\u00e9 et analysons les causes pour ajuster le cap.',
          },
          {
            title: '4. Gestion et pr\u00e9vision de tr\u00e9sorerie',
            content:
              'La tr\u00e9sorerie est le nerf de la guerre. Nous mettons en place un plan de tr\u00e9sorerie glissant \u00e0 3 ou 6 mois, identifiant les pics et creux pr\u00e9visibles, les besoins de financement \u00e0 court terme et les leviers d\'optimisation (escompte, affacturage, d\u00e9lais fournisseurs).',
          },
          {
            title: '5. Accompagnement aux d\u00e9cisions strat\u00e9giques',
            content:
              'Recruter un collaborateur, ouvrir un deuxi\u00e8me site, lancer un nouveau produit, acqu\u00e9rir un concurrent : toute d\u00e9cision importante m\u00e9rite une mod\u00e9lisation financi\u00e8re. Nous simulons l\'impact de vos projets sur votre rentabilit\u00e9, votre tr\u00e9sorerie et votre valorisation pour que vous d\u00e9cidiez en connaissance de cause.',
          },
        ],
      },
      {
        title: 'Ce que vous obtenez avec notre mission conseil en gestion',
        list: [
          'Un tableau de bord mensuel clair, disponible en quelques clics',
          'Des analyses de rentabilit\u00e9 par activit\u00e9, actualis\u00e9es \u00e0 chaque p\u00e9riode',
          'Un budget annuel suivi et ajust\u00e9 chaque mois',
          'Des alertes sur vos indicateurs critiques (tr\u00e9sorerie, DSO, marge\u2026)',
          'Un cabinet qui parle le langage du dirigeant, pas seulement celui du comptable',
        ],
      },
    ],
    faq: [
      {
        question: 'En quoi le conseil en gestion est-il diff\u00e9rent de la comptabilit\u00e9 ?',
        answer:
          'La comptabilit\u00e9 est obligatoire, tourn\u00e9e vers le pass\u00e9 et destin\u00e9e \u00e0 produire des \u00e9tats l\u00e9gaux. Le conseil en gestion est tourn\u00e9 vers l\'avenir et l\'aide \u00e0 la d\u00e9cision : budgets, pr\u00e9visions, analyses de rentabilit\u00e9, tableaux de bord. Les deux sont compl\u00e9mentaires. Chez Drakar, nous les int\u00e9grons naturellement dans une mission globale.',
      },
      {
        question: 'Mon entreprise est-elle trop petite pour b\u00e9n\u00e9ficier du contr\u00f4le de gestion ?',
        answer:
          'Non. Un tableau de bord simple et bien construit est utile d\u00e8s 5 salari\u00e9s ou d\u00e8s que vous atteignez quelques centaines de milliers d\'euros de chiffre d\'affaires. Nous adaptons le niveau de complexit\u00e9 et le co\u00fbt de la mission \u00e0 la taille de votre structure. L\'essentiel est d\'avoir les bons indicateurs, m\u00eame peu nombreux.',
      },
      {
        question: 'Comment acc\u00e9der \u00e0 mon tableau de bord au quotidien ?',
        answer:
          'Via notre espace client digital ou directement depuis Pennylane selon votre configuration. Vos tableaux de bord sont disponibles \u00e0 tout moment, depuis votre ordinateur ou votre mobile. Nous les actualisons apr\u00e8s chaque arr\u00eat\u00e9 comptable mensuel.',
      },
    ],
    relatedLinks: [
      { label: 'Tenue de comptabilit\u00e9 & Bilan', to: '/comptabilite' },
      { label: 'Conseil fiscal & Optimisation', to: '/fiscalite' },
      { label: 'Expert-comptable \u00e0 Caen', to: '/expert-comptable-caen' },
    ],
  },

  'gestion-sociale-paie': {
    slug: 'gestion-sociale-paie',
    metaTitle: 'Gestion Sociale & Paie externalis\u00e9e | Cabinet Drakar Normandie',
    metaDescription:
      'Externalisez votre paie et gestion sociale en Normandie avec Drakar Expert Comptable. Bulletins de paie, DSN, contrats de travail. Conformit\u00e9 garantie. Devis gratuit.',
    h1: 'Externalisation de la paie et gestion sociale pour les entreprises en Normandie',
    intro:
      'La gestion de la paie est l\'une des missions les plus complexes et les plus \u00e0 risque pour une entreprise : erreurs de calcul, retards de d\u00e9claration, contentieux prud\'homaux\u2026 Le cabinet Drakar Expert Comptable prend en charge l\'int\u00e9gralit\u00e9 de votre gestion sociale et paie, avec rigueur et r\u00e9activit\u00e9, pour que vous soyez toujours en conformit\u00e9.',
    sections: [
      {
        title: 'Pourquoi externaliser votre paie \u00e0 un cabinet expert-comptable ?',
        content:
          'La paie en France compte parmi les plus complexes d\'Europe : conventions collectives, pr\u00e9l\u00e8vement \u00e0 la source, DSN mensuelle, gestion des absences, des cong\u00e9s pay\u00e9s, des arr\u00eats maladie\u2026 Les erreurs sont fr\u00e9quentes et souvent co\u00fbteuses. Externaliser cette mission, c\'est :',
        list: [
          'S\u00e9curiser vos pratiques RH et \u00e9viter tout risque de redressement URSSAF',
          'Lib\u00e9rer du temps pour vos \u00e9quipes en supprimant une t\u00e2che chronophage',
          'B\u00e9n\u00e9ficier d\'une veille sociale permanente int\u00e9gr\u00e9e \u00e0 votre gestion',
          'R\u00e9duire vos co\u00fbts en comparaison d\'un gestionnaire paie interne',
        ],
      },
      {
        title: 'Notre mission paie et gestion sociale : \u00e9tapes et process',
        subSections: [
          {
            title: '1. Collecte mensuelle des variables de paie',
            content:
              'Chaque mois, vous nous transmettez vos \u00e9l\u00e9ments variables (heures suppl\u00e9mentaires, primes, absences, arr\u00eats maladie, entr\u00e9es et sorties) via notre interface digitale s\u00e9curis\u00e9e. Nous int\u00e9grons ces \u00e9l\u00e9ments dans notre logiciel de paie Silae, r\u00e9f\u00e9rence du march\u00e9.',
          },
          {
            title: '2. \u00c9tablissement des bulletins de paie',
            content:
              'Nous calculons les bulletins de paie en appliquant scrupuleusement votre convention collective, les taux de cotisations sociales en vigueur et le pr\u00e9l\u00e8vement \u00e0 la source. Chaque bulletin est v\u00e9rifi\u00e9 avant envoi. Vos salari\u00e9s re\u00e7oivent leur bulletin au format papier ou \u00e9lectronique.',
          },
          {
            title: '3. D\u00e9claration Sociale Nominative (DSN) mensuelle',
            content:
              'La DSN est la d\u00e9claration unique qui remplace l\'ensemble des d\u00e9clarations sociales. Nous la pr\u00e9parons et la t\u00e9l\u00e9transmettons avant le 5 ou le 15 du mois suivant (selon votre effectif), \u00e9vitant p\u00e9nalit\u00e9s de retard et majorations.',
          },
          {
            title: '4. Gestion des entr\u00e9es et sorties de personnel',
            content:
              'R\u00e9daction et v\u00e9rification des contrats de travail, DPAE (d\u00e9claration pr\u00e9alable \u00e0 l\'embauche), soldes de tout compte, attestations France Travail (anciennement P\u00f4le emploi) : nous g\u00e9rons chaque \u00e9v\u00e9nement RH de mani\u00e8re s\u00e9curis\u00e9e et conforme.',
          },
          {
            title: '5. Conseil en droit social',
            content:
              'Au-del\u00e0 de la paie, nous vous conseillons sur vos obligations l\u00e9gales en mati\u00e8re de droit du travail : dur\u00e9e l\u00e9gale du travail, cong\u00e9s pay\u00e9s, gestion des arr\u00eats maladie, licenciements, ruptures conventionnelles, mise en place du CSE. En cas de litige, nous vous orientons vers les bons professionnels.',
          },
        ],
      },
      {
        title: 'Outil utilis\u00e9 : Silae, leader de la paie en France',
        content:
          'Silae est le logiciel de paie le plus utilis\u00e9 par les experts-comptables fran\u00e7ais, reconnu pour sa fiabilit\u00e9 et sa mise \u00e0 jour automatique des conventions collectives. En choisissant Drakar, vous b\u00e9n\u00e9ficiez d\'un outil professionnel sans investissement de votre part.',
      },
      {
        title: 'Ce que vous obtenez avec notre mission sociale et paie',
        list: [
          'Bulletins de paie conformes et remis dans les d\u00e9lais chaque mois',
          'DSN mensuelles transmises sans retard, sans risque de p\u00e9nalit\u00e9s URSSAF',
          'Contrats de travail et documents RH r\u00e9dig\u00e9s et v\u00e9rifi\u00e9s',
          'Accompagnement lors des contr\u00f4les URSSAF ou des contentieux prud\'homaux',
          'Tableau de bord des charges sociales pour anticiper votre tr\u00e9sorerie',
        ],
      },
      {
        title: 'Qui est concern\u00e9 par notre mission paie et gestion sociale ?',
        list: [
          'TPE de 1 \u00e0 9 salari\u00e9s souhaitant externaliser cette mission sans embaucher un RH',
          'PME de 10 \u00e0 250 salari\u00e9s cherchant fiabilit\u00e9 et conformit\u00e9',
          'Associations employeuses',
          'Professions lib\u00e9rales embauchant du personnel assistant',
          'Restaurateurs, artisans BTP et commerces avec des \u00e9quipes saisonni\u00e8res',
        ],
      },
    ],
    faq: [
      {
        question: 'Que signifie DSN et pourquoi est-ce important ?',
        answer:
          'La D\u00e9claration Sociale Nominative (DSN) est le dispositif l\u00e9gal qui centralise toutes les d\u00e9clarations sociales de l\'employeur en un seul flux mensuel. Elle est obligatoire pour tous les employeurs. Toute erreur ou retard peut entra\u00eener des p\u00e9nalit\u00e9s de l\'URSSAF. Notre cabinet en assure la production et la transmission dans les d\u00e9lais r\u00e9glementaires.',
      },
      {
        question: 'Combien de temps faut-il pour mettre en place l\'externalisation de la paie ?',
        answer:
          'La reprise d\'un dossier paie prend g\u00e9n\u00e9ralement 2 \u00e0 4 semaines, le temps de r\u00e9cup\u00e9rer l\'historique, de param\u00e9trer les profils salari\u00e9s et de v\u00e9rifier la conformit\u00e9 des bulletins pr\u00e9c\u00e9dents. Cette transition est enti\u00e8rement g\u00e9r\u00e9e par notre \u00e9quipe.',
      },
      {
        question: 'G\u00e9rez-vous les conventions collectives sp\u00e9cifiques \u00e0 notre secteur ?',
        answer:
          'Oui. Nous ma\u00eetrisons les principales conventions collectives applicables en Normandie : BTP, CHR (restauration/h\u00f4tellerie), m\u00e9dical, commerce de d\u00e9tail, transport, bureaux d\'\u00e9tudes\u2026 Notre logiciel Silae est mis \u00e0 jour automatiquement lors de chaque r\u00e9vision conventionnelle.',
      },
      {
        question: 'Puis-je continuer \u00e0 g\u00e9rer moi-m\u00eame certains \u00e9l\u00e9ments de la paie ?',
        answer:
          'Absolument. Nous adaptons la mission \u00e0 votre organisation. Certains clients pr\u00e9f\u00e8rent conserver la relation directe avec leurs salari\u00e9s et nous transmettent simplement les variables de paie. D\'autres nous d\u00e9l\u00e8guent l\'int\u00e9gralit\u00e9 des \u00e9changes RH. Nous construisons la solution qui vous correspond.',
      },
    ],
    relatedLinks: [
      { label: 'Tenue de comptabilit\u00e9 & Bilan', to: '/comptabilite' },
      { label: 'Accompagnement juridique', to: '/conseil-juridique' },
      { label: 'Expert-comptable \u00e0 Caen', to: '/expert-comptable-caen' },
      { label: 'Expert-comptable au Havre', to: '/expert-comptable-le-havre' },
    ],
  },

  'conseil-juridique': {
    slug: 'conseil-juridique',
    metaTitle: 'Accompagnement Juridique des Entreprises | Cabinet Drakar Normandie',
    metaDescription:
      'Le cabinet Drakar vous accompagne dans toutes vos d\u00e9marches juridiques en Normandie : r\u00e9daction de statuts, assembl\u00e9es g\u00e9n\u00e9rales, modifications de soci\u00e9t\u00e9. Devis gratuit.',
    h1: 'Accompagnement juridique des entreprises en Normandie',
    intro:
      'La vie d\'une entreprise g\u00e9n\u00e8re r\u00e9guli\u00e8rement des actes juridiques obligatoires ou strat\u00e9giques : modification des statuts, changement de g\u00e9rant, augmentation de capital, transfert de si\u00e8ge, approbation des comptes annuels\u2026 Le cabinet Drakar Expert Comptable vous assiste dans l\'ensemble de ces d\u00e9marches, en collaboration avec nos juristes partenaires, pour s\u00e9curiser chaque \u00e9tape de la vie de votre soci\u00e9t\u00e9.',
    sections: [
      {
        title: 'Pourquoi confier vos d\u00e9marches juridiques \u00e0 votre expert-comptable ?',
        content:
          'L\'expert-comptable est l\'interlocuteur privil\u00e9gi\u00e9 du dirigeant pour les actes juridiques courants. Il conna\u00eet votre structure, votre historique et vos enjeux. Faire appel \u00e0 Drakar pour vos besoins juridiques, c\'est b\u00e9n\u00e9ficier d\'une vision globale, d\'une rapidit\u00e9 d\'ex\u00e9cution et d\'une coordination naturelle avec votre comptabilit\u00e9 et votre fiscalit\u00e9.',
      },
      {
        title: 'Nos missions d\'accompagnement juridique',
        subSections: [
          {
            title: '1. R\u00e9daction et modification des statuts',
            content:
              'Lors de la cr\u00e9ation ou en cours de vie sociale, vos statuts peuvent n\u00e9cessiter des modifications : changement d\'objet social, transformation de la forme juridique (SARL en SAS, EURL en SASU\u2026), entr\u00e9e d\'un nouvel associ\u00e9, modification des r\u00e8gles de gouvernance. Nous r\u00e9digeons ou modifions vos statuts en veillant \u00e0 ce qu\'ils correspondent \u00e0 votre r\u00e9alit\u00e9 et \u00e0 vos objectifs.',
          },
          {
            title: '2. Assembl\u00e9es g\u00e9n\u00e9rales annuelles et extraordinaires',
            content:
              'L\'approbation des comptes annuels est une obligation l\u00e9gale annuelle pour toutes les soci\u00e9t\u00e9s. Nous pr\u00e9parons l\'int\u00e9gralit\u00e9 du dossier d\'AGO : rapport de gestion, rapport du commissaire aux comptes le cas \u00e9ch\u00e9ant, proc\u00e8s-verbal, feuille de pr\u00e9sence. En cas d\'AGE (d\u00e9cisions extraordinaires), nous vous conseillons sur les conditions de quorum et de majorit\u00e9 \u00e0 respecter.',
          },
          {
            title: '3. Cessions et transferts de parts sociales ou d\'actions',
            content:
              'Vous souhaitez c\u00e9der des parts de votre soci\u00e9t\u00e9, accueillir un nouvel associ\u00e9 ou r\u00e9organiser votre actionnariat ? Nous r\u00e9alisons la valorisation des parts, r\u00e9digeons le protocole de cession et l\'acte de cession, et accompagnons les formalit\u00e9s d\'enregistrement et de publication.',
          },
          {
            title: '4. Transfert de si\u00e8ge social et autres modifications',
            content:
              'Changement d\'adresse, changement de d\u00e9nomination sociale, ouverture d\'un \u00e9tablissement secondaire, radiation\u2026 Toutes ces modifications n\u00e9cessitent des formalit\u00e9s au greffe et une publication dans un journal d\'annonces l\u00e9gales. Nous g\u00e9rons l\'int\u00e9gralit\u00e9 de ces d\u00e9marches pour vous.',
          },
          {
            title: '5. Augmentation et r\u00e9duction de capital',
            content:
              'Vous souhaitez renforcer les fonds propres de votre soci\u00e9t\u00e9 ou accueillir de nouveaux investisseurs ? Nous vous accompagnons dans la structuration de l\'op\u00e9ration, la r\u00e9daction des actes et les formalit\u00e9s l\u00e9gales associ\u00e9es, en coordination avec votre avocat si n\u00e9cessaire.',
          },
        ],
      },
      {
        title: 'Ce que vous obtenez avec notre mission juridique',
        list: [
          'Des actes juridiques conformes et enregistr\u00e9s dans les d\u00e9lais',
          'Une coordination avec votre comptabilit\u00e9 (impact bilan des modifications de capital)',
          'Un acc\u00e8s \u00e0 un r\u00e9seau de juristes et avocats partenaires pour les situations complexes',
          'Une r\u00e9activit\u00e9 sur les d\u00e9marches urgentes (cession, transformation)',
        ],
      },
    ],
    faq: [
      {
        question: 'L\'expert-comptable peut-il r\u00e9diger mes statuts ou dois-je passer par un avocat ?',
        answer:
          'L\'expert-comptable est habilit\u00e9 \u00e0 r\u00e9diger les statuts pour les formes societaires courantes (SARL, SAS, EURL, SASU, SNC). Pour des situations plus complexes (pacte d\'actionnaires, LBO, transmission), nous travaillons en collaboration avec des avocats sp\u00e9cialis\u00e9s partenaires du cabinet, garantissant une approche \u00e0 la fois comptable, fiscale et juridique.',
      },
      {
        question: 'Quelles sont les modifications statutaires \u00e0 publier dans un journal d\'annonces l\u00e9gales ?',
        answer:
          'Toute modification des mentions figurant au registre du commerce (d\u00e9nomination, adresse, g\u00e9rant, objet social, capital\u2026) doit faire l\'objet d\'une publication dans un journal habilit\u00e9 et d\'un d\u00e9p\u00f4t au greffe. Nous g\u00e9rons ces formalit\u00e9s de bout en bout, y compris la r\u00e9daction de l\'annonce l\u00e9gale.',
      },
      {
        question: 'Dois-je tenir une AGO chaque ann\u00e9e m\u00eame si je suis seul associ\u00e9 ?',
        answer:
          'Oui, pour une SARL (m\u00eame EURL) et une SA, l\'approbation annuelle des comptes par l\'associ\u00e9 unique est l\u00e9galement obligatoire, m\u00eame si vous \u00eates seul. Pour une SAS unipersonnelle (SASU), c\'est \u00e9galement requis. Le d\u00e9faut d\'approbation peut entra\u00eener des sanctions. Notre cabinet g\u00e8re l\'int\u00e9gralit\u00e9 de cette proc\u00e9dure chaque ann\u00e9e.',
      },
    ],
    relatedLinks: [
      { label: 'Cr\u00e9ation & Reprise d\'entreprise', to: '/creation-reprise-entreprise' },
      { label: 'Commissariat aux comptes', to: '/commissariat-aux-comptes' },
      { label: 'Expert-comptable \u00e0 Caen', to: '/expert-comptable-caen' },
      { label: 'Expert-comptable \u00e0 Rouen', to: '/expert-comptable-rouen' },
    ],
  },

  'creation-reprise-entreprise': {
    slug: 'creation-reprise-entreprise',
    metaTitle: 'Cr\u00e9ation & Reprise d\'Entreprise en Normandie | Cabinet Drakar',
    metaDescription:
      'Cr\u00e9ez ou reprenez votre entreprise en Normandie avec l\'accompagnement de Drakar Expert Comptable : choix du statut, business plan, pr\u00e9visionnel financier. Devis gratuit.',
    h1: 'Accompagnement \u00e0 la cr\u00e9ation et reprise d\'entreprise en Normandie',
    intro:
      'Vous avez un projet d\'entreprise en Normandie ? Le cabinet Drakar Expert Comptable est votre partenaire de confiance d\u00e8s la premi\u00e8re \u00e9tape. Nous vous guidons de l\'id\u00e9e \u00e0 l\'immatriculation, et bien au-del\u00e0 : choix du statut juridique, business plan, pr\u00e9visionnel financier, optimisation fiscale au d\u00e9marrage. Parce qu\'un bon d\u00e9part est la meilleure garantie de succ\u00e8s.',
    sections: [
      {
        title: 'Pourquoi se faire accompagner pour cr\u00e9er ou reprendre son entreprise ?',
        content:
          'Cr\u00e9er une entreprise sans accompagnement, c\'est naviguer \u00e0 vue dans un environnement juridique, fiscal et social complexe. Les erreurs de d\u00e9part (mauvais statut, capitalisation insuffisante, oubli de formalit\u00e9s) peuvent co\u00fbter tr\u00e8s cher. Avec Drakar :',
        list: [
          'Vous choisissez le statut juridique optimal d\u00e8s le d\u00e9part, sans devoir restructurer deux ans plus tard',
          'Vous disposez d\'un pr\u00e9visionnel financier solide, indispensable pour convaincre vos banques et investisseurs',
          'Vous \u00e9vitez les erreurs classiques des cr\u00e9ateurs non accompagn\u00e9s',
          'Vous b\u00e9n\u00e9ficiez d\'une optimisation fiscale et sociale d\u00e8s le premier jour',
        ],
      },
      {
        title: 'Notre accompagnement cr\u00e9ation d\'entreprise : \u00e9tapes d\u00e9taill\u00e9es',
        subSections: [
          {
            title: '1. Analyse du projet et choix du statut juridique',
            content:
              'Micro-entreprise, EURL, SARL, SAS, SASU, SCI\u2026 Chaque statut a ses avantages et ses contraintes fiscales, sociales et juridiques. Nous analysons votre projet, votre niveau d\'activit\u00e9 pr\u00e9vu, votre situation personnelle et familiale, puis simulons les charges et la fiscalit\u00e9 de chaque option pour vous recommander la forme la plus adapt\u00e9e.',
          },
          {
            title: '2. \u00c9laboration du business plan et du pr\u00e9visionnel financier',
            content:
              'Nous construisons avec vous un business plan professionnel incluant : description du mod\u00e8le \u00e9conomique, analyse du march\u00e9 normand, compte de r\u00e9sultat pr\u00e9visionnel sur 3 ans, plan de tr\u00e9sorerie mensuel, plan de financement (apports, emprunts, aides). Ce document est directement pr\u00e9sentable \u00e0 votre banque ou \u00e0 Bpifrance.',
          },
          {
            title: '3. Recherche de financements et aides',
            content:
              'La Normandie dispose de dispositifs d\'aide sp\u00e9cifiques \u00e0 la cr\u00e9ation d\'entreprise. Nous vous orientons vers les aides auxquelles vous pouvez pr\u00e9tendre : NACRE, ARCE / ARE maintien pour les demandeurs d\'emploi, Aides r\u00e9gionales Normandie et pr\u00eats d\'honneur Initiative Normandie, Pr\u00eats BPI France pour l\'innovation ou la cr\u00e9ation, Exon\u00e9rations ACRE (cotisations sociales premi\u00e8re ann\u00e9e).',
          },
          {
            title: '4. Formalit\u00e9s d\'immatriculation et r\u00e9daction des statuts',
            content:
              'Nous r\u00e9digeons vos statuts constitutifs (notamment pour les soci\u00e9t\u00e9s), pr\u00e9parons le dossier d\'immatriculation sur le Guichet Unique et suivons l\'obtention du KBIS. Pour une SARL ou une SAS, nous veillons \u00e0 ce que les clauses statutaires prot\u00e8gent vos int\u00e9r\u00eats d\u00e8s le d\u00e9part.',
          },
          {
            title: '5. Mise en place de la structure comptable et fiscale',
            content:
              'Une fois immatricul\u00e9, nous configurons votre environnement comptable, param\u00e9trons vos obligations fiscales (option TVA, r\u00e9gime d\'imposition) et vous formons \u00e0 l\'utilisation de nos outils digitaux. Vous d\u00e9marrez votre activit\u00e9 sur des bases solides.',
          },
        ],
      },
      {
        title: 'Notre accompagnement reprise d\'entreprise',
        content:
          'Reprendre une entreprise est un projet complexe qui n\u00e9cessite une due diligence approfondie. Nous intervenons \u00e0 chaque \u00e9tape :',
        list: [
          'Audit d\'acquisition : analyse des comptes, des dettes, des risques cach\u00e9s (fiscal, social, juridique)',
          'Valorisation de l\'entreprise cible : m\u00e9thodes patrimoniale, DCF, comparables sectoriels',
          'Montage du financement et structuration de la reprise (LBO, holding de reprise)',
          'Accompagnement post-acquisition : int\u00e9gration comptable, optimisation de la structure',
        ],
      },
      {
        title: 'Ce que vous obtenez avec notre mission cr\u00e9ation/reprise',
        list: [
          'Un choix de statut juridique motiv\u00e9 et document\u00e9',
          'Un business plan professionnel finan\u00e7able',
          'Des statuts sur mesure r\u00e9dig\u00e9s par nos juristes partenaires',
          'Un KBIS obtenu dans les d\u00e9lais',
          'Un cabinet comptable qui vous accompagne bien au-del\u00e0 de la cr\u00e9ation',
        ],
      },
    ],
    faq: [
      {
        question: 'Quelle est la diff\u00e9rence entre une SARL et une SAS ?',
        answer:
          'La SARL (Soci\u00e9t\u00e9 \u00e0 Responsabilit\u00e9 Limit\u00e9e) est une forme plus encadr\u00e9e, avec des r\u00e8gles l\u00e9gales pr\u00e9cises sur la gestion et les d\u00e9cisions. Elle est souvent pr\u00e9f\u00e9r\u00e9e pour les projets artisanaux ou familiaux. La SAS (Soci\u00e9t\u00e9 par Actions Simplifi\u00e9e) offre une grande libert\u00e9 statutaire et est particuli\u00e8rement adapt\u00e9e aux projets de croissance rapide, aux lev\u00e9es de fonds et aux startups. Nous simulons les deux options selon votre projet.',
      },
      {
        question: 'Puis-je cr\u00e9er une entreprise tout en \u00e9tant salari\u00e9 ?',
        answer:
          'Oui, sous r\u00e9serve de v\u00e9rifier que votre contrat de travail ne comporte pas de clause d\'exclusivit\u00e9 ou de non-concurrence. Le statut de micro-entrepreneur est souvent le plus adapt\u00e9 pour d\u00e9buter en parall\u00e8le d\'un emploi salari\u00e9. Nous analysons votre situation personnelle pour s\u00e9curiser votre d\u00e9marche.',
      },
      {
        question: 'Combien de temps faut-il pour cr\u00e9er une soci\u00e9t\u00e9 en Normandie ?',
        answer:
          'Avec notre accompagnement, le d\u00e9lai de cr\u00e9ation d\'une SARL ou SAS est g\u00e9n\u00e9ralement de 10 \u00e0 20 jours ouvr\u00e9s apr\u00e8s validation des statuts. La micro-entreprise peut \u00eatre cr\u00e9\u00e9e en 24 \u00e0 48 heures via le Guichet Unique. Nous g\u00e9rons l\'ensemble des d\u00e9marches pour vous.',
      },
    ],
    relatedLinks: [
      { label: 'Tenue de comptabilit\u00e9 & Bilan', to: '/comptabilite' },
      { label: 'Conseil fiscal & Optimisation', to: '/fiscalite' },
      { label: 'Accompagnement juridique', to: '/conseil-juridique' },
      { label: 'Expert-comptable \u00e0 Caen', to: '/expert-comptable-caen' },
    ],
  },

  'gestion-patrimoine': {
    slug: 'gestion-patrimoine',
    metaTitle: 'Gestion de Patrimoine du Dirigeant | Cabinet Drakar Normandie',
    metaDescription:
      'Optimisez votre patrimoine professionnel et priv\u00e9 avec Drakar Expert Comptable en Normandie. Holding, immobilier, \u00e9pargne retraite TNS. Conseil sur mesure. Devis gratuit.',
    h1: 'Gestion et optimisation du patrimoine du dirigeant en Normandie',
    intro:
      'En tant que dirigeant d\'entreprise, vous \u00eates \u00e0 la fois entrepreneur et particulier. Votre patrimoine professionnel et votre patrimoine priv\u00e9 sont intimement li\u00e9s, et les d\u00e9cisions prises \u00e0 l\'un influencent l\'autre. Le cabinet Drakar Expert Comptable vous accompagne dans une approche globale de gestion patrimoniale, pour construire, prot\u00e9ger et transmettre votre patrimoine en toute s\u00e9r\u00e9nit\u00e9.',
    sections: [
      {
        title: 'Pourquoi les dirigeants doivent anticiper leur strat\u00e9gie patrimoniale ?',
        content:
          'La plupart des chefs d\'entreprise concentrent l\'essentiel de leur patrimoine dans leur soci\u00e9t\u00e9. C\'est \u00e0 la fois une force (levier de valorisation) et un risque (concentration, illiquidit\u00e9). Une strat\u00e9gie patrimoniale bien construite permet de :',
        list: [
          'Diversifier son patrimoine au-del\u00e0 de son outil de travail',
          'Optimiser fiscalement les flux entre l\'entreprise et la sph\u00e8re priv\u00e9e',
          'Pr\u00e9parer sa retraite avec des solutions adapt\u00e9es au statut de TNS',
          'Prot\u00e9ger sa famille (conjoint, enfants) en cas d\'accident de la vie',
          'Anticiper la transmission de l\'entreprise dans les meilleures conditions fiscales',
        ],
      },
      {
        title: 'Nos missions de conseil en gestion de patrimoine',
        subSections: [
          {
            title: '1. Audit patrimonial global',
            content:
              'Nous commen\u00e7ons par un \u00e9tat des lieux complet de votre situation : valeur de votre entreprise, actifs immobiliers (personnels et professionnels), placements financiers, passifs, couvertures sociales et pr\u00e9voyance. Cet audit permet d\'identifier les d\u00e9s\u00e9quilibres, les risques et les opportunit\u00e9s.',
          },
          {
            title: '2. Structuration de la holding patrimoniale',
            content:
              'La holding patrimoniale (souvent une SAS ou SARL holding) est un outil puissant pour les dirigeants souhaitant optimiser la remont\u00e9e de dividendes (r\u00e9gime m\u00e8re-fille \u00e0 5 % d\'IS effectif), s\u00e9curiser des liquidit\u00e9s hors entreprise op\u00e9rationnelle et r\u00e9investir dans de nouveaux projets ou dans l\'immobilier. Nous analysons l\'int\u00e9r\u00eat de cette structure pour votre situation sp\u00e9cifique.',
          },
          {
            title: '3. Investissement immobilier et SCI',
            content:
              'L\'immobilier est un pilier de la diversification patrimoniale des dirigeants. Nous vous conseillons sur la structure optimale (SCI \u00e0 l\'IS ou \u00e0 l\'IR, LMNP, LMP, d\u00e9tention en direct) selon vos objectifs : revenus compl\u00e9mentaires, d\u00e9fiscalisation, transmission. Nous \u00e9tablissons les comptes annuels de vos SCI et vous accompagnons dans les arbitrages.',
          },
          {
            title: '4. \u00c9pargne retraite pour les TNS',
            content:
              'Le statut de travailleur non salari\u00e9 (TNS) offre des solutions d\'\u00e9pargne retraite particuli\u00e8rement avantageuses fiscalement : PER individuel (ex-Madelin), PER collectif, contrats retraite article 83. Nous simulons l\'impact fiscal de vos versements et optimisons les montants \u00e0 cotiser chaque ann\u00e9e en fonction de votre plafond disponible.',
          },
          {
            title: '5. Transmission d\'entreprise et Pacte Dutreil',
            content:
              'La transmission de votre entreprise \u00e0 vos enfants ou \u00e0 des tiers est un \u00e9v\u00e9nement patrimonial majeur. Le Pacte Dutreil permet de b\u00e9n\u00e9ficier d\'une exon\u00e9ration de 75 % de la valeur transmise pour les droits de donation ou succession, sous conditions. Nous structurons la transmission en amont pour maximiser cette exon\u00e9ration et minimiser l\'impact fiscal.',
          },
        ],
      },
      {
        title: 'Ce que vous obtenez avec notre mission gestion de patrimoine',
        list: [
          'Un audit patrimonial complet et une cartographie de votre situation',
          'Des recommandations concr\u00e8tes, chiffr\u00e9es et adapt\u00e9es \u00e0 votre profil',
          'Un suivi annuel de l\'\u00e9volution de votre patrimoine',
          'Une coordination avec votre conseiller en gestion de patrimoine (CGP) si vous en avez un',
          'Une approche globale qui int\u00e8gre l\'entreprise, le fiscal et le priv\u00e9',
        ],
      },
    ],
    faq: [
      {
        question: '\u00c0 partir de quel niveau de revenus est-il pertinent de structurer son patrimoine ?',
        answer:
          'D\u00e8s lors que votre entreprise g\u00e9n\u00e8re une capacit\u00e9 b\u00e9n\u00e9ficiaire r\u00e9guli\u00e8re, m\u00eame modeste, il vaut la peine de structurer sa strat\u00e9gie patrimoniale. Les outils comme le PER individuel sont accessibles et avantageux d\u00e8s les premi\u00e8res ann\u00e9es d\'activit\u00e9. La structuration via holding devient pertinente g\u00e9n\u00e9ralement \u00e0 partir de 150 000 \u00e0 200 000 \u20ac de r\u00e9sultat annuel.',
      },
      {
        question: 'L\'expert-comptable peut-il remplacer un CGP (Conseiller en Gestion de Patrimoine) ?',
        answer:
          'Ces deux professions sont compl\u00e9mentaires, pas substituables. L\'expert-comptable a une vision globale de votre entreprise et de votre situation fiscale, ce qui est fondamental pour la strat\u00e9gie patrimoniale. Le CGP apporte son expertise sur les produits financiers et l\'assurance-vie. Nous travaillons en collaboration avec des CGP partenaires pour vous offrir un conseil \u00e0 360 degr\u00e9s.',
      },
      {
        question: 'Le Pacte Dutreil s\'applique-t-il \u00e0 toutes les entreprises ?',
        answer:
          'Le Pacte Dutreil s\'applique aux transmissions d\'entreprises individuelles et de parts/actions de soci\u00e9t\u00e9s exer\u00e7ant une activit\u00e9 industrielle, commerciale, artisanale, agricole ou lib\u00e9rale. Les soci\u00e9t\u00e9s civiles purement patrimoniales (SCI de gestion) sont exclues. L\'engagement collectif de conservation des titres doit \u00eatre de minimum 2 ans, puis individuel de 4 ans. L\'anticipation est donc indispensable.',
      },
    ],
    relatedLinks: [
      { label: 'Conseil fiscal & Optimisation', to: '/fiscalite' },
      { label: 'Conseil en gestion & Pilotage', to: '/conseil-gestion' },
      { label: 'Accompagnement juridique', to: '/conseil-juridique' },
      { label: 'Expert-comptable \u00e0 Caen', to: '/expert-comptable-caen' },
    ],
  },

  'commissariat-aux-comptes': {
    slug: 'commissariat-aux-comptes',
    metaTitle: 'Commissariat aux Comptes en Normandie | Cabinet Drakar',
    metaDescription:
      'Commissariat aux comptes en Normandie : certification l\u00e9gale ou contractuelle, audit des comptes, due diligence. Cabinet Drakar Expert Comptable. Devis gratuit.',
    h1: 'Commissariat aux comptes en Normandie',
    intro:
      'La certification des comptes par un commissaire aux comptes est une garantie de transparence financi\u00e8re pour les associ\u00e9s, les investisseurs, les banques et les partenaires commerciaux. Le cabinet Drakar Expert Comptable intervient en commissariat aux comptes l\u00e9gal et contractuel pour les entreprises normandes qui souhaitent renforcer la cr\u00e9dibilit\u00e9 de leurs \u00e9tats financiers.',
    sections: [
      {
        title: 'Qu\'est-ce que le commissariat aux comptes ?',
        content:
          'Le commissariat aux comptes (CAC) est la mission de certification de la r\u00e9gularit\u00e9, de la sinc\u00e9rit\u00e9 et de l\'image fid\u00e8le des comptes annuels d\'une entreprise. Cette certification est r\u00e9alis\u00e9e par un professionnel inscrit \u00e0 la Compagnie Nationale des Commissaires aux Comptes (CNCC), soumis \u00e0 des normes d\'ind\u00e9pendance strictes. Elle peut \u00eatre obligatoire (mission l\u00e9gale) ou choisie librement (mission contractuelle).',
      },
      {
        title: 'Commissariat aux comptes l\u00e9gal : quelles entreprises sont concern\u00e9es ?',
        content:
          'Depuis la r\u00e9forme de 2019, le seuil de nomination obligatoire d\'un commissaire aux comptes a \u00e9t\u00e9 relev\u00e9. Une SA est toujours tenue d\'avoir un CAC. Pour les SARL et SAS, la nomination est obligatoire si deux des trois seuils suivants sont d\u00e9pass\u00e9s :',
        list: [
          'Bilan total sup\u00e9rieur \u00e0 4 millions d\'euros',
          'Chiffre d\'affaires HT sup\u00e9rieur \u00e0 8 millions d\'euros',
          'Nombre de salari\u00e9s permanent sup\u00e9rieur \u00e0 50',
        ],
      },
      {
        title: 'Commissariat aux comptes contractuel : pourquoi choisir un audit volontaire ?',
        content:
          'M\u00eame sans obligation l\u00e9gale, de nombreuses entreprises choisissent de faire certifier leurs comptes. Les raisons sont multiples :',
        list: [
          'Renforcer la confiance des investisseurs ou pr\u00e9parer une lev\u00e9e de fonds',
          'S\u00e9curiser une op\u00e9ration de cession ou de reprise (due diligence)',
          'Cr\u00e9dibiliser les comptes aupr\u00e8s des banques pour l\'obtention de financements',
          'Anticiper une croissance future qui rendra le CAC obligatoire',
          'Rassurer les associ\u00e9s minoritaires sur la gestion de la soci\u00e9t\u00e9',
        ],
      },
      {
        title: 'Notre process de commissariat aux comptes',
        subSections: [
          {
            title: '1. Prise de connaissance de l\'entit\u00e9',
            content:
              'Nous commen\u00e7ons par une phase de prise de connaissance approfondie : activit\u00e9, secteur, organisation interne, contr\u00f4le interne, risques sp\u00e9cifiques. Cette \u00e9tape est fondamentale pour orienter nos travaux d\'audit.',
          },
          {
            title: '2. Planification et \u00e9valuation des risques',
            content:
              'Nous \u00e9valuons les risques d\'anomalies significatives dans les comptes (risques li\u00e9s \u00e0 l\'activit\u00e9, aux estimations comptables, aux parties li\u00e9es\u2026) et planifions nos travaux en cons\u00e9quence.',
          },
          {
            title: '3. Travaux d\'audit et contr\u00f4le des comptes',
            content:
              'Nous r\u00e9alisons nos tests de contr\u00f4le et de validation sur les postes significatifs du bilan et du compte de r\u00e9sultat : immobilisations, stocks, cr\u00e9ances, dettes, chiffre d\'affaires, charges. Nous appliquons les Normes d\'Exercice Professionnel (NEP) de la CNCC.',
          },
          {
            title: '4. Certification et rapport du commissaire aux comptes',
            content:
              '\u00c0 l\'issue de nos travaux, nous \u00e9mettons notre rapport g\u00e9n\u00e9ral sur les comptes annuels. La certification peut \u00eatre sans r\u00e9serve, avec r\u00e9serves ou \u00eatre refus\u00e9e en cas d\'anomalie significative. Ce rapport est remis aux associ\u00e9s lors de l\'assembl\u00e9e g\u00e9n\u00e9rale d\'approbation des comptes.',
          },
        ],
      },
      {
        title: 'Due diligence et audit d\'acquisition',
        content:
          'Dans le cadre d\'une reprise d\'entreprise, l\'audit d\'acquisition (due diligence) est une \u00e9tape indispensable pour valider la valeur de la cible et identifier les risques cach\u00e9s. Nous intervenons sur les volets comptable, fiscal et social pour vous donner une vision compl\u00e8te et document\u00e9e avant votre engagement.',
      },
    ],
    faq: [
      {
        question: 'Quelle est la dur\u00e9e du mandat d\'un commissaire aux comptes ?',
        answer:
          'Le mandat l\u00e9gal d\'un commissaire aux comptes dans les soci\u00e9t\u00e9s est de 6 exercices comptables (6 ans). \u00c0 l\'issue de ce mandat, le CAC peut \u00eatre reconduit ou remplac\u00e9. Dans les associations et fondations, le mandat est g\u00e9n\u00e9ralement de 6 ans aussi, fix\u00e9 par les statuts.',
      },
      {
        question: 'Peut-on avoir le m\u00eame cabinet en expertise comptable et en commissariat aux comptes ?',
        answer:
          'Non. Les r\u00e8gles d\'ind\u00e9pendance de la CNCC interdisent au commissaire aux comptes d\'une entit\u00e9 d\'assurer \u00e9galement sa mission d\'expertise comptable (tenue des comptes, \u00e9tablissement du bilan). Ces deux missions doivent \u00eatre assur\u00e9es par des entit\u00e9s distinctes. Notre cabinet peut \u00eatre votre expert-comptable, mais nous faisons appel \u00e0 un commissaire aux comptes partenaire et ind\u00e9pendant pour la certification.',
      },
    ],
    relatedLinks: [
      { label: 'Tenue de comptabilit\u00e9 & Bilan', to: '/comptabilite' },
      { label: 'Accompagnement juridique', to: '/conseil-juridique' },
      { label: 'Cr\u00e9ation & Reprise d\'entreprise', to: '/creation-reprise-entreprise' },
      { label: 'Expert-comptable \u00e0 Rouen', to: '/expert-comptable-rouen' },
    ],
  },
};
