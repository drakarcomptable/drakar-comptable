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

### Ce qui disparait au redemarrage

`depots/` et `sortie/` sont volatils. Un document se telecharge dans la
foulee, donc c'est sans consequence ; mais un lien de telechargement garde
quelques heures ne vaudra plus rien apres un redemarrage.

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

### Les reperes rouges automatiques

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

## Le nombre de demandes par mois n'est pas un chiffre magique

Il est calcule, jamais saisi a la main :

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
