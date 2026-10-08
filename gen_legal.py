# -*- coding: utf-8 -*-
import io, os
FLECHE = ('<span class="arrow"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
          'stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>')

def doc(fichier, titre, desc, corps):
    s = u"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>%s | NAZAR</title>
<meta name="description" content="%s">
<meta name="robots" content="noindex,follow">
<link rel="icon" href="logo.png">
<link rel="preload" href="police-jakarta.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="nazar.css">
</head>
<body>
<header class="topbar">
  <div class="rail">
    <a class="home" href="index.html"><img src="logo.png" alt="NAZAR"></a>
    <span class="sep"></span>
    <a class="back" href="index.html">Retour au site</a>
    <a class="btn btn-dark" href="index.html#rdv" style="padding:.6rem .7rem .6rem 1.1rem;font-size:.9rem">Audit gratuit %s</a>
  </div>
</header>

<main class="legal">
  <div class="narrow">
%s
  </div>
</main>

<footer>
  <div class="rail">
    <span>&copy; 2026 NAZAR</span>
    <span class="sep"></span>
    <a href="index.html">Accueil</a>
    <a href="mentions-legales.html">Mentions légales</a>
    <a href="confidentialite.html">Confidentialité</a>
  </div>
</footer>
</body>
</html>
""" % (titre, desc, FLECHE, corps)
    # ecrit a cote du script, dans la racine de deploiement du site, et non
    # dans un "deploy/" relatif au dossier courant au moment de l'appel
    sortie = os.path.join(os.path.dirname(os.path.abspath(__file__)), "nazar-site", fichier)
    io.open(sortie, "w", encoding="utf-8").write(s)
    print("ecrit", fichier)

ML = u"""    <p class="maj">Dernière mise à jour : 5 octobre 2026</p>
    <h1>Mentions légales</h1>

    <h2>Éditeur du site</h2>
    <dl>
      <dt>Raison sociale</dt><dd>NAZAR DEV, société par actions simplifiée, exploitant le site sous l'enseigne NAZAR</dd>
      <dt>Capital social</dt><dd>1 000 €</dd>
      <dt>Siège social</dt><dd>10 rue de Penthièvre, 75008 Paris, France</dd>
      <dt>SIREN</dt><dd>931 478 812</dd>
      <dt>SIRET du siège</dt><dd>931 478 812 00015</dd>
      <dt>RCS</dt><dd>Paris 931 478 812</dd>
      <dt>Numéro de TVA intracommunautaire</dt><dd>FR17 931 478 812</dd>
      <dt>Code APE</dt><dd>62.01Z, programmation informatique</dd>
      <dt>Directeur de la publication</dt><dd>Brice Volet</dd>
      <dt>Téléphone</dt><dd><a href="tel:+33743392574">+33 7 43 39 25 74</a></dd>
      <dt>Courriel</dt><dd><a href="mailto:contact@seo-nazar.fr">contact@seo-nazar.fr</a></dd>
    </dl>

    <h2>Hébergement</h2>
    <p>Le site est hébergé par <b>Vercel Inc.</b>, société de droit américain. Site de l'hébergeur : <a href="https://vercel.com">vercel.com</a>.</p>

    <h2>Propriété intellectuelle</h2>
    <p>L'ensemble des contenus de ce site, à savoir la structure, les textes, les visuels, les illustrations et le code, est la propriété de NAZAR DEV, sauf mention contraire. Toute reproduction, représentation ou adaptation, totale ou partielle, par quelque procédé que ce soit, est interdite sans autorisation écrite préalable.</p>
    <p>Les marques, dénominations sociales et logos des clients cités restent la propriété de leurs titulaires respectifs. Ils apparaissent sur ce site avec leur accord, à seule fin d'illustrer des références commerciales.</p>

    <h2>Responsabilité</h2>
    <p>NAZAR DEV s'efforce de maintenir les informations publiées exactes et à jour, sans garantir qu'elles soient exemptes d'erreur ou d'omission. Les résultats présentés dans les rapports de mission correspondent à des situations réelles, propres au marché et au site de chaque client. Ils ne constituent pas un engagement de résultat sur une prestation à venir : le référencement naturel dépend de facteurs qui échappent au prestataire, notamment des évolutions des algorithmes des moteurs de recherche et des moteurs de réponse.</p>
    <p>Les liens vers des sites tiers sont fournis à titre indicatif. NAZAR DEV n'exerce aucun contrôle sur leur contenu et décline toute responsabilité à leur égard.</p>

    <h2>Droit applicable</h2>
    <p>Les présentes mentions sont régies par le droit français. En cas de litige, et après échec de toute tentative de résolution amiable, les tribunaux français sont seuls compétents.</p>

    <h2>Signalement</h2>
    <p>Pour toute question ou demande relative à ce site, écrivez à <a href="mailto:contact@seo-nazar.fr">contact@seo-nazar.fr</a>.</p>
