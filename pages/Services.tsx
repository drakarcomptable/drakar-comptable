
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle, Zap, Ship } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../constants';

const Services: React.FC = () => {
  return (
    <div className="pt-40 pb-32 bg-brand-slate/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-brand-blue tracking-tighter leading-tight">Nos Expertises</h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            Drakar a structuré son accompagnement autour de 5 briques stratégiques souveraines. Sélectionnez un pôle pour découvrir nos solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {SERVICE_CATEGORIES.map((category) => (
            <Link 
              key={category.id} 
              to={`/expertises/${category.slug}`}
              className="bg-white rounded-[40px] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col group relative overflow-hidden h-full"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-brand-slate rounded-2xl flex items-center justify-center text-brand-orange mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all">
                  {category.icon}
                </div>
                <h3 className="text-3xl font-black text-brand-blue mb-4 leading-tight tracking-tight group-hover:text-brand-orange transition-colors">
                  {category.title}
                </h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-6">
                  {category.subServices.length} sous-services disponibles
                </p>
                <div className="flex items-center gap-2 text-brand-orange font-black text-sm uppercase tracking-widest mt-auto">
                  Consulter le pôle <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            </Link>
          ))}
        </div>

        {/* CTA Global - Orange Bubble with Ship background */}
        <div className="mt-32 bg-brand-orange rounded-[60px] p-12 lg:p-24 text-white relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(249,115,22,0.4)]">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none text-brand-blue flex items-center justify-center">
             <Ship className="w-full h-full scale-150 rotate-12 stroke-1" />
          </div>
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">
              <Zap className="w-4 h-4" /> Accompagnement Souverain
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-tight mb-10">
              Transformez votre gestion en levier de réussite.
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 font-medium leading-relaxed mb-12 max-w-2xl">
              L’expertise comptable n’est que le début. Nos experts Drakar fusionnent conseil financier, social et juridique pour sécuriser votre croissance.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <Link 
                to="/contact" 
                className="bg-brand-blue text-white px-10 py-6 rounded-2xl font-black text-xl hover:bg-brand-blue-light transition-all shadow-2xl flex items-center gap-4 group active:scale-95"
              >
                Prendre rendez-vous <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </Link>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <CheckCircle className="w-5 h-5 text-brand-blue" /> Premier échange offert
                </div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <CheckCircle className="w-5 h-5 text-brand-blue" /> Devis personnalisé sous 24h
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
