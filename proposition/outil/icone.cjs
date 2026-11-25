/* Fabrique l'icone d'onglet de DONETADOC.

   Un SVG en ligne dans la page n'est pas affiche par tous les
   navigateurs. Un PNG, si. On le dessine une fois et on le sert comme un
   fichier ordinaire.

   Lancement :  node proposition/outil/icone.cjs
*/
const { lance } = require('../navigateur.cjs');
const path = require('path');

const ICI = path.dirname(path.resolve(__filename));
const TAILLES = [32, 180];     // onglet, et raccourci sur mobile

(async () => {
  const nav = await lance();
  for (const t of TAILLES) {
    const pg = await nav.newPage({ viewport: { width: t, height: t },
      deviceScaleFactor: 1 });
    await pg.setContent(`<style>
      html,body{margin:0;width:${t}px;height:${t}px;background:transparent}
      .f{width:100%;height:100%;border-radius:${Math.round(t * 0.22)}px;
         background:#f5f3ff;display:grid;place-items:center}
      .p{width:${Math.round(t * 0.56)}px;height:${Math.round(t * 0.56)}px;
         border-radius:50%;background:#6d4aff}
    </style><div class="f"><div class="p"></div></div>`);
    await pg.screenshot({ path: path.join(ICI, 'icone-' + t + '.png'),
                          omitBackground: true });
    await pg.close();
    console.log('  icone-' + t + '.png');
  }
  await nav.close();
})();
