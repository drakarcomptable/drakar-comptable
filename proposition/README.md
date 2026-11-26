# Proposition d'audit GEO

Genere un PDF a envoyer a un prospect : page de garde avec une capture de
son site, les requetes de son marche, ce que nous avons vu chez lui, qui
est NAZAR, et l'invitation a un echange de 9 minutes.

Quatre pages, ou cinq quand la proposition porte des reperes rouges sur
une capture.

## DONETADOC

La porte d'entree. On colle l'adresse d'un prospect, on appuie, et le
document se fabrique.

    python3 proposition/outil.py

Puis <http://127.0.0.1:8080>.

Le travail dure une a deux minutes et rend compte de son avancement, parce
qu'une page qui ne dit rien pendant deux minutes donne l'impression d'etre
plantee. Quatre etapes : lecture du site, photographie des sections,
montage, fabrication.

**Deux choses peuvent manquer, et ce ne sont pas des erreurs.** Si le site
refuse d'etre photographie, le travail se met en PAUSE et demande deux
captures a deposer. Si le site ne repond pas du tout, il demande une autre
adresse. Dans les deux cas il reprend la ou il s'est arrete.

**Modifier la doc** accepte des instructions ecrites. Ce qui n'est pas
compris est dit, jamais devine : une modification mal interpretee sur un
document commercial coute plus cher qu'une modification refusee. Les
instructions reconnues sont listees dans `AIDE_COMMANDES`
(`donnetadoc.py`) et s'affichent dans l'outil des qu'une commande echoue.

### Ce que l'outil etablit tout seul, et ce qu'il n'invente pas

`analyse.cjs` ne sort que des faits verifiables : une balise titre existe
ou non, robots.txt laisse passer GPTBot ou non, la page porte des donnees
structurees ou non. Ces constats deviennent les premiers reperes rouges.

Il tire aussi des **pistes de requetes** des titres et du menu du site. Ce
sont des pistes, pas des volumes : **un volume de recherche n'est pas
devinable**, il demande un outil de mots-cles. Tant qu'aucun volume reel
n'est saisi, la fiche reste marquee `exemple` et la proposition l'ecrit
noir sur blanc. On corrige ensuite avec `volume de <requete> : <nombre>`.

## Lancer

Deux facons. L'interface est la plus simple, le fichier JSON sert quand on
veut rejouer une proposition a l'identique.

### L'interface

    python3 proposition/outil.py

Puis ouvrir <http://127.0.0.1:8080>. On y saisit le prospect et ses
requetes, on depose les deux captures, on trace les reperes rouges a la
souris sur la seconde, et on recupere le PDF.

### Le fichier

    python3 proposition/gen.py proposition/donnees/<prospect>.json

Le PDF sort dans `proposition/sortie/`. Les images deposees par
l'interface sont rangees dans `proposition/depots/`, avec le JSON
correspondant : une proposition faite a l'interface est donc rejouable
telle quelle en ligne de commande.

Ni `sortie/` ni `depots/` ne partent dans le depot git : ce sont des
donnees de prospects, pas du code.

## Le mettre en ligne pour l'equipe

### Le mot de passe d'abord

L'outil fabrique des documents qui portent des noms et des logos de
clients. Un lien ouvert a tout vent les donnerait a qui le devine.

    HOTE=127.0.0.1    acces libre, la machine seule          (defaut)
    HOTE=0.0.0.0      ouvert au reseau, mot de passe EXIGE

Sans `DONETADOC_MDP`, l'outil **refuse de demarrer** sur `0.0.0.0` plutot
que de s'ouvrir. Pour assumer un acces libre il faut le dire :
`DONETADOC_OUVERT=oui`. Un garde-fou qui s'enleve par accident n'en est
pas un ; celui-la ne s'enleve qu'exprès.

Le service en ligne tourne aujourd'hui en acces libre, par choix.
Quiconque connait l'adresse peut fabriquer un document au nom de NAZAR,
avec les logos des clients dessus. L'authentification est une authentification HTTP simple,
comparee a temps constant pour qu'un temps de reponse ne trahisse pas
combien de caracteres du mot de passe sont justes.

