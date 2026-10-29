# -*- coding: utf-8 -*-
"""Page d'atterrissage des campagnes publicitaires : nazar-seo.fr/audit-gratuit

La premiere version etait une passerelle, un ecran de chargement de deux
secondes qui renvoyait sur l'agenda HubSpot. Elle avait un defaut decisif : la
reservation se passait sur un domaine qui n'est pas le notre, donc aucune
conversion publicitaire n'etait mesurable, et le visiteur n'avait rien vu de
NAZAR avant de choisir un creneau.

Ici l'agenda est integre dans la page. Tout se passe sur nazar-seo.fr : le
pixel a le temps de s'executer, la conversion est rattachee au clic qui l'a
amenee, et la personne voit les resultats clients et le consultant avant de
reserver.

La page est generee depuis nazar-geo.html plutot qu'ecrite a cote : elle en
reprend la feuille de style entiere, les logos de moteurs et le script. Le
site reste donc la source unique du dessin, et une retouche de charte s'y
propage sans rien recopier.

Elle est servie a la racine, et non dans un dossier : les images injectees par
le script portent des noms relatifs, qui ne resolvent correctement que depuis
la racine du site. Une reecriture Vercel sert le fichier sous /audit-gratuit.
"""
import io, os

RACINE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(RACINE, 'nazar-geo.html')
SORTIE = os.path.join(RACINE, 'nazar-site', 'audit-gratuit.html')

# lien de rendez-vous propre aux campagnes, distinct de celui du formulaire :
# les reservations venues de la publicite restent ainsi identifiables.
AGENDA = ('https://meetings-eu1.hubspot.com/mael-gallais/auditnazargeo'
          '?uuid=a0d8d83c-fb50-40d7-bb86-985a8633a7eb')

src = io.open(SOURCE, encoding='utf-8').read()

def entre(texte, ouvre, ferme, depuis=0):
    a = texte.index(ouvre, depuis)
    b = texte.index(ferme, a) + len(ferme)
    return texte[a:b]

STYLE   = entre(src, '<style>', '</style>')
MOTEURS = entre(src, '<script>window.NZ =', '</script>')
SCRIPT  = src[src.rindex('<script>'):src.rindex('</script>') + len('</script>')]

FLECHE = ('<span class="arrow"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
          'stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>')

STYLE_PAGE = u"""
/* ---------- page d'atterrissage publicitaire ---------- */
.lpbar{position:sticky;top:0;z-index:60;background:rgba(227,247,254,.86);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(0,67,88,.07)}
.lpbar .rail{display:flex;align-items:center;justify-content:space-between;gap:16px;
  padding-block:12px}
.lpbar img{width:42px;height:42px;display:block}
.lpbar .btn{padding:.62rem .72rem .62rem 1.15rem;font-size:.92rem}

.lph{padding-block:clamp(44px,6vw,86px) clamp(26px,3vw,40px);
  background:linear-gradient(180deg,var(--ice) 0%,var(--paper) 100%)}
.lph .rail{display:flex;flex-direction:column;align-items:center;text-align:center;
  gap:clamp(14px,1.8vw,22px)}
.lph h1{margin:0;max-width:19ch;font-weight:800;letter-spacing:-.035em;
  font-size:clamp(2.05rem,5.6vw,3.9rem);line-height:1.04}
.lph .sub{margin:0;max-width:62ch;color:var(--ink-2);
  font-size:clamp(1rem,1.5vw,1.14rem);line-height:1.55}
.lph .note{margin:0;font-family:var(--mono);font-size:.76rem;letter-spacing:.04em;
  text-transform:uppercase;color:var(--steel)}

/* un logo de moteur, dans sa couleur de marque, colle au nom du moteur */
.mt{display:inline-flex;align-items:center;gap:.26em;white-space:nowrap}
.mt i{display:inline-flex;align-items:center;justify-content:center;
  width:1.04em;height:1.04em;border-radius:.26em;background:#fff;
  box-shadow:0 3px 12px rgba(0,67,88,.14);flex:none}
.mt i svg{width:.68em;height:.68em;display:block}
.anim .mt i{animation:mtflot 3.8s ease-in-out infinite}
.anim .mt:nth-of-type(2) i{animation-delay:.6s}
.anim .mt:nth-of-type(3) i{animation-delay:1.2s}
@keyframes mtflot{0%,100%{transform:translateY(0)}50%{transform:translateY(-.16em)}}

#agenda{background:var(--paper);padding-block:clamp(10px,1.4vw,18px) clamp(54px,6vw,86px)}
#agenda .ahead{display:flex;flex-direction:column;align-items:center;gap:12px;
  text-align:center;margin-bottom:clamp(20px,2.6vw,34px)}
#agenda h2{margin:0;font-size:clamp(1.5rem,3vw,2.2rem);letter-spacing:-.03em}
#agenda .ahead p{margin:0;max-width:52ch;color:var(--ink-2)}
.agbox{background:var(--white);border-radius:24px;padding:clamp(6px,.8vw,12px);
  box-shadow:0 24px 70px -30px rgba(0,67,88,.45);overflow:hidden}
.meetings-iframe-container{min-height:702px}
.meetings-iframe-container iframe{width:100%!important;border:0!important;min-height:702px}
@media(max-width:720px){
  .meetings-iframe-container,.meetings-iframe-container iframe{min-height:900px}
}
.agwait{display:flex;align-items:center;justify-content:center;gap:10px;
  min-height:702px;color:var(--steel);font-family:var(--mono);font-size:.82rem}

.lpfoot{background:var(--night);color:var(--on-night);padding-block:clamp(34px,4vw,54px)}
.lpfoot .rail{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;
  gap:18px;font-size:.9rem}
.lpfoot a{color:var(--on-night);text-decoration:none;opacity:.78}
.lpfoot a:hover{opacity:1}
.lpfoot .lk{display:flex;gap:18px;flex-wrap:wrap}
"""

