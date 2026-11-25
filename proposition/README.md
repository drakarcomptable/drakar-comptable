# Proposition d'audit GEO

Genere un PDF a envoyer a un prospect : page de garde avec une capture de
son site, les requetes de son marche, ce que nous avons vu chez lui, qui
est NAZAR, et l'invitation a un echange de 9 minutes.

Quatre pages, ou cinq quand la proposition porte des reperes rouges sur
une capture.

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
