/* Apparition au defilement des pages de contenu.
   Meme mecanisme que la page d'accueil : un IntersectionObserver pose la
   classe « in » quand l'element entre dans la fenetre, puis cesse de
   l'observer. Ce qui est deja visible au chargement est revele tout de
   suite, sans attendre un defilement qui n'aura peut-etre pas lieu. */
(function () {
  'use strict';
  if (!document.documentElement.classList.contains('anim')) return;
  var nodes = [].slice.call(document.querySelectorAll('.rv'));
  if (!nodes.length) return;

  if (!('IntersectionObserver' in window)) {
    nodes.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (x) {
      if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  nodes.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      requestAnimationFrame(function () { el.classList.add('in'); });
    } else {
      io.observe(el);
    }
  });
})();