`/sante` est la seule adresse qui repond sans mot de passe : l'hebergeur
doit pouvoir verifier que le service est vivant, et cette reponse ne
divulgue rien.

### Pourquoi un conteneur et pas une fonction

L'outil a besoin d'un vrai Chromium, et un document demande une a deux
minutes. Une fonction sans etat ne tient ni la taille (Chromium pese plus
que ce qu'elle accepte d'embarquer) ni la duree. Il lui faut un service
qui vit.

### Marche a suivre

Le depot porte `render.yaml` et `proposition/Dockerfile`.

1. Sur Render, « New » puis « Blueprint », et pointer le depot.
2. Render lit `render.yaml` et propose le service `donetadoc`.
3. Saisir `DONETADOC_MDP` quand il le demande. Il n'est pas dans le depot
   et ne doit jamais y entrer.
4. Mettre en ligne. La premiere construction est longue : l'image
   Playwright pese lourd.

L'adresse obtenue est le lien interne. Identifiant `nazar`, mot de passe
celui qui a ete saisi.

`autoDeploy` est a `false` volontairement : un document commercial ne doit
pas changer de forme parce qu'un commit est passe. On remet en ligne quand
on le decide.

### Le navigateur ne garde rien

Toutes les reponses portent `Cache-Control: no-store`. Sans cela, une
page gardee en memoire continue de faire tourner l'ancien code apres une
remise en ligne : un poste est reste sans le telechargement automatique
alors qu'il etait deja en service, et une page d'erreur est revenue
apres un clic qui avait pourtant abouti. Rien ici ne gagne a etre garde
par le navigateur, et beaucoup y perd.

### Ce qui disparait au redemarrage

`depots/` et `sortie/` sont volatils : le disque du service est efface a
chaque remise en ligne. Un lien de telechargement garde le temps d'une
reunion ne vaut donc plus rien, et c'est arrive : la page repondait
« absent » sur fond blanc, ce qui n'explique rien a la personne qui
voulait son document.

Deux reponses. L'outil **prend le document des qu'il est pret**, sans
attendre le clic, pendant qu'il existe encore ; le bouton reste pour une
seconde copie ou si le navigateur refuse l'enregistrement automatique.

Et un lien devenu caduc n'est plus un cul-de-sac : la page porte un champ
d'adresse, et la fabrication repart de la. Elle renvoyait d'abord vers
l'accueil, ou il fallait retrouver l'adresse du prospect et la recoller ;
entre les deux on revenait au lien mort, et on croyait l'outil casse.
L'adresse voyage donc dans `/?url=`, et la page d'accueil la reprend
toute seule.

Rendre les liens durables demanderait un disque persistant chez
l'hebergeur, qui se paie en plus. Tant qu'un document se recupere a la
fabrication, ca n'en vaut pas la peine.

## Photographier le site du prospect

Dans l'interface, un bouton parcourt la page du prospect et la **decoupe en
sections**, puis les propose en vignettes. On choisit celle qui habille la
couverture et celle qu'on va annoter.

Pourquoi decouper plutot que prendre le haut de la page : le haut d'une page
d'accueil est l'endroit ou un site est a son avantage, grand titre, boutons,
chiffres. Les defauts qui nous interessent sont plus bas, dans les blocs de
contenu, la ou le site repond ou ne repond pas a une intention de recherche.

Chaque section recoit une **note de merite**, batie sur des comptages et
non sur un avis : un titre qui annonce une offre, beaucoup de puces, peu
de phrases, aucun chiffre. Autrement dit le bloc qui vend quelque chose
sous une forme qu'aucune IA ne peut reprendre. Le haut de page est penalise
(il flatte toujours), les pieds de page et les mentions le sont aussi.

Sur bsecure.fr : « Nos expertises Pentest & Audit » note 64, le slogan
d'accueil −25, « Contactez-nous » −50.

DONETADOC retient automatiquement la mieux notee. Le formulaire detaille
montre les vignettes et laisse choisir a la main.

### Ou se pose l'etiquette d'un repere

Pas du cote ou le cadre est le moins centre, mais du cote ou il reste de
la place. Juger au centre donnait des resultats absurdes a la frontiere :
un cadre centre a 50,05 % partait a gauche alors qu'il restait autant de
place des deux cotes, et l'etiquette sortait de la page en coupant son
premier mot.

