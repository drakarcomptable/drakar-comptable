# -*- coding: utf-8 -*-
"""Page d'atterrissage des campagnes publicitaires : nazar-seo.fr/audit-gratuit

Elle a connu trois formes. D'abord une passerelle, un ecran de chargement de
deux secondes qui renvoyait sur l'agenda HubSpot : la reservation se passait
alors sur un domaine qui n'est pas le notre, donc aucune conversion
publicitaire n'etait mesurable. Puis une reprise de l'accueil, trop longue
pour du trafic paye. Aujourd'hui une page a une seule intention : l'agenda est
a droite, la raison de prendre rendez-vous est a gauche, et tout ce qui suit
ne sert qu'a rassurer celui qui hesite.

Les sections conservees ne sont pas recopiees : elles sont decoupees dans
nazar-geo.html a la generation. Le site reste donc la source unique du dessin
comme des textes, et une retouche s'y propage sans qu'on y pense.

L'agenda est un iframe pose directement, sans le script d'integration de
HubSpot : ce script ne repondait pas, et la page restait indefiniment sur son
message de chargement. Un iframe n'a besoin de personne pour s'afficher. Sa
hauteur suit ensuite les messages que HubSpot envoie a la page qui l'heberge.

La page est servie a la racine et non dans un dossier : les images injectees
par le script portent des noms relatifs, qui ne resolvent correctement que
depuis la racine du site. Deux reecritures Vercel la servent sous
/audit-gratuit, avec et sans barre finale.
"""
import io, os, re

RACINE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(RACINE, 'nazar-geo.html')
SORTIE = os.path.join(RACINE, 'nazar-site', 'audit-gratuit.html')
SORTIE_JS = os.path.join(RACINE, 'nazar-site', 'audit-gratuit.js')

# lien de rendez-vous propre aux campagnes, distinct de celui du formulaire :
# les reservations venues de la publicite restent ainsi identifiables.
AGENDA = ('https://meetings-eu1.hubspot.com/mael-gallais/auditnazargeo'
          '?uuid=a0d8d83c-fb50-40d7-bb86-985a8633a7eb')

src = io.open(SOURCE, encoding='utf-8').read()


def entre(texte, ouvre, ferme):
    a = texte.index(ouvre)
    b = texte.index(ferme, a) + len(ferme)
    return texte[a:b]


def section(texte, debut):
    """Decoupe une section complete, en suivant les imbrications."""
    a = texte.index(debut)
    i, prof = a, 0
    while True:
        o = texte.find('<section', i + 1)
        f = texte.find('</section>', i + 1)
        if f < 0:
            raise ValueError('section non fermee : ' + debut)
        if 0 <= o < f:
            prof += 1
            i = o
        else:
            if prof == 0:
                return texte[a:f + len('</section>')]
            prof -= 1
            i = f


STYLE   = entre(src, '<style>', '</style>')
MOTEURS = entre(src, '<script>window.NZ =', '</script>')
SCRIPT  = src[src.rindex('<script>'):src.rindex('</script>') + len('</script>')]

# Un logo client est retire du bandeau sur cette page, et sur celle-ci
# seulement : la page porte sa propre copie du script, la liste y est donc
# modifiee a la generation plutot que sur le site.
SANS = ["ref-14.webp"]
for fichier in SANS:
    avant = SCRIPT
    SCRIPT = re.sub(r"\n\s*\{f:'" + re.escape(fichier) + r"'[^}]*\},?", '', SCRIPT)
    if SCRIPT == avant:
        raise ValueError('logo introuvable dans le bandeau : ' + fichier)

CLIENTS = section(src, '<section class="clients">')
CAS     = section(src, '<section class="night sec" id="cas">')
CONSULT = section(src, '<section class="cream-s" id="consultant">')
FAQ     = section(src, '<section class="faq" id="faq">')
PIED    = entre(src, '<footer>', '</footer>')

# Seuls les avis Google sont repris de la section consultant : le portrait et
# le texte sur le consultant dedie n'ont pas leur place sur une page qui ne
# doit faire qu'une chose.
MARQUE = '<div class="avis rv" id="avis" hidden>'
AVIS = ('<section class="cream-s" id="avis-google">\n  '
        + CONSULT[CONSULT.index(MARQUE):])


