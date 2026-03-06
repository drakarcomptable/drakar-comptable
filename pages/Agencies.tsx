
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Building2, Ship, ArrowRight, Users, Shield, Monitor } from 'lucide-react';
import NormandieMap from '../components/NormandieMap';

const Agencies: React.FC = () => {
  return (
    <div className="pt-40 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest">
              <Ship className="w-4 h-4" /> Cabinet normand
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-brand-blue tracking-tighter leading-tight">
              Expert-comptable <br /><span className="text-brand-orange">en Normandie.</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
              Le cabinet Drakar accompagne les entrepreneurs, TPE et PME normands avec une expertise comptable de proximité. Retrouvez nos agences à Caen et à Rouen pour un accompagnement personnalisé au plus près de votre activité.
            </p>
          </div>
          <NormandieMap />
        </div>

        {/* Agences Cards */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-blue tracking-tight">Nos agences en Normandie</h2>
            <div className="w-20 h-1.5 bg-brand-orange mx-auto mt-6 rounded-full"></div>
            <p className="text-lg text-slate-500 font-medium mt-6 max-w-2xl mx-auto">
              Deux implantations stratégiques pour couvrir l'ensemble du territoire normand : le Calvados et la Seine-Maritime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Agence Caen */}
            <Link to="/expert-comptable-caen" className="group relative bg-brand-slate/50 rounded-[40px] p-10 lg:p-14 border-2 border-transparent hover:border-brand-orange hover:bg-white hover:shadow-2xl transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Building2 className="w-40 h-40" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue text-brand-orange rounded-lg text-[9px] font-black uppercase tracking-widest">
                  <MapPin className="w-3 h-3" /> Calvados
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight group-hover:text-brand-orange transition-colors">
                  Agence de Caen
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Accompagnement des entrepreneurs, TPE et PME du Calvados. Expertise comptable, fiscalité, droit social et conseil en gestion pour les entreprises caennaises.
                </p>
                <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-400">
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Comptabilité</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Fiscalité</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Social</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Juridique</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Création</span>
                </div>
                <div className="flex items-center gap-3 text-brand-orange font-black text-sm uppercase tracking-widest pt-4">
                  Découvrir l'agence <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Agence Rouen */}
            <Link to="/expert-comptable-rouen" className="group relative bg-brand-slate/50 rounded-[40px] p-10 lg:p-14 border-2 border-transparent hover:border-brand-orange hover:bg-white hover:shadow-2xl transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Building2 className="w-40 h-40" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue text-brand-orange rounded-lg text-[9px] font-black uppercase tracking-widest">
                  <MapPin className="w-3 h-3" /> Seine-Maritime
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight group-hover:text-brand-orange transition-colors">
                  Agence de Rouen
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Accompagnement des entrepreneurs, TPE et PME de Seine-Maritime. Expertise comptable, optimisation fiscale, gestion sociale et conseil en pilotage d'entreprise.
                </p>
                <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-400">
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Comptabilité</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Fiscalité</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Social</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Pilotage</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-slate-100">Création</span>
                </div>
                <div className="flex items-center gap-3 text-brand-orange font-black text-sm uppercase tracking-widest pt-4">
                  Découvrir l'agence <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Avantages Section */}
        <div className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-brand-slate/50 rounded-[40px] space-y-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-brand-blue">Proximité</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Un interlocuteur dédié qui connaît le tissu économique normand et les spécificités de votre marché local.
              </p>
            </div>
            <div className="p-10 bg-brand-slate/50 rounded-[40px] space-y-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-brand-blue">Expertise</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Inscrit à l'Ordre des experts-comptables. Comptabilité, fiscalité, social, juridique et conseil en gestion.
              </p>
            </div>
            <div className="p-10 bg-brand-slate/50 rounded-[40px] space-y-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-brand-blue">Digital</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Outils digitaux modernes pour suivre votre comptabilité en temps réel, en présentiel ou à distance.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Text Section */}
        <div className="p-16 lg:p-24 bg-brand-blue rounded-[80px] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
            <Ship className="w-96 h-96" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-tight">Un cabinet ancré <br /><span className="text-brand-orange">en Normandie.</span></h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                Le cabinet Drakar a fait le choix de la proximité. Nous croyons que l'excellence de l'expertise comptable passe par une connaissance parfaite des enjeux économiques locaux et une présence physique forte sur le territoire normand.
              </p>
            </div>
            <div className="space-y-8 text-slate-400 font-medium leading-relaxed">
              <p>
                Présents à Caen et à Rouen, nos équipes couvrent le Calvados et la Seine-Maritime pour offrir un accompagnement rigoureux aux dirigeants normands. Chaque agence Drakar combine expertise sectorielle, réactivité et outils digitaux performants pour simplifier la gestion de votre entreprise.
              </p>
              <div className="flex gap-12">
                <div>
                  <p className="text-3xl font-black text-brand-orange">2</p>
                  <p className="text-[10px] font-black uppercase tracking-widest">Agences en Normandie</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-brand-orange">2</p>
                  <p className="text-[10px] font-black uppercase tracking-widest">Départements couverts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agencies;
