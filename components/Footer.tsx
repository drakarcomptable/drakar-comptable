
import React from 'react';
import { Link } from 'react-router-dom';
import { Ship, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { SEO_SERVICES } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-blue text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-20">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <Ship className="w-10 h-10 text-brand-orange" />
              <div className="flex flex-col -space-y-1">
                <span className="text-3xl font-black tracking-tighter leading-none">DRAKAR</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-brand-orange uppercase leading-none">COMPTABLE</span>
              </div>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed">
              Drakar est un cabinet d’expertise comptable souverain dédié aux entreprises. Une présence nationale au service de l'excellence technique.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-brand-orange transition-all transform hover:-translate-y-1">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-8">Navigation</h3>
            <ul className="space-y-5">
              <li><Link to="/" className="text-slate-300 font-bold hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/expertises" className="text-slate-300 font-bold hover:text-white transition-colors">Nos Expertises</Link></li>
              <li><Link to="/agences" className="text-slate-300 font-bold hover:text-white transition-colors">Nos Agences</Link></li>
              <li><Link to="/a-propos" className="text-slate-300 font-bold hover:text-white transition-colors">À Propos</Link></li>
              <li><Link to="/contact" className="text-slate-300 font-bold hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-8">Nos Expertises</h3>
            <ul className="space-y-4">
              {SEO_SERVICES.map((service) => (
                <li key={service.id}>
                  <Link to={service.to} className="text-slate-300 font-bold hover:text-white transition-colors text-sm">
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-8">Nos Agences</h3>
            <ul className="space-y-4 mb-8">
              <li><Link to="/expert-comptable-caen" className="text-slate-300 font-bold hover:text-white transition-colors text-sm">Expert-comptable Caen</Link></li>
              <li><Link to="/expert-comptable-rouen" className="text-slate-300 font-bold hover:text-white transition-colors text-sm">Expert-comptable Rouen</Link></li>
              <li><Link to="/expert-comptable-le-havre" className="text-slate-300 font-bold hover:text-white transition-colors text-sm">Expert-comptable Le Havre</Link></li>
              <li><Link to="/agences" className="text-slate-300 font-bold hover:text-white transition-colors text-sm">Toutes nos agences →</Link></li>
            </ul>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-slate-400 font-medium text-sm leading-relaxed">10 Rue de Penthièvre,<br />75008 Paris</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                <a href="tel:+33611012559" className="text-slate-400 font-bold text-sm hover:text-white transition-colors">06 11 01 25 59</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0" />
                <a href="mailto:contact@drakarexpertcomptable.fr" className="text-slate-400 font-bold text-sm hover:text-white transition-colors">contact@drakarexpertcomptable.fr</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-bold tracking-tight">
            © {new Date().getFullYear()} DRAKAR COMPTABLE. Excellence et Rigueur.
          </p>
          <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
            <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link to="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/cgv" className="hover:text-white transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
