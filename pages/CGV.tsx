
import React from 'react';

const CGV: React.FC = () => {
  return (
    <div className="bg-brand-slate min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-brand-blue mb-2">Conditions Générales de Vente</h1>
        <p className="text-slate-500 mb-12">Applicables à l'ensemble des missions confiées à DRAKAR EXPERT COMPTABLE.</p>

        <div className="space-y-10">

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">1. Objet</h2>
            <p className="text-slate-600 font-medium leading-relaxed">Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre DRAKAR EXPERT COMPTABLE, société d'expertise comptable inscrite au Tableau de l'Ordre des Experts-Comptables, dont le siège social est situé au 10 Rue de Penthièvre, 75008 Paris, et toute personne physique ou morale (ci-après « le Client ») faisant appel à ses services.</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">2. Prestations</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">DRAKAR EXPERT COMPTABLE propose notamment les prestations suivantes :</p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 font-medium">
              <li>Tenue et révision comptable</li>
              <li>Établissement des comptes annuels et bilans</li>
              <li>Déclarations fiscales (TVA, IS, IR, CFE…)</li>
              <li>Accompagnement social et gestion de la paie</li>
              <li>Conseil en gestion et optimisation fiscale</li>
              <li>Audit légal et commissariat aux comptes</li>
              <li>Accompagnement à la création et reprise d'entreprise</li>
            </ul>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">La nature précise des prestations, leur périmètre et leurs modalités sont définis dans la lettre de mission signée entre les parties.</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">3. Tarifs et facturation</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">Les honoraires sont fixés contractuellement dans la lettre de mission et peuvent être établis selon les modalités suivantes :</p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 font-medium">
              <li>Forfait mensuel ou annuel</li>
              <li>Tarification au temps passé (taux horaire défini en lettre de mission)</li>
              <li>Prestation ponctuelle à devis</li>
            </ul>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">Les factures sont payables à réception, sauf délai spécifique mentionné dans la lettre de mission. Tout retard de paiement entraîne l'application de pénalités de retard au taux légal en vigueur, ainsi qu'une indemnité forfaitaire de 40 € pour frais de recouvrement.</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">4. Obligations du Client</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">Le Client s'engage à :</p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 font-medium">
              <li>Fournir l'ensemble des documents, informations et pièces nécessaires à la réalisation des missions dans les délais convenus</li>
              <li>Informer DRAKAR EXPERT COMPTABLE de tout événement susceptible d'affecter sa situation financière ou juridique</li>
              <li>Régler les honoraires aux échéances convenues</li>
              <li>Ne pas dissimuler d'informations susceptibles d'influer sur la qualité des travaux réalisés</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">5. Responsabilité</h2>
            <p className="text-slate-600 font-medium leading-relaxed">DRAKAR EXPERT COMPTABLE est couvert par une assurance responsabilité civile professionnelle conformément aux obligations de l'Ordre des Experts-Comptables. Notre responsabilité ne saurait être engagée en cas de fourniture d'informations erronées ou incomplètes par le Client, ni pour des faits extérieurs à notre intervention.</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">6. Durée et résiliation</h2>
            <p className="text-slate-600 font-medium leading-relaxed">Les missions sont conclues pour une durée définie dans la lettre de mission, renouvelable par tacite reconduction. Chaque partie peut mettre fin à la mission en respectant un préavis de 3 mois, notifié par lettre recommandée avec accusé de réception. En cas de manquement grave, la résiliation peut être immédiate.</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">7. Confidentialité</h2>
            <p className="text-slate-600 font-medium leading-relaxed">DRAKAR EXPERT COMPTABLE s'engage à maintenir la confidentialité de toutes les informations qui lui sont communiquées dans le cadre de ses missions, conformément au secret professionnel de l'expert-comptable (article 226-13 du Code Pénal et déontologie professionnelle).</p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black text-brand-blue uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">8. Loi applicable et litiges</h2>
            <p className="text-slate-600 font-medium leading-relaxed">Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut d'accord amiable, le litige sera soumis aux tribunaux compétents de Paris.</p>
          </section>

        </div>

        <p className="text-slate-400 text-sm mt-12 text-center">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );
};

export default CGV;
