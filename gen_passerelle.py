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

/* ---------- la ligne directe ----------
   Sous la liste de ce que contient l'audit, une carte qui donne le numero.
   Elle reprend la grammaire des autres cartes de la page, blanche et arrondie,
   pour se voir sans entrer en concurrence avec l'agenda. Le numero est ecrit
   en clair : beaucoup le composeront sur un autre appareil plutot que de
   cliquer, et sur ordinateur un lien telephonique ne fait souvent rien. */
.tel{display:flex;align-items:center;gap:clamp(12px,1.4vw,18px);
  background:var(--white);border-radius:18px;
  padding:clamp(12px,1.3vw,17px) clamp(14px,1.5vw,20px);
  box-shadow:0 18px 44px -28px rgba(0,67,88,.5), inset 0 0 0 1px rgba(0,67,88,.08);
  width:100%;box-sizing:border-box}
.tel img{flex:none;width:60px;height:60px;border-radius:50%;object-fit:cover;display:block;
  box-shadow:0 0 0 3px var(--ice)}
.tel .dit{flex:1 1 auto;min-width:0}
.tel .dit b{display:block;color:var(--ink);font-weight:700;
  font-size:clamp(.95rem,1.1vw,1.02rem);letter-spacing:-.012em}
.tel .dit span{display:block;color:var(--ink-2);font-size:clamp(.86rem,1vw,.93rem);margin-top:2px}
.telbt{flex:none;display:inline-flex;align-items:center;gap:8px;text-decoration:none;
  background:var(--night);color:#fff;border-radius:999px;
  padding:.6rem 1rem;font-weight:800;letter-spacing:-.01em;
  font-size:clamp(.95rem,1.15vw,1.06rem);white-space:nowrap;
  box-shadow:0 16px 30px -18px rgba(0,33,44,.95);
  transition:transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease}
.telbt svg{width:17px;height:17px;color:var(--acc)}
.telbt:hover{transform:translateY(-2px);box-shadow:0 20px 36px -16px rgba(0,33,44,.95)}
.telbt:focus-visible{outline:2px solid var(--acc);outline-offset:3px}
@media(max-width:620px){
  .tel{flex-wrap:wrap}
  .tel .dit{flex:1 1 140px}
  .telbt{width:100%;justify-content:center;margin-top:4px}
}
/* Sur un ecran court la carte se resserre comme le reste du bloc. */
@media(min-width:901px) and (max-height:760px){
  .tel{padding:10px 14px}
  .tel img{width:52px;height:52px}
}

/* ---------- la discussion ----------
   Une pastille en bas a droite, un panneau qui s'ouvre a sa place. Ce n'est
   pas une messagerie instantanee : le visiteur pose sa question, laisse son
   adresse, et la reponse part par courriel. L'entete le dit, pour ne pas
   laisser croire a un echange en direct. */
.bulle{position:fixed;right:20px;bottom:20px;z-index:60;display:flex;align-items:center;gap:10px;
  background:var(--night);color:#fff;border:0;cursor:pointer;
  border-radius:999px;padding:.66rem 1.1rem .66rem .66rem;
  font:inherit;font-weight:700;font-size:.96rem;letter-spacing:-.01em;
  box-shadow:0 22px 44px -20px rgba(0,33,44,.95);
  transition:transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s ease}
.bulle[hidden]{display:none}
.bulle i{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;flex:none;
  background:var(--acc);color:var(--night)}
.bulle i svg{width:18px;height:18px}
.bulle:hover{transform:translateY(-2px);box-shadow:0 26px 50px -18px rgba(0,33,44,.95)}
.bulle:focus-visible{outline:2px solid var(--acc);outline-offset:3px}

.caus{position:fixed;right:20px;bottom:20px;z-index:61;width:372px;
  max-width:calc(100vw - 32px);max-height:min(620px,calc(100vh - 40px));
  display:flex;flex-direction:column;background:var(--white);border-radius:22px;overflow:hidden;
  box-shadow:0 40px 90px -34px rgba(0,33,44,.6), inset 0 0 0 1px rgba(0,67,88,.08)}
.caus[hidden]{display:none}
.caushaut{flex:none;display:flex;align-items:center;gap:11px;background:var(--night);color:#fff;
  padding:14px 16px}
