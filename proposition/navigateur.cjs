/* Le navigateur, lance de la meme facon partout.

   Dans un conteneur, Chromium se heurte a deux choses : /dev/shm y fait
   64 Mo par defaut, bien moins que ce qu'il attend, et la memoire totale
   est comptee. Ces options le font tenir dans une petite machine.

   Elles ne changent rien a ce qui est rendu : ni les polices, ni la mise
   en page, ni les couleurs.
*/
const { chromium } = require('playwright');

const OPTIONS = [
  // /dev/shm est minuscule dans un conteneur : sans cela Chromium
  // plante en plein chargement de page.
  '--disable-dev-shm-usage',
  // un seul processus au lieu d'un par onglet : moins de memoire
  '--renderer-process-limit=1',
  // ce dont un rendu hors ecran n'a aucun besoin
  '--disable-extensions',
  '--disable-background-networking',
  '--disable-sync',
  '--disable-translate',
  '--mute-audio',
  '--no-first-run',
  '--no-default-browser-check',
];

function lance(options) {
  return chromium.launch(Object.assign({ args: OPTIONS }, options || {}));
}

module.exports = { lance, OPTIONS };
