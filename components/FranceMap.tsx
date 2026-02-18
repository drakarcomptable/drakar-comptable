
import React from 'react';
import { REGIONS_DATA } from '../data/agencies';

interface FranceMapProps {
  onRegionClick: (regionName: string) => void;
  activeRegion?: string;
}

const FranceMap: React.FC<FranceMapProps> = ({ onRegionClick, activeRegion }) => {
  const activeRegionNames = REGIONS_DATA.map(r => r.name);

  // Tracés vectoriels précis et modernes
  const regions = [
    { id: 'Hauts-de-France', name: 'Hauts-de-France', d: 'M314,32 L356,32 L405,82 L392,128 L348,174 L288,138 Z', node: { x: 345, y: 100 } },
    { id: 'Normandie', name: 'Normandie', d: 'M156,96 L288,138 L285,192 L212,254 L114,202 L110,152 Z', node: { x: 190, y: 180 } },
    { id: 'Ile-de-France', name: 'Île-de-France', d: 'M285,150 L340,185 L355,235 L305,275 L260,240 L260,195 Z', node: { x: 305, y: 220 } },
    { id: 'Grand-Est', name: 'Grand Est', d: 'M405,82 L524,104 L572,212 L542,294 L424,332 L348,174 Z', node: { x: 470, y: 220 } },
    { id: 'Bretagne', name: 'Bretagne', d: 'M34,184 L168,178 L188,244 L144,302 L62,284 Z', node: { x: 110, y: 235 } },
    { id: 'Pays-de-la-Loire', name: 'Pays de la Loire', d: 'M144,302 L232,254 L305,272 L334,374 L214,422 L134,362 Z', node: { x: 220, y: 335 } },
    { id: 'Centre-Val-de-Loire', name: 'Centre-Val de Loire', d: 'M305,192 L382,222 L412,362 L334,402 L274,362 L274,248 Z', node: { x: 340, y: 300 } },
    { id: 'Bourgogne-Franche-Comte', name: 'Bourgogne-Franche-Comté', d: 'M382,222 L542,274 L562,422 L462,462 L412,362 Z', node: { x: 470, y: 345 } },
    { id: 'Nouvelle-Aquitaine', name: 'Nouvelle-Aquitaine', d: 'M134,362 L274,362 L334,502 L354,602 L154,632 L104,502 Z', node: { x: 215, y: 515 } },
    { id: 'Auvergne-Rhone-Alpes', name: 'Auvergne-Rhône-Alpes', d: 'M334,402 L502,432 L542,562 L442,602 L344,542 Z', node: { x: 430, y: 505 } },
    { id: 'Occitanie', name: 'Occitanie', d: 'M254,582 L394,582 L422,702 L234,702 L204,642 Z', node: { x: 320, y: 645 } },
    { id: 'Provence-Alpes-Cote-d-Azur', name: 'Provence-Alpes-Côte d’Azur', d: 'M442,562 L582,562 L592,672 L472,692 L432,632 Z', node: { x: 515, y: 625 } },
    { id: 'Corse', name: 'Corse', d: 'M602,692 L632,692 L632,752 L602,752 Z', node: { x: 617, y: 722 } },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[4/5] bg-brand-blue rounded-[60px] p-6 lg:p-10 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.5)] overflow-hidden group">
      {/* Grille de fond technologique */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#F97316 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Titrage interne épuré */}
      <div className="absolute top-10 left-10 z-30">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Réseau Souverain</p>
          <h3 className="text-xl font-black text-white tracking-tighter">Couverture France</h3>
        </div>
      </div>

      {/* Encart La Réunion (Ultra Minimaliste) */}
      <div 
        className={`absolute bottom-8 left-10 w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/10 active:scale-95 z-30 ${activeRegion === 'La Réunion' ? 'border-brand-orange bg-brand-orange/20' : ''}`}
        onClick={() => onRegionClick('La Réunion')}
      >
        <div className={`w-2 h-2 rounded-full mb-1 ${activeRegion === 'La Réunion' ? 'bg-brand-orange' : 'bg-brand-orange/40'}`}></div>
        <span className="text-[6px] font-bold uppercase tracking-widest text-white/50">Réunion</span>
      </div>

      <svg viewBox="0 0 680 820" className="w-full h-full relative z-20">
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {regions.map((region) => {
          const isPresent = activeRegionNames.includes(region.name);
          const isActive = activeRegion === region.name;

          return (
            <g key={region.id} className="group/region cursor-pointer" onClick={() => onRegionClick(region.name)}>
              {/* Region Shape - Dégradés de Bleu */}
              <path
                d={region.d}
                className={`transition-all duration-500 stroke-white/5 stroke-1 ${
                  isActive 
                    ? 'fill-brand-orange' 
                    : isPresent 
                      ? 'fill-brand-blue-light hover:fill-[#2D3E56]' 
                      : 'fill-[#141C2F] opacity-40 hover:opacity-60'
                }`}
              />
              
              {/* Nodes (Points de présence) */}
              {isPresent && (
                <circle 
                  cx={region.node.x} 
                  cy={region.node.y} 
                  r={isActive ? 6 : 4}
                  className={`transition-all duration-300 ${
                    isActive ? 'fill-white' : 'fill-brand-orange'
                  }`}
                  filter={isActive ? 'url(#glow)' : ''}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Footer Minimaliste avec nouveau texte */}
      <div className="absolute bottom-10 right-10 text-right">
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Nos cabinets comptable</span>
        </div>
      </div>
    </div>
  );
};

export default FranceMap;
