
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const COOKIE_KEY = 'drakar_cookie_consent';

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(COOKIE_KEY, 'refused');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-brand-blue text-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-1">
          <p className="font-black text-base mb-1">🍪 Ce site utilise des cookies</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Nous utilisons des cookies pour assurer le bon fonctionnement du site et améliorer votre expérience. Aucune donnée n'est revendue à des tiers.{' '}
            <Link to="/confidentialite" className="text-brand-orange underline hover:text-orange-400">
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={refuse}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border border-white/20 hover:bg-white/10 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-orange hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            Accepter
          </button>
          <button
            onClick={refuse}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