Un cadre large ne laisse de place nulle part. Son etiquette se pose alors
au-dessus du cadre, ou en dessous quand il touche le haut de l'image. Et
elle peut se replier sur plusieurs lignes : `white-space:nowrap`
l'empechait, donc une phrase un peu longue debordait forcement.

## Deux reperes ne se marchent plus dessus

Chaque repere choisissait son cote sans savoir ou etaient les autres, et
deux etiquettes finissaient l'une sur l'autre, illisibles toutes les
deux. Les positions sont maintenant essayees dans l'ordre du plus
confortable au moins, et la premiere qui ne tombe pas sur une etiquette
deja posee est retenue.

## Les reperes rouges automatiques

Ils parlent de la section montree, et d'elle seule : combien de puces,
combien de phrases, combien de chiffres, combien de questions. Un constat
qui vaut pour tout le site, comme l'absence de `llms.txt`, ne devient pas
une fleche : elle designerait un titre au hasard et decredibiliserait la
page. Les emplacements sont des defauts a deplacer, pas des mesures.

## Le nom du fichier telecharge

Un « b-secure.pdf » se perd dans un dossier de telechargements. Le
document part donc sous le nom **Proposition audit GEO gratuit
&lt;Entreprise&gt;.pdf**.

Sur le disque le fichier garde son nom d'identifiant, sans accent ni
espace, parce que c'est lui qui sert d'adresse. `gen.py` ecrit le nom
lisible dans un fichier `.nom` a cote, et le serveur le pose dans
l'en-tete de telechargement, sous les deux formes que les navigateurs
attendent pour que les accents passent.

En ligne de commande :

    node proposition/sections.cjs <url> <dossier> [prefixe]

Il ecrit les images et decrit chaque vue en JSON. Une section est retenue si
elle fait plus de 260 px de haut, moins de 1500, occupe au moins 60 % de la
largeur et contient du texte ; dix au maximum. La page est parcourue de haut
en bas avant la prise de vue, parce que beaucoup de sites ne chargent leurs
images qu'au passage du lecteur.

## Savoir si la mise en ligne est passee

`autoDeploy` est a `false` : une mise a jour du depot ne part pas toute
seule, il faut la declencher. Restait a savoir ce qui tourne reellement,
et la seule facon etait de fabriquer un document entier pour lire son
journal.

`/sante` rend maintenant `ok` suivi d'une empreinte des sources :

    curl -s https://donetadoc.onrender.com/sante
    python3 -c "import sys;sys.path.insert(0,'proposition');import outil;print(outil.empreinte())"

Meme empreinte, le code en ligne est celui du depot. Empreinte
differente, la mise en ligne n'est pas passee. C'est une requete au lieu
de deux minutes.

## De vraies requetes, et la preuve que le prospect n'y est pas

Les requetes venaient des titres du site : « their words »,
« highlighted work ». Personne ne tape ca, et un prospect le voit a la
premiere ligne.

`requetes.py` les tire maintenant de l'autocompletion de Google, c'est a
dire de ce que de vraies personnes tapent vraiment, puis verifie chacune
sur une vraie page de resultats : le site ressort-il dans les liens, et
surtout **est-il cite par la reponse de l'IA de Google**.

C'est ce second point qui vaut le detour. Sur « agence vidéo saas »,
l'IA de Google cite huit sites, et le prospect n'en fait pas partie. La
colonne « requetes sur lesquelles vous n'etes pas cite » cesse d'etre une
affirmation et devient un constat, avec le nom des concurrents cites a la
place (`_concurrents_ia` dans la fiche).

### Ce qu'il faut pour que ca marche

La variable `SERP_API_KEY`. **Elle doit etre posee sur l'hebergeur**, pas
seulement sur un poste : sans elle le service repart sur l'ancienne
methode, le dit dans le journal, et ne plante pas.

Un document consomme environ sept recherches du forfait : une ou deux
d'autocompletion, puis une recherche et une lecture de la reponse IA par
requete verifiee. Le plafond est dans `BUDGET` : un document ne peut pas
vider le quota du mois a lui tout seul.

### Ce que le filtre ecarte, et pourquoi