def vers_agenda(html):
    """Les appels a l'action du site ouvrent l'agenda HubSpot dans un onglet.
       Ici l'agenda est dans la page : ils y font defiler, ce qui evite de
       sortir du domaine au moment precis ou la conversion se joue."""
    return re.sub(r'href="https://meetings-eu1\.hubspot\.com/[^"]*"'
                  r'(\s+target="_blank")?(\s+rel="noopener")?',
                  'href="#agenda"', html)


PIED = vers_agenda(PIED)

# le pied de page renvoie vers des sections absentes d'ici : on les fait
# pointer sur l'accueil plutot que vers une ancre qui n'existe pas.
for ancre in ('plateforme', 'surfaces', 'ecosysteme', 'consultant', 'audit'):
    PIED = PIED.replace('href="#' + ancre + '"', 'href="/#' + ancre + '"')
PIED = (PIED.replace('href="mentions-legales.html"', 'href="/mentions-legales.html"')
            .replace('href="confidentialite.html"', 'href="/confidentialite.html"'))

STYLE_PAGE = u"""
:root{--coche:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M2.2 8.4l4 4 7.6-9' fill='none' stroke='%23000' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}

/* ---------- page d'atterrissage publicitaire ---------- */
/* Deux colonnes : a gauche la raison de prendre rendez-vous, a droite
   l'agenda. Rien entre les deux, rien au-dessus. Sous 900 pixels les
   colonnes s'empilent, le texte d'abord. */
.duo{background:linear-gradient(180deg,var(--ice) 0%,var(--paper) 100%);
  padding-block:clamp(14px,1.6vw,24px) clamp(16px,1.8vw,28px)}
.duo .rail{display:grid;grid-template-columns:minmax(0,.94fr) minmax(0,1.06fr);
  gap:clamp(24px,3.2vw,48px);align-items:start}
.duo .dcol{display:flex;flex-direction:column;align-items:flex-start;
  gap:clamp(15px,1.9vw,23px)}
.duo h1{margin:0;font-weight:800;letter-spacing:-.038em;line-height:1.04;
  font-size:clamp(2rem,3.9vw,3.1rem);max-width:15ch}
.lpsub{margin:0;max-width:46ch;color:var(--ink-2);line-height:1.56;
  font-size:clamp(.98rem,1.2vw,1.06rem)}
.lpsub b{color:var(--ink);font-weight:700}
.lplist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;
  max-width:46ch}
.lplist li{display:flex;gap:11px;align-items:flex-start;color:var(--ink-2);
  font-size:clamp(.94rem,1.1vw,1rem);line-height:1.5}
.lplist li::before{content:'';flex:none;width:19px;height:19px;margin-top:2px;
  border-radius:50%;background:var(--acc);
  box-shadow:inset 0 0 0 1px rgba(0,67,88,.16);
  -webkit-mask:var(--coche) center/11px 11px no-repeat;mask:var(--coche) center/11px 11px no-repeat;
  background-color:var(--ink)}
.lplist b{color:var(--ink);font-weight:700}
@media(max-width:900px){.duo .rail{grid-template-columns:1fr}}

/* le bandeau de logos doit entrer dans le champ des l'ouverture : il remonte
   presque au contact de la section bleue, et son intitule se resserre */
/* Le blanc se prolonge sous les logos : a l'ouverture, on ne doit pas voir
   depasser un liseré de la section sombre en bas de l'ecran. */
.clients{padding-block:clamp(30px,3.9vw,60px) clamp(34px,4.5vw,68px)}

/* Et la section sombre commence tout de suite par son titre : son retrait
   d'origine est fait pour une lecture au fil de la page, pas pour un ecran
   ou l'on arrive dessus au premier defilement. */
#cas{padding-top:clamp(26px,3vw,44px)}
.clients .clabel{margin-bottom:clamp(20px,2.3vw,34px)}

/* Le logo prend place sur la meme ligne que le badge, a sa gauche : c'est le
   coin superieur gauche de la page, et cela ne coute pas un pixel de hauteur,
   alors qu'une barre au-dessus aurait repousse le bandeau de logos clients
   hors du premier ecran. Il renvoie sur le site. */
.hautg{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.lplogo{display:flex;flex:none;border-radius:14px;
  transition:transform .3s cubic-bezier(.22,1,.36,1)}
.lplogo img{width:clamp(56px,4.6vw,68px);height:auto;display:block}
.lplogo:hover{transform:translateY(-2px)}
.lplogo:focus-visible{outline:2px solid var(--acc);outline-offset:4px}

.badge1{display:inline-flex;align-items:center;gap:9px;background:var(--night);color:var(--ice);
  border-radius:999px;padding:.46rem 1.05rem .46rem .5rem;font-weight:600;
  font-size:clamp(.84rem,1.05vw,.97rem);letter-spacing:-.005em;
  box-shadow:0 16px 32px -20px rgba(0,33,44,.95)}
.badge1 b{color:var(--acc);font-weight:800}
.badge1 i{display:inline-flex;align-items:center;justify-content:center;
  width:28px;height:28px;border-radius:50%;background:#fff;flex:none;margin-right:-3px}
.badge1 i svg{width:18px;height:18px;display:block}
.badge1 i{transition:opacity .23s ease, transform .23s ease}
.badge1 i.mue{opacity:0;transform:scale(.72)}

.agbox{background:var(--white);border-radius:24px;padding:clamp(6px,.8vw,12px);
  box-shadow:0 24px 70px -30px rgba(0,67,88,.45);overflow:hidden}
#agframe{display:block;width:100%;border:0;height:584px}
@media(max-width:720px){#agframe{height:940px}}

/* Sur un ecran court, le calendrier se tasse pour que le bandeau de logos
   reste dans le premier ecran. C'est lui qui rassure au premier coup d'oeil ;
   le calendrier, lui, reste atteignable d'un coup de molette, et defile dans
   son cadre si HubSpot en demande davantage.
   La regle vise la hauteur de la fenetre, pas sa largeur : un grand ecran peu
   haut, ou un navigateur avec beaucoup de barres, tombent dans le meme cas
   qu'un petit portable. */
@media(min-width:901px) and (max-height:860px){
  #agframe{height:min(584px,calc(100vh - 235px))}
  .duo{padding-block:14px 16px}
  .duo .dcol{gap:17px}
  .clients{padding-block:34px 72px}
  .clients .clabel{margin-bottom:20px}
}
/* Plus court encore : on resserre aussi le titre, le logo et les
   interlignes de la liste. Rien ne disparait, tout se tasse. */
@media(min-width:901px) and (max-height:760px){
  #agframe{height:min(584px,calc(100vh - 211px))}
  .duo{padding-block:10px 12px}
  .duo .dcol{gap:13px}
  .duo h1{font-size:clamp(1.72rem,3.1vw,2.3rem)}
  .lplogo img{width:52px}
  .lplist{gap:8px}
  .lplist li{line-height:1.45}
  .clients{padding-block:24px 64px}
  .clients .clabel{margin-bottom:16px}
  #cas{padding-top:24px}
}
@media(min-width:901px) and (max-height:660px){
  .duo h1{font-size:clamp(1.6rem,2.8vw,2.05rem)}
  .clients{padding-block:18px 70px}
}
/* Et a l'inverse, sur un ecran tres haut la page est plus courte que la
   fenetre : le blanc se prolonge jusqu'au bas de l'ecran pour qu'aucun
   liseré sombre ne depasse a l'ouverture. */
@media(min-width:901px) and (min-height:861px){
  .clients{padding-bottom:min(max(68px,calc(100vh - 745px)),360px)}
}
"""