.caushaut img{width:40px;height:40px;border-radius:50%;object-fit:cover;flex:none}
.causqui b{display:block;font-size:.98rem;letter-spacing:-.01em}
.causqui em{display:block;font-style:normal;font-size:.82rem;color:#9fd4e4;margin-top:1px}
.causx{margin-left:auto;background:transparent;border:0;color:#9fd4e4;cursor:pointer;
  font-size:1.4rem;line-height:1;padding:0 3px;font-family:inherit}
.causx:hover{color:#fff}
.causx:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.causfil{flex:1 1 auto;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;
  background:linear-gradient(180deg,var(--ice) 0%,var(--white) 70%)}
.causfil .msg{margin:0;max-width:86%;padding:.66rem .85rem;border-radius:16px;
  font-size:.93rem;line-height:1.5}
.causfil .msg.eux{background:var(--white);color:var(--ink);border-bottom-left-radius:6px;
  box-shadow:0 10px 24px -18px rgba(0,67,88,.5), inset 0 0 0 1px rgba(0,67,88,.07)}
.causfil .msg.moi{background:var(--night);color:#fff;align-self:flex-end;
  border-bottom-right-radius:6px;white-space:pre-wrap}
.causfil .msg.ok{display:flex;gap:10px;align-items:flex-start;max-width:100%;
  background:var(--white);color:var(--ink);
  box-shadow:inset 0 0 0 1px rgba(0,67,88,.07)}
.causfil .msg.ok::before{content:'✓';flex:none;display:grid;place-items:center;
  width:26px;height:26px;border-radius:50%;background:#49d39a;color:#fff;font-weight:800;
  font-size:.86rem;margin-top:-1px}
.causbas[hidden]{display:none}
.causbas{flex:none;display:flex;flex-direction:row;align-items:flex-end;gap:8px;
  padding:12px 14px;background:var(--white);
  border-top:1px solid rgba(0,67,88,.1)}
.causlab{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);
  clip-path:inset(50%);white-space:nowrap}
.causbas textarea{flex:1;min-width:0;border:1px solid rgba(0,67,88,.22);border-radius:12px;
  padding:.62rem .8rem;font:inherit;font-size:.93rem;line-height:1.45;color:var(--ink);
  background:#fff;resize:none;max-height:120px}
.causbas textarea:focus{outline:2px solid var(--acc);outline-offset:0;border-color:transparent}
.causbas button{flex:none;background:var(--night);color:#fff;border:0;border-radius:12px;
  padding:.62rem .95rem;font:inherit;font-weight:700;cursor:pointer}
.causbas button[disabled]{background:#c3d6dd;cursor:default}
.causbas button:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.causpied{flex:none;margin:0;padding:0 14px 12px;font-size:.76rem;color:var(--ink-2);
  background:var(--white)}
/* Le panneau s'ouvre de lui-meme au bout de quelques secondes. L'arrivee est
   donc une animation : il monte et se deplie depuis le coin, assez pour
   accrocher l'oeil, assez court pour ne pas se faire remarquer comme un
   effet. */
@keyframes causentre{
  from{opacity:0;transform:translateY(18px) scale(.96)}
  to{opacity:1;transform:none}
}
.caus{transform-origin:100% 100%}
.caus.entre{animation:causentre .44s cubic-bezier(.22,1,.36,1) both}

/* Sur telephone le panneau est pose en bas et ne prend qu'une partie de la
   hauteur : le titre et le calendrier restent visibles derriere, sinon
   l'ouverture automatique masquerait la page entiere. La zone de saisie
   passe sur deux lignes, le bouton en pleine largeur, plus facile au pouce.
   100dvh suit la barre d'adresse des navigateurs mobiles ; la regle en vh
   reste pour ceux qui ne la connaissent pas. */
@media(max-width:620px){
  .caus{right:9px;left:9px;bottom:9px;width:auto;max-width:none;
    max-height:min(62vh,440px);max-height:min(62dvh,440px);border-radius:20px}
  .bulle{right:12px;bottom:12px}
  .caushaut{padding:12px 14px}
  .causfil{padding:14px}
  .causbas{flex-direction:column;padding:11px 12px}
  .causbas textarea{flex:1 1 auto;width:100%;font-size:16px}
  .causbas button{width:100%;padding:.7rem}
  .causpied{padding:0 12px 11px}
}
@media(prefers-reduced-motion:reduce){
  .bulle{transition:none}
  .caus.entre{animation:none}
}
"""

TELICO = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
          '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6'
          'A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81'
          'a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45'
          'c.9.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"/></svg>')

BULICO = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" '
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
          '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 21l1.9-4.1'
          'A8.4 8.4 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"/></svg>')

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
      <div class="tel rv d1">
        <img src="hote-mael.webp" width="60" height="60" alt="Maël Gallais" decoding="async">
        <span class="dit"><b>Une question avant de réserver ?</b>
          <span>Je vous réponds tout de suite.</span></span>
        <a class="telbt" href="tel:+33644608071">__TELICO__ 06 44 60 80 71</a>
      </div>
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

<button class="bulle" id="bulle" type="button" aria-expanded="false" aria-controls="caus">
  <i>__BULICO__</i><span>Une question ?</span>
</button>
<section class="caus" id="caus" hidden aria-labelledby="caustitre">
  <div class="caushaut">
    <img src="hote-mael.webp" width="40" height="40" alt="" decoding="async">
    <span class="causqui"><b id="caustitre">Maël, Consultant GEO</b>
      <em>Je vous réponds par e-mail</em></span>
    <button class="causx" id="causx" type="button" aria-label="Fermer la discussion">&times;</button>
  </div>
  <div class="causfil" id="causfil" role="log" aria-live="polite">
    <p class="msg eux">Bonjour, je suis Maël. Posez votre question ici, laissez-moi votre e-mail, et je vous réponds personnellement.</p>
  </div>
  <form class="causbas" id="causform" novalidate>
    <label class="causlab" for="causin" id="causlab">Votre question</label>
    <textarea id="causin" rows="1" placeholder="Écrivez votre question…"
      autocomplete="off" maxlength="900"></textarea>
    <button type="submit" id="causok">Envoyer</button>
  </form>
  <p class="causpied">Vos réponses nous servent à préparer l'échange, rien d'autre.</p>
</section>
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

  /* ---------- la discussion ----------
     Deux temps : la question, puis l'adresse. On demande l'adresse apres la
     question et pas avant, parce qu'un peage a l'entree fait fermer la
     fenetre. Rien n'est envoye tant que les deux ne sont pas la.
     L'envoi part a deux endroits, comme le formulaire du site : la boite de
     Mael pour qu'il reponde, et HubSpot pour que le contact existe. */
  (function(){
    var bulle = document.getElementById('bulle');
    var pan = document.getElementById('caus');
    if(!bulle || !pan) return;
    var fil = document.getElementById('causfil');
    var form = document.getElementById('causform');
    var champ = document.getElementById('causin');
    var lab = document.getElementById('causlab');
    var envoi = document.getElementById('causok');
    var croix = document.getElementById('causx');

    var BOITE = 'https://formsubmit.co/ajax/mael@nazar-seo.fr';
    var HUBSPOT = 'https://api.hsforms.com/submissions/v3/integration/submit' +
                  '/139506748/81a83a93-bb6a-4609-96fe-d9a8ac806c8d';

    var etape = 'question';
    var question = '';

    var CLE = 'nz-caus-vu';
    function dejaVu(){
      try{ return sessionStorage.getItem(CLE) === '1'; }catch(e){ return false; }
    }
    function marquer(){
      try{ sessionStorage.setItem(CLE, '1'); }catch(e){}
    }

    function ouvrir(auto){
      if(!pan.hidden) return;
      pan.hidden = false; bulle.hidden = true;
      bulle.setAttribute('aria-expanded', 'true');
      pan.classList.remove('entre');
      void pan.offsetWidth;
      pan.classList.add('entre');
      /* une ouverture automatique n'attrape pas le curseur : sur telephone
         cela ferait surgir le clavier sans que personne l'ait demande. */
      if(!auto) setTimeout(function(){ try{ champ.focus(); }catch(e){} }, 60);
    }
    function fermer(){
      pan.hidden = true; bulle.hidden = false;
      bulle.setAttribute('aria-expanded', 'false');
      marquer();
      try{ bulle.focus(); }catch(e){}
    }
    bulle.addEventListener('click', function(){ marquer(); ouvrir(false); });
    croix.addEventListener('click', fermer);

    /* ---- l'ouverture automatique ----
       Elle n'a lieu qu'une fois par session : un visiteur qui a ferme la
       fenetre, ou qui l'a deja vue s'ouvrir, n'y a plus droit.
       Elle attend aussi que le bandeau de consentement ait ete traite, sinon
       les deux se disputent le bas de l'ecran. Si le visiteur ne repond pas au
       bandeau, la fenetre ne s'ouvre pas d'elle-meme ; la pastille reste. */
    function quandLibre(suite){
      var debut = Date.now();
      (function regarde(){
        if(document.hidden){
          document.addEventListener('visibilitychange', function u(){
            document.removeEventListener('visibilitychange', u); regarde();
          });
          return;
        }
        if(!document.getElementById('consentement')){ suite(); return; }
        if(Date.now() - debut > 20000) return;
        setTimeout(regarde, 400);
      })();
    }

    if(!dejaVu()){
      var etroit = window.matchMedia('(max-width:620px)').matches;
      quandLibre(function(){
        setTimeout(function(){
          if(dejaVu() || !pan.hidden) return;
          marquer();
          ouvrir(true);
        }, etroit ? 3400 : 2600);
      });
    }
    document.addEventListener('keydown', function(e){
      if((e.key === 'Escape' || e.keyCode === 27) && !pan.hidden) fermer();
    });

    function dire(texte, qui){
      var p = document.createElement('p');
      p.className = 'msg ' + (qui || 'eux');
      p.textContent = texte;
      fil.appendChild(p);
      fil.scrollTop = fil.scrollHeight;
      return p;
    }
    function adresseOk(a){
      return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(a);
    }

    /* la zone de saisie grandit avec le texte, jusqu'a la limite posee en CSS */
    champ.addEventListener('input', function(){
      champ.style.height = 'auto';
      champ.style.height = Math.min(champ.scrollHeight, 120) + 'px';
    });
    /* Entree envoie, Maj+Entree passe a la ligne */
    champ.addEventListener('keydown', function(e){
      if((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey){
        e.preventDefault();
        form.dispatchEvent(new Event('submit', {cancelable: true}));
      }
    });

    function versBoite(adresse){
      if(!window.fetch) return;
      fetch(BOITE, {
        method: 'POST', keepalive: true,
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
          _subject: 'Question depuis la page audit : ' + adresse,
          'Adresse': adresse,
          'Question': question,
          'Page': location.href,
          _template: 'table'
        })
      }).then(function(r){
        if(!r.ok && diag) r.text().then(function(t){ console.log('[NAZAR] courriel refuse :', r.status, t); });
      }, function(){});
    }

    function versHubspot(adresse){
      if(!window.fetch) return;
      fetch(HUBSPOT, {
        method: 'POST', keepalive: true,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          fields: [{name: 'email', value: adresse}],
          context: {pageUri: location.href, pageName: document.title}
        })
      }).then(function(r){
        if(!r.ok && diag) r.text().then(function(t){ console.log('[NAZAR] HubSpot a refuse :', r.status, t); });
      }, function(){});
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var val = (champ.value || '').trim();
      if(!val) return;

      if(etape === 'question'){
        question = val;
        dire(val, 'moi');
        champ.value = ''; champ.style.height = 'auto';
        etape = 'adresse';
        lab.textContent = 'Votre adresse e-mail';
        champ.setAttribute('placeholder', 'votre@email.fr');
        champ.setAttribute('inputmode', 'email');
        champ.setAttribute('autocomplete', 'email');
        setTimeout(function(){
          dire("Merci. Laissez-moi une adresse e-mail et je vous réponds personnellement.");
          try{ champ.focus(); }catch(e2){}
        }, 420);
        return;
      }

      if(!adresseOk(val)){
        dire("Il manque quelque chose dans cette adresse, pouvez-vous la vérifier ?");
        return;
      }

      dire(val, 'moi');
      champ.value = ''; champ.disabled = true; envoi.disabled = true;
      versBoite(val);
      versHubspot(val);
      if(window.mesure) window.mesure('lead_created', {type: 'customer_action'});
      setTimeout(function(){
        dire("C’est noté. Vous avez une réponse dans la journée, et le créneau reste ouvert à côté si vous préférez en parler de vive voix.", "ok");
        form.hidden = true;
      }, 420);
    });
  })();
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

corps = (CORPS.replace('__TELICO__', TELICO)
              .replace('__BULICO__', BULICO)
              .replace('__AGENDA__', AGENDA)
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
