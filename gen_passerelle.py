# -*- coding: utf-8 -*-
"""Page d'atterrissage des campagnes publicitaires : nazar-seo.fr/audit-gratuit

La premiere version etait une passerelle, un ecran de chargement de deux
secondes qui renvoyait sur l'agenda HubSpot. Elle avait un defaut decisif : la
reservation se passait sur un domaine qui n'est pas le notre, donc aucune
conversion publicitaire n'etait mesurable, et le visiteur choisissait un
creneau sans avoir rien vu de NAZAR.

La page reprend desormais l'accueil, dans un ordre resserre : l'accroche du
site, puis l'agenda, puis la preuve. Les sections ne sont pas recopiees, elles
sont decoupees dans nazar-geo.html a la generation. Le site reste donc la
source unique du dessin comme des textes, et une retouche s'y propage sans
qu'on y pense.

L'agenda est un iframe pose directement, sans le script d'integration de
HubSpot : ce script ne repondait pas, et la page restait sur « Chargement de
l'agenda » indefiniment. Un iframe n'a besoin de personne pour s'afficher. Sa
hauteur est ajustee sur les messages que HubSpot envoie a la page qui
l'heberge, avec des bornes, et une hauteur de depart suffisante pour que le
calendrier soit lisible meme si aucun message n'arrive.

La page est servie a la racine et non dans un dossier : les images injectees
par le script portent des noms relatifs, qui ne resolvent correctement que
depuis la racine du site. Deux reecritures Vercel la servent sous
/audit-gratuit, avec et sans barre finale.
"""
import io, os, re

RACINE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(RACINE, 'nazar-geo.html')
SORTIE = os.path.join(RACINE, 'nazar-site', 'audit-gratuit.html')

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

HERO     = section(src, '<section class="hero">')
CLIENTS  = section(src, '<section class="clients">')
CAS      = section(src, '<section class="night sec" id="cas">')
CONSULT  = section(src, '<section class="cream-s" id="consultant">')
FLOW     = section(src, '<section class="night flow" id="audit">')
FAQ      = section(src, '<section class="faq" id="faq">')
PIED     = entre(src, '<footer>', '</footer>')

# l'avis Google vit dans la section consultant sur le site ; ici il passe plus
# bas, apres le bloc sur les leads, comme demande.
MARQUE = '<div class="avis rv" id="avis" hidden>'
coupe = CONSULT.index(MARQUE)
EQUIPE = CONSULT[:coupe].rstrip() + '\n</section>'
AVIS   = '<section class="cream-s" id="avis-google">\n  ' + CONSULT[coupe:]


def vers_agenda(html):
    """Les appels a l'action du site ouvrent l'agenda HubSpot dans un onglet.
       Ici l'agenda est dans la page : ils y font defiler, ce qui evite de
       sortir du domaine au moment precis ou la conversion se joue."""
    html = re.sub(r'href="https://meetings-eu1\.hubspot\.com/[^"]*"'
                  r'(\s+target="_blank")?(\s+rel="noopener")?',
                  'href="#agenda"', html)
    return html


HERO, FLOW, PIED = vers_agenda(HERO), vers_agenda(FLOW), vers_agenda(PIED)

# L'accroche porte un bouton vers l'agenda sur le site. Ici l'agenda est juste
# en dessous, a portee de regard : un bouton pour descendre de trois cents
# pixels n'apporte rien et retarde la vue du calendrier.
HERO = re.sub(r'\s*<a class="btn btn-white rv d2" href="#agenda">.*?</a>',
              '', HERO, flags=re.S)

# L'accroche du site presente l'agence. Celle d'une page publicitaire doit
# poser la question qui amene a reserver, et rien d'autre : la phrase est
# remplacee, le paragraphe de presentation cede la place a une fleche qui
# designe le calendrier.
H1_SITE = ('<h1 class="rv d1">Vos prochains clients<br class="bm"> vous cherchent'
           '<br class="bm"> <em>sur les IA</em>.</h1>')
H1_PAGE = ('<h1 class="rv d1">Combien de leads peut générer<br class="bm"> '
           '<em>votre entreprise sur les IA</em> ?</h1>')
if HERO.count(H1_SITE) != 1:
    raise ValueError("l'accroche du site a change, le titre n'est plus reconnu")
HERO = HERO.replace(H1_SITE, H1_PAGE)

FLECHE_BAS = ('<a class="vers-bas rv d2" href="#agenda" aria-label="Aller à l\'agenda">'
              '<svg viewBox="0 0 132 86" fill="none" stroke="currentColor" stroke-width="3.2" '
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
              '<path d="M8 13c26-11 68-9 92 7 18 12 20 32 6 46"/>'
              '<path d="M92 52l14 16 15-13"/></svg></a>')
HERO, n = re.subn(r'<p class="hlede rv d2">.*?</p>', FLECHE_BAS, HERO, flags=re.S)
if n != 1:
    raise ValueError("le paragraphe de presentation de l'accroche est introuvable")