CORPS = u"""
<header class="lpbar">
  <div class="rail">
    <a href="/" aria-label="NAZAR"><img src="logo.png" width="42" height="42" alt="NAZAR"></a>
    <a class="btn btn-dark" href="#agenda">Réserver mon audit __FLECHE__</a>
  </div>
</header>

<section class="lph">
  <div class="rail">
    <span class="pill9 rv"><i><img src="hote-mael.webp" width="200" height="200" decoding="async" alt="Maël, consultant NAZAR"></i>Premier échange de 9 minutes <span class="qui">avec Maël</span></span>
    <h1 class="rv d1">Calculez le ROI d'être cité par
      <span class="mt" data-eng="ChatGPT">ChatGPT</span>,
      <span class="mt" data-eng="Perplexity">Perplexity</span> et
      <span class="mt" data-eng="Gemini">Gemini</span></h1>
    <p class="sub rv d1">Vos acheteurs posent leur question à une IA avant de vous appeler. Nous relevons ce que les moteurs répondent sur votre marché, les concurrents qu'ils citent à votre place, et nous chiffrons ce que vaudrait votre place dans ces réponses.</p>
    <a class="btn btn-dark rv d2" href="#agenda">Choisir mon créneau __FLECHE__</a>
    <p class="note rv d2">Gratuit, sans engagement</p>
  </div>
</section>

<section id="agenda">
  <div class="rail">
    <div class="ahead">
      <span class="kick rv" data-ic="report">Votre créneau</span>
      <h2 class="rv d1">Trente minutes avec le consultant qui suivrait votre dossier</h2>
      <p class="rv d1">Choisissez l'heure qui vous arrange. Vous recevez l'invitation par mail dans la foulée.</p>
    </div>
    <div class="agbox rv d1">
      <div class="meetings-iframe-container" data-src="__AGENDA__&amp;embed=true">
        <div class="agwait">Chargement de l'agenda…</div>
      </div>
    </div>
  </div>
</section>

<section class="clients">
  <div class="rail"><p class="clabel">Ils nous ont fait confiance</p></div>
  <div class="cmar"><div class="crow" id="crow"></div></div>
</section>

<section class="night sec" id="cas">
  <div class="rail">
    <div style="display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center">
      <span class="kick on-night rv" data-ic="__IC__">Résultats</span>
      <h2 class="rv d1" style="max-width:24ch">Nous sommes fiers d'avoir contribué <em>à ces projets</em></h2>
    </div>
    <div class="mcards" id="mcards"></div>
  </div>
</section>

<section class="cream-s" id="consultant">
  <div class="rail team">
    <div class="frame rv"><img src="consultant-seo-nazar.jpg" width="896" height="1120" loading="lazy"
      alt="Consultant SEO NAZAR au travail sur le positionnement d'un client"
      title="Consultant SEO NAZAR"></div>
    <div class="tcopy">
      <h2 class="rv d1" style="margin-top:18px">Un consultant<br class="bm"> <em>dédié à votre projet</em></h2>
      <p class="bd rv d1">Vous ne parlez pas à un compte, vous parlez à quelqu'un. La même personne relève vos moteurs chaque semaine, rédige vos contenus, corrige votre socle technique et présente vos résultats. Pas de sous-traitance, pas de passage de dossier, pas de rapport automatique envoyé sans lecture.</p>
      <p class="coll rv d2"><b>NAZAR est un collectif de consultants GEO et SEO.</b> Notre métier n'a pas changé : vous faire ressortir quand quelqu'un cherche ce que vous vendez. Sur Google, et désormais dans les réponses des IA.</p>
    </div>
  </div>
  <div class="avis rv" id="avis" hidden>
    <div class="rail avis-head">
      <h3>Ce qu'ils en disent sur <img class="gword" src="logo-google.webp" width="480" height="158" alt="Google" decoding="async"></h3>
      <span class="gnote" id="gnote"></span>
    </div>
    <div class="amar"><div class="arow" id="arow"></div></div>
  </div>
</section>

<footer class="lpfoot">
  <div class="rail">
    <span>&copy; 2026 NAZAR</span>
    <div class="lk">
      <a href="/">Le site</a>
      <a href="mailto:contact@seo-nazar.fr">contact@seo-nazar.fr</a>
      <a href="/mentions-legales.html">Mentions légales</a>
      <a href="/confidentialite.html">Confidentialité</a>
    </div>
  </div>
</footer>
"""

