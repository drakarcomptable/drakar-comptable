/* Mesure publicitaire NAZAR.

   Le pixel OpenAI depose un cookie first-party pour rattacher une conversion
   au clic publicitaire qui l'a amenee. En France cela demande un consentement
   prealable : rien n'est telecharge, rien n'est ecrit, tant que le visiteur
   n'a pas repondu au bandeau.

   Le refus est conserve aussi longtemps que l'accord. Sans cela le bandeau
   reviendrait a chaque page et le refus ne vaudrait rien, ce qui est
   exactement ce que la regle interdit.

   Une page declenche un evenement par window.mesure('nom_evenement'). Si le
   visiteur n'a pas encore repondu, l'evenement patiente : il peut tres bien
   remplir le formulaire avant de s'occuper du bandeau. */
(function(){
  'use strict';

  var CLE   = 'nazar-consentement';
  var PIXEL = 'MJecAz8PDaF6QoyMQpJWue';
  var SDK   = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';

  var attente = [];
  var charge  = false;

  function lu(){
    try { return localStorage.getItem(CLE); } catch(e){ return null; }
  }
  function ecrit(v){
    try { localStorage.setItem(CLE, v); } catch(e){}
  }

  /* Amorce recopiee telle quelle depuis Ads Manager. Elle installe une file
     d'attente sur window.oaiq, puis charge le SDK : les appels passes avant
     la fin du telechargement ne sont donc pas perdus.
     L'option debug ecrit l'activite du SDK dans la console. Elle n'est
     allumee que si l'adresse porte ?pixeldebug=1, pour diagnostiquer sans
     bavarder dans la console de tous les visiteurs. */
  function chargePixel(){
    if(charge) return;
    charge = true;
    !function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script",SDK);
    oaiq("init", {pixelId: PIXEL, debug: /[?&]pixeldebug=1/.test(location.search)});
    while(attente.length){
      var e = attente.shift();
      oaiq("measure", e[0], e[1]);
    }
  }

  window.mesure = function(nom, detail){
    var d = detail || {type: 'customer_action'};
    var c = lu();
    if(c === 'non') return;
    if(c === 'oui'){ chargePixel(); oaiq("measure", nom, d); return; }
    attente.push([nom, d]);
  };

  function repond(valeur){
    ecrit(valeur);
    var b = document.getElementById('consentement');
    if(b) b.parentNode.removeChild(b);
    if(valeur === 'oui') chargePixel();
    else attente.length = 0;
  }

  function style(){
    var s = document.createElement('style');
    s.textContent = [
      '#consentement{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;',
      '  background:var(--white,#fff);color:var(--ink,#004358);border-radius:16px;',
      '  box-shadow:0 10px 40px rgba(0,67,88,.18);padding:18px 20px;',
      '  font-family:var(--sans,system-ui,sans-serif);font-size:.92rem;line-height:1.5;',
      '  display:flex;flex-wrap:wrap;gap:14px 18px;align-items:center;',
      '  max-width:760px;margin-inline:auto;animation:consmonte .35s ease-out both}',
      '@keyframes consmonte{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}',
      '@media (prefers-reduced-motion:reduce){#consentement{animation:none}}',
      '#consentement p{margin:0;flex:1 1 320px}',
      '#consentement a{color:var(--ink-2,#0e4e62)}',
      '#consentement .boutons{display:flex;gap:10px;flex:0 0 auto}',
      '#consentement button{font:inherit;font-weight:600;border-radius:999px;',
      '  padding:.6rem 1.15rem;cursor:pointer;border:1px solid var(--ink,#004358)}',
      '#consentement .oui{background:var(--ink,#004358);color:#fff}',
      '#consentement .non{background:transparent;color:var(--ink,#004358)}',
      '#consentement button:focus-visible{outline:2px solid var(--acc,#7fd8ee);outline-offset:2px}'
    ].join('');
    document.head.appendChild(s);
  }

  function bandeau(){
    style();
    var b = document.createElement('div');
    b.id = 'consentement';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookies');
    var p = document.createElement('p');
    p.innerHTML = 'Un seul cookie, et seulement si vous l’acceptez : il nous dit ' +
      'si une de nos publicités a mené à une demande d’audit. Pas de mesure ' +
      'd’audience, pas de profilage, pas de revente. ' +
      '<a href="/confidentialite.html">Le détail ici</a>.';
    var z = document.createElement('div');
    z.className = 'boutons';
    var oui = document.createElement('button');
    oui.className = 'oui'; oui.type = 'button'; oui.textContent = 'Accepter';
    var non = document.createElement('button');
    non.className = 'non'; non.type = 'button'; non.textContent = 'Refuser';
    oui.addEventListener('click', function(){ repond('oui'); });
    non.addEventListener('click', function(){ repond('non'); });
    z.appendChild(oui); z.appendChild(non);
    b.appendChild(p); b.appendChild(z);
    document.body.appendChild(b);
  }

  /* Le SDK ne compte pas les pages vues de lui-meme : sans cet appel, une
     visite ne produit aucun evenement et le flux d'Ads Manager reste vide,
     ce qui bloque la verification de l'integration. On envoie donc une page
     vue a chaque chargement, identifiee par son chemin. */
  function pageVue(){
    window.mesure('page_viewed', {
      type: 'contents',
      contents: [{
        id: location.pathname,
        name: (document.title || location.pathname).slice(0, 120),
        content_type: 'page'
      }]
    });
  }

  function depart(){
    var c = lu();
    if(c === 'oui'){ chargePixel(); pageVue(); return; }
    if(c === 'non') return;
    bandeau();
    /* la page vue attend la reponse au bandeau : si le visiteur accepte,
       elle part a ce moment-la, sinon elle est jetee. */
    pageVue();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', depart);
  } else {
    depart();
  }
})();
