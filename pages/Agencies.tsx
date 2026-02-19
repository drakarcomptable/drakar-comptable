
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ChevronRight, Building2, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { REGIONS_DATA, slugify } from '../data/agencies';
import FranceMap from '../components/FranceMap';

const Agencies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isNormandieExpanded, setIsNormandieExpanded] = useState(false);

  const filteredRegions = REGIONS_DATA.map(region => ({
    ...region,
    cities: region.cities.filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase()) || 
      region.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(region => region.cities.length > 0);

  const scrollToRegion = (regionName: string) => {
    setSelectedRegion(regionName);
    const element = document.getElementById(`region-${slugify(regionName)}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pt-40 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest">
              <Globe className="w-4 h-4" /> Réseau National Drakar
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-8xl font-black text-brand-blue tracking-tighter leading-tight">
              Expert-comptable <span className="text-brand-orange">de proximité.</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
              Le cabinet Drakar déploie son excellence technique à travers tout l'hexagone. Sélectionnez votre région sur la carte interactive pour découvrir nos implantations locales.
            </p>
            <div className="relative max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Rechercher une ville ou une région..."
                className="w-full pl-14 pr-6 py-5 bg-brand-slate border-2 border-transparent focus:border-brand-orange rounded-2xl outline-none font-bold transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <FranceMap onRegionClick={scrollToRegion} activeRegion={selectedRegion || undefined} />
        </div>

        {/* Regions Grid */}
        <div className="space-y-24">
          {filteredRegions.map((region) => {
            const isNormandie = region.name === 'Normandie';
            const displayedCities = isNormandie && !isNormandieExpanded && !searchTerm 
              ? region.cities.slice(0, 12) 
              : region.cities;

            return (
              <section 
                key={region.name} 
                id={`region-${slugify(region.name)}`}
                className={`scroll-mt-40 transition-all duration-700 ${selectedRegion === region.name ? 'p-8 bg-brand-slate/40 ring-2 ring-brand-orange/20 rounded-[40px]' : ''}`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-blue p-4 rounded-2xl shadow-lg shadow-brand-blue/10">
                      <Building2 className="w-6 h-6 text-brand-orange" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-brand-blue tracking-tight">{region.name}</h2>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{region.cities.length} agences à votre service</p>
                    </div>
                  </div>
                  <div className="hidden md:block flex-grow h-px bg-slate-100 ml-4"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-500">
                  {displayedCities.map((city) => (
                    <Link 
                      key={city}
                      to={`/${slugify(city)}`}
                      className="group flex items-center justify-between p-6 bg-brand-slate/50 rounded-2xl border border-transparent hover:border-brand-orange hover:bg-white hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                        <span className="font-bold text-brand-blue group-hover:text-brand-orange transition-colors line-clamp-1">{city}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-orange group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>

                {isNormandie && !searchTerm && region.cities.length > 12 && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => setIsNormandieExpanded(!isNormandieExpanded)}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-brand-blue text-brand-blue rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all shadow-lg active:scale-95"
                    >
                      {isNormandieExpanded ? (
                        <>Voir moins <ChevronUp className="w-5 h-5" /></>
                      ) : (
                        <>Voir toutes les villes en Normandie <ChevronDown className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* SEO Text Section */}
        <div className="mt-40 p-16 lg:p-24 bg-brand-blue rounded-[80px] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
            <Globe className="w-96 h-96" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-tight">Un maillage territorial <br /><span className="text-brand-orange">souverain.</span></h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                Le cabinet Drakar a fait le choix de la proximité. Nous croyons que l'excellence de l'expertise comptable passe par une connaissance parfaite des enjeux économiques locaux et une présence physique forte.
              </p>
            </div>
            <div className="space-y-8 text-slate-400 font-medium leading-relaxed">
              <p>
                De Lille à Nice, en passant par notre ancrage historique en Normandie et notre siège parisien, nos équipes sont mobilisées pour offrir un accompagnement rigoureux aux dirigeants. Chaque agence Drakar respecte les mêmes standards de qualité institutionnelle et de sécurité numérique.
              </p>
              <div className="flex gap-12">
                <div>
                  <p className="text-3xl font-black text-brand-orange">13</p>
                  <p className="text-[10px] font-black uppercase tracking-widest">Régions couvertes</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-brand-orange">100+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest">Experts locaux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agencies;
