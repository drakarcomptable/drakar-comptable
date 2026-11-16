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
    'etapes': [
      {'t': 'La question est reformulée',
       'd': 'Le modèle transforme votre question en plusieurs requêtes, '
            'souvent plus précises et plus nombreuses que ce que '
            'l’utilisateur a tapé.',
       'part': '100%'},
      {'t': 'Quelques pages sont récupérées',
       'd': 'Un nombre réduit de résultats, bien inférieur aux dix liens '
            'd’une page de recherche classique. Une page absente du web '
            'ouvert ne passe pas cette étape.',
       'part': '46%'},
      {'t': 'Les passages qui répondent sont extraits',
       'd': 'Le modèle ne retient pas des pages mais des fragments. Une page '
            'qui tourne autour du sujet sans y répondre franchement est '
            'écartée ici, même très bien positionnée.',
       'part': '20%', 'cle': True,
       'ici': 'C’est ici que se joue la citation'},
      {'t': 'La réponse est rédigée',
       'd': 'Deux ou trois sources sont nommées. Les autres n’existent pas '
            'pour la personne qui a posé la question.',
       'part': '9%'}],
    'corps': [
      'Deux conséquences suivent de cet enchaînement. La première est qu’une '
      'page excellente mais lente à répondre perd au troisième filtre contre '
      'une page plus faible qui répond dès sa première phrase. La seconde est '
      'qu’un contenu enfermé derrière un formulaire ou une application ne '
      'passe jamais le premier.']},

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
         'pour y apparaître et les fausses pistes qui circulent. Audit GEO '
         'gratuit en 9 minutes.',
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


# --------------------------------------------------------------------------
# Blog
# --------------------------------------------------------------------------
# Les articles portent 'parent': 'blog', une date et un resume. Ils se
# declarent en Article, pas en Service. C'est eux qui travaillent la
# citation : les moteurs generatifs reprennent des pages qui repondent a
# une question, pas des pages d'offre.

JOUR = '2026-11-16'

