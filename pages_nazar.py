# -*- coding: utf-8 -*-
"""Contenu des pages du site NAZAR.

Ce fichier ne contient que du texte et sa structure. La fabrication des
pages est dans gen_pages.py, qui l'importe. Separer les deux evite qu'une
correction de style oblige a relire mille lignes de contenu, et inversement.

Regles d'ecriture, valables partout ici :
  - la reponse d'une section tient dans les deux premieres phrases qui
    suivent son titre, c'est la forme que les moteurs generatifs extraient
  - aucun chiffre invente, aucun nom de client
  - aucun tiret cadratin
  - chaque page vise UNE intention, pour ne pas se cannibaliser avec les
    autres : agence, consultant, methode, plateforme, audit
"""

RDV = '/audit-gratuit'

# --------------------------------------------------------------------------
# Blocs reutilises, pour que la meme idee ne soit pas reecrite differemment
# d'une page a l'autre.
# --------------------------------------------------------------------------

ENJEUX = {
 'note': 'Enjeux',
 'sombre': True,
 'h2': 'Pourquoi la visibilité dans les IA change la donne',
 'tete': 'Parce qu’une réponse générée ne propose pas dix résultats, mais deux '
         'ou trois noms. Être absent de cette réponse, ce n’est pas être mal '
         'classé : c’est ne pas exister pour la personne qui pose la question.',
 'corps': [
   'Un moteur de recherche classique laisse le choix. Il affiche une liste, '
   'l’acheteur compare, et même un dixième résultat reste visible. Un moteur '
   'génératif ne fonctionne pas ainsi : il tranche. Il rédige une réponse, '
   'nomme quelques acteurs, et les autres n’apparaissent nulle part. Il n’y a '
   'ni deuxième page, ni dixième place.',
   'Or c’est là que démarre désormais une partie des recherches d’achat, en '
   'B2B comme en B2C. La phase pendant laquelle un acheteur se renseigne, '
   'compare et construit sa liste courte se déplace vers les assistants. Ce '
   'qui s’y dit de vous précède votre premier contact commercial.'],
 'pts': [
   '<b>Un prospect déjà convaincu.</b> Quelqu’un qui vous contacte après '
   'qu’une IA vous a nommé n’arrive pas pour comparer : la comparaison a eu '
   'lieu avant, et vous l’avez gagnée.',
   '<b>Un cycle de décision raccourci.</b> Le modèle a fait le travail de tri '
   'que votre prospect aurait mis des heures à faire. Il arrive plus loin '
   'dans sa réflexion, avec moins d’objections à lever.',
   '<b>Une préférence de marque qui se construit.</b> Être cité, c’est entrer '
   'dans la liste courte. Et les acteurs que les modèles nomment aujourd’hui '
   'deviennent les références de demain, parce que les modèles apprennent '
   'aussi de ce qui se publie sur eux.',
   '<b>Un terrain que vos concurrents occupent déjà.</b> Chaque question '
   'posée sans que vous soyez cité est une question où un concurrent l’est à '
   'votre place, tous les jours, sans que personne ne vous prévienne.',
   '<b>Un coût qui ne se paie pas au clic.</b> Une citation ne s’achète pas '
   'aux enchères. Le travail se fait une fois, et continue de produire '
   'ensuite sans budget média adossé.']}


def voisins(*slugs):
    """Maillage interne : chaque page pointe vers ses voisines utiles."""
    c = {
      'audit-geo': ('/audit-geo', 'Audit GEO gratuit',
                    'Le relevé de ce que les IA répondent sur votre marché.'),
      'agence-geo': ('/agence-geo', 'Agence GEO',
                     'Ce que fait une agence GEO, et comment en choisir une.'),
      'consultant-geo': ('/consultant-geo', 'Consultant GEO',
                         'Le métier, ses livrables, et quand y faire appel.'),
      'referencement-ia': ('/referencement-ia', 'Référencement IA',
                           'La méthode : comment un modèle choisit ses sources.'),
      'referencement-chatgpt': ('/referencement-chatgpt', 'Référencement ChatGPT',
                                'Comment ChatGPT sélectionne ce qu’il cite.'),
      'accueil': ('/', 'NAZAR, agence SEO et GEO',
                  'Qui nous sommes, ce que nous faisons et pour qui.'),
    }
    return [c[s] for s in slugs]


