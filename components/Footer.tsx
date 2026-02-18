
import React from 'react';
import { Link } from 'react-router-dom';
import { Ship, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../constants';

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
              {SERVICE_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/expertises/${cat.slug}`} className="text-slate-300 font-bold hover:text-white transition-colors text-sm">
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-8">Siège Social</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-brand-orange shrink-0" />
                <span className="text-slate-400 font-medium text-sm leading-relaxed">10 RUE DE PENTHIEVRE,<br />75008 PARIS</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-brand-orange shrink-0" />
                <span className="text-slate-400 font-bold text-sm">06 11 01 25 59</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-brand-orange shrink-0" />
                <span className="text-slate-400 font-bold text-sm">contact@drakarexpertcomptable.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-bold tracking-tight">
            © {new Date().getFullYear()} DRAKAR COMPTABLE. Excellence et Rigueur.
          </p>
          <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