FLECHE = ('<span class="arrow"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
          'stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>')

CORPS = u"""
<section class="duo" id="agenda">
  <div class="rail">
    <div class="dcol">
      <div class="hautg rv">
        <a class="lplogo" href="/" aria-label="Aller sur le site NAZAR"><img src="logo.png" width="68" height="68" alt="NAZAR"></a>
        <span class="badge1" data-eng="ChatGPT">Devenez <b>n°1</b> sur les IA <i></i></span>
      </div>
      <h1 class="rv d1">Prenez rendez-vous avec un <em>expert GEO</em></h1>
      <p class="lpsub rv d1">Il audite votre site <b>gratuitement</b> et vous remet un <b>audit GEO</b>, avec une feuille de route d'actions concrètes, propres à votre site et à votre secteur.</p>
      <ul class="lplist rv d1">
        <li><span><b>Les requêtes de niche qualifiées</b> sur lesquelles vous n'apparaissez pas encore, et que vos acheteurs posent déjà aux IA.</span></li>
        <li><span><b>Pourquoi votre site ne ressort pas</b> dans les réponses : ce qui manque sur vos pages, et ce que les moteurs n'y trouvent pas.</span></li>
        <li><span><b>Comment vos concurrents s'y positionnent</b>, sur quelles sources ils s'appuient, et par où les dépasser sur votre marché.</span></li>
        <li><span><b>Les actions à mener, dans l'ordre</b>, avec ce que chacune peut rapporter.</span></li>
      </ul>
    </div>
    <div class="agbox rv d1">
      <iframe id="agframe" src="__AGENDA__&amp;embed=true" title="Choisir un créneau avec Maël" loading="eager"></iframe>
    </div>
  </div>
</section>

__CLIENTS__

__CAS__

__AVIS__

__FAQ__

__PIED__
"""