"""

CONF = u"""    <p class="maj">Dernière mise à jour : 5 octobre 2026</p>
    <h1>Politique de confidentialité</h1>
    <p>Cette page explique quelles données personnelles nous recueillons sur ce site, pourquoi nous les recueillons, combien de temps nous les gardons, et comment vous gardez la main dessus.</p>

    <h2>Qui est responsable de vos données</h2>
    <p><b>NAZAR DEV</b>, SAS au capital de 1 000 €, dont le siège est au 10 rue de Penthièvre, 75008 Paris, immatriculée au RCS de Paris sous le numéro 931 478 812, est responsable du traitement.</p>
    <p>Pour toute question sur vos données : <a href="mailto:contact@seo-nazar.fr">contact@seo-nazar.fr</a>.</p>

    <h2>Ce que nous recueillons</h2>
    <p>Uniquement ce que vous saisissez vous-même dans le formulaire de demande d'audit :</p>
    <ul>
      <li>Vos nom et prénom, ainsi que le nom de votre société</li>
      <li>Votre adresse de courriel professionnelle</li>
      <li>Votre numéro de téléphone, si vous choisissez de le renseigner</li>
      <li>L'adresse de votre site, votre secteur d'activité, le nom de vos principaux concurrents</li>
      <li>Le texte libre décrivant ce que vous attendez de l'audit</li>
    </ul>
    <p>Nous ne pratiquons aucun profilage et ne prenons aucune décision automatisée vous concernant.</p>

    <h2>Pourquoi nous les recueillons</h2>
    <dl>
      <dt>Répondre à votre demande</dt>
      <dd>Vous recontacter, préparer l'audit demandé et organiser l'échange. Base légale : l'exécution de mesures précontractuelles prises à votre demande.</dd>
      <dt>Vous adresser nos communications commerciales</dt>
      <dd>Vous tenir informé de nos prestations. Base légale : notre intérêt légitime à promouvoir une activité professionnelle auprès de professionnels, dans les limites posées par la réglementation sur la prospection. Vous pouvez vous y opposer à tout moment, sans avoir à vous justifier.</dd>
    </dl>

    <h2>Combien de temps nous les gardons</h2>
    <p>Trois ans à compter de notre dernier contact, qu'il s'agisse de votre demande initiale ou d'un échange ultérieur. Au-delà, les données sont supprimées. Si une relation contractuelle s'engage, les durées légales de conservation applicables aux documents commerciaux et comptables prennent le relais.</p>

    <h2>Qui y a accès</h2>
    <p>Vos données sont consultées par les consultants de NAZAR concernés par votre demande. Elles sont également traitées par les prestataires suivants, qui agissent pour notre compte :</p>
    <dl>
      <dt>HubSpot</dt>
      <dd>Notre outil de gestion de la relation client, où vos informations sont enregistrées. HubSpot est une société américaine. Les transferts de données hors de l'Union européenne sont encadrés par les mécanismes prévus par le règlement général sur la protection des données.</dd>
      <dt>Vercel</dt>
      <dd>L'hébergeur de ce site, qui conserve des journaux techniques de connexion.</dd>
      <dt>Slack</dt>
      <dd>Utilisé pour nous notifier en interne de l'arrivée d'une nouvelle demande.</dd>
    </dl>
    <p>Nous ne vendons ni ne louons vos données à qui que ce soit.</p>

    <h2>Cookies et mesure d'audience</h2>
    <p>Ce site ne dépose aucun cookie publicitaire, ni aucun traceur de mesure d'audience. Aucune bannière de consentement n'est donc nécessaire.</p>
    <p>Les polices de caractères utilisées pour l'affichage sont hébergées sur ce site. Leur chargement ne transmet aucune donnée à un service tiers.</p>

    <h2>Vos droits</h2>
    <p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, d'opposition, et de portabilité de vos données. Vous pouvez également définir des directives relatives à leur sort après votre décès.</p>
    <p>Pour les exercer, écrivez à <a href="mailto:contact@seo-nazar.fr">contact@seo-nazar.fr</a>. Nous répondons dans un délai d'un mois.</p>
    <p>Si notre réponse ne vous satisfait pas, vous pouvez saisir la Commission nationale de l'informatique et des libertés, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, ou déposer une réclamation sur <a href="https://www.cnil.fr">cnil.fr</a>.</p>

    <h2>Sécurité</h2>
    <p>Les échanges avec ce site sont chiffrés par le protocole HTTPS. L'accès aux données enregistrées est réservé aux personnes qui en ont besoin dans le cadre de leur mission.</p>

    <h2>Évolution de cette page</h2>
    <p>Cette politique peut être modifiée pour tenir compte d'évolutions légales ou techniques. La date de dernière mise à jour figure en haut de page.</p>
"""

doc("mentions-legales.html", "Mentions légales", "Mentions légales du site NAZAR, édité par NAZAR DEV.", ML)
doc("confidentialite.html", "Politique de confidentialité", "Comment NAZAR traite les données personnelles recueillies sur ce site.", CONF)
