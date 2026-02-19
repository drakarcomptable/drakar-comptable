
import React from 'react';

const Confidentialite: React.FC = () => {
  return (
    <div className="bg-brand-slate min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-brand-blue mb-2">Politique de Confidentialité</h1>
        <p className="text-slate-500 mb-12">Conformément au Règlement Général sur la Protection des Données (RGPD) — Règlement UE 2016/679.</p>

        <div className="space-y-10">

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">1. Responsable du traitement</h2>
            <div className="space-y-2 text-slate-600 font-medium">
              <p><span className="font-bold text-brand-blue">Société :</span> DRAKAR EXPERT COMPTABLE</p>
              <p><span className="font-bold text-brand-blue">Adresse :</span> 10 Rue de Penthièvre, 75008 Paris</p>
              <p><span className="font-bold text-brand-blue">Email :</span> contact@drakarexpertcomptable.fr</p>
              <p><span className="font-bold text-brand-blue">Téléphone :</span> 06 11 01 25 59</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">2. Données collectées</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">Nous collectons les données suivantes uniquement lorsque vous nous les transmettez volontairement (formulaire de contact, prise de rendez-vous) :</p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 font-medium">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Nom de la société (le cas échéant)</li>
              <li>Message libre</li>
            </ul>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">Des données de navigation peuvent également être collectées de manière anonyme à des fins statistiques (pages visitées, durée de visite, type de navigateur).</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">3. Finalités du traitement</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 font-medium">
              <li>Répondre à vos demandes de contact et d'information</li>
              <li>Établir des devis et propositions commerciales</li>
              <li>Assurer la relation client dans le cadre de nos missions comptables</li>
              <li>Améliorer notre site web (statistiques anonymes)</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">4. Base légale</h2>
            <p className="text-slate-600 font-medium leading-relaxed">Le traitement de vos données repose sur votre consentement (art. 6.1.a du RGPD) et sur l'intérêt légitime de notre société à répondre à vos demandes (art. 6.1.f du RGPD). Dans le cadre d'une relation contractuelle, le traitement est fondé sur l'exécution d'un contrat (art. 6.1.b du RGPD).</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">5. Durée de conservation</h2>
            <div className="space-y-2 text-slate-600 font-medium">
              <p><span className="font-bold text-brand-blue">Données prospects :</span> 3 ans à compter du dernier contact</p>
              <p><span className="font-bold text-brand-blue">Données clients :</span> 10 ans à compter de la fin de la relation contractuelle (obligation légale comptable)</p>
              <p><span className="font-bold text-brand-blue">Données de navigation :</span> 13 mois maximum</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">6. Vos droits</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 font-medium">
              <li><span className="font-bold text-brand-blue">Droit d'accès</span> — obtenir une copie de vos données</li>
              <li><span className="font-bold text-brand-blue">Droit de rectification</span> — corriger des données inexactes</li>
              <li><span className="font-bold text-brand-blue">Droit à l'effacement</span> — demander la suppression de vos données</li>
              <li><span className="font-bold text-brand-blue">Droit d'opposition</span> — vous opposer à certains traitements</li>
              <li><span className="font-bold text-brand-blue">Droit à la portabilité</span> — recevoir vos données dans un format structuré</li>
              <li><span className="font-bold text-brand-blue">Droit de retrait du consentement</span> — à tout moment pour les traitements fondés sur votre consentement</li>
            </ul>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">Pour exercer ces droits : <a href="mailto:contact@drakarexpertcomptable.fr" className="text-brand-orange hover:underline">contact@drakarexpertcomptable.fr</a></p>
            <p className="text-slate-600 font-medium leading-relaxed mt-2">En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">www.cnil.fr</a>.</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">7. Cookies</h2>
            <p className="text-slate-600 font-medium leading-relaxed">Notre site utilise des cookies strictement nécessaires à son bon fonctionnement. Aucun cookie de tracking publicitaire n'est utilisé sans votre consentement préalable. Vous pouvez gérer vos préférences via le bandeau de consentement affiché à votre première visite ou dans les paramètres de votre navigateur.</p>
          </section>

        </div>

        <p className="text-slate-400 text-sm mt-12 text-center">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );
};

export default Confidentialite;
