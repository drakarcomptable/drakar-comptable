
import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, CheckCircle2, TrendingUp, ShieldCheck, Ship, ArrowRight, Star } from 'lucide-react';
import { getAgencyBySlug, ALL_AGENCIES } from '../data/agencies';

const AgencyDetail: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  
  const agency = useMemo(() => {
    // Try to match standard city name or prefixed slug
    const cleanSlug = citySlug?.replace('expert-comptable-', '').replace('cabinet-expert-comptable-', '');
    return ALL_AGENCIES.find(a => a.slug === citySlug || a.slug === `expert-comptable-${cleanSlug}`);
  }, [citySlug]);

  useEffect(() => {
    if (agency) {
      document.title = `Expert-comptable à ${agency.name} | Cabinet Drakar`;
    }
  }, [agency]);

  if (!agency) {
    return (
      <div className="pt-56 pb-40 text-center">
        <h1 className="text-4xl font-black">Agence introuvable</h1>
        <Link to="/agences" className="text-brand-orange font-bold mt-4 inline-block">Consulter toutes nos agences</Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "name": `Drakar Comptable ${agency.name}`,
    "image": "https://drakar-comptable.fr/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": agency.name,
      "addressRegion": agency.region,
      "addressCountry": "FR"
    },
    "url": window.location.href,
    "telephone": "0611012559",
    "priceRange": "$$"
  };

  return (
    <div className="pt-40 pb-32 bg-white">
      {/* Schema.org Injection */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-12">
          <Link to="/agences" className="hover:text-brand-orange">Nos agences</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-blue">{agency.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-brand-orange rounded-xl text-[10px] font-black uppercase tracking-widest">
              <Ship className="w-4 h-4" /> Cabinet Expert-Comptable
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-brand-blue tracking-tighter leading-tight">
              Expert-comptable <br /><span className="text-brand-orange">à {agency.name}.</span>
            </h1>
            <p className="text-2xl text-slate-600 font-medium leading-relaxed">
              Cabinet d’expertise comptable à {agency.name} – Accompagnement des entreprises, indépendants et sociétés.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/contact" className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-500/30 hover:bg-brand-orange-hover transition-all">
                Prendre rendez-vous
              </Link>
              <div className="flex items-center gap-4 text-brand-blue font-bold">
                <Phone className="w-5 h-5 text-brand-orange" />
                <span>06 11 01 25 59</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-10 bg-brand-slate blur-3xl rounded-full opacity-60"></div>
            <div className="relative bg-white p-12 rounded-[60px] border border-slate-100 shadow-2xl space-y-8">
              <div className="flex items-center gap-4 p-6 bg-brand-slate/50 rounded-3xl">
                <MapPin className="w-8 h-8 text-brand-orange" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Localisation</p>
                  <p className="text-xl font-black text-brand-blue">Centre d'affaires Drakar {agency.name}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  Réponse sous 24h garantie
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  Premier audit offert
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-brand-blue tracking-tight">Nos services à {agency.name}</h2>
            <div className="w-20 h-1.5 bg-brand-orange mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Expertise Comptable", icon: <TrendingUp /> },
              { title: "Création d’Entreprise", icon: <Ship /> },
              { title: "Gestion Sociale & Paie", icon: <ShieldCheck /> },
              { title: "Optimisation Fiscale", icon: <Star /> },
              { title: "Conseil Juridique", icon: <CheckCircle2 /> },
              { title: "Audit & Pilotage", icon: <TrendingUp /> }
            ].map((s, i) => (
              <div key={i} className="p-10 bg-brand-slate/50 rounded-[40px] border border-transparent hover:border-brand-orange hover:bg-white hover:shadow-2xl transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-orange mb-6 shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-all">
                  {React.cloneElement(s.icon as React.ReactElement, { className: "w-6 h-6" })}
                </div>
                <h3 className="text-2xl font-black text-brand-blue mb-4">{s.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Accompagnement rigoureux dédié au tissu économique de {agency.name}.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Local SEO Content */}
        <div className="bg-brand-blue text-white rounded-[60px] p-16 lg:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
            <Ship className="w-96 h-96" />
          </div>
          <div className="relative z-10 max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-none">
              Votre cabinet d'expertise comptable <span className="text-brand-orange">de référence à {agency.name}.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-300 font-medium leading-relaxed">
              <p>
                Le cabinet expert-comptable {agency.name} de Drakar est spécialisé dans l'accompagnement stratégique des entreprises de la région {agency.region}. Que vous soyez une startup en forte croissance, une PME industrielle ou un indépendant, nous structurons votre expertise comptable à {agency.name} pour en faire un véritable levier de performance.
              </p>
              <p>
                Ancrés au cœur de {agency.name}, nous comprenons parfaitement les spécificités économiques locales. Notre équipe fusionne une rigueur institutionnelle avec les outils digitaux les plus modernes pour simplifier votre gestion comptable quotidienne et sécuriser vos déclarations fiscales.
              </p>
            </div>
            <div className="pt-8 flex flex-wrap gap-8">
              <Link to="/contact" className="flex items-center gap-3 text-brand-orange font-black uppercase tracking-widest text-sm group">
                Contacter l'agence de {agency.name} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/agences" className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-sm">
                Voir les agences voisines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyDetail;
