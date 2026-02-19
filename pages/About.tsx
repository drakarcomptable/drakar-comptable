
import React from 'react';
// Import Link component for navigation
import { Link } from 'react-router-dom';
import { Shield, Ship, Award, Scale, CheckCircle2, TrendingUp } from 'lucide-react';
import SolutionVisual from '../components/SolutionVisual';

const About: React.FC = () => {
  return (
    <div className="pt-40 pb-20 bg-white">
      {/* Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-brand-blue tracking-tighter leading-tight">
              Drakar : Naviguez sur votre comptabilité en <span className="text-brand-orange">toute sérénité.</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed border-l-4 border-brand-orange pl-8">
              Plus qu'un cabinet, Drakar est une institution de confiance dédiée à la pérennité de votre entreprise. Nous mettons à votre disposition une organisation rigoureuse et une excellence technique sans compromis pour piloter votre activité avec précision.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-brand-blue font-bold">
                <CheckCircle2 className="w-6 h-6 text-brand-orange" />
                <span>Une organisation structurée pour un pilotage optimal</span>
              </div>
              <div className="flex items-center gap-4 text-brand-blue font-bold">
                <CheckCircle2 className="w-6 h-6 text-brand-orange" />
                <span>Expertise fiscale et comptable de haut niveau</span>
              </div>
              <div className="flex items-center gap-4 text-brand-blue font-bold">
                <CheckCircle2 className="w-6 h-6 text-brand-orange" />
                <span>Accompagnement souverain pour une gestion pérenne</span>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-10 bg-brand-slate blur-3xl rounded-full opacity-60"></div>
            <SolutionVisual type="dashboard" className="relative z-10 transform -rotate-1 group-hover:rotate-0 transition-transform duration-700 shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Pillars of Trust */}
      <section className="bg-brand-slate py-16 rounded-[80px] mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl font-black text-brand-blue tracking-tighter">
              L'Excellence <span className="text-brand-orange">Drakar</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium">Une structure pensée pour sécuriser chaque aspect de votre gestion.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Confiance &",
                highlight: "Intégrité",
                desc: "Nous bâtissons des relations durables fondées sur la transparence absolue. Votre comptabilité est entre les mains d'experts intègres.",
                icon: <Shield className="w-8 h-8 text-brand-orange" />
              },
              {
                title: "Rigueur",
                highlight: "Opérationnelle",
                desc: "Notre organisation interne permet un traitement fluide et précis de vos données, garantissant un pilotage en temps réel de votre activité.",
                icon: <TrendingUp className="w-8 h-8 text-brand-orange" />
              },
              {
                title: "Savoir-faire",
                highlight: "Technique",
                desc: "L'excellence technique est notre norme. Nous maîtrisons les complexités fiscales pour assurer la pérennité de votre patrimoine.",
                icon: <Award className="w-10 h-10 text-brand-orange" />
              }
            ].map((value, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-slate rounded-2xl text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black text-brand-blue tracking-tight mb-4">
                  {value.title} <span className="text-brand-orange">{value.highlight}</span>
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl lg:text-5xl font-black text-brand-blue tracking-tighter leading-tight">
            Confiez votre avenir à une <span className="text-brand-orange">expertise reconnue.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Nous mobilisons tous les moyens nécessaires pour faire de votre gestion fiscale un levier de croissance sécurisé.
          </p>
          <div className="pt-4">
            <Link to="/contact" className="bg-brand-blue text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-brand-blue-light transition-all shadow-xl">
              Consulter un expert Drakar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