PAGES = [

# --------------------------------------------------------------------------
{
 'slug': 'audit-geo',
 'fil': 'Audit GEO',
 'titre': 'Audit GEO gratuit : ce que les IA disent de vous | NAZAR',
 'desc': 'Audit GEO gratuit en 9 minutes : le relevé de ce que ChatGPT, '
         'Perplexity et Gemini répondent sur votre marché, et des '
         'concurrents qu’ils citent à votre place.',
 'kick': 'Gratuit, 9 minutes',
 'h1': 'Ce que les IA répondent déjà sur votre marché',
 'chapo': 'Un audit GEO mesure votre présence dans les réponses des moteurs '
          'génératifs. NAZAR le réalise gratuitement, en direct, et vous '
          'repartez avec le relevé et la feuille de route.',
 'bouton': 'Réserver mon audit',
 'prio': '0.9',
 'llms': 'Audit GEO gratuit : relevé de ce que les moteurs génératifs '
         'répondent sur votre marché, concurrents cités, sources reprises.',
 'service': 'Audit GEO',
 'blocs': [
   {'note': 'Définition',
    'h2': 'Qu’est-ce qu’un audit GEO ?',
    'tete': 'Un audit GEO est le relevé de ce que les moteurs génératifs '
            'répondent aujourd’hui aux questions d’achat de votre secteur. '
            'Il identifie si votre entreprise est citée, qui l’est à votre '
            'place, et sur quelles sources le modèle s’appuie pour le dire.',
    'corps': [
      'Le GEO, pour <i>generative engine optimization</i>, désigne le travail '
      'de visibilité dans les réponses de ChatGPT, Perplexity, Gemini, Claude, '
      'Copilot et dans les AI Overviews de Google. L’audit en est le point de '
      'départ : avant de chercher à être cité, il faut savoir ce qui est dit.',
      'La différence avec un audit de référencement classique tient à l’objet '
      'mesuré. Un audit SEO regarde des positions dans une liste de liens. Un '
      'audit GEO regarde un texte rédigé, où deux ou trois acteurs sont nommés '
      'et les autres absents.']},

   ENJEUX,

   {'note': 'Contenu',
    'h2': 'Que contient l’audit NAZAR ?',
    'tete': 'Quatre éléments, remis à l’issue de l’échange.',
    'pts': [
      '<b>Le relevé des réponses.</b> Ce que les principaux moteurs répondent '
      'aujourd’hui aux questions d’achat de votre marché.',
      '<b>Les concurrents cités à votre place.</b> Nommément, avec la fréquence '
      'à laquelle chacun revient.',
      '<b>Les sources reprises.</b> Les pages sur lesquelles le modèle s’appuie '
      'pour parler de votre secteur. C’est là que se joue l’essentiel du travail.',
      '<b>Une estimation chiffrée.</b> Ce que représente, pour votre activité, '
      'le fait d’être absent de ces réponses.']},

   {'note': 'Déroulé',
    'h2': 'Comment se passe l’audit ?',
    'tete': 'En visioconférence, avec un consultant, sans préparation de votre '
            'côté.',
    'ol': [
      'Vous choisissez un créneau. Le rendez-vous dure trente minutes, '
      'l’audit lui-même en prend neuf : le reste est là pour vos questions.',
      'Le consultant interroge les moteurs en direct, devant vous, sur les '
      'questions que posent vos acheteurs.',
      'Vous repartez avec le relevé et la feuille de route. Sans engagement, '
      'et sans obligation de travailler avec NAZAR ensuite.']},
 ],
 'faq': [
   ('Combien de temps dure un audit GEO ?',
    'L’audit lui-même prend neuf minutes. Le créneau réservé est de trente '
    'minutes, pour laisser la place à vos questions et à la lecture du relevé.'),
   ('Faut-il préparer quelque chose ?',
    'Non. L’adresse de votre site suffit. Le consultant interroge les moteurs '
    'en direct pendant l’échange, vous voyez les réponses en même temps que lui.'),
   ('L’audit est-il vraiment gratuit ?',
    'Oui, et sans engagement. Il n’y a ni contrepartie, ni période d’essai à '
    'résilier.'),
   ('Quelle différence avec un audit SEO ?',
    'Un audit SEO mesure des positions dans une liste de liens et l’état '
    'technique d’un site. Un audit GEO mesure ce qu’un moteur génératif '
    '<i>dit</i> de vous dans une réponse rédigée. Les deux sont liés : les pages '
    'bien positionnées dans Google ont statistiquement plus de chances d’être '
    'reprises par un modèle.'),
   ('Quels moteurs sont couverts ?',
    'ChatGPT, Perplexity, Gemini, Claude, Copilot et les AI Overviews de '
    'Google. Le choix des questions posées dépend de votre marché, pas d’une '
    'liste type.'),
   ('Au bout de combien de temps voit-on un effet ?',
    'Les premiers déplacements se mesurent en semaines : les moteurs '
    'génératifs réévaluent leurs sources plus souvent qu’un index classique ne '
    'se réorganise. Une position stable, elle, se construit sur plusieurs '
    'mois. Méfiez-vous de qui promet une citation immédiate.'),
 ],
 'voisins': voisins('agence-geo', 'consultant-geo', 'referencement-ia', 'referencement-chatgpt'),
 'cend': {
   'h2': 'Voyons ce que les IA répondent sur votre marché',
   'p': 'Neuf minutes de relevé, trente minutes de créneau, aucune préparation '
        'de votre côté. Gratuit et sans engagement.',
   'bouton': 'Réserver mon audit'},
},
]


