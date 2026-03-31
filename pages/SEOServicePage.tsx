import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, HelpCircle, ArrowRight, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { SEO_SERVICE_PAGES } from '../data/seoServicePages';
import type { SEOServicePageData, SEOSection } from '../data/seoServicePages';

const SEOServicePage: React.FC = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const data: SEOServicePageData | undefined = useMemo(
    () => (slug ? SEO_SERVICE_PAGES[slug] : undefined),
    [slug]
  );

  // Set document title
  useEffect(() => {
    if (data) {
      document.title = data.metaTitle;
    }
  }, [data]);

  // Set meta description
  useEffect(() => {
    if (data) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', data.metaDescription);
      }
    }
  }, [data]);

  // Inject FAQPage Schema.org JSON-LD
  useEffect(() => {
    if (!data) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
    document.head.appendChild(script);

    return () => {
      document.getElementById('faq-schema')?.remove();
    };
  }, [data]);

  if (!data) {
    return (
      <div className="pt-56 pb-40 text-center">
        <h1 className="text-4xl font-black text-brand-blue">Page introuvable</h1>
        <p className="text-slate-500 font-medium mt-4 mb-8">
          Le service demand&eacute; n'existe pas ou a &eacute;t&eacute; d&eacute;plac&eacute;.
        </p>
        <Link
          to="/services"
          className="text-brand-orange font-bold inline-flex items-center gap-2 hover:underline"
        >
          <ArrowRight className="w-4 h-4" />
          Retour aux services
        </Link>
      </div>
    );
  }

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="pt-40 pb-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-12">
          <Link to="/" className="hover:text-brand-orange transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/services" className="hover:text-brand-orange transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-blue">{data.h1}</span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-16">
            {/* H1 + Intro */}
            <section>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-blue tracking-tighter leading-tight mb-8">
                {data.h1}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                {data.intro}
              </p>
            </section>

            {/* Sections */}
            {data.sections.map((section: SEOSection, sectionIndex: number) => (
              <section key={sectionIndex}>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-blue tracking-tight mb-6">
                  {section.title}
                </h2>

                {section.content && (
                  <p className="text-slate-600 leading-relaxed mb-6">{section.content}</p>
                )}

                {section.subSections && (
                  <div className="space-y-8">
                    {section.subSections.map((sub, subIndex) => (
                      <div
                        key={subIndex}
                        className="border-l-4 border-brand-orange/30 pl-6"
                      >
                        <h3 className="text-xl font-bold text-brand-blue mb-3">
                          {sub.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">{sub.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.list && (
                  <ul className="space-y-4 mt-6">
                    {section.list.map((item, listIndex) => (
                      <li key={listIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* FAQ Section */}
            {data.faq.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-brand-orange/10 p-2 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-blue tracking-tight">
                    Questions fr&eacute;quentes
                  </h2>
                </div>

                <div className="space-y-4">
                  {data.faq.map((faqItem, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="bg-brand-slate/30 rounded-2xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faqIndex)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-brand-slate/50 transition-colors"
                      >
                        <span className="text-brand-blue font-bold pr-4">
                          {faqItem.question}
                        </span>
                        {openFaq === faqIndex ? (
                          <ChevronUp className="w-5 h-5 text-brand-orange shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-brand-orange shrink-0" />
                        )}
                      </button>
                      {openFaq === faqIndex && (
                        <div className="px-6 pb-6">
                          <p className="text-slate-600 leading-relaxed">
                            {faqItem.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="relative">
            <div className="sticky top-32 space-y-12">
              {/* Orange CTA Card */}
              <div className="bg-brand-orange p-10 rounded-[40px] text-white shadow-2xl shadow-orange-500/30 group overflow-hidden relative border border-white/10">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-2xl font-black mb-6 relative z-10">
                  Besoin de cette expertise ?
                </h3>
                <p className="text-white/80 font-medium mb-10 relative z-10">
                  Nos experts Drakar sont &agrave; votre disposition pour analyser votre
                  dossier et vous proposer un accompagnement sur mesure.
                </p>
                <Link
                  to="/contact"
                  className="block w-full text-center bg-brand-blue text-white py-5 rounded-2xl font-black hover:bg-brand-blue-light transition-all shadow-xl relative z-10 active:scale-95"
                >
                  Demander un devis
                </Link>
              </div>

              {/* Related Links Card */}
              {data.relatedLinks.length > 0 && (
                <div className="bg-brand-slate/50 p-8 rounded-[40px] border border-slate-100">
                  <h3 className="text-xl font-black text-brand-blue mb-8">
                    Pages associ&eacute;es
                  </h3>
                  <div className="space-y-4">
                    {data.relatedLinks.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        to={link.to}
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-brand-orange hover:shadow-md transition-all group"
                      >
                        <span className="text-sm font-bold text-brand-blue group-hover:text-brand-orange">
                          {link.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOServicePage;
