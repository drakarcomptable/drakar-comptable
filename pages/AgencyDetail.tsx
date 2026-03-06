
import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, CheckCircle2, Ship, ArrowRight, ChevronDown, ChevronUp, TrendingUp, ShieldCheck, Star, Users, Scale, BarChart3 } from 'lucide-react';
import { getAgencyBySlug, AGENCY_CONTENT } from '../data/agencies';

const AgencyDetail: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const agency = useMemo(() => {
    const cleanSlug = citySlug?.replace('expert-comptable-', '').replace('cabinet-expert-comptable-', '');
    return getAgencyBySlug(citySlug || '') || getAgencyBySlug(`expert-comptable-${cleanSlug}`);
  }, [citySlug]);

  const content = useMemo(() => {
    if (!agency) return null;
    return AGENCY_CONTENT[agency.slug] || null;
  }, [agency]);

  useEffect(() => {
    if (content) {
      document.title = content.metaTitle;
    } else if (agency) {
      document.title = `Expert-comptable à ${agency.name} | Cabinet Drakar`;
    }
  }, [agency, content]);

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
    "name": `Drakar Expert Comptable ${agency.name}`,
    "image": "https://drakar-comptable.fr/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": agency.name,
      "addressRegion": "Normandie",
      "addressCountry": "FR"
    },
    "url": window.location.href,
    "telephone": "0611012559",
    "priceRange": "$$"
  };

  const faqJsonLd = content ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faq.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  const missionIcons = [
    <Ship className="w-6 h-6" />,
    <TrendingUp className="w-6 h-6" />,
    <Star className="w-6 h-6" />,
    <ShieldCheck className="w-6 h-6" />,
    <Scale className="w-6 h-6" />,
    <BarChart3 className="w-6 h-6" />
  ];

  // Si pas de contenu SEO dédié, affichage générique
  if (!content) {
    return (
      <div className="pt-40 pb-32 bg-white">
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-12">
            <Link to="/agences" className="hover:text-brand-orange">Nos agences</Link>
            <span className="text-slate-300">/</span>
            <span className="text-brand-blue">{agency.name}</span>
          </nav>
          <h1 className="text-6xl font-black text-brand-blue tracking-tighter mb-8">
            Expert-comptable <span className="text-brand-orange">à {agency.name}.</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium mb-12">
            Cabinet d'expertise comptable à {agency.name} – Accompagnement des entreprises, indépendants et sociétés.
          </p>
          <Link to="/contact" className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-500/30 hover:bg-brand-orange-hover transition-all inline-block">
            Prendre rendez-vous
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 bg-white">
      {/* Schema.org */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-12">
          <Link to="/agences" className="hover:text-brand-orange">Nos agences</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-blue">{agency.name}</span>
        </nav>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-brand-orange rounded-xl text-[10px] font-black uppercase tracking-widest">
              <Ship className="w-4 h-4" /> Expert-Comptable à {agency.name}
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-brand-blue tracking-tighter leading-tight">
              {content.heroTitle.replace("Votre cabinet d'expert-comptable", "Expert-comptable")}
              <span className="text-brand-orange">.</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/contact" className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-500/30 hover:bg-brand-orange-hover transition-all text-center">
                Demander un devis gratuit
              </Link>
              <Link to="/contact" className="bg-brand-blue text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-brand-blue-light transition-all text-center">
                Prendre rendez-vous
              </Link>
            </div>
            <div className="flex items-center gap-4 text-brand-blue font-bold">
              <Phone className="w-5 h-5 text-brand-orange" />
              <span>06 11 01 25 59</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-brand-slate blur-3xl rounded-full opacity-60"></div>
            <div className="relative bg-white p-12 rounded-[60px] border border-slate-100 shadow-2xl space-y-8">
              <div className="flex items-center gap-4 p-6 bg-brand-slate/50 rounded-3xl">
                <MapPin className="w-8 h-8 text-brand-orange" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Localisation</p>
                  <p className="text-xl font-black text-brand-blue">Cabinet Drakar {agency.name}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  Réponse sous 24h garantie
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  Premier échange gratuit et sans engagement
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  Inscrit à l'Ordre des experts-comptables
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pourquoi nous choisir */}
        <section className="mb-32">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight">
              Pourquoi choisir Drakar comme expert-comptable à {agency.name} ?
            </h2>
            <div className="w-20 h-1.5 bg-brand-orange mt-6 rounded-full"></div>
            <p className="text-lg text-slate-500 font-medium mt-6 max-w-3xl leading-relaxed">
              {content.whyChooseUs.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.whyChooseUs.points.map((point, i) => (
              <div key={i} className="p-8 bg-brand-slate/50 rounded-[30px] border border-transparent hover:border-brand-orange hover:bg-white hover:shadow-xl transition-all group">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-brand-blue mb-2">{point.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nos missions */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight">
              Nos missions d'expertise comptable à {agency.name}
            </h2>
            <div className="w-20 h-1.5 bg-brand-orange mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="space-y-8">
            {content.missions.map((mission, i) => (
              <div key={i} className="p-8 lg:p-10 bg-brand-slate/30 rounded-[30px] border border-transparent hover:border-brand-orange/20 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm shrink-0">
                    {React.cloneElement(missionIcons[i % missionIcons.length] as React.ReactElement)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-brand-blue mb-4">{mission.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{mission.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clientèle */}
        <section className="mb-32">
          <div className="bg-brand-blue text-white rounded-[60px] p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <Users className="w-80 h-80" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4">
                Qui accompagnons-nous <span className="text-brand-orange">à {agency.name} ?</span>
              </h2>
              <p className="text-slate-400 font-medium mb-10 max-w-3xl leading-relaxed">
                {content.clientele.intro}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {content.clientele.types.map((type, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="font-bold text-sm">{type}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                {content.clientele.outro}
              </p>
            </div>
          </div>
        </section>

        {/* Ancrage local */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight leading-tight">
                {content.localSection.title}
              </h2>
              <div className="w-20 h-1.5 bg-brand-orange rounded-full"></div>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {content.localSection.description}
              </p>
            </div>
            <div className="bg-brand-slate/50 rounded-[40px] p-10 space-y-8">
              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <MapPin className="w-6 h-6 text-brand-orange" />
                <div>
                  <p className="font-black text-brand-blue">{agency.name}</p>
                  <p className="text-sm text-slate-400 font-medium">Normandie</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <Ship className="w-6 h-6 text-brand-orange" />
                <div>
                  <p className="font-black text-brand-blue">Cabinet Drakar</p>
                  <p className="text-sm text-slate-400 font-medium">Membre de l'Ordre des experts-comptables</p>
                </div>
              </div>
              <Link to="/contact" className="flex items-center gap-3 text-brand-orange font-black text-sm uppercase tracking-widest group">
                Contacter l'agence <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight">
              Questions fréquentes
            </h2>
            <div className="w-20 h-1.5 bg-brand-orange mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {content.faq.map((faq, i) => (
              <div key={i} className="bg-brand-slate/50 rounded-2xl border border-transparent hover:border-brand-orange/20 transition-all overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-black text-brand-blue pr-4">{faq.question}</h3>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-brand-orange shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-slate-500 font-medium leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section>
          <div className="bg-brand-blue text-white rounded-[60px] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(#F97316 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}>
            </div>
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {content.ctaTitle}
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                {content.ctaDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                <Link to="/contact" className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-500/30 hover:bg-brand-orange-hover transition-all">
                  Demander un devis gratuit
                </Link>
                <Link to="/contact" className="bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all border border-white/10">
                  Prendre rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgencyDetail;