- le **mobilier de site** et les intentions qui ne sont pas commerciales
  (`jobs`, `avis`, `definition`, `gratuit`) ;
- les **lieux qui ne sont pas les siens**. L'autocompletion repond au
  monde entier : proposer « cabinet conseil management maroc », ou meme
  « nantes », a un cabinet bordelais est une erreur visible. Une ville
  n'est gardee que si le site en parle lui-meme ;
- les **requetes de marque**, mais seulement quand *tous* les mots de la
  marque y sont. Comparer la marque en sous-chaine etait faux : « x » se
  trouve dans « bordeaux », et une marque appelee « Pro Video » aurait
  emporte « production video entreprise », qui est pourtant exactement
  son marche.

### Par quoi on commence a taper

L'autocompletion ne vaut que ce que vaut la graine qu'on lui donne, et
une graine tiree d'une page secondaire emmene toute la recherche
ailleurs. Sur bsecure.fr, une mention d'hebergement a suffi a faire
sortir « modèle attestation d'hébergement », une requete administrative
sans aucun rapport avec un pentester.

Les mots du site sont donc peses : la balise titre et le H1 comptent
triple, un titre de section ou un item de menu compte une fois. Le noyau
de bsecure.fr devient pentests, audits, cyberattaque, cybersecurite, et
les graines en sortent seules. Une suggestion qui ne touche pas ce noyau
est ecartee.

La comparaison se fait sur les racines. Sans cela le noyau contenait
« pentests » et la requete « pentest as a service » ne correspondait a
rien : un « s » decidait du sort de la recherche. Le filtre reste
volontairement severe, et laisse passer moins de requetes qu'il n'en
existe : une requete manquante se rattrape a la main, une requete hors
sujet part chez le prospect.

Resultat sur bsecure.fr : « pentest as a service », « pentest
assurance », « pentest anssi », aucune des trois citee par l'IA de
Google, qui cite a la place Synack, Cobalt, HackerOne et NetSPI.

### Trois pieges que l'autocompletion tend

**La traduction.** « dechets industriels banals en anglais » n'est pas
une requete de marche, c'est quelqu'un qui cherche a traduire. Le nom
d'une langue etrangere trahit presque toujours cette intention.

**Le hors-sujet qui porte les bons mots.** « dechets industriels no
man's sky » a passe tous les filtres : ses deux premiers mots sont ceux
du site. Ce que l'IA citait ne laissait aucun doute, trois YouTube et un
site de jeux. Quand la reponse de Google s'appuie pour moitie sur du non
marchand, la requete est ecartee et le journal le dit. C'est une preuve,
pas une supposition : elle vient de la page qu'on vient de lire.

**Les services jetes par le filtre.** « location de bennes » n'emploie
aucun mot du titre, et se trouvait donc ecarte comme hors sujet, alors
que c'est exactement le genre de requete recherche. Une piste sans mot
du noyau passe maintenant apres les autres, elle n'est plus jetee.

### Sa limite, qu'il faut connaitre

Sur un site **en francais**, la chaine se suffit a elle-meme : les mots
du site font de bonnes graines et l'autocompletion rend de vraies
requetes francaises.

Sur un site **en anglais** vise sur le marche francais, elle derive :
« video saas » rend « video saas demo » et « video saasu maa ». Rien ici
ne traduit « video agency for SaaS » en « agence vidéo saas ». Cette
etape-la demande autre chose, et en attendant on la fait a la main avec
la commande ci-dessous.

## Imposer les requetes a la main

L'outil lit le site, il ne connait pas le metier. Quand il se trompe, on
le corrige dans « Modifier la doc » sans avoir a inventer un volume en
face :

    requêtes : production vidéo SaaS, vidéo marketing produit

Trois au maximum, les suivantes sont ignorees et l'outil le dit. Les
volumes sont recalcules par la regle habituelle, celle qui ne descend
jamais a zero et ne promet jamais plus de demandes que personne ne
croirait. « mots-clés : ... » fait la meme chose.

## Une page vide n'est pas une page

Mesure faite sur chromaction.fr depuis le serveur en ligne :

    reponse : 200 OK, servie par LiteSpeed
    page servie : «  », 0 caracteres de texte
    mise en page : 0 blocs mesurables, hauteur 0
    couverture : PRESQUE VIDE, 8 Ko apres 3 essais

