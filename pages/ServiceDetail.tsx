
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, HelpCircle, ArrowRight, Star, Quote, Users, Info } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../constants';
import { getServiceContent } from '../serviceData';
import SolutionVisual from '../components/SolutionVisual';

const ServiceDetail: React.FC = () => {
  const { categorySlug, subSlug } = useParams<{ categorySlug: string; subSlug?: string }>();

  const category = useMemo(() => 
    SERVICE_CATEGORIES.find(c => c.slug === categorySlug),
    [categorySlug]
  );
  
  if (!category) {
    return (
      <div className="pt-56 pb-40 text-center">
        <h1 className="text-4xl font-black">Expertise introuvable</h1>
        <Link to="/expertises" className="text-brand-orange font-bold mt-4 inline-block">Retour aux expertises</Link>
      </div>
    );
  }

  const subService = subSlug ? category.subServices.find(s => s.slug === subSlug) : null;
  const pageTitle = subService ? subService.title : category.title;
  const content = useMemo(() => getServiceContent(subSlug || categorySlug || ''), [subSlug, categorySlug]);

  return (
    <div className="pt-40 pb-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-12">
          <Link to="/expertises" className="hover:text-brand-orange transition-colors">Expertises</Link>
          <ChevronRight className="w-3 h-3" />
          {subSlug ? (
            <>
              <Link to={`/expertises/${category.slug}`} className="hover:text-brand-orange transition-colors">{category.title}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-brand-blue">{pageTitle}</span>
            </>
          ) : (
            <span className="text-brand-blue">{category.title}</span>
          )}
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-24">
            
            {/* 1. Presentation Section */}
            <section className="space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest">
                <Star className="w-3 h-3 fill-brand-orange" /> Excellence Drakar
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-brand-blue tracking-tighter leading-none">
                {pageTitle}
              </h1>
              <p className="text-2xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                {content.introduction}
              </p>
              
              {/* Management Animation Component */}
              <div className="relative pt-10">
                <div className="absolute -inset-10 bg-brand-slate blur-3xl rounded-full opacity-50"></div>
                <div className="relative bg-white rounded-[40px] p-8 border border-slate-100 shadow-2xl flex flex-col md:flex-row gap-10 items-center overflow-hidden">
                   <div className="shrink-0 w-full md:w-1/2">
                      <SolutionVisual 
                        type={subSlug?.includes('paie') ? 'payroll' : subSlug?.includes('fiscale') ? 'tax' : 'dashboard'} 
                        className="w-full transform transition-all duration-700 hover:rotate-0 rotate-2" 
                      />
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-2xl font-black text-brand-blue">Drakar gère, vous pilotez.</h3>
                      <p className="text-slate-500 font-medium">Notre pôle d'expertise prend en charge l'intégralité du cycle de gestion souverain. Nous sécurisons vos données pour vous offrir une visibilité absolue sur votre performance.</p>
                      <div className="flex gap-4">
                        <div className="flex -space-x-3">
                           {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="client" />)}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange self-center">Confiance renouvelée</p>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* 2. Client Reassurance Section */}
            <section className="bg-brand-blue text-white p-12 lg:p-16 rounded-[60px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Users className="w-40 h-40" />
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-black tracking-tight">Ils naviguent avec nous</h2>
                  <p className="text-lg text-slate-300 font-medium">Rejoignez plus de 250 entrepreneurs qui ont délégué leur gestion à Drakar pour se concentrer sur l'essentiel.</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 text-brand-orange fill-brand-orange" />)}
                  </div>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                   <Quote className="w-8 h-8 text-brand-orange mb-4" />
                   <p className="text-xl font-bold italic mb-6">"Le pôle {pageTitle.toLowerCase()} a été d'une aide précieuse pour la structuration de mon activité. Une équipe souveraine."</p>
                   <p className="font-black text-sm uppercase tracking-widest text-brand-orange">Marc D. — CEO TechNexus</p>
                </div>
              </div>
            </section>

            {/* 3. Ce que comprend la mission */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-brand-orange/10 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-black text-brand-blue tracking-tight">Ce que comprend la mission</h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.mission.map((item, i) => (
                  <li key={i} className="flex gap-4 p-6 bg-brand-slate/50 rounded-2xl border border-slate-100 items-start hover:bg-white hover:shadow-xl transition-all">
                    <span className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">{i + 1}</span>
                    <span className="text-slate-700 font-bold leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar - FIXED/STICKY CTA */}
          <div className="relative">
            <div className="sticky top-32 space-y-12">
              <div className="bg-brand-orange p-10 rounded-[40px] text-white shadow-2xl shadow-orange-500/30 group overflow-hidden border border-white/10">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-2xl font-black mb-6 relative z-10">Besoin de cette expertise ?</h3>
                <p className="text-white/80 font-medium mb-10 relative z-10">
                  Nos experts Drakar sont à votre disposition pour analyser votre dossier et vous proposer un accompagnement souverain.
                </p>
                <Link to="/contact" className="block w-full text-center bg-brand-blue text-white py-5 rounded-2xl font-black hover:bg-brand-blue-light transition-all shadow-xl relative z-10 active:scale-95">
                  Demander un devis
                </Link>
              </div>
              
              <div className="bg-brand-slate/50 p-8 rounded-[40px] border border-slate-100">
                <h3 className="text-xl font-black text-brand-blue mb-8">Expertises Liées</h3>
                <div className="space-y-4">
                  {SERVICE_CATEGORIES.filter(c => c.slug !== categorySlug).slice(0, 3).map(cat => (
                    <Link key={cat.id} to={`/expertises/${cat.slug}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-brand-orange hover:shadow-md transition-all group">
                       <span className="text-sm font-bold text-brand-blue group-hover:text-brand-orange">{cat.title}</span>
                       <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