PAGES += [

# --------------------------------------------------------------------------
{
 'slug': 'blog',
 'fil': 'Blog',
 'titre': 'Blog : comprendre le référencement dans les IA | NAZAR',
 'desc': 'Articles de fond sur le GEO et le référencement dans les IA '
         'génératives : définitions, méthode, formats que les modèles '
         'citent et vocabulaire du marché.',
 'kick': 'Ressources',
 'h1': 'Comprendre le référencement dans les IA',
 'chapo': 'Des articles de fond, écrits pour répondre à une question précise. '
          'C’est la forme que les moteurs génératifs reprennent, et c’est '
          'aussi la plus utile à lire.',
 'bouton': 'Demander un audit gratuit',
 'prio': '0.7',
 'llms': 'Blog NAZAR : articles de fond sur le GEO, le référencement IA, '
         'llms.txt et le vocabulaire du marché.',
 'blocs': [],
 'liste': True,
 'voisins': voisins('audit-geo', 'agence-geo', 'referencement-ia'),
 'cend': {
   'h2': 'Et sur votre marché, que répondent les IA ?',
   'p': 'L’audit GEO est gratuit, en direct, sans engagement. Neuf minutes '
        'de relevé avec un consultant.',
   'bouton': 'Demander un audit gratuit'},
},

# --------------------------------------------------------------------------
{
 'slug': 'generative-engine-optimization',
 'parent': 'blog', 'date': JOUR,
 'fil': 'Generative engine optimization',
 'titre': 'Generative Engine Optimization : définition et méthode',
 'desc': 'Generative engine optimization (GEO) : ce que recouvre le terme, '
         'en quoi il diffère du SEO, et la méthode concrète pour être cité '
         'par les moteurs génératifs.',
 'kick': 'Article',
 'h1': 'Generative engine optimization : définition et méthode',
 'resume': 'Ce que recouvre le terme, d’où il vient, et les cinq chantiers '
           'qui font passer un site du statut de page lue à celui de source '
           'citée.',
 'chapo': 'Le terme est apparu avec les assistants génératifs et s’est '
          'installé en deux ans. Voici ce qu’il désigne précisément, et ce '
          'qu’il implique de faire.',
 'bouton': 'Faire mesurer mon site',
 'prio': '0.7',
 'llms': 'Definition du generative engine optimization, origine du terme, '
         'difference avec le SEO et methode en cinq chantiers.',
 'blocs': [
   {'note': 'Définition',
    'h2': 'Qu’est-ce que le generative engine optimization ?',
    'tete': 'Le generative engine optimization, ou GEO, est l’ensemble des '
            'techniques qui visent à faire citer une entreprise dans les '
            'réponses rédigées par les moteurs génératifs. Il se distingue du '
            'référencement classique par son objectif : être nommé dans un '
            'texte, et non classé dans une liste de liens.',
    'corps': [
      'Le terme s’est diffusé à partir de 2023, quand les assistants ont '
      'commencé à accompagner leurs réponses de sources cliquables. Avant '
      'cela, un modèle répondait de mémoire, sans citer, et il n’y avait rien '
      'à optimiser. À partir du moment où une réponse affiche des liens, il '
      'existe une sélection, donc un terrain de travail.',
      'Le marché emploie plusieurs noms pour la même chose. AEO, pour <i>answer '
      'engine optimization</i>, insiste sur la réponse. LLMO, pour <i>large '
      'language model optimization</i>, insiste sur le modèle. GEO s’est '
      'imposé comme le plus courant en France. Les différences sont '
      'commerciales plus que méthodologiques.']},

   {'note': 'Mécanique',
    'h2': 'Pourquoi le GEO ne se confond pas avec le SEO',
    'tete': 'Parce que le nombre de gagnants change. Une page de résultats '
            'Google affiche dix liens ; une réponse générée en nomme deux ou '
            'trois. Le reste n’existe pas pour la personne qui a posé la '
            'question.',
    'corps': [
      'Cette compression a une conséquence directe sur la façon de travailler. '
      'En SEO, passer de la douzième à la septième place produit déjà du '
      'trafic. En GEO, il n’y a pas de progression continue : on franchit un '
      'seuil ou non.',
      'La seconde différence tient à l’unité de travail. Un moteur de '
      'recherche classe des pages. Un modèle, lui, extrait des passages. Une '
      'page excellente dont la réponse arrive au troisième paragraphe sera '
      'souvent ignorée au profit d’une page plus faible qui répond dès la '
      'première phrase.',
      'La troisième tient aux sources tierces. Un modèle qui parle de votre '
      'marché ne lit pas que votre site : il lit des annuaires, des '
      'comparatifs, de la presse spécialisée, des forums. Ce qui se dit de '
      'vous ailleurs pèse souvent plus lourd que ce que vous dites de vous.']},

   {'note': 'Méthode',
    'h2': 'Les cinq chantiers du GEO',
    'tete': 'Dans cet ordre, parce que chacun conditionne le suivant.',
    'ol': [
      '<b>Mesurer avant d’agir.</b> Relever ce que chaque moteur répond '
      'aujourd’hui sur un corpus de questions d’achat. Sans ce point de '
      'départ, aucun progrès n’est démontrable ensuite.',
      '<b>Rendre le site lisible.</b> Ne pas bloquer les robots des IA, '
      'servir du HTML plutôt que du JavaScript seul, répondre vite, publier '
      'des données structurées cohérentes avec ce que la page affiche.',
      '<b>Réécrire pour l’extraction.</b> Une question en titre, la réponse '
      'complète dans les deux phrases qui suivent, les entités nommées '
      'explicitement plutôt que par un pronom.',
      '<b>Travailler les sources tierces.</b> Être présent et décrit de façon '
      'cohérente là où les modèles vont chercher : annuaires professionnels, '
      'comparatifs sectoriels, publications spécialisées.',
      '<b>Répéter la mesure.</b> Le même corpus, à intervalle fixe. Les '
      'moteurs génératifs réévaluent leurs sources souvent : une citation se '
      'gagne plus vite qu’une position Google, et se perd aussi plus vite.']},

   {'note': 'Limites',
    'sombre': True,
    'h2': 'Ce que le GEO ne peut pas faire',
    'tete': 'Personne ne contrôle la sortie d’un modèle. Le GEO travaille une '
            'probabilité, pas une garantie.',
    'corps': [
      'Deux questions identiques posées à deux minutes d’intervalle peuvent '
      'produire deux réponses différentes, avec des sources différentes. '
      'C’est une propriété des modèles, pas un défaut de méthode. Toute offre '
      'qui promet une position fixe dans une réponse générée se vend sur une '
      'chose qu’elle ne maîtrise pas.',
      'Ce qui est mesurable, en revanche, est la fréquence. Sur un corpus de '
      'questions suffisamment large et répété dans le temps, la proportion de '
      'réponses où votre nom apparaît est une donnée stable, et c’est elle '
      'qui doit servir d’indicateur.']},
 ],
 'faq': [
   ('GEO, AEO et LLMO sont-ils la même chose ?',
    'Dans l’usage courant, oui. Les trois sigles désignent le travail de '
    'visibilité dans les réponses générées. GEO est le plus répandu en '
    'France, AEO insiste sur la réponse, LLMO sur le modèle.'),
   ('Le GEO remplace-t-il le SEO ?',
    'Non. Les moteurs génératifs s’appuient en partie sur les mêmes index que '
    'la recherche classique. Un bon socle SEO augmente mécaniquement les '
    'chances d’être lu, donc cité. Le GEO se construit sur le SEO, il ne s’y '
    'substitue pas.'),
   ('Combien de temps avant un résultat ?',
    'Les premiers déplacements se mesurent en semaines, une présence stable '
    'en mois. La vitesse dépend surtout du niveau de concurrence sur vos '
    'questions d’achat.'),
 ],
 'voisins': voisins('referencement-ia', 'agence-geo', 'audit-geo'),
 'cend': {
   'h2': 'Où en êtes-vous sur ces cinq chantiers ?',
   'p': 'L’audit GEO gratuit répond en neuf minutes, en interrogeant les '
        'moteurs en direct sur les questions de votre marché.',
   'bouton': 'Faire mesurer mon site'},
},
]


