
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const NormandieMap: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[4/5] bg-brand-blue rounded-[60px] p-6 lg:p-10 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.5)] overflow-hidden group">
      {/* Grille de fond */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#F97316 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Titre */}
      <div className="absolute top-10 left-10 z-30">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Implantation Normande</p>
          <h3 className="text-xl font-black text-white tracking-tighter">Nos agences</h3>
        </div>
      </div>

      <svg viewBox="0 0 600 750" className="w-full h-full relative z-20">
        <defs>
          <linearGradient id="normandieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <filter id="glowCity" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glowOrange" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur" />
            <feFlood floodColor="#F97316" floodOpacity="0.4" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Normandie - forme simplifiée des 5 départements */}
        {/* Manche */}
        <path
          d="M40,200 L80,120 L130,100 L160,130 L140,200 L120,280 L60,320 L30,280 Z"
          className="fill-brand-blue-light stroke-white/10 stroke-1"
        />
        {/* Calvados */}
        <path
          d="M140,200 L160,130 L260,110 L300,150 L290,230 L200,270 L120,280 Z"
          className="fill-[#2D3E56] stroke-white/10 stroke-1"
        />
        {/* Orne */}
        <path
          d="M120,280 L200,270 L290,230 L300,320 L260,400 L140,400 L60,320 Z"
          className="fill-brand-blue-light stroke-white/10 stroke-1"
        />
        {/* Eure */}
        <path
          d="M290,230 L300,150 L400,130 L460,200 L440,300 L380,340 L300,320 Z"
          className="fill-brand-blue-light stroke-white/10 stroke-1"
        />
        {/* Seine-Maritime */}
        <path
          d="M260,110 L300,60 L420,50 L480,100 L460,200 L400,130 L300,150 Z"
          className="fill-[#2D3E56] stroke-white/10 stroke-1"
        />

        {/* Labels département (discrets) */}
        <text x="85" y="220" className="fill-white/15 text-[11px] font-bold" textAnchor="middle">Manche</text>
        <text x="210" y="200" className="fill-white/15 text-[11px] font-bold" textAnchor="middle">Calvados</text>
        <text x="200" y="350" className="fill-white/15 text-[11px] font-bold" textAnchor="middle">Orne</text>
        <text x="370" y="260" className="fill-white/15 text-[11px] font-bold" textAnchor="middle">Eure</text>
        <text x="380" y="100" className="fill-white/15 text-[11px] font-bold" textAnchor="middle">Seine-Maritime</text>

        {/* Ligne de connexion entre les deux villes */}
        <line x1="220" y1="195" x2="400" y2="108" className="stroke-brand-orange/30 stroke-1" strokeDasharray="6 4" />

        {/* Ville : Caen */}
        <g className="cursor-pointer">
          {/* Halo */}
          <circle cx="220" cy="195" r="20" className="fill-brand-orange/10 animate-pulse" />
          <circle cx="220" cy="195" r="12" className="fill-brand-orange/20" />
          {/* Point */}
          <circle cx="220" cy="195" r="6" className="fill-brand-orange" filter="url(#glowOrange)" />
          <circle cx="220" cy="195" r="3" className="fill-white" />
          {/* Label */}
          <rect x="170" y="220" width="100" height="32" rx="10" className="fill-white/10" />
          <text x="220" y="241" className="fill-white text-[14px] font-black tracking-wide" textAnchor="middle">CAEN</text>
        </g>

        {/* Ville : Rouen */}
        <g className="cursor-pointer">
          {/* Halo */}
          <circle cx="400" cy="108" r="20" className="fill-brand-orange/10 animate-pulse" />
          <circle cx="400" cy="108" r="12" className="fill-brand-orange/20" />
          {/* Point */}
          <circle cx="400" cy="108" r="6" className="fill-brand-orange" filter="url(#glowOrange)" />
          <circle cx="400" cy="108" r="3" className="fill-white" />
          {/* Label */}
          <rect x="345" y="130" width="110" height="32" rx="10" className="fill-white/10" />
          <text x="400" y="151" className="fill-white text-[14px] font-black tracking-wide" textAnchor="middle">ROUEN</text>
        </g>

        {/* Indicateur de la Manche (mer) */}
        <text x="60" y="80" className="fill-white/8 text-[10px] italic" textAnchor="middle">La Manche</text>

        {/* Petites vagues stylisées au nord */}
        <path d="M20,60 Q40,50 60,60 Q80,70 100,60" className="fill-none stroke-white/5 stroke-1" />
        <path d="M100,40 Q120,30 140,40 Q160,50 180,40" className="fill-none stroke-white/5 stroke-1" />
      </svg>

      {/* Légende en bas */}
      <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between z-30">
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Nos cabinets</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <MapPin className="w-3 h-3 text-brand-orange/60" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">2 agences</span>
        </div>
      </div>
    </div>
  );
};

export default NormandieMap;