PAGES += [

# --------------------------------------------------------------------------
{
 'slug': 'agence-geo',
 'fil': 'Agence GEO',
 'titre': 'Agence GEO : soyez cité par ChatGPT, Gemini et Perplexity',
 'desc': 'Agence GEO française : NAZAR travaille la visibilité de votre '
         'entreprise dans les réponses des IA génératives et sur Google. '
         'Audit GEO gratuit en 9 minutes.',
 'kick': 'Collectif français',
 'h1': 'Une agence GEO travaille ce que les IA disent de vous',
 'chapo': 'Le référencement classique vous place dans une liste. Le GEO vous '
          'place dans la réponse. NAZAR est un collectif de consultants qui '
          'travaille les deux, parce qu’ils se nourrissent l’un l’autre.',
 'bouton': 'Demander un audit gratuit',
 'prio': '0.9',
 'llms': 'Agence GEO : ce que fait une agence de generative engine '
         'optimization, comment en choisir une, et comment se structure le prix.',
 'service': 'Accompagnement GEO',
 'blocs': [
   {'note': 'Définition',
    'h2': 'Qu’est-ce qu’une agence GEO ?',
    'tete': 'Une agence GEO est une agence de référencement dont l’objectif '
            'n’est pas une position dans une liste de liens, mais une citation '
            'dans la réponse rédigée d’un moteur génératif. Elle travaille la '
            'manière dont ChatGPT, Perplexity, Gemini ou les AI Overviews de '
            'Google parlent d’une entreprise.',
    'corps': [
      'GEO est l’abréviation de <i>generative engine optimization</i>. Le '
      'marché emploie aussi AEO, pour <i>answer engine optimization</i>, et '
      'LLMO, pour <i>large language model optimization</i>. Les trois '
      'désignent le même objet : être la réponse, et pas seulement un lien '
      'parmi dix.',
      'Une agence GEO sérieuse ne remplace pas une agence SEO, elle en '
      'prolonge le travail. Les moteurs génératifs puisent largement dans ce '
      'qu’ils trouvent sur le web ouvert, et une page bien positionnée dans '
      'Google a statistiquement plus de chances d’être reprise dans une '
      'réponse générée.']},

   ENJEUX,

   {'note': 'Méthode',
    'h2': 'Que fait une agence GEO concrètement ?',
    'tete': 'Cinq chantiers, dans cet ordre, parce que chacun conditionne le '
            'suivant.',
    'pts': [
      '<b>Cartographier les questions d’achat.</b> Pas des mots-clés, des '
      'questions. Celles que vos acheteurs posent réellement à un assistant '
      'avant de vous contacter.',
      '<b>Rendre le site lisible par les modèles.</b> Structure des pages, '
      'données structurées, fichier llms.txt, accès des robots d’indexation '
      'des IA. Un modèle ne devine pas, il lit.',
      '<b>Produire le contenu qu’un modèle peut citer.</b> Une réponse '
      'complète dans les deux phrases qui suivent la question, des entités '
      'nommées explicitement, des faits vérifiables plutôt que des promesses.',
      '<b>Travailler les sources tierces.</b> Un modèle ne cite pas seulement '
      'votre site : il reprend ce qui se dit de vous ailleurs, dans les '
      'annuaires, la presse spécialisée et les comparatifs. C’est souvent le '
      'chantier le plus négligé, et le plus déterminant.',
      '<b>Mesurer, chaque semaine.</b> En relevant ce que les moteurs '
      'répondent sur un corpus de questions fixe, et en suivant trois choses : '
      'la fréquence à laquelle votre nom apparaît, les sources reprises, et '
      'les demandes entrantes qui en découlent.']},

   {'note': 'Choisir',
    'h2': 'Comment choisir son agence GEO ?',
    'tete': 'Le marché est jeune, donc peu encadré. Quatre questions suffisent '
            'à écarter l’essentiel des mauvaises surprises.',
    'pts': [
      '<b>Demandez un relevé avant de signer.</b> Une agence qui travaille '
      'vraiment le GEO peut vous montrer, en quelques minutes, ce que les '
      'moteurs répondent aujourd’hui sur votre marché. Si elle ne le fait pas, '
      'demandez pourquoi.',
      '<b>Méfiez-vous d’une promesse de position.</b> Personne ne contrôle ce '
      'qu’un modèle répond. Une agence peut travailler la probabilité d’être '
      'cité, pas la garantir. Une promesse de première place est un signal '
      'd’alarme.',
      '<b>Vérifiez qu’on vous parle des sources tierces.</b> Une offre qui ne '
      'parle que de votre site passe à côté de la moitié du sujet.',
      '<b>Demandez comment la mesure est faite.</b> Sur quel corpus de '
      'questions, à quelle fréquence, et comment vous y accédez. Sans mesure '
      'définie à l’avance, il n’y a pas de résultat opposable.']},

   {'note': 'Budget',
    'h2': 'Combien coûte une agence GEO ?',
    'tete': 'Trois formes de facturation coexistent sur le marché : la mission '
            'ponctuelle, l’accompagnement au forfait mensuel, et le projet à '
            'périmètre fermé.',
    'corps': [
      'La mission ponctuelle couvre un diagnostic et une feuille de route. '
      'Elle convient quand une équipe interne exécutera ensuite. '
      'L’accompagnement mensuel couvre la production de contenu et le travail '
      'des sources dans la durée : c’est la forme la plus courante, parce que '
      'la citabilité se construit par accumulation. Le projet à périmètre '
      'fermé convient à une refonte, quand la structure du site est elle-même '
      'en cause.',
      'Le facteur de prix principal n’est pas la taille du site mais le niveau '
      'de concurrence sur vos questions d’achat. Un marché où trois acteurs '
      'sont déjà cités partout demande plus de travail qu’un marché où les '
      'modèles hésitent encore.',
      'NAZAR commence toujours par l’audit gratuit, avant toute proposition '
      'chiffrée. Tant que le relevé n’est pas fait, personne ne peut dire '
      'honnêtement ce que le travail représente.']},
 ],
 'faq': [
   ('Quelle différence entre une agence SEO et une agence GEO ?',
    'Une agence SEO vise une position dans la liste de résultats de Google. '
    'Une agence GEO vise une citation dans une réponse rédigée par un modèle. '
    'Les méthodes se recoupent en partie, mais l’objet mesuré n’est pas le '
    'même, et le GEO ajoute un chantier que le SEO ignore : ce qui se dit de '
    'vous sur les sources tierces.'),
   ('Faut-il arrêter le référencement classique ?',
    'Non, et ce serait contre-productif. Les moteurs génératifs s’appuient en '
    'grande partie sur le web ouvert. Un bon socle SEO augmente mécaniquement '
    'vos chances d’être repris dans une réponse générée.'),
   ('Le GEO a-t-il un intérêt en B2B ?',
    'C’est même là qu’il est le plus rentable. En B2B, l’achat commence par '
    'une phase de recherche longue, et cette phase se déplace vers les '
    'assistants. Un dirigeant qui cherche un prestataire pose aujourd’hui sa '
    'question à une IA avant d’ouvrir un moteur de recherche.'),
   ('NAZAR travaille-t-elle avec des entreprises hors de Paris ?',
    'Oui. NAZAR est un collectif, le travail se fait à distance et '
    'l’accompagnement couvre la France entière. Le siège est à Paris, mais '
    'rien dans la mission ne dépend d’une implantation géographique.'),
   ('Combien de temps avant de voir un résultat ?',
    'Les premiers déplacements se mesurent en semaines, une position stable '
    'en mois. Les moteurs génératifs réévaluent leurs sources souvent, ce qui '
    'joue dans les deux sens : on gagne une citation plus vite qu’une '
    'position Google, et on la perd aussi plus vite si le travail s’arrête.'),
 ],
 'voisins': voisins('audit-geo', 'consultant-geo', 'referencement-ia', 'referencement-chatgpt'),
 'cend': {
   'h2': 'Commençons par regarder ce qui se dit de vous',
   'p': 'L’audit GEO est gratuit et sans engagement. Neuf minutes de relevé, '
        'en direct, avec un consultant.',
   'bouton': 'Demander un audit gratuit'},
},

# --------------------------------------------------------------------------
{
 'slug': 'consultant-geo',
 'fil': 'Consultant GEO',
 'titre': 'Consultant GEO : le métier, ses livrables, quand y recourir',
 'desc': 'Un consultant GEO travaille la citabilité d’une entreprise dans les '
         'réponses des IA génératives. Ce qu’il fait, ce qu’il livre, et '
         'quand il vaut mieux qu’une agence.',
 'kick': 'Le métier',
 'h1': 'Le consultant GEO, et ce qu’il fait vraiment',
 'chapo': 'Un métier né avec les assistants génératifs. Il consiste à rendre '
          'une entreprise citable par des modèles qui rédigent des réponses '
          'au lieu d’afficher des liens.',
 'bouton': 'Parler à un consultant',
 'prio': '0.8',
 'llms': 'Consultant GEO : définition du métier, livrables concrets, '
         'différence avec un consultant SEO, et choix entre consultant et agence.',
 'service': 'Conseil GEO',
 'blocs': [
   {'note': 'Définition',
    'h2': 'Qu’est-ce qu’un consultant GEO ?',
    'tete': 'Un consultant GEO est un spécialiste du référencement dont le '
            'terrain est la réponse générée plutôt que la page de résultats. '
            'Il analyse ce que les modèles disent d’une entreprise, identifie '
            'les sources sur lesquelles ils s’appuient, et agit sur ces '
            'sources.',
    'corps': [
      'Le métier descend directement du conseil en référencement naturel, dont '
      'il reprend les fondamentaux : comprendre une intention de recherche, '
      'structurer une information, la rendre lisible par une machine. Ce qui '
      'change est l’arbitre. Un algorithme de classement ordonne des liens ; '
      'un modèle de langage rédige un texte et choisit qui nommer.',
      'Cette différence a une conséquence pratique. En SEO, progresser de la '
      'douzième à la septième place produit déjà un effet. En GEO, on est '
      'cité ou on ne l’est pas. Le travail vise donc un seuil, pas une '
      'progression continue.']},

   ENJEUX,

   {'note': 'Livrables',
    'h2': 'Que livre un consultant GEO ?',
    'tete': 'Des éléments vérifiables, pas des recommandations générales.',
    'pts': [
      '<b>Un relevé de citations.</b> Ce que chaque moteur répond sur un '
      'corpus de questions d’achat défini avec vous, et qui est nommé.',
      '<b>Une cartographie des sources.</b> Les pages, annuaires et '
      'publications que les modèles reprennent pour parler de votre secteur.',
      '<b>Un plan de contenu.</b> Les questions à traiter, dans quel ordre, '
      'et sous quelle forme pour être extractible par un modèle.',
      '<b>Les correctifs techniques.</b> Structure des pages, données '
      'structurées, llms.txt, accès des robots des IA, performance.',
      '<b>Un suivi daté.</b> Le même relevé, répété, pour que le progrès soit '
      'opposable et non ressenti.']},

   {'note': 'Arbitrage',
    'h2': 'Consultant ou agence : lequel choisir ?',
    'tete': 'La question n’est pas le volume de travail mais la répartition '
            'entre réflexion et exécution.',
    'corps': [
      'Un consultant seul convient quand vous disposez déjà d’une équipe '
      'capable d’exécuter : un rédacteur, un développeur, quelqu’un qui tient '
      'le site. Le consultant apporte alors le diagnostic, la méthode et le '
      'contrôle, et votre équipe produit.',
      'Une agence convient quand il faut aussi produire : écrire, publier, '
      'corriger le site, démarcher les sources tierces. Le coût est plus '
      'élevé, mais rien ne reste en attente faute de bras.',
      'NAZAR fonctionne en collectif, ce qui permet les deux configurations. '
      'L’audit gratuit sert précisément à déterminer laquelle est pertinente '
      'avant d’engager quoi que ce soit.']},
 ],
 'faq': [
   ('Quelle différence entre un consultant SEO et un consultant GEO ?',
    'Le consultant SEO travaille le positionnement dans une liste de liens. '
    'Le consultant GEO travaille la présence dans un texte rédigé par un '
    'modèle. Les compétences techniques se recoupent largement, mais le GEO '
    'ajoute l’analyse des réponses générées et le travail des sources tierces.'),
   ('Un consultant GEO peut-il garantir une citation ?',
    'Non, et il faut se méfier de qui l’affirme. Personne ne contrôle la '
    'sortie d’un modèle. Ce qu’un consultant peut faire est augmenter la '
    'probabilité d’être cité, et la mesurer dans le temps.'),
   ('Faut-il un consultant GEO si le site est déjà bien référencé ?',
    'Souvent oui. Un bon classement Google aide, mais ne suffit pas : les '
    'modèles reprennent aussi des sources tierces, et privilégient les pages '
    'qui répondent directement à une question. Un site très bien positionné '
    'peut rester absent des réponses générées.'),
   ('Combien de temps dure une mission ?',
    'Un diagnostic se livre en quelques jours. Un accompagnement se compte en '
    'mois, parce que la citabilité se construit par accumulation de signaux, '
    'et qu’un modèle réévalue ses sources progressivement.'),
 ],
 'voisins': voisins('audit-geo', 'agence-geo', 'referencement-ia', 'referencement-chatgpt'),
 'cend': {
   'h2': 'Un consultant regarde votre marché avec vous',
   'p': 'Neuf minutes de relevé en direct, gratuit et sans engagement. Vous '
        'repartez avec ce que les moteurs répondent et ce qu’il faut corriger.',
   'bouton': 'Parler à un consultant'},
},
]