# le pied de page renvoie vers des sections absentes d'ici : on les fait
# pointer sur l'accueil plutot que vers une ancre qui n'existe pas.
for ancre in ('plateforme', 'surfaces', 'ecosysteme'):
    PIED = PIED.replace('href="#' + ancre + '"', 'href="/#' + ancre + '"')
PIED = (PIED.replace('href="mentions-legales.html"', 'href="/mentions-legales.html"')
            .replace('href="confidentialite.html"', 'href="/confidentialite.html"'))

FLECHE = ('<span class="arrow"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
          'stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>')

STYLE_PAGE = u"""
/* ---------- page d'atterrissage publicitaire ---------- */
/* L'accroche du site reserve la place d'un en-tete flottant qui n'existe pas
   ici, et se termine sur une marge faite pour une section suivante lointaine.
   On resserre des deux cotes : l'agenda doit entrer dans le champ en meme
   temps que la phrase qui l'annonce. */
.lph-top .hero{padding-top:clamp(26px,3.4vw,46px);padding-bottom:0}

#agenda{background:var(--paper);padding-block:clamp(14px,1.8vw,26px) clamp(48px,6vw,86px)}

/* La fleche remplace le paragraphe de presentation : elle designe le
   calendrier plutot que de le decrire. Une courbe tracee a main levee, qui
   part vers la droite et revient vers le bas, plutot qu'un pictogramme : elle
   a l'air ajoutee sur la page, donc elle attire l'oeil la ou on veut.
   Cliquable, pour qui prefere appuyer que faire defiler. */
.vers-bas{display:inline-block;color:var(--steel);text-decoration:none;
  margin-left:clamp(4px,2vw,34px)}
.vers-bas svg{width:clamp(96px,9vw,132px);height:auto;display:block;overflow:visible}
.anim .vers-bas{animation:versbas 2.6s ease-in-out infinite}
@keyframes versbas{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}
.vers-bas:hover{color:var(--ink-2)}
.vers-bas:focus-visible{outline:2px solid var(--acc);outline-offset:6px;border-radius:8px}
.agbox{background:var(--white);border-radius:24px;padding:clamp(6px,.8vw,12px);
  box-shadow:0 24px 70px -30px rgba(0,67,88,.45);overflow:hidden}
#agframe{display:block;width:100%;border:0;height:720px}
@media(max-width:720px){#agframe{height:1000px}}
"""

CORPS = u"""
<div class="lph-top">
__HERO__
</div>

<section id="agenda">
  <div class="rail">
    <div class="agbox rv d1">
      <iframe id="agframe" src="__AGENDA__&amp;embed=true" title="Choisir un créneau avec Maël" loading="lazy"></iframe>
    </div>
  </div>
</section>

__CAS__

__CLIENTS__

__EQUIPE__

__FLOW__

__AVIS__

__FAQ__

__PIED__
"""

SCRIPT_PAGE = u"""
<script>
(function(){
  'use strict';
  var diag = /[?&]pixeldebug=1/.test(location.search);
  var cadre = document.getElementById('agframe');
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
      if(h > 420 && h < 3000) cadre.style.height = h + 'px';
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
<title>Audit GEO gratuit : ce que les IA disent de votre marché | NAZAR</title>
<meta name="description" content="Trente minutes avec un consultant NAZAR : ce que ChatGPT, Perplexity et Gemini répondent sur votre marché, et ce que vaudrait votre place dans ces réponses.">
<!-- page d'atterrissage publicitaire : elle reprend des blocs de l'accueil,
     il n'y a donc rien a indexer ici, et tout a suivre vers le site -->
<meta name="robots" content="noindex,follow">
<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" href="logo.png" sizes="192x192">
<link rel="preload" href="police-jakarta.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://meetings-eu1.hubspot.com" crossorigin>
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

corps = (CORPS.replace('__FLECHE__', FLECHE)
              .replace('__AGENDA__', AGENDA)
              .replace('__HERO__', HERO)
              .replace('__CAS__', CAS)
              .replace('__CLIENTS__', CLIENTS)
              .replace('__EQUIPE__', EQUIPE)
              .replace('__FLOW__', FLOW)
              .replace('__AVIS__', AVIS)
              .replace('__FAQ__', FAQ)
              .replace('__PIED__', PIED))

page = (PAGE.replace('__STYLE_PAGE__', STYLE_PAGE)
            .replace('__STYLE__', STYLE)
            .replace('__CORPS__', corps)
            .replace('__MOTEURS__', MOTEURS)
            .replace('__SCRIPT_PAGE__', SCRIPT_PAGE)
            .replace('__SCRIPT__', SCRIPT))

io.open(SORTIE, 'w', encoding='utf-8').write(page)
print('ecrit audit-gratuit.html, %d octets' % len(page))
