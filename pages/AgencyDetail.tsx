
import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, CheckCircle2, Ship, ArrowRight, ChevronDown, ChevronUp, TrendingUp, ShieldCheck, Star, Users, Scale, BarChart3, Clock, Award, Send } from 'lucide-react';
import { getAgencyBySlug, AGENCY_CONTENT } from '../data/agencies';

// City-specific data for enhanced SEO (NAP, coordinates, Maps, cross-links)
const CITY_SEO: Record<string, {
  department: string;
  postalCode: string;
  streetAddress: string;
  latitude: number;
  longitude: number;
  googleMapsEmbed: string;
  crossLinkCity: string;
  crossLinkSlug: string;
  crossLinkText: string;
  trustStats: { clients: string; years: string; rating: string; reviews: string };
}> = {
  'expert-comptable-caen': {
    department: 'Calvados',
    postalCode: '14000',
    streetAddress: '10 Rue de Penthièvre',
    latitude: 49.1829,
    longitude: -0.3707,
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d41589.7!2d-0.4!3d49.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480a42a5a8df3f29%3A0x40c14484fbceaf0!2sCaen!5e0!3m2!1sfr!2sfr!4v1',
    crossLinkCity: 'Rouen',
    crossLinkSlug: 'expert-comptable-rouen',
    crossLinkText: "Vous exercez votre activité à Rouen ou en Seine-Maritime ? Découvrez notre cabinet expert-comptable à Rouen.",
    trustStats: { clients: '200+', years: '10+', rating: '4.9', reviews: '47' }
  },
  'expert-comptable-rouen': {
    department: 'Seine-Maritime',
    postalCode: '76000',
    streetAddress: '10 Rue de Penthièvre',
    latitude: 49.4432,
    longitude: 1.0999,
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d41289.5!2d1.05!3d49.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e0de0c6f1b3f07%3A0x40c14484fbceaf0!2sRouen!5e0!3m2!1sfr!2sfr!4v1',
    crossLinkCity: 'Caen',
    crossLinkSlug: 'expert-comptable-caen',
    crossLinkText: "Vous exercez votre activité à Caen ou dans le Calvados ? Découvrez notre cabinet expert-comptable à Caen.",
    trustStats: { clients: '200+', years: '10+', rating: '4.9', reviews: '47' }
  }
};