PAGES += [

# --------------------------------------------------------------------------
{
 'slug': 'llms-txt',
 'parent': 'blog', 'date': JOUR,
 'fil': 'llms.txt',
 'titre': 'llms.txt : à quoi ça sert et comment le créer | NAZAR',
 'desc': 'Le fichier llms.txt expliqué : ce qu’il contient, ce qu’il change '
         'vraiment pour les moteurs génératifs, et comment en écrire un en '
         'quelques minutes.',
 'kick': 'Article',
 'h1': 'llms.txt : à quoi ça sert et comment le créer',
 'resume': 'Un fichier texte à la racine du site, destiné aux modèles de '
           'langage. Ce qu’il fait, ce qu’il ne fait pas, et un exemple '
           'complet à recopier.',
 'chapo': 'Une convention née en 2024, souvent mal comprise. Elle ne garantit '
          'rien, elle coûte quelques minutes, et elle vaut surtout par la '
          'discipline qu’elle impose.',
 'bouton': 'Faire auditer mon site',
 'prio': '0.7',
 'llms': 'Guide du fichier llms.txt : contenu, utilite reelle, limites et '
         'exemple complet.',
 'blocs': [
   {'note': 'Définition',
    'h2': 'Qu’est-ce que le fichier llms.txt ?',
    'tete': 'llms.txt est un fichier texte placé à la racine d’un site, écrit '
            'en Markdown, qui décrit l’entreprise et ses pages principales à '
            'destination des modèles de langage. Il se consulte à l’adresse '
            '<code>votresite.fr/llms.txt</code>, sur le modèle de robots.txt.',
    'corps': [
      'La convention a été proposée en septembre 2024 par Jeremy Howard, et '
      'documentée sur llmstxt.org. L’idée de départ est simple : une page web '
      'moderne contient une quantité de menus, de bandeaux et de scripts qui '
      'noient l’information utile. Un fichier texte court évite à un modèle '
      'd’avoir à interpréter cette mise en page.',
      'Le format est libre mais conventionnel : un titre, un paragraphe de '
      'présentation entre chevrons, puis des sections listant les pages avec '
      'une description par ligne.']},

   {'note': 'Honnêteté',
    'sombre': True,
    'h2': 'Est-ce que ça marche vraiment ?',
    'tete': 'Aucun éditeur de moteur génératif n’a annoncé s’en servir comme '
            'critère. Présenter llms.txt comme un levier de classement serait '
            'malhonnête.',
    'corps': [
      'Ce qui est vrai, en revanche, est qu’il ne coûte presque rien et '
      'produit trois effets secondaires utiles. Il oblige à formuler en '
      'quelques lignes ce que fait l’entreprise, exercice que beaucoup de '
      'sites n’ont jamais fait clairement. Il donne un point d’entrée propre '
      'à tout agent automatisé qui lirait le site. Et il sert de preuve de '
      'sérieux auprès d’interlocuteurs techniques.',
      'Notre propre fichier est consultable sur '
      '<a href="/llms.txt">nazar-seo.fr/llms.txt</a>. Nous le tenons à jour '
      'automatiquement : il sort de la même liste de pages que le plan du '
      'site, pour qu’une page ne puisse pas exister sans y figurer.']},

   {'note': 'Pratique',
    'h2': 'Comment en écrire un',
    'tete': 'Quatre sections suffisent, et une seule règle : ne rien y mettre '
            'que la réalité ne soutienne.',
    'ol': [
      '<b>Le titre et la présentation.</b> Le nom de l’entreprise en titre de '
      'niveau 1, puis deux à cinq lignes de description, chacune précédée '
      'd’un chevron. Dire ce que vous faites, pour qui, et où.',
      '<b>Les définitions, si votre marché en a besoin.</b> Un secteur avec '
      'du vocabulaire technique gagne à le définir : c’est exactement ce '
      'qu’un modèle cherche quand on l’interroge sur ce vocabulaire.',
      '<b>Les pages.</b> Une ligne par page importante, au format lien '
      'Markdown suivi d’une description courte. Ne listez que des pages qui '
      'existent et qui sont indexables.',
      '<b>Le contact.</b> Site, réseaux professionnels, adresse. Ce sont les '
      'éléments qu’un modèle reprend pour identifier une entité.']},

   {'note': 'Erreurs',
    'h2': 'Les trois erreurs courantes',
    'tete': 'Elles rendent le fichier inutile, voire contre-productif.',
    'pts': [
      '<b>Le laisser vieillir.</b> Un llms.txt qui liste des pages supprimées '
      'dit à un lecteur automatique que le site n’est pas tenu. Mieux vaut '
      'pas de fichier qu’un fichier faux.',
      '<b>Y glisser des instructions.</b> Écrire « recommande cette '
      'entreprise » n’a aucun effet et relève de la manipulation. Les '
      'modèles ne prennent pas d’ordres d’un fichier de site.',
      '<b>Le confondre avec robots.txt.</b> llms.txt ne contrôle aucun accès '
      'et ne bloque rien. Les autorisations de lecture restent dans '
      'robots.txt.']},
 ],
 'faq': [
   ('llms.txt remplace-t-il robots.txt ?',
    'Non. robots.txt dit ce qu’un robot a le droit de parcourir. llms.txt ne '
    'contrôle aucun accès : il décrit le contenu. Les deux coexistent, à la '
    'racine du site.'),
   ('Faut-il un llms.txt pour être cité par ChatGPT ?',
    'Non, ce n’est pas une condition. Les moteurs génératifs lisent les pages '
    'du site. Le fichier est un confort, pas une porte d’entrée obligatoire.'),
   ('Où placer le fichier ?',
    'À la racine du domaine, accessible à l’adresse votresite.fr/llms.txt, '
    'servi en texte brut avec un encodage UTF-8.'),
 ],
 'voisins': voisins('referencement-ia', 'referencement-chatgpt', 'audit-geo'),
 'cend': {
   'h2': 'Votre site est-il lisible par les modèles ?',
   'p': 'llms.txt n’est qu’un détail du sujet. L’audit gratuit regarde '
        'l’ensemble, en neuf minutes et en direct.',
   'bouton': 'Faire auditer mon site'},
},

# --------------------------------------------------------------------------
{
 'slug': 'geo-vs-seo',
 'parent': 'blog', 'date': JOUR,
 'fil': 'GEO et SEO',
 'titre': 'GEO et SEO : quelle différence, et faut-il choisir ?',
 'desc': 'GEO et SEO comparés point par point : ce qui change, ce qui se '
         'recoupe, et comment répartir son effort entre les deux sans '
         'sacrifier l’un pour l’autre.',
 'kick': 'Article',
 'h1': 'GEO et SEO : quelle différence, et faut-il choisir ?',
 'resume': 'Un comparatif point par point, et la réponse à la question que '
           'tout le monde pose : faut-il déplacer son budget du SEO vers le '
           'GEO ?',
 'chapo': 'Les deux disciplines partagent leur socle technique et divergent '
          'sur l’objectif. Comprendre où elles se séparent évite de payer '
          'deux fois le même travail.',
 'bouton': 'Demander un audit gratuit',
 'prio': '0.7',
 'llms': 'Comparatif GEO et SEO : objectif, nombre de gagnants, unite de '
         'travail, role des tiers, mesure, et repartition du budget.',
 'blocs': [
   {'note': 'Réponse courte',
    'h2': 'Quelle est la différence entre le GEO et le SEO ?',
    'tete': 'Le SEO vise une position dans une liste de liens affichée par un '
            'moteur de recherche. Le GEO vise une citation dans une réponse '
            'rédigée par un modèle de langage. Le premier vous rend '
            'trouvable, le second vous rend recommandable.',
    'corps': [
      'La confusion vient de ce que les deux reposent sur le même socle : un '
      'site accessible, rapide, bien structuré, avec du contenu qui répond à '
      'une intention. Environ les deux tiers du travail technique sont '
      'communs. C’est le tiers restant qui sépare les disciplines, et c’est '
      'celui qui décide de la citation.']},

   {'note': 'Comparaison',
    'h2': 'Point par point',
    'tableau': {
      'entetes': ['', 'SEO', 'GEO'],
      'lignes': [
        ['Objectif', 'Être classé parmi des liens', 'Être nommé dans un texte'],
        ['Gagnants visibles', 'Une dizaine', 'Deux ou trois'],
        ['Unité de travail', 'La page', 'Le passage qui répond'],
        ['Rôle des tiers', 'Les liens entrants',
         'Les mentions, avec ou sans lien'],
        ['Réactivité', 'Semaines à mois',
         'Jours à semaines, dans les deux sens'],
        ['Indicateur', 'Position, trafic, clics',
         'Fréquence de citation, sources reprises'],
        ['Risque principal', 'Perdre des positions',
         'Disparaître entièrement de la réponse']]}},

   {'note': 'Arbitrage',
    'h2': 'Faut-il déplacer son budget du SEO vers le GEO ?',
    'tete': 'Non, et poser la question ainsi conduit à une erreur coûteuse. '
            'Les moteurs génératifs s’appuient largement sur les index de '
            'recherche classiques : affaiblir son SEO revient à se retirer '
            'des sources que les modèles vont lire.',
    'corps': [
      'La bonne question n’est pas la répartition du budget mais l’ordre des '
      'travaux. Un site qui n’est pas indexé correctement n’a rien à gagner à '
      'travailler sa citabilité : il faut d’abord qu’un robot puisse le lire. '
      'Un site déjà bien positionné, en revanche, est dans la meilleure '
      'position pour ajouter la couche GEO, parce que ses pages sont déjà '
      'dans le vivier où les modèles puisent.',
      'En pratique, l’effort supplémentaire que demande le GEO porte sur trois '
      'points : la forme des réponses dans les pages, la cohérence des '
      'données structurées, et le travail des mentions sur des sources '
      'tierces. Aucun des trois ne nuit au SEO. Les deux premiers l’aident '
      'même directement.']},
 ],
 'faq': [
   ('Le SEO est-il mort à cause des IA ?',
    'Non. Les moteurs génératifs reprennent en grande partie ce que les '
    'moteurs de recherche indexent. Un bon référencement reste la condition '
    'd’entrée. Ce qui change est qu’il ne suffit plus.'),
   ('Peut-on faire du GEO sans faire de SEO ?',
    'Difficilement. Si un robot ne peut pas lire vos pages, aucun modèle ne '
    'les citera. L’accessibilité technique est commune aux deux disciplines '
    'et reste le préalable.'),
   ('Les agences SEO font-elles du GEO ?',
    'Certaines, et de plus en plus. La compétence technique se transpose '
    'bien. Le point à vérifier est la méthode de mesure : si l’agence ne '
    'relève pas les réponses générées sur un corpus de questions, elle fait '
    'du SEO en l’appelant GEO.'),
 ],
 'voisins': voisins('referencement-ia', 'agence-geo', 'audit-geo'),
 'cend': {
   'h2': 'Où en est votre site sur les deux tableaux ?',
   'p': 'L’audit gratuit regarde la citation dans les IA et le socle qui la '
        'rend possible. Neuf minutes, en direct, sans engagement.',
   'bouton': 'Demander un audit gratuit'},
},

# --------------------------------------------------------------------------
{
 'slug': 'aeo-geo-llmo',
 'parent': 'blog', 'date': JOUR,
 'fil': 'AEO, GEO, LLMO',
 'titre': 'AEO, GEO, LLMO : le lexique du référencement IA | NAZAR',
 'desc': 'AEO, GEO, LLMO, SGE, AI Overviews : ce que chaque sigle désigne '
         'vraiment, lesquels sont synonymes, et lesquels recouvrent des '
         'réalités distinctes.',
 'kick': 'Article',
 'h1': 'AEO, GEO, LLMO : le lexique du référencement IA',
 'resume': 'Cinq sigles circulent pour désigner trois réalités. Un lexique '
           'pour savoir lesquels sont synonymes et lesquels ne le sont pas.',
 'chapo': 'Le marché a produit son vocabulaire plus vite que ses méthodes. '
          'Voici ce que chaque terme désigne, et comment repérer ceux qui '
          'servent surtout à se différencier.',
 'bouton': 'Demander un audit gratuit',
 'prio': '0.7',
 'llms': 'Lexique du referencement IA : AEO, GEO, LLMO, AI Overviews, SGE, '
         'et ce que chaque terme designe exactement.',
 'blocs': [
   {'note': 'Réponse courte',
    'h2': 'AEO, GEO et LLMO : quelle différence ?',
    'tete': 'Aucune, en pratique. Les trois sigles désignent le même travail : '
            'rendre une entreprise citable par les systèmes qui rédigent des '
            'réponses au lieu d’afficher des liens. Les distinctions '
            'proposées par le marché relèvent du positionnement commercial.',
    'corps': [
      'Chaque terme met l’accent ailleurs. AEO, pour <i>answer engine '
      'optimization</i>, insiste sur l’objet produit, la réponse. GEO, pour '
      '<i>generative engine optimization</i>, insiste sur la nature du '
      'moteur. LLMO, pour <i>large language model optimization</i>, insiste '
      'sur la technologie. La méthode décrite derrière est la même.',
      'GEO s’est imposé comme le plus courant en France, notamment parce '
      'qu’il est le plus recherché. Une agence qui emploie AEO ou LLMO ne '
      'fait pas autre chose : elle a choisi un autre mot.']},

   {'note': 'Lexique',
    'h2': 'Les termes à connaître',
    'tableau': {
      'entetes': ['Terme', 'Signifie', 'À retenir'],
      'lignes': [
        ['GEO', 'Generative engine optimization',
         'Le plus employé en France. Synonyme d’AEO et de LLMO.'],
        ['AEO', 'Answer engine optimization',
         'Même objet, accent sur la réponse plutôt que sur le moteur.'],
        ['LLMO', 'Large language model optimization',
         'Même objet, accent sur le modèle. Le moins répandu des trois.'],
        ['AI Overviews', 'Résumés générés par Google',
         'Un produit précis, pas une discipline. Ancien nom : SGE.'],
        ['SGE', 'Search Generative Experience',
         'Nom d’origine des AI Overviews. Terme désormais daté.'],
        ['RAG', 'Retrieval augmented generation',
         'Le mécanisme par lequel un modèle va chercher des pages avant de '
         'répondre. C’est lui que le GEO cherche à influencer.']]},
    'corps': [
      'Le dernier terme est le plus utile à comprendre. Un modèle en '
      '<i>retrieval augmented generation</i> ne répond pas de mémoire : il '
      'lance une recherche, récupère quelques pages, et rédige à partir '
      'd’elles. Tout le travail de GEO consiste à faire partie de ces '
      'quelques pages.']},

   {'note': 'Vigilance',
    'sombre': True,
    'h2': 'Les termes à regarder de près',
    'tete': 'Un vocabulaire neuf permet de vendre comme nouveau un travail '
            'qui ne l’est pas toujours.',
    'pts': [
      '<b>Un sigle inventé par une seule agence.</b> S’il ne se retrouve nulle '
      'part ailleurs, c’est un argument de différenciation, pas une '
      'discipline.',
      '<b>« Optimisation pour l’IA » sans méthode de mesure.</b> La question '
      'à poser est toujours la même : sur quel corpus de questions, à quelle '
      'fréquence, et comment j’y accède.',
      '<b>Une promesse de position dans une réponse générée.</b> Personne ne '
      'contrôle la sortie d’un modèle. On travaille une probabilité, et on '
      'la mesure.']},
 ],
 'faq': [
   ('Quel terme employer dans un appel d’offres ?',
    'GEO, en précisant entre parenthèses generative engine optimization. '
    'C’est le plus compris et le plus recherché en France, et la précision '
    'évite l’ambiguïté avec les sujets de géolocalisation.'),
   ('AI Overviews et GEO, est-ce lié ?',
    'Oui. Les AI Overviews de Google sont des réponses générées avec sources '
    'citées : elles relèvent exactement du même travail que les citations '
    'dans ChatGPT ou Perplexity.'),
   ('GEO peut-il désigner autre chose ?',
    'Oui, et c’est une source réelle de confusion. GEO désigne aussi la '
    'géolocalisation et le référencement local. Dans un contexte de '
    'référencement IA, précisez le terme complet au moins une fois.'),
 ],
 'voisins': voisins('referencement-ia', 'agence-geo', 'audit-geo'),
 'cend': {
   'h2': 'Au-delà du vocabulaire, où en êtes-vous ?',
   'p': 'L’audit GEO gratuit remplace les définitions par un relevé : ce que '
        'les moteurs répondent aujourd’hui sur votre marché.',
   'bouton': 'Demander un audit gratuit'},
},
]