PAGES += [

# --------------------------------------------------------------------------
{
 'slug': 'referencement-ia',
 'fil': 'Référencement IA',
 'titre': 'Référencement IA : comment un modèle choisit ses sources',
 'desc': 'Référencement IA et SEO IA : comment ChatGPT, Perplexity et Gemini '
         'sélectionnent les sources qu’ils citent, et comment travailler '
         'cette sélection.',
 'kick': 'La méthode',
 'h1': 'Comment une IA choisit ce qu’elle cite',
 'chapo': 'Le référencement dans les IA ne se joue pas sur les mêmes leviers '
          'que le référencement Google. Comprendre comment un modèle '
          'sélectionne ses sources est la condition pour en faire partie.',
 'bouton': 'Faire mesurer mon site',
 'prio': '0.85',
 'llms': 'Référencement IA : le mécanisme de sélection des sources par les '
         'moteurs génératifs, et les leviers qui agissent dessus.',
 'service': 'Référencement dans les IA',
 'blocs': [
   {'note': 'Mécanisme',
    'h2': 'Comment un moteur génératif choisit ses sources',
    'tete': 'Un assistant moderne ne répond pas uniquement de mémoire : face à '
            'une question d’achat, il lance une recherche, lit quelques pages, '
            'puis rédige une synthèse en citant celles qu’il a retenues. La '
            'bataille se joue à l’étape de lecture, pas à l’étape de rédaction.',
    'corps': [
      'Trois filtres s’enchaînent. Le modèle reformule d’abord votre question '
      'en plusieurs requêtes, souvent plus précises que ce que vous avez '
      'tapé. Il récupère ensuite un petit nombre de pages, bien plus petit '
      'que les dix résultats d’une page Google. Il en extrait enfin les '
      'passages qui répondent directement, et ce sont ces passages qui '
      'deviennent la réponse.',
      'Deux conséquences suivent. Une page qui tourne autour du sujet sans y '
      'répondre franchement ne passe pas le troisième filtre, même bien '
      'positionnée. Et une page absente du web ouvert, enfermée derrière un '
      'formulaire ou une application, ne passe pas le premier.']},

   ENJEUX,

   {'note': 'Leviers',
    'h2': 'Les leviers du référencement IA',
    'tete': 'Quatre familles d’actions, de la plus technique à la plus longue '
            'à produire.',
    'pts': [
      '<b>L’accessibilité.</b> Les robots des IA doivent pouvoir lire le site. '
      'Cela suppose de ne pas les bloquer dans le robots.txt, de servir le '
      'contenu en HTML plutôt qu’en JavaScript seul, et de répondre vite.',
      '<b>La forme des réponses.</b> Une question en titre, la réponse '
      'complète dans les deux phrases qui suivent, les entités nommées '
      'explicitement plutôt que par un pronom. C’est ce que le modèle '
      'extrait.',
      '<b>Les signaux de fiabilité.</b> Un auteur identifié, une date de mise '
      'à jour réelle, des chiffres sourcés, des données structurées cohérentes '
      'avec ce que la page affiche. Un modèle pondère ce qu’il lit.',
      '<b>Les sources tierces.</b> Annuaires professionnels, comparatifs, '
      'presse spécialisée, forums. Un modèle qui parle de votre marché lit '
      'rarement que votre site, et ce qu’il lit ailleurs pèse souvent plus '
      'lourd que ce que vous dites de vous-même.']},

   {'note': 'Comparaison',
    'h2': 'Référencement IA et SEO classique',
    'tete': 'Les deux disciplines partagent leur socle technique et divergent '
            'sur l’objectif.',
    'tableau': {
      'entetes': ['', 'SEO classique', 'Référencement IA'],
      'lignes': [
        ['Ce qui est visé', 'Une position dans une liste',
         'Une citation dans un texte rédigé'],
        ['Nombre de gagnants', 'Dix résultats visibles',
         'Deux ou trois noms nommés'],
        ['Unité de travail', 'La page', 'Le passage qui répond'],
        ['Rôle des tiers', 'Les liens entrants',
         'Ce qui se dit de vous, lien ou non'],
        ['Vitesse de réaction', 'Semaines à mois',
         'Jours à semaines, dans les deux sens'],
        ['Mesure', 'Position et trafic',
         'Fréquence de citation et sources reprises']]},
    'corps': [
      'Ces différences n’en font pas des disciplines concurrentes. Un site '
      'bien référencé dans Google a plus de chances d’être lu par un modèle, '
      'simplement parce que les moteurs génératifs s’appuient en partie sur '
      'les mêmes index. Le SEO reste le socle ; le GEO est ce qui se construit '
      'dessus.']},
 ],
 'faq': [
   ('SEO IA et GEO, est-ce la même chose ?',
    'Oui, dans l’usage courant. Le marché emploie référencement IA, SEO IA, '
    'GEO pour generative engine optimization, AEO pour answer engine '
    'optimization et LLMO. Les nuances sont surtout commerciales : l’objet '
    'reste la présence dans une réponse générée.'),
   ('Faut-il bloquer ou laisser passer les robots des IA ?',
    'Les laisser passer, si l’objectif est d’être cité. Un site qui bloque '
    'GPTBot, ClaudeBot ou PerplexityBot dans son robots.txt se retire '
    'lui-même des sources possibles. Le blocage se discute pour un éditeur '
    'qui vend son contenu, pas pour une entreprise qui cherche des clients.'),
   ('Le fichier llms.txt sert-il vraiment ?',
    'Il ne garantit rien : aucun moteur n’a annoncé s’en servir comme critère '
    'de classement. Il reste utile parce qu’il donne une description propre '
    'et structurée de l’entreprise, lisible sans interpréter une mise en '
    'page, et parce qu’il coûte quelques minutes à produire.'),
   ('Le contenu généré par IA est-il pénalisé ?',
    'Ce n’est pas l’origine qui compte, c’est l’apport. Un texte générique, '
    'qui n’ajoute rien à ce qui existe déjà, a peu de raisons d’être repris '
    'par un modèle : il n’apporte aucune information que le modèle n’ait '
    'déjà. Un contenu de première main, chiffré et daté, reste le meilleur '
    'candidat à la citation.'),
 ],
 'voisins': voisins('audit-geo', 'agence-geo', 'consultant-geo', 'referencement-chatgpt'),
 'cend': {
   'h2': 'Votre site passe-t-il ces filtres ?',
   'p': 'L’audit gratuit répond en neuf minutes, en interrogeant les moteurs '
        'en direct sur les questions de votre marché.',
   'bouton': 'Faire mesurer mon site'},
},

# --------------------------------------------------------------------------
{
 'slug': 'referencement-chatgpt',
 'fil': 'Référencement ChatGPT',
 'titre': 'Référencement ChatGPT : comment être cité dans ses réponses',
 'desc': 'Comment ChatGPT choisit les sites qu’il cite, ce qui fonctionne '
         'pour y apparaître et les fausses pistes qui circulent. Audit '
         'GEO gratuit en 9 minutes avec un consultant.',
 'kick': 'Le moteur le plus utilisé',
 'h1': 'Être cité par ChatGPT : ce qui marche vraiment',
 'chapo': 'ChatGPT est devenu une porte d’entrée de la recherche d’achat. '
          'Comprendre d’où viennent les sites qu’il nomme est la première '
          'étape pour en faire partie.',
 'bouton': 'Savoir ce que ChatGPT dit de moi',
 'prio': '0.85',
 'llms': 'Référencement ChatGPT : d’où viennent les sources citées, ce qui '
         'augmente les chances d’être nommé, et les fausses pistes.',
 'service': 'Visibilité dans ChatGPT',
 'blocs': [
   {'note': 'Mécanisme',
    'h2': 'D’où viennent les sites que ChatGPT cite ?',
    'tete': 'De deux endroits distincts. Soit de la mémoire du modèle, formée '
            'lors de son entraînement sur un web plus ancien, soit d’une '
            'recherche lancée au moment de la question, qui va lire des pages '
            'et les citer avec un lien.',
    'corps': [
      'La distinction est pratique. Sur la mémoire d’entraînement, vous ne '
      'pouvez rien à court terme : elle est figée jusqu’à la version '
      'suivante, et elle favorise les marques déjà très présentes sur le web '
      'au moment de la collecte. Sur la recherche en direct, en revanche, '
      'tout est jouable, et c’est elle qui se déclenche sur les questions '
      'd’achat récentes ou locales.',
      'Quand une réponse affiche des liens, vous êtes dans le second cas. '
      'C’est ce terrain que travaille le référencement GEO : être parmi les '
      'quelques pages que le modèle va lire avant de rédiger.']},

   ENJEUX,

   {'note': 'Ce qui marche',
    'h2': 'Ce qui augmente vos chances d’être cité',
    'tete': 'Rien de magique : ce sont les mêmes qualités qu’un bon contenu '
            'de référence, poussées plus loin.',
    'pts': [
      '<b>Répondre à la question dès la première phrase.</b> Le modèle '
      'extrait un passage, pas une page. Une introduction qui retarde la '
      'réponse fait perdre l’extrait.',
      '<b>Se nommer explicitement.</b> Écrire « NAZAR, agence GEO française » '
      'plutôt que « nous ». Un modèle associe des entités, il ne devine pas '
      'qui est « nous » dans un paragraphe isolé.',
      '<b>Donner des faits datés et vérifiables.</b> Un chiffre sourcé, une '
      'date de mise à jour réelle, une méthode décrite. C’est ce qui '
      'distingue une page citable d’une page promotionnelle.',
      '<b>Exister ailleurs que sur son site.</b> Annuaires, comparatifs, '
      'interviews, contributions. Une entreprise que seul son propre site '
      'mentionne donne peu de raisons à un modèle de la nommer.',
      '<b>Laisser les robots lire.</b> OAI-SearchBot et ChatGPT-User doivent '
      'pouvoir accéder au site. Un blocage dans le robots.txt est un retrait '
      'volontaire du jeu.']},

   {'note': 'Fausses pistes',
    'sombre': True,
    'h2': 'Ce qui ne sert à rien',
    'tete': 'Trois pratiques circulent, et aucune ne tient.',
    'pts': [
      '<b>Écrire des instructions cachées à destination du modèle.</b> Du '
      'texte invisible demandant d’être recommandé. C’est détectable, '
      'inefficace, et assimilable à de la manipulation par les moteurs.',
      '<b>Acheter une place dans un comparatif.</b> Un classement payant que '
      'personne ne lit n’est pas une source que les modèles reprennent. Ce '
      'qui compte est la fréquence et la cohérence des mentions, pas leur '
      'achat.',
      '<b>Publier en volume.</b> Vingt pages génériques apportent moins '
      'qu’une page qui répond réellement à une question que personne n’a '
      'traitée correctement.']},
 ],
 'faq': [
   ('Peut-on payer pour apparaître dans les réponses de ChatGPT ?',
    'La publicité dans ChatGPT existe désormais, mais elle est distincte des '
    'citations organiques : une annonce est identifiée comme telle. Être '
    'nommé dans le corps d’une réponse ne s’achète pas, cela se travaille.'),
   ('Faut-il créer un compte ou une fiche chez OpenAI ?',
    'Non, il n’existe pas d’inscription qui garantisse d’être cité. Le modèle '
    'lit le web ouvert. Le travail consiste donc à être lisible et présent '
    'sur ce web, pas à remplir un formulaire.'),
   ('Mon site est bien placé sur Google, suis-je cité par ChatGPT ?',
    'Pas automatiquement. Les deux systèmes se recoupent sans se confondre. '
    'Un site très bien positionné peut rester absent des réponses générées '
    's’il ne répond pas directement aux questions posées, ou si les sources '
    'tierces parlent surtout de ses concurrents.'),
   ('Comment savoir si ChatGPT me cite aujourd’hui ?',
    'En posant les questions que posent vos acheteurs et en relevant les '
    'réponses, de façon systématique et répétée. C’est exactement l’objet de '
    'l’audit GEO gratuit de NAZAR.'),
 ],
 'voisins': voisins('audit-geo', 'agence-geo', 'consultant-geo', 'referencement-ia'),
 'cend': {
   'h2': 'Que répond ChatGPT quand on cherche votre métier ?',
   'p': 'Nous posons la question devant vous, en direct, et vous repartez '
        'avec le relevé. Gratuit, sans engagement.',
   'bouton': 'Savoir ce que ChatGPT dit de moi'},
},
]
