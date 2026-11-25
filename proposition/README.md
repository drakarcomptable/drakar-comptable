# Proposition d'audit GEO

Genere un PDF de quatre pages a envoyer a un prospect : page de garde avec
une capture de son site, les requetes de son marche, qui est NAZAR, et
l'invitation a un echange.

## Lancer

    python3 proposition/gen.py proposition/donnees/<prospect>.json

Le PDF sort dans `proposition/sortie/`.

## Reseau

La capture du site du prospect demande un acces reseau sortant. Elle
fonctionne sur un poste de travail ordinaire. Dans un conteneur dont le
reseau est restreint, la capture echoue et le generateur pose un cadre
d'attente a la place, sans interrompre la fabrication du PDF.

## Le nombre de demandes par mois n'est pas un chiffre magique

Il est calcule, jamais saisi a la main :

    demandes = volume mensuel total x taux de prise de contact

Le taux est un parametre du fichier de donnees et il est **imprime sur la
page**. Un prospect qui lit « 1 240 recherches, a 0,5 %, soit 6 demandes »
peut contester l'hypothese. Un prospect qui lit « 6 demandes » sans savoir
d'ou ca sort cesse de nous croire des qu'il y reflechit.

C'est la difference entre une estimation et une promesse inventee.
