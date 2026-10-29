# -*- coding: utf-8 -*-
"""Pages passerelles pour les campagnes publicitaires.

La publicite envoie sur nazar-seo.fr plutot que directement sur l'agenda
HubSpot, pour deux raisons : le prospect voit la marque avant le calendrier,
et le trafic paye passe par le domaine, donc il se mesure la ou le reste se
mesure. Les parametres de campagne sont transmis a HubSpot, qui sait alors
d'ou vient le rendez-vous.

Une premiere version portait un titre, un paragraphe et trois arguments. A
l'usage, c'etait une faute : dans une fenetre de deux secondes, du texte qu'on
n'a pas le temps de lire donne l'impression de rater quelque chose. Une
passerelle ne doit rien demander. D'ou les deux variantes ci-dessous, a
comparer en vrai avant de trancher.

Aucun script tiers : le module de prise de rendez-vous HubSpot n'est pas
embarque, il poserait des cookies de suivi sur le domaine et imposerait une
banniere de consentement a un site qui n'en a pas besoin.
"""
import io, os

# Lien propre a la publicite, distinct de celui du formulaire du site
# (auditgeonazar) : deux liens, deux sources, et l'agenda dit de lui-meme d'ou
# vient chaque rendez-vous.
AGENDA = ('https://meetings-eu1.hubspot.com/mael-gallais/auditnazargeo'
          '?uuid=a0d8d83c-fb50-40d7-bb86-985a8633a7eb')

SOCLE = u"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Audit GEO gratuit | NAZAR</title>
<!-- passerelle publicitaire : elle n'a rien a faire dans l'index, et elle ne
     doit surtout pas etre bloquee dans robots.txt, sans quoi Google ne lirait
     jamais cette balise. -->
<meta name="robots" content="noindex,nofollow">
<link rel="icon" href="/logo.png">
<link rel="preconnect" href="https://meetings-eu1.hubspot.com" crossorigin>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}
body{display:flex;align-items:center;justify-content:center;
  background:#00212c;
  background-image:radial-gradient(130% 150% at 88% 12%,#0a4a60 0%,#00303f 42%,#00212c 100%);
  font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;
  color:#dff2f9;text-align:center;padding:2rem}
@font-face{font-family:'Plus Jakarta Sans';src:url(/police-jakarta.woff2) format('woff2');
  font-weight:200 800;font-style:normal;font-display:swap}
/* meme traitement que dans la barre du site : le blob du logo est un bleu
   nuit a peine plus clair que le fond, il disparait pose a meme le fond. Sur
   sa pastille glace, il se lit instantanement. */
.marque{width:84px;height:84px;display:block;margin:0 auto;object-fit:contain;
  background:#e3f7fe;border-radius:22px;padding:8px}
.ligne{margin-top:1.4rem;font-size:.95rem;letter-spacing:.02em;color:#9ec6d4}
.secours{margin-top:2.2rem;font-size:.85rem}
.secours a{color:#7fd8ee}
__STYLE__
</style>
</head>
<body>
<main>
  <img class="marque" src="/logo.png" alt="NAZAR" width="84" height="84">
__CORPS__
  <p class="secours" id="secours" hidden><a id="rdv" href="__AGENDA__">Ouvrir l'agenda</a></p>
</main>
<script>
(function(){
  var AGENDA = '__AGENDA__', DELAI = __DELAI__;
  var lien = document.getElementById('rdv'), secours = document.getElementById('secours');

  /* Les parametres de la campagne suivent jusqu'a HubSpot : sans cela, un
     rendez-vous venu de la publicite est indiscernable d'un autre, et le
     budget se pilote a l'aveugle. L'uuid est deja dans AGENDA, on ne recopie
     donc pas celui qui arriverait de l'URL. */
  function destination(){
    var q = location.search.replace(/^\?/, '');
    if(!q) return AGENDA;
    var gardes = q.split('&').filter(function(p){
      return p && p.split('=')[0].toLowerCase() !== 'uuid';
    });
    return gardes.length ? AGENDA + '&' + gardes.join('&') : AGENDA;
  }

  var cible = destination();
  lien.href = cible;
  location.replace(cible) && 0;   /* jamais atteint, voir plus bas */
})();
</script>
</body>
</html>
"""

# Variante A : l'ecran de marque. Le logo, une ligne, rien a lire. C'est le
# temps d'un battement de cils, juste assez pour que le prospect sache chez
# qui il a atterri.
A_STYLE = u""".ligne{font-size:1.05rem;color:#dff2f9}"""
A_CORPS = u"""  <p class="ligne">Audit GEO gratuit</p>"""

# Variante B : le chargement. Trois points qui pulsent annoncent qu'il se
# passe quelque chose, donc l'attente est comprise au lieu d'etre subie. Un
# peu plus longue que la A, le temps que l'animation ait un sens.
B_STYLE = u""".pts{margin-top:1.5rem;display:flex;gap:.45rem;justify-content:center}
.pts span{width:8px;height:8px;border-radius:50%;background:#7fd8ee;
  animation:pulse 1.1s ease-in-out infinite}
.pts span:nth-child(2){animation-delay:.16s}
.pts span:nth-child(3){animation-delay:.32s}
@keyframes pulse{0%,80%,100%{opacity:.25;transform:scale(.8)}
  40%{opacity:1;transform:scale(1)}}
/* qui a demande moins d'animations n'en recoit pas : les points restent
   visibles, fixes, et la redirection part de la meme facon */
@media (prefers-reduced-motion:reduce){.pts span{animation:none;opacity:.8}}"""
B_CORPS = u"""  <p class="ligne">Préparation de votre audit</p>
  <div class="pts" aria-hidden="true"><span></span><span></span><span></span></div>"""

# La redirection n'utilise pas location.assign mais location.replace : la
# passerelle ne doit pas s'inscrire dans l'historique, sinon le bouton Retour
# depuis l'agenda y ramene et relance la redirection en boucle.
SCRIPT = u"""
  /* Le lien de secours n'apparait que si la redirection n'a pas eu lieu au
     bout de quatre secondes : invisible dans le parcours normal, present
     quand le JavaScript est coupe ou que la navigation echoue. */
  setTimeout(function(){ secours.hidden = false; }, 4000);
  setTimeout(function(){ location.replace(cible); }, DELAI);
"""

VARIANTES = [
    ('a', A_STYLE, A_CORPS, 1200),
    ('b', B_STYLE, B_CORPS, 2000),
]

if __name__ == '__main__':
    ici = os.path.dirname(os.path.abspath(__file__))
    for nom, style, corps, delai in VARIANTES:
        page = (SOCLE.replace('__STYLE__', style)
                     .replace('__CORPS__', corps)
                     .replace('__AGENDA__', AGENDA)
                     .replace('__DELAI__', str(delai))
                     .replace('  location.replace(cible) && 0;   /* jamais atteint, voir plus bas */',
                              SCRIPT.rstrip()))
        dossier = os.path.join(ici, 'nazar-site', 'audit-gratuit', nom)
        if not os.path.isdir(dossier):
            os.makedirs(dossier)
        io.open(os.path.join(dossier, 'index.html'), 'w', encoding='utf-8').write(page)
        print('ecrit audit-gratuit/%s/ (%d ms)' % (nom, delai))
