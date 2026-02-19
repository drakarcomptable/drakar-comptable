
import React from 'react';

const MentionsLegales: React.FC = () => {
  return (
    <div className="bg-brand-slate min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-brand-blue mb-2">Mentions Légales</h1>
        <p className="text-slate-500 mb-12">Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique.</p>

        <div className="space-y-10">

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">1. Éditeur du site</h2>
            <div className="space-y-2 text-slate-600 font-medium">
              <p><span className="font-bold text-brand-blue">Dénomination sociale :</span> DRAKAR EXPERT COMPTABLE</p>
              <p><span className="font-bold text-brand-blue">Forme juridique :</span> Société d'Expertise Comptable</p>
              <p><span className="font-bold text-brand-blue">Siège social :</span> 10 Rue de Penthièvre, 75008 Paris</p>
              <p><span className="font-bold text-brand-blue">Téléphone :</span> 06 11 01 25 59</p>
              <p><span className="font-bold text-brand-blue">Email :</span> contact@drakarexpertcomptable.fr</p>
              <p><span className="font-bold text-brand-blue">Membre de l'Ordre :</span> Inscrit au Tableau de l'Ordre des Experts-Comptables</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">2. Directeur de la publication</h2>
            <p className="text-slate-600 font-medium">Le directeur de la publication du site <strong>drakarexpertcomptable.fr</strong> est le représentant légal de la société DRAKAR EXPERT COMPTABLE.</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">3. Hébergement</h2>
            <div className="space-y-2 text-slate-600 font-medium">
              <p><span className="font-bold text-brand-blue">Hébergeur :</span> Vercel Inc.</p>
              <p><span className="font-bold text-brand-blue">Adresse :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p><span className="font-bold text-brand-blue">Site :</span> vercel.com</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">4. Propriété intellectuelle</h2>
            <p className="text-slate-600 font-medium leading-relaxed">L'ensemble des contenus présents sur le site drakarexpertcomptable.fr (textes, images, graphismes, logo, icônes, sons, logiciels…) est la propriété exclusive de DRAKAR EXPERT COMPTABLE, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de DRAKAR EXPERT COMPTABLE.</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">5. Données personnelles</h2>
            <p className="text-slate-600 font-medium leading-relaxed">Les informations recueillies sur ce site font l'objet d'un traitement informatique destiné à DRAKAR EXPERT COMPTABLE. Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données vous concernant. Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@drakarexpertcomptable.fr" className="text-brand-orange hover:underline">contact@drakarexpertcomptable.fr</a></p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">6. Cookies</h2>
            <p className="text-slate-600 font-medium leading-relaxed">Le site drakarexpertcomptable.fr peut être amené à vous demander l'acceptation des cookies pour des besoins de statistiques et d'affichage. Un cookie est une information déposée sur votre disque dur par le serveur du site que vous visitez. Il contient plusieurs données. Vous pouvez vous opposer à l'enregistrement de cookies en configurant votre navigateur ou en utilisant le bandeau de consentement présent sur le site.</p>
          </section>

        </div>

        <p className="text-slate-400 text-sm mt-12 text-center">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );
};

export default MentionsLegales;