SCRIPT_PAGE = u"""
<script>
(function(){
  'use strict';

  /* les logos de moteurs du titre viennent du meme dessin que le site,
     expose par nazar-geo.html sous window.NZico */
  if(window.NZico){
    document.querySelectorAll('.mt[data-eng]').forEach(function(el){
      el.insertAdjacentHTML('afterbegin', '<i>' + window.NZico(el.getAttribute('data-eng')) + '</i>');
    });
  }

  /* Conversion : HubSpot previent la page qui l'heberge quand un creneau est
     pris. Le nom exact du message n'etant pas publiquement documente, on en
     reconnait plusieurs formulations, et le mode diagnostic journalise tout ce
     qui vient de HubSpot pour pouvoir ajuster sans tatonner. */
  var diag = /[?&]pixeldebug=1/.test(location.search);
  var parti = false;
  window.addEventListener('message', function(ev){
    var hote = '';
    try { hote = new URL(ev.origin).hostname; } catch(e){ return; }
    if(!/(^|\\.)hubspot\\.com$/.test(hote)) return;
    var brut = typeof ev.data === 'string' ? ev.data : JSON.stringify(ev.data || '');
    if(diag) console.log('[NAZAR] message HubSpot :', brut);
    if(parti) return;
    if(/meetings?BookSucceeded|bookingSucceeded|meetingBooked/i.test(brut)){
      parti = true;
      if(window.mesure) window.mesure('appointment_scheduled', {type:'customer_action'});
      if(diag) console.log('[NAZAR] conversion appointment_scheduled envoyee');
    }
  }, false);
})();
</script>
<script src="https://static.hubspot.com/cos-static/meetings-embed/static-1.1/embed/MeetingsEmbedCode.js" defer></script>
"""

PAGE = u"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Audit GEO gratuit : ce que les IA disent de votre marché | NAZAR</title>
<meta name="description" content="Trente minutes avec un consultant NAZAR : ce que ChatGPT, Perplexity et Gemini répondent sur votre marché, et ce que vaudrait votre place dans ces réponses.">
<!-- page d'atterrissage publicitaire : elle reprend des blocs de l'accueil,
     il n'y a donc rien a indexer ici, et tout a suivre vers le site -->
<meta name="robots" content="noindex,follow">
<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" href="logo.png" sizes="192x192">
<link rel="preload" href="police-jakarta.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://meetings-eu1.hubspot.com" crossorigin>
<link rel="preconnect" href="https://static.hubspot.com" crossorigin>
__STYLE__
<style>__STYLE_PAGE__</style>
<script src="/mesure.js" defer></script>
</head>
<body>
__CORPS__
__MOTEURS__
__SCRIPT__
__SCRIPT_PAGE__
</body>
</html>
"""

page = (PAGE.replace('__STYLE_PAGE__', STYLE_PAGE)
            .replace('__STYLE__', STYLE)
            .replace('__CORPS__', CORPS.replace('__FLECHE__', FLECHE)
                                       .replace('__AGENDA__', AGENDA))
            .replace('__MOTEURS__', MOTEURS)
            .replace('__SCRIPT_PAGE__', SCRIPT_PAGE)
            .replace('__SCRIPT__', SCRIPT))

io.open(SORTIE, 'w', encoding='utf-8').write(page)
print('ecrit audit-gratuit.html, %d octets' % len(page))
