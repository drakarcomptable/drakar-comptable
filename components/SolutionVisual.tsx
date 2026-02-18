
import React from 'react';
import { TrendingUp, FileText, UserCheck, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';

interface VisualProps {
  type: 'dashboard' | 'payroll' | 'ledger' | 'tax' | 'stats';
  className?: string;
}

const SolutionVisual: React.FC<VisualProps> = ({ type, className = "" }) => {
  if (type === 'dashboard') {
    return (
      <div className={`bg-brand-blue p-6 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl ${className}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Trésorerie Net</p>
            <p className="text-2xl font-bold text-white">42,850.00 €</p>
          </div>
          <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-end gap-2 h-24 mb-6">
          {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 bg-brand-orange/30 rounded-t-sm relative group">
              <div 
                className="bg-brand-orange w-full rounded-t-sm absolute bottom-0 transition-all duration-1000" 
                style={{ height: `${h}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-slate-400 border-b border-slate-700 pb-2">
            <span>Dernières opérations</span>
            <span>Montant</span>
          </div>
          <div className="flex justify-between text-xs font-medium text-white">
            <span>Facture Client #A22</span>
            <span className="text-green-400">+ 1,200 €</span>
          </div>
          <div className="flex justify-between text-xs font-medium text-white">
            <span>Abonnement SaaS Cloud</span>
            <span className="text-slate-300">- 49 €</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'payroll') {
    return (
      <div className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-xl ${className}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-blue">Gestion Paie</p>
            <p className="text-xs text-slate-500">Mars 2024</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-brand-slate rounded-xl border border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-bold">Salarié #01</span>
            </div>
            <span className="text-xs font-medium text-slate-600">Bulletin généré</span>
          </div>
          <div className="p-3 bg-brand-slate rounded-xl border border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-bold">Salarié #02</span>
            </div>
            <span className="text-xs font-medium text-slate-600">Bulletin généré</span>
          </div>
          <div className="p-3 bg-brand-orange/5 rounded-xl border border-brand-orange/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
              <span className="text-xs font-bold">Salarié #03</span>
            </div>
            <span className="text-xs font-bold text-brand-orange">En cours...</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'tax') {
    return (
      <div className={`bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-lg ${className}`}>
        <div className="flex justify-between items-start mb-6">
          <h4 className="text-sm font-bold text-brand-blue uppercase tracking-wider">Echéances Fiscales</h4>
          <Calendar className="w-5 h-5 text-brand-orange" />
        </div>
        <div className="relative pl-6 border-l-2 border-brand-orange/30 space-y-6">
          <div className="relative">
            <div className="absolute -left-[29px] top-0 w-3 h-3 rounded-full bg-brand-orange"></div>
            <p className="text-xs font-bold text-brand-blue">15 AVRIL</p>
            <p className="text-[10px] text-slate-500">Télédéclaration TVA</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[29px] top-0 w-3 h-3 rounded-full bg-slate-300"></div>
            <p className="text-xs font-bold text-slate-400">15 MAI</p>
            <p className="text-[10px] text-slate-500">Acompte IS</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-brand-slate rounded-2xl">
          <DollarSign className="w-6 h-6 text-brand-orange mb-2" />
          <p className="text-xs text-slate-500">Facturation</p>
          <p className="text-lg font-bold">12.4k€</p>
        </div>
        <div className="p-4 bg-brand-blue text-white rounded-2xl">
          <ArrowUpRight className="w-6 h-6 text-brand-orange mb-2" />
          <p className="text-xs text-slate-400">Croissance</p>
          <p className="text-lg font-bold">+18%</p>
        </div>
      </div>
    </div>
  );
};

export default SolutionVisual;