SCRIPT_PAGE = u"""
<script>
(function(){
  'use strict';
  /* Le logo du badge vient du meme dessin que le site, expose en window.NZico,
     et il passe d'un moteur a l'autre : le badge dit « les IA », il faut donc
     qu'il en montre plusieurs plutot qu'un seul. Un fondu court suffit, une
     rotation trop appuyee detournerait du titre.
     Un visiteur qui a demande moins d'animation garde un logo fixe. */
  var MOTEURS = ['ChatGPT', 'Gemini', 'Perplexity', 'Grok', 'Claude', 'Copilot'];
  if(window.NZico){
    document.querySelectorAll('.badge1 i').forEach(function(el){
      var k = 0;
      function pose(){ el.innerHTML = window.NZico(MOTEURS[k % MOTEURS.length]); }
      pose();
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      setInterval(function(){
        el.classList.add('mue');
        setTimeout(function(){ k++; pose(); el.classList.remove('mue'); }, 230);
      }, 1250);
    });
  }

  var diag = /[?&]pixeldebug=1/.test(location.search);
  var cadre = document.getElementById('agframe');
  /* le plafond suit la hauteur posee par la feuille de style, donc les regles
     ci-dessus : HubSpot ne peut pas rendre a l'agenda ce que l'ecran court lui
     a retire. */
  var plafond = (cadre && cadre.offsetHeight) || 584;
  var parti = false;

  /* HubSpot parle a la page qui l'heberge par messages. On en attend deux
     choses : la hauteur du calendrier, pour que l'iframe ne coupe rien et ne
     laisse pas de vide, et l'annonce d'une reservation, qui est la conversion.

     Le nom exact du message de reservation n'est pas publiquement documente :
     on en reconnait plusieurs formulations, et le mode diagnostic journalise
     tout ce qui vient de HubSpot, de quoi ajuster sur une vraie reservation
     plutot que de deviner. */
  window.addEventListener('message', function(ev){
    var hote = '';
    try { hote = new URL(ev.origin).hostname; } catch(e){ return; }
    if(!/(^|\\.)hubspot\\.com$/.test(hote)) return;

    var d = ev.data;
    var brut = typeof d === 'string' ? d : JSON.stringify(d || '');
    if(diag) console.log('[NAZAR] message HubSpot :', brut);

    if(cadre && d && typeof d === 'object'){
      var h = d.height;
      if(h == null && d.meetingsPayload) h = d.meetingsPayload.height;
      h = parseInt(h, 10);
      /* bornes larges : on suit HubSpot sans le laisser produire une page de
         dix mille pixels si un message aberrant passe */
      /* plafonnee : le bandeau de logos clients doit rester visible des
         l'ouverture de la page, l'agenda ne peut donc pas s'etendre a sa
         guise. Il defile de lui-meme au-dela. */
      if(h > 420) cadre.style.height = Math.min(h, plafond) + 'px';
    }

    if(parti) return;
    if(/meetings?BookSucceeded|bookingSucceeded|meetingBooked/i.test(brut)){
      parti = true;
      if(window.mesure) window.mesure('appointment_scheduled', {type:'customer_action'});
      if(diag) console.log('[NAZAR] conversion appointment_scheduled envoyee');
    }
  }, false);

  /* Les avis Google ne sont affiches que lorsqu'ils sont fournis : tant qu'il
     n'y en a pas, le bloc reste masque et sa section n'afficherait qu'une
     bande vide. On la retire plutot que de laisser un trou dans la page. */
  var av = document.getElementById('avis');
  var sec = document.getElementById('avis-google');
  if(sec && (!av || av.hidden)) sec.parentNode.removeChild(sec);
})();
</script>
"""