Le site repond, la navigation aboutit, et la page reste sans un
caractere ni un bloc. Depuis un poste ordinaire le meme site rend 3 253
caracteres et 107 blocs. La lecture du site par `analyse.cjs` passe dans
les deux cas : c'est la visite au navigateur qui ne recoit rien.

Le decoupage s'arrete donc net quand la page arrive vide, au lieu de
livrer une couverture grise et un document sans page de diagnostic. On
bascule sur le depot des deux captures a la main, qui existe pour ce cas.

Il serait possible de se presenter au site sous une autre identite que
celle d'un navigateur automatique. Ce n'est pas fait : un site qui ne
sert rien a une visite automatique a pris une decision, et la contourner
n'est pas une decision technique.

## Quand ca marche ici et pas en ligne

C'est arrive, et le journal du travail n'en disait rien : couverture
blanche et document sans page de diagnostic, sans rien pour savoir
pourquoi. La cause de ce silence etait `_node`, qui jetait la sortie
d'erreur des scripts des qu'ils rendaient la main sans code d'erreur.
`sections.cjs` ecrivait bien « capture presque vide », personne ne la
lisait.

La sortie d'erreur est donc gardee et recopiee dans le journal. Elle dit
maintenant, a chaque document :

- **quelle page est reellement arrivee** : titre, adresse finale et
  nombre de caracteres de texte. Le meme code et le meme navigateur ne
  donnent pas forcement la meme page : un pare-feu peut servir une page
  de controle a l'adresse IP d'un hebergeur et le vrai site ailleurs ;
- **la mise en page** : combien de blocs sont mesurables et quelle
  hauteur fait la page ;
- **le decoupage** : combien de blocs examines, combien retenus, et pour
  quelle raison les autres ont ete ecartes ;
- **les notes** de chaque section retenue ;
- **le poids de chaque photo**, et le nombre d'essais qu'elle a demandes.

Un document a quatre pages au lieu de cinq veut dire qu'aucune section
n'a ete notee. La ligne « decoupage » dit alors si les blocs ont ete
ecartes sur leur taille, leur largeur ou leur absence de texte.

### Reproduire une machine lente

Le serveur en ligne tourne sur un seul processeur. Une correction qui
passe ici et echoue la-bas coute un aller-retour a chaque fois.

    DONETADOC_LENT=6 node proposition/sections.cjs <url> <dossier> essai

Le processeur du navigateur est bride d'autant. A titre de mesure,
chromaction.fr rend les memes 107 blocs et la meme couverture de 147 Ko a
1x, 6x et 20x : la lenteur de la machine, a elle seule, ne suffit pas a
expliquer une couverture blanche.

## Les captures

La capture automatique demande un acces reseau sortant vers le site du
prospect. Elle fonctionne depuis un poste de travail ordinaire. Elle
echoue des que le site est injoignable : reseau filtre, site derriere un
mot de passe, page qui refuse les robots. Dans ce cas la fabrication
continue et la page de garde recoit un aplat a la place de l'image, sans
message d'erreur imprime sur le PDF.

C'est pour ce cas que l'interface accepte deux images a la main :

- **capture d'accueil** (`capture_accueil`) : elle habille la couverture ;
- **capture a annoter** (`capture_analyse`) : elle porte les reperes rouges.

Une image fournie l'emporte toujours sur la capture automatique.

Quand aucune image n'est fournie, `rendu.cjs` prend sa propre capture de
secours. Elle attendait 3,3 secondes en tout sans rien verifier, la ou le
decoupage attend la mise en page, retire les bandeaux de consentement et
recommence si la photo est quasi vide. Les deux suivent desormais la meme
procedure : il n'y a plus deux facons de photographier un site, dont une
seule etait solide.

## Ou se pose l'etiquette d'un repere

Pas du cote ou le cadre est le moins centre, mais du cote ou il reste de
la place. Juger au centre donnait des resultats absurdes a la frontiere :
un cadre centre a 50,05 % partait a gauche alors qu'il restait autant de
place des deux cotes, et l'etiquette sortait de la page en coupant son
premier mot.