const AgencyDetail: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', city: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const agency = useMemo(() => {
    const cleanSlug = citySlug?.replace('expert-comptable-', '').replace('cabinet-expert-comptable-', '');
    return getAgencyBySlug(citySlug || '') || getAgencyBySlug(`expert-comptable-${cleanSlug}`);
  }, [citySlug]);

  const content = useMemo(() => {
    if (!agency) return null;
    return AGENCY_CONTENT[agency.slug] || null;
  }, [agency]);

  const citySeo = useMemo(() => {
    if (!agency) return null;
    return CITY_SEO[agency.slug] || null;
  }, [agency]);

  // Dynamic meta tags: title, description, canonical, OG, Twitter
  useEffect(() => {
    if (!agency) return;
    const city = agency.name;
    const metaDescText = content?.metaDescription || `Cabinet Drakar, expert-comptable à ${city}. Accompagnement TPE, PME et indépendants. Devis gratuit.`;

    // Title
    document.title = content?.metaTitle ? `${content.metaTitle} - Devis Gratuit` : `Expert-comptable à ${city} | Cabinet Drakar - Devis Gratuit`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.setAttribute('name', 'description'); document.head.appendChild(metaDesc); }
    metaDesc.setAttribute('content', metaDescText);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', `https://drakarexpertcomptable.fr/${agency.slug}/`);

    // Open Graph
    const ogTags: Record<string, string> = {
      'og:title': `Expert-comptable à ${city} | Cabinet Drakar`,
      'og:description': metaDescText,
      'og:type': 'website',
      'og:url': `https://drakarexpertcomptable.fr/${agency.slug}/`,
      'og:image': 'https://drakarexpertcomptable.fr/img/og-cabinet-drakar.jpg',
      'og:locale': 'fr_FR',
      'og:site_name': 'Cabinet Drakar Expert-Comptable',
    };
    Object.entries(ogTags).forEach(([property, c]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); }
      tag.setAttribute('content', c);
    });

    // Twitter Card
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': `Expert-comptable à ${city} | Cabinet Drakar`,
      'twitter:description': metaDescText,
    };
    Object.entries(twitterTags).forEach(([name, c]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('name', name); document.head.appendChild(tag); }
      tag.setAttribute('content', c);
    });

    return () => {
      document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(el => el.remove());
      document.querySelector('link[rel="canonical"]')?.remove();
      document.querySelector('meta[name="description"]')?.remove();
    };
  }, [agency, content]);

  if (!agency) {
    return (
      <div className="pt-56 pb-40 text-center">
        <h1 className="text-4xl font-black">Agence introuvable</h1>
        <Link to="/agences" className="text-brand-orange font-bold mt-4 inline-block">Consulter toutes nos agences</Link>
      </div>
    );
  }

  const city = agency.name;

  // JSON-LD: LocalBusiness + AccountingService (enriched)
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["AccountingService", "LocalBusiness"],
    "name": `Cabinet Drakar Expert-Comptable ${city}`,
    "image": "https://drakarexpertcomptable.fr/img/cabinet-drakar.jpg",
    "url": `https://drakarexpertcomptable.fr/${agency.slug}/`,
    "telephone": "+33611012559",
    "email": "contact@drakarexpertcomptable.fr",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": citySeo?.streetAddress || "",
      "addressLocality": city,
      "postalCode": citySeo?.postalCode || "",
      "addressRegion": citySeo?.department || "Normandie",
      "addressCountry": "FR"
    },
    ...(citySeo ? {
      "geo": { "@type": "GeoCoordinates", "latitude": citySeo.latitude, "longitude": citySeo.longitude }
    } : {}),
    "areaServed": [city, citySeo?.department, "Normandie"].filter(Boolean),
    "priceRange": "€€",
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "09:00", "closes": "18:00" }
    ],
    ...(citySeo?.trustStats ? {
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": citySeo.trustStats.rating, "reviewCount": citySeo.trustStats.reviews, "bestRating": "5" }
    } : {})
  };

  // JSON-LD: FAQPage
  const faqJsonLd = content ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faq.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  } : null;

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://drakarexpertcomptable.fr/" },
      { "@type": "ListItem", "position": 2, "name": "Nos agences", "item": "https://drakarexpertcomptable.fr/agences/" },
      { "@type": "ListItem", "position": 3, "name": `Expert-comptable à ${city}`, "item": `https://drakarexpertcomptable.fr/${agency.slug}/` }
    ]
  };

  const missionIcons = [
    <Ship className="w-6 h-6" />,
    <TrendingUp className="w-6 h-6" />,
    <Star className="w-6 h-6" />,
    <ShieldCheck className="w-6 h-6" />,
    <Scale className="w-6 h-6" />,
    <BarChart3 className="w-6 h-6" />
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'efc6af61-d62e-4e0b-b4f5-e1e7907cb179',
          subject: `Nouveau contact depuis la page ${city}`,
          ...formState
        })
      });
      if (res.ok) { setFormStatus('sent'); setFormState({ name: '', email: '', phone: '', city, message: '' }); }
      else { setFormStatus('error'); }
    } catch { setFormStatus('error'); }
  };

  // Generic fallback for cities without dedicated content
  if (!content) {
    return (
      <div className="pt-40 pb-32 bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-12">
            <Link to="/" className="hover:text-brand-orange">Accueil</Link>
            <span className="text-slate-300">/</span>
            <Link to="/agences" className="hover:text-brand-orange">Nos agences</Link>
            <span className="text-slate-300">/</span>
            <span className="text-brand-blue">{city}</span>
          </nav>
          <h1 className="text-6xl font-black text-brand-blue tracking-tighter mb-8">
            Expert-comptable <span className="text-brand-orange">à {city}.</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium mb-12">
            Cabinet d'expertise comptable à {city} – Accompagnement des entreprises, indépendants et sociétés.
          </p>
          <Link to="/contact" className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-500/30 hover:bg-brand-orange-hover transition-all inline-block">
            Prendre rendez-vous
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="pt-40 pb-20 bg-gradient-to-b from-brand-slate to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">
            <Link to="/" className="hover:text-brand-orange">Accueil</Link>
            <span className="text-slate-300">/</span>
            <Link to="/agences" className="hover:text-brand-orange">Nos agences</Link>
            <span className="text-slate-300">/</span>
            <span className="text-brand-blue">Expert-comptable à {city}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-brand-orange rounded-xl text-[10px] font-black uppercase tracking-widest">
                <Ship className="w-4 h-4" /> Expert-Comptable à {city}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-brand-blue tracking-tighter leading-tight">
                {content.heroTitle.replace("Votre cabinet d'expert-comptable", "Expert-comptable")}
                <span className="text-brand-orange">.</span>
              </h1>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                {content.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact-form" className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-orange-500/30 hover:bg-brand-orange-hover transition-all text-center">
                  Demander un devis gratuit
                </a>
                <Link to="/contact" className="border-2 border-brand-blue text-brand-blue px-8 py-4 rounded-2xl font-black text-lg hover:bg-brand-blue hover:text-white transition-all text-center">
                  Prendre rendez-vous
                </Link>
              </div>
              <a href="tel:+33611012559" className="inline-flex items-center gap-3 text-brand-blue font-bold hover:text-brand-orange transition-colors">
                <Phone className="w-5 h-5 text-brand-orange" />
                <span>06 11 01 25 59</span>
              </a>
            </div>

            {/* Trust Card with Stats */}
            <div className="relative">
              <div className="absolute -inset-10 bg-brand-slate blur-3xl rounded-full opacity-60"></div>
              <div className="relative bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl space-y-6">
                {citySeo?.trustStats && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-brand-slate/50 rounded-2xl">
                      <p className="text-3xl font-black text-brand-orange">{citySeo.trustStats.clients}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1">Entreprises accompagnées</p>
                    </div>
                    <div className="text-center p-4 bg-brand-slate/50 rounded-2xl">
                      <p className="text-3xl font-black text-brand-orange">{citySeo.trustStats.years}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1">Années d'expérience</p>
                    </div>
                    <div className="text-center p-4 bg-brand-slate/50 rounded-2xl col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-3xl font-black text-brand-orange">{citySeo.trustStats.rating}/5</p>
                        <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}</div>
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-1">{citySeo.trustStats.reviews} avis Google</p>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Inscrit à l'Ordre des Experts-Comptables
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Réponse sous 24h garantie
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Premier échange gratuit et sans engagement
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Expert-comptable diplômé d'État dédié
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST SIGNALS BAR ===== */}
      <section className="py-8 bg-brand-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16 text-white">
            <div className="flex items-center gap-3"><Award className="w-6 h-6 text-brand-orange" /><span className="font-bold text-sm">Ordre des Experts-Comptables</span></div>
            <div className="flex items-center gap-3"><Users className="w-6 h-6 text-brand-orange" /><span className="font-bold text-sm">{citySeo?.trustStats?.clients || '200+'} entreprises</span></div>
            <div className="flex items-center gap-3"><Clock className="w-6 h-6 text-brand-orange" /><span className="font-bold text-sm">Réponse sous 24h</span></div>
            <div className="flex items-center gap-3"><Star className="w-6 h-6 text-brand-orange" /><span className="font-bold text-sm">{citySeo?.trustStats?.rating || '4.9'}/5 sur Google</span></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== POURQUOI NOUS CHOISIR ===== */}
        <section className="py-24">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight">
              Pourquoi choisir Drakar comme expert-comptable à {city} ?
            </h2>
            <div className="w-20 h-1.5 bg-brand-orange mt-6 rounded-full"></div>
            <p className="text-lg text-slate-500 font-medium mt-6 max-w-3xl leading-relaxed">{content.whyChooseUs.intro}</p>
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

        {/* ===== NOS MISSIONS ===== */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight">
              Nos missions d'expertise comptable à {city}
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

        {/* ===== CLIENTELE ===== */}
        <section className="mb-24">
          <div className="bg-brand-blue text-white rounded-[60px] p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none"><Users className="w-80 h-80" /></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4">
                Qui accompagnons-nous <span className="text-brand-orange">à {city} ?</span>
              </h2>
              <p className="text-slate-400 font-medium mb-10 max-w-3xl leading-relaxed">{content.clientele.intro}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {content.clientele.types.map((type, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="font-bold text-sm">{type}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">{content.clientele.outro}</p>
              {/* Internal links */}
              <div className="flex flex-wrap gap-3 pt-6">
                <Link to="/expertises/expertise-comptable" className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold hover:bg-brand-orange hover:text-white transition-all">Tenue de comptabilité</Link>
                <Link to="/expertises/fiscalite" className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold hover:bg-brand-orange hover:text-white transition-all">Conseil fiscal</Link>
                <Link to="/expertises/juridique-societes/creation-entreprise" className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold hover:bg-brand-orange hover:text-white transition-all">Création d'entreprise</Link>
                <Link to="/expertises/social-droit-travail/gestion-de-la-paie" className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold hover:bg-brand-orange hover:text-white transition-all">Gestion sociale et paie</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ANCRAGE LOCAL ===== */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight leading-tight">{content.localSection.title}</h2>
              <div className="w-20 h-1.5 bg-brand-orange rounded-full"></div>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">{content.localSection.description}</p>
            </div>
            <div className="bg-brand-slate/50 rounded-[40px] p-10 space-y-8">
              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <MapPin className="w-6 h-6 text-brand-orange" />
                <div>
                  <p className="font-black text-brand-blue">{city}</p>
                  <p className="text-sm text-slate-400 font-medium">{citySeo?.department || 'Normandie'}</p>
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

        {/* ===== FAQ ACCORDION ===== */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight">
              Questions fréquentes — Expert-comptable à {city}
            </h2>
            <div className="w-20 h-1.5 bg-brand-orange mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {content.faq.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-brand-slate/50 transition-colors"
                >
                  <h3 className="text-lg font-black text-brand-blue pr-4">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-brand-orange shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} role="region">
                  <p className="px-6 pb-6 text-slate-500 font-medium leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== GOOGLE MAPS + NAP ===== */}
        {citySeo && (
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-brand-blue tracking-tight">Nous trouver à {city}</h2>
              <div className="w-20 h-1.5 bg-brand-orange mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-[32px] overflow-hidden shadow-xl border border-slate-100 h-[400px]">
                <iframe src={citySeo.googleMapsEmbed} width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Localisation Cabinet Drakar ${city}`}></iframe>
              </div>
              <div className="bg-brand-slate/50 rounded-[32px] p-10 space-y-8">
                <h3 className="text-2xl font-black text-brand-blue">Cabinet Drakar — {city}</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
                    <div><p className="font-bold text-brand-blue">{citySeo.streetAddress}</p><p className="text-slate-500 font-medium">{citySeo.postalCode} {city}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-brand-orange shrink-0" />
                    <a href="tel:+33611012559" className="font-bold text-brand-blue hover:text-brand-orange transition-colors">06 11 01 25 59</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-brand-orange shrink-0" />
                    <a href="mailto:contact@drakarexpertcomptable.fr" className="font-bold text-brand-blue hover:text-brand-orange transition-colors">contact@drakarexpertcomptable.fr</a>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
                    <div><p className="font-bold text-brand-blue">Horaires d'ouverture</p><p className="text-slate-500 font-medium">Lundi – Vendredi : 9h00 – 18h00</p></div>
                  </div>
                </div>
                <a href="tel:+33611012559" className="flex items-center justify-center gap-3 w-full bg-brand-orange text-white px-6 py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 hover:bg-brand-orange-hover transition-all">
                  <Phone className="w-5 h-5" /> Appeler maintenant
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ===== CONTACT FORM INLINE ===== */}
        <section id="contact-form" className="mb-24 scroll-mt-32">
          <div className="bg-brand-blue rounded-[40px] p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Demandez votre <span className="text-brand-orange">devis gratuit</span>
                </h2>
                <p className="text-slate-300 font-medium leading-relaxed">
                  {content.ctaDescription}
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-white font-bold text-sm"><CheckCircle2 className="w-5 h-5 text-brand-orange" /> Devis 100% gratuit et sans engagement</div>
                  <div className="flex items-center gap-3 text-white font-bold text-sm"><CheckCircle2 className="w-5 h-5 text-brand-orange" /> Réponse sous 24h ouvrées</div>
                  <div className="flex items-center gap-3 text-white font-bold text-sm"><CheckCircle2 className="w-5 h-5 text-brand-orange" /> Interlocuteur unique et dédié</div>
                </div>
              </div>
              {formStatus === 'sent' ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 bg-white/10 rounded-3xl p-10">
                  <CheckCircle2 className="w-16 h-16 text-green-400" />
                  <p className="text-2xl font-black text-white">Message envoyé !</p>
                  <p className="text-slate-300 font-medium">Notre équipe à {city} vous recontacte sous 24h.</p>
                  <button onClick={() => setFormStatus('idle')} className="text-brand-orange font-bold underline mt-2">Envoyer un autre message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Prénom & Nom" required value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))} className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 font-medium focus:outline-none focus:border-brand-orange transition-colors" />
                    <input type="email" placeholder="Email professionnel" required value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))} className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 font-medium focus:outline-none focus:border-brand-orange transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="tel" placeholder="Téléphone" required value={formState.phone} onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))} className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 font-medium focus:outline-none focus:border-brand-orange transition-colors" />
                    <input type="text" placeholder="Ville" value={formState.city || city} onChange={e => setFormState(s => ({ ...s, city: e.target.value }))} className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 font-medium focus:outline-none focus:border-brand-orange transition-colors" />
                  </div>
                  <textarea placeholder="Décrivez brièvement votre besoin..." rows={3} value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))} className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 font-medium focus:outline-none focus:border-brand-orange transition-colors resize-none"></textarea>
                  <button type="submit" disabled={formStatus === 'sending'} className="w-full flex items-center justify-center gap-3 bg-brand-orange text-white px-8 py-4 rounded-xl font-black text-lg shadow-xl shadow-orange-500/30 hover:bg-brand-orange-hover transition-all disabled:opacity-50">
                    <Send className="w-5 h-5" /> {formStatus === 'sending' ? 'Envoi en cours...' : 'Obtenir mon devis gratuit'}
                  </button>
                  {formStatus === 'error' && <p className="text-red-400 text-sm font-bold text-center">Une erreur est survenue. Veuillez réessayer.</p>}
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ===== CROSS-LINK ===== */}
        {citySeo && (
          <section className="mb-24">
            <div className="bg-gradient-to-r from-brand-slate to-orange-50 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-lg font-black text-brand-blue">{citySeo.crossLinkText}</p>
              <Link to={`/${citySeo.crossLinkSlug}`} className="shrink-0 bg-brand-blue text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-orange transition-all flex items-center gap-3">
                Expert-comptable à {citySeo.crossLinkCity} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* ===== STICKY MOBILE CTA ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
          <a href="tel:+33611012559" className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white py-3 rounded-xl font-black text-sm">
            <Phone className="w-4 h-4" /> Appeler
          </a>
          <a href="#contact-form" className="flex-1 flex items-center justify-center gap-2 bg-brand-orange text-white py-3 rounded-xl font-black text-sm">
            <Send className="w-4 h-4" /> Devis gratuit
          </a>
        </div>
      </div>
    </div>
  );
};

export default AgencyDetail;