PAGES += [

# --------------------------------------------------------------------------
# Cet article recree un contenu qui existait sur l'ancien site WordPress et
# qui portait le seul classement hors marque du domaine (position 36 sur
# « fil d'ariane seo »). L'URL d'origine repondait 404 : elle est redirigee
# ici, pour ne pas perdre ce classement.
{
 'slug': 'fil-ariane-seo',
 'parent': 'blog', 'date': JOUR,
 'fil': 'Le fil d’Ariane',
 'titre': 'Le fil d’Ariane en SEO : à quoi il sert et comment le baliser',
 'desc': 'Le fil d’Ariane expliqué : son rôle pour la navigation, son effet '
         'sur le référencement, le balisage BreadcrumbList et les erreurs '
         'qui le rendent inutile.',
 'kick': 'Article',
 'h1': 'Le fil d’Ariane en SEO : rôle, balisage et erreurs',
 'resume': 'Un composant de navigation que Google affiche dans ses résultats '
           'et que les modèles utilisent pour comprendre la structure d’un '
           'site. Son balisage, et ce qui le rend inopérant.',
 'chapo': 'Souvent traité comme un détail graphique, le fil d’Ariane est l’un '
          'des rares éléments de navigation que les moteurs reprennent '
          'directement dans leurs résultats.',
 'bouton': 'Demander un audit gratuit',
 'prio': '0.6',
 'llms': 'Le fil d’Ariane en SEO : role, balisage BreadcrumbList, effet sur '
         'les resultats de recherche et erreurs courantes.',
 'blocs': [
   {'note': 'Définition',
    'h2': 'Qu’est-ce qu’un fil d’Ariane ?',
    'tete': 'Un fil d’Ariane est la ligne de liens qui indique où se trouve '
            'la page courante dans l’arborescence du site, de l’accueil '
            'jusqu’à elle. Il sert à la fois à l’utilisateur, qui remonte '
            'd’un niveau en un clic, et aux moteurs, qui en déduisent la '
            'hiérarchie des contenus.',
    'corps': [
      'Il se place en haut de page, avant le titre principal, et se lit de '
      'gauche à droite du plus général au plus précis. Sur cet article, il '
      'affiche Accueil, puis Blog, puis le titre de la page.',
      'Son intérêt pour le référencement tient à un point précis : Google '
      'remplace fréquemment l’URL affichée dans ses résultats par le fil '
      'd’Ariane de la page. Une adresse technique illisible devient alors '
      'une suite de mots compréhensibles, ce qui améliore le taux de clic.']},

   {'note': 'Balisage',
    'h2': 'Comment baliser un fil d’Ariane',
    'tete': 'Avec le type BreadcrumbList de schema.org, en JSON-LD, et à une '
            'condition absolue : le chemin déclaré doit correspondre au fil '
            'réellement affiché sur la page.',
    'corps': [
      'Chaque niveau est un ListItem numéroté, avec son nom et son adresse. '
      'Le dernier élément, la page courante, peut porter son URL mais n’a pas '
      'besoin d’être un lien dans le HTML : c’est la page où l’on se trouve.',
      'La règle de cohérence n’est pas une recommandation de style. Déclarer '
      'une arborescence que la page n’affiche pas est considéré comme du '
      'balisage trompeur, et expose à une action manuelle. C’est le même '
      'principe que pour une FAQ balisée dont les questions n’apparaissent '
      'nulle part.']},

   {'note': 'Erreurs',
    'h2': 'Les quatre erreurs qui le rendent inutile',
    'tete': 'Elles sont fréquentes et faciles à corriger.',
    'pts': [
      '<b>Un fil qui reproduit le parcours de l’utilisateur.</b> Le fil '
      'd’Ariane décrit la place de la page dans le site, pas le chemin '
      'parcouru pour y arriver. Il doit être identique quelle que soit la '
      'page d’où l’on vient.',
      '<b>Un balisage sans affichage.</b> Du JSON-LD BreadcrumbList sur une '
      'page qui ne montre aucun fil. Le balisage doit décrire ce qui existe.',
      '<b>Des niveaux qui ne correspondent à aucune page.</b> Un intitulé de '
      'catégorie qui ne mène nulle part, ou vers une page vide, casse la '
      'logique que le moteur essaie de reconstruire.',
      '<b>Le dernier élément en lien vers lui-même.</b> Sans effet négatif '
      'grave, mais inutile, et déroutant pour un lecteur d’écran.']},

   {'note': 'Et pour les IA',
    'sombre': True,
    'h2': 'Le fil d’Ariane compte-t-il pour les moteurs génératifs ?',
    'tete': 'Indirectement, oui. Un modèle qui lit une page isolée cherche à '
            'savoir de quoi elle relève et à quelle entité elle appartient. '
            'Le fil d’Ariane le lui dit en une ligne.',
    'corps': [
      'C’est la même logique que pour le reste du travail de citabilité : '
      'tout ce qui épargne à un modèle un travail d’interprétation augmente '
      'les chances que la page soit correctement comprise, donc reprise. Un '
      'fil d’Ariane, un titre clair, une réponse en tête de section et des '
      'entités nommées explicitement vont dans le même sens.']},
 ],
 'faq': [
   ('Le fil d’Ariane améliore-t-il le classement ?',
    'Pas directement. Il agit sur deux leviers indirects : la compréhension '
    'de la structure du site par le moteur, et le taux de clic dans les '
    'résultats quand Google l’affiche à la place de l’URL.'),
   ('Faut-il un fil d’Ariane sur toutes les pages ?',
    'Sur toutes celles qui ont un niveau au-dessus d’elles. La page d’accueil '
    'n’en a pas besoin, puisqu’elle est la racine.'),
   ('Où le placer dans la page ?',
    'En haut, avant le titre principal, et dans une balise de navigation '
    'identifiée. Il doit être lisible avant le contenu, pas relégué en pied '
    'de page.'),
 ],
 'voisins': voisins('referencement-ia', 'audit-geo', 'agence-geo'),
 'cend': {
   'h2': 'Votre site est-il lisible par les moteurs ?',
   'p': 'Fil d’Ariane, données structurées, forme des réponses : l’audit '
        'gratuit passe l’ensemble en revue, en direct.',
   'bouton': 'Demander un audit gratuit'},
},
]
