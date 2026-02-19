
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Star, TrendingUp, Ship, Cpu, Briefcase, Building2, Utensils, Scale, Activity, Globe, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { SERVICE_CATEGORIES, FEATURES } from '../constants';
import SolutionVisual from '../components/SolutionVisual';

const LogoItem: React.FC<{ icon: any; name: string }> = ({ icon: Icon, name }) => (
  <div className="flex items-center gap-3 px-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group">
    <Icon className="w-8 h-8 text-brand-blue group-hover:text-brand-orange transition-colors" />
    <span className="font-black text-xl tracking-tighter text-brand-blue group-hover:text-brand-orange transition-colors">{name}</span>
  </div>
);

const ExpertiseBubble: React.FC<{ category: any }> = ({ category }) => (
  <Link 
    to={`/expertises/${category.slug}`} 
    className="flex-shrink-0 w-[280px] sm:w-[450px] snap-center bg-brand-blue-light/40 backdrop-blur-sm p-8 sm:p-14 rounded-[40px] sm:rounded-[60px] border border-white/5 hover:border-brand-orange hover:bg-brand-blue-light transition-all duration-500 group flex flex-col items-center text-center"
  >
    <div className="w-16 h-16 sm:w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-brand-orange mb-6 sm:mb-10 group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white transition-all shadow-2xl">
      {React.cloneElement(category.icon as React.ReactElement<any>, { className: "w-7 h-7 sm:w-10 h-10" })}
    </div>
    <h3 className="text-base sm:text-lg font-black text-white mb-4 sm:mb-6 tracking-tight group-hover:text-brand-orange transition-colors whitespace-normal leading-tight">
      {category.title}
    </h3>
    <p className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-8">Pôle Expertise Drakar</p>
    <div className="flex items-center gap-3 text-brand-orange font-black text-[9px] sm:text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
      Découvrir l'offre
    </div>
  </Link>
);