PAGE = u"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Audit GEO gratuit en 9 minutes | NAZAR</title>
<meta name="description" content="Neuf minutes avec un consultant NAZAR : il audite votre site et vous remet un audit GEO gratuit, avec une feuille de route pour vous référencer dans les réponses des IA.">
<!-- page d'atterrissage publicitaire : elle reprend des blocs de l'accueil,
     il n'y a donc rien a indexer ici, et tout a suivre vers le site -->
<meta name="robots" content="noindex,follow">
<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" href="logo.png" sizes="192x192">
<link rel="preload" href="police-jakarta.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://meetings-eu1.hubspot.com" crossorigin>
<!-- Les logos du bandeau sont poses par le script, donc demandes tard. Sur
     un ecran large ils sont dans le premier ecran : on les demande des la
     tete, en meme temps que le reste. Sur telephone les colonnes s'empilent,
     le bandeau passe sous la ligne de flottaison et ces images prendraient de
     la bande passante au texte : le media les reserve au grand ecran. -->
<link rel="preload" href="ref-01.webp" as="image" media="(min-width:721px)">
<link rel="preload" href="ref-08.webp" as="image" media="(min-width:721px)">
<link rel="preload" href="ref-13.webp" as="image" media="(min-width:721px)">
<link rel="preload" href="ref-02.webp" as="image" media="(min-width:721px)">
<link rel="preload" href="ref-11.webp" as="image" media="(min-width:721px)">
<link rel="preload" href="ref-03.webp" as="image" media="(min-width:721px)">
__STYLE__
<style>__STYLE_PAGE__</style>
<script src="/mesure.js" defer></script>
</head>
<body>
__CORPS__
<script src="/audit-gratuit.js" defer></script>
</body>
</html>
"""

corps = (CORPS.replace('__AGENDA__', AGENDA)
              .replace('__CAS__', CAS)
              .replace('__CLIENTS__', CLIENTS)
              .replace('__AVIS__', AVIS)
              .replace('__FAQ__', FAQ)
              .replace('__PIED__', PIED))

page = (PAGE.replace('__STYLE_PAGE__', STYLE_PAGE)
            .replace('__STYLE__', STYLE)
            .replace('__CORPS__', corps))


def sans_balises(bloc):
    """Retire les balises <script> autour d'un bloc, pour le mettre en fichier."""
    return bloc[bloc.index('>') + 1:bloc.rindex('</script>')]


# Les trois blocs de script partent dans un fichier a part, dans l'ordre :
# les donnees des moteurs, le script du site, puis celui propre a la page.
# Charge en defer, il n'empeche plus le premier affichage.
js = ('/* Genere par gen_passerelle.py, ne pas modifier a la main. */\n'
      + sans_balises(MOTEURS) + '\n'
      + sans_balises(SCRIPT) + '\n'
      + sans_balises(SCRIPT_PAGE))

io.open(SORTIE, 'w', encoding='utf-8').write(page)
io.open(SORTIE_JS, 'w', encoding='utf-8').write(js)
print('ecrit audit-gratuit.html, %d octets' % len(page))
print('ecrit audit-gratuit.js, %d octets' % len(js))