Un cadre large ne laisse de place nulle part. Son etiquette se pose alors
au-dessus du cadre, ou en dessous quand il touche le haut de l'image. Et
elle peut se replier sur plusieurs lignes : `white-space:nowrap`
l'empechait, donc une phrase un peu longue debordait forcement.

## Deux reperes ne se marchent plus dessus

Chaque repere choisissait son cote sans savoir ou etaient les autres, et
deux etiquettes finissaient l'une sur l'autre, illisibles toutes les
deux. Les positions sont maintenant essayees dans l'ordre du plus
confortable au moins, et la premiere qui ne tombe pas sur une etiquette
deja posee est retenue.

## Les reperes rouges

Ils sont donnes en pourcentage de **l'image**, pas du cadre qui l'accueille
dans la page. Le rendu les recale sur le rectangle reellement occupe par
l'image, sans quoi ils glisseraient des qu'une capture n'a pas le meme
rapport que son cadre.

Cet essai le verifie, et echoue si la regle casse :

    bash proposition/essais/lance.sh

Il fabrique une proposition a partir d'une image d'etalonnage portant des
pastilles vertes a des pourcentages connus, puis mesure en pixels si les
cadres rouges tombent bien dessus.

## Le poids du fichier

Chromium ne recopie pas une image WebP telle quelle dans un PDF : il la
decode et la re-encode **sans compression**. Les quatre photos de cas
pesaient 184 Ko en WebP et ressortaient a 3,2 Mo dans le fichier. Un JPEG,
lui, est recopie tel quel.

`proposition/visuels.cjs` fabrique les copies JPEG allegees utilisees par
le rendu, dans `proposition/visuels/` :

    node proposition/visuels.cjs

Le rendu prend le visuel allege s'il existe, sinon la source. Deposer une
photo dans `proposition/equipe/` suffit donc a la voir apparaitre ; la
passer dans `visuels.cjs` ne fait que l'alleger. A relancer apres avoir
ajoute ou remplace une photo.

Pour la meme raison, la capture automatique est enregistree en JPEG et pas
en PNG : une capture de site est une photo.

## Un gros cadre, pas un trait fin

Le repere entourait le titre d'un bloc. C'etait juste et sans effet : sur
un document commercial, ce qu'on montre c'est « tout ce pave ne dit rien
a une IA ». Le decoupage releve donc aussi le plus grand conteneur qui
porte vraiment du texte, en ne comptant que sa partie visible dans la
photo, et en s'arretant a 82 % de l'image : au-dela le cadre ne designe
plus rien.

Sur bsecure.fr, le cadre couvre les quatre cartes d'expertise d'un seul
tenant au lieu de souligner leur titre.

## Le nombre de demandes par mois n'est pas un chiffre magique

Il est calcule, jamais saisi a la main :

Les volumes sont ceux d'une niche, pas d'un marche de masse. 1 370
recherches pour 5 a 6 demandes se lisait mal : un prospect qui fait la
division trouve 0,4 % et en conclut que l'essentiel de son marche lui
echappe de toute facon. Une requete tres precise, posee a une IA par
quelqu'un qui cherche deja un prestataire, a un faible volume et une
forte part de prise de contact. C'est le propos de la page : peu de
monde, mais les bonnes personnes. En B2B cela donne 40, 30 et 20
recherches, 90 au total, a 6,1 %.


    demandes = volume mensuel total x taux de prise de contact

Le taux est un parametre du fichier de donnees et il est **imprime sur la
page**. Un prospect qui lit « 1 240 recherches, a 0,5 %, soit 6 demandes »
peut contester l'hypothese. Un prospect qui lit « 6 demandes » sans savoir
d'ou ca sort cesse de nous croire des qu'il y reflechit.

C'est la difference entre une estimation et une promesse inventee.

## Les logos des cas clients

Un logo clair ne se voit pas sur une plaque blanche, et l'inverser
fausserait ses couleurs de marque. Les entrees concernees portent donc
`clair: true` dans `CAS` (`rendu.cjs`), ce qui leur donne une plaque
sombre de meme forme que les autres. A verifier quand on ajoute un logo :
deux des quatre sont dans ce cas.