const Home: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const words = ["gestion", "conformité", "pilotage"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  const logos = [
    { icon: Cpu, name: "TechNexus" },
    { icon: Globe, name: "AeroGlobal" },
    { icon: Building2, name: "BatiFort" },
    { icon: Activity, name: "BioHealth" },
    { icon: Scale, name: "LexConsult" },
    { icon: Utensils, name: "UrbanFood" },
    { icon: Zap, name: "NovaFlow" },
    { icon: Briefcase, name: "Luxe & Co" },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      // Ajustement dynamique du scroll selon la largeur de la bulle (mobile vs desktop)
      const isMobile = window.innerWidth < 640;
      const scrollAmount = isMobile ? 320 : 490; // Largeur bulle + gap approximatif
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-32 bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-slate/50 hidden lg:block -z-10 rounded-l-[200px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-full text-xs font-black uppercase tracking-[0.2em]">
                <span className="text-brand-orange mr-1">★</span>
                Cabinet Drakar
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-brand-blue leading-tight tracking-tighter min-h-[1.8em] lg:min-h-[2.7em]">
                L'expertise comptable au service de votre <span className="text-brand-orange inline-block animate-word-change" key={words[wordIndex]}>{words[wordIndex]}</span>
              </h1>
              <p className="text-xl text-brand-blue/70 leading-relaxed max-w-xl font-medium">
                Le Cabinet Drakar accompagne les dirigeants d'entreprise dans la gestion rigoureuse de leurs obligations comptables, fiscales et sociales. Nous privilégions une approche souveraine et fiable.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to="/contact"
                  className="bg-brand-orange text-white px-6 py-4 sm:px-10 sm:py-5 rounded-2xl text-sm sm:text-lg font-black shadow-2xl shadow-orange-500/40 hover:bg-brand-orange-hover transition-all transform hover:-translate-y-1 text-center whitespace-nowrap"
                >
                  Demander une étude
                </Link>
                <Link
                  to="/expertises"
                  className="bg-white border-2 border-brand-blue text-brand-blue px-6 py-4 sm:px-10 sm:py-5 rounded-2xl text-sm sm:text-lg font-black hover:bg-brand-slate transition-all text-center whitespace-nowrap"
                >
                  Nos expertises
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-8 border-t border-slate-100">
                <div className="flex -space-x-4">
                  {[
                    'https://i.pravatar.cc/150?u=21',
                    'https://randomuser.me/api/portraits/women/44.jpg',
                    'https://i.pravatar.cc/150?u=23',
                    'https://i.pravatar.cc/150?u=24',
                  ].map((src, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-400 overflow-hidden">
                      <img src={src} alt="Client" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-brand-blue/60">
                  <span className="text-brand-blue font-black text-lg">250+</span> entreprises font confiance au cabinet
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-10 bg-brand-orange/10 blur-[100px] rounded-full group-hover:bg-brand-orange/20 transition-colors duration-1000"></div>
              
              <div className="relative z-10 space-y-6">
                <SolutionVisual type="dashboard" className="w-full transform -rotate-2 hover:rotate-0 transition-transform duration-500" />
                <div className="grid grid-cols-2 gap-6">
                  <SolutionVisual type="payroll" className="transform rotate-1 hover:rotate-0 transition-transform duration-500" />
                  <SolutionVisual type="tax" className="transform -rotate-1 hover:rotate-0 transition-transform duration-500" />
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl z-20 hidden xl:block border border-slate-100 transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-5">
                  <div className="bg-green-100 p-4 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Suivi de Performance</p>
                    <p className="text-3xl font-black text-brand-blue">Indicateurs</p>
                    <p className="text-[10px] text-slate-500 font-bold">Analyse financière souveraine</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Band (Logos Clients) */}
      <section className="py-20 bg-brand-slate/50 overflow-hidden border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
            <p className="text-xl sm:text-2xl font-black text-brand-blue">Ils font confiance à <span className="text-brand-orange">l'expertise Drakar</span></p>
        </div>
        <div className="marquee-container relative">
          <div className="animate-scroll flex items-center">
            {logos.map((logo, idx) => (
              <LogoItem key={`logo-1-${idx}`} icon={logo.icon} name={logo.name} />
            ))}
            {logos.map((logo, idx) => (
              <LogoItem key={`logo-2-${idx}`} icon={logo.icon} name={logo.name} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Drakar */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-24 gap-12 relative">
            <div className="w-full max-w-2xl space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-blue tracking-tighter leading-tight">
                Un accompagnement fondé sur la <span className="text-brand-orange">rigueur</span> et l’excellence.
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-500 font-medium leading-relaxed">
                Nous assurons le pilotage global de votre structure. Notre méthode concilie l’efficacité des outils modernes avec l’expertise d’un conseil technique de haut niveau, indispensable à la prise de décision.
              </p>
            </div>
            
            <Link to="/contact" className="bg-brand-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-blue-light transition-all shadow-xl whitespace-nowrap">
              Prendre rendez-vous
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="p-12 rounded-[40px] bg-brand-slate border border-transparent hover:border-brand-orange/10 hover:bg-white hover:shadow-2xl transition-all group">
                <div className="mb-8 inline-block p-5 bg-white rounded-2xl shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-brand-blue">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domains of Intervention */}
      <section className="py-40 bg-brand-blue relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #F97316 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-3xl space-y-6">
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight">
                Nos domaines <span className="text-brand-orange">d'expertises.</span>
              </h2>
              <p className="text-base lg:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl">
                Découvrez l’ensemble des pôles Drakar et l’accompagnement souverain que nous proposons pour la gestion de votre patrimoine professionnel.
              </p>
            </div>
            {/* Nav buttons */}
            <div className="flex gap-6 mb-2">
              <button 
                onClick={() => scroll('left')}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange hover:scale-110 transition-all shadow-xl"
                aria-label="Expertise précédente"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange hover:scale-110 transition-all shadow-xl"
                aria-label="Expertise suivante"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          </div>
        </div>

        {/* Manual Horizontal Scroll Area */}
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 sm:gap-10 px-6 sm:px-[calc((100vw-1280px)/2)] scrollbar-hide snap-x snap-mandatory py-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Espacement initial mobile pour centrer le début */}
            <div className="flex-shrink-0 w-0 sm:hidden"></div>
            {SERVICE_CATEGORIES.map((category) => (
              <ExpertiseBubble key={category.id} category={category} />
            ))}
            <div className="flex-shrink-0 w-6 sm:hidden"></div>
          </div>
        </div>

        {/* ORANGE ACTION BUTTON */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-24 text-center">
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-6 bg-brand-orange text-white px-8 py-5 sm:px-16 sm:py-8 rounded-[20px] sm:rounded-[30px] text-lg sm:text-2xl font-black shadow-[0_20px_50px_rgba(249,115,22,0.4)] hover:bg-brand-orange-hover transition-all transform hover:-translate-y-2 hover:scale-105 group active:scale-95 whitespace-nowrap"
          >
            Démarrer votre projet <Zap className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-bounce" />
          </Link>
          <p className="mt-10 text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Accompagnement souverain sous 24h</p>
        </div>
      </section>

      {/* Reassurance Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-slate rounded-[60px] p-12 lg:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none text-brand-blue">
                <Ship className="w-96 h-96" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-10">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-blue leading-tight tracking-tighter">
                  <span className="text-brand-orange">Optimiser</span> votre gestion quotidienne.
                </h2>
                <ul className="space-y-6">
                  {[
                    "Suivi rigoureux de vos flux financiers",
                    "Gestion conforme de vos obligations sociales",
                    "Sécurisation et optimisation fiscale",
                    "Conseil stratégique et accompagnement institutionnel"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-xl font-bold text-slate-800">
                      <CheckCircle2 className="w-7 h-7 text-brand-orange fill-brand-orange/10" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-6">
                  <Link
                    to="/contact"
                    className="bg-brand-blue text-white px-6 py-4 sm:px-12 sm:py-6 rounded-xl sm:rounded-2xl text-sm sm:text-xl font-black hover:bg-brand-blue-light transition-all shadow-2xl shadow-slate-900/20 inline-block whitespace-nowrap"
                  >
                    Demander une consultation
                  </Link>
                </div>
              </div>
              <div className="relative">
                <SolutionVisual type="stats" className="w-full transform rotate-3 scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
