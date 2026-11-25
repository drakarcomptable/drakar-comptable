/* Fabrique une image d'etalonnage : des pastilles vertes a des pourcentages
   connus, sur un rapport (2,5) tres different de celui du cadre du PDF.
   Si les reperes rouges tombent dessus, le recalage est juste. */
const { chromium } = require('playwright');
const SC = '/tmp/claude-0/-home-user-drakar-comptable/053d6a3d-6ce3-51d7-a083-05ef634a21f1/scratchpad';
const CIBLES = [{ x: 20, y: 30 }, { x: 70, y: 60 }];

(async () => {
  const nav = await chromium.launch();
  const pg = await nav.newPage({ viewport: { width: 1000, height: 400 } });
  const points = CIBLES.map(c =>
    `<i style="left:${c.x}%;top:${c.y}%"></i>`).join('');
  await pg.setContent(`<style>
    html,body{margin:0;width:1000px;height:400px;background:#fff}
    i{position:absolute;width:14px;height:14px;margin:-7px 0 0 -7px;
      border-radius:50%;background:#00ff00}
  </style><body>${points}</body>`);
  await pg.screenshot({ path: SC + '/etalon.png' });
  await nav.close();
  console.log('image d etalonnage 1000x400, pastilles a ' +
    CIBLES.map(c => c.x + '%/' + c.y + '%').join(' et '));
})();
