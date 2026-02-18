
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Ship } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Expertises', path: '/expertises' },
    { name: 'Agences', path: '/agences' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-brand-blue p-2.5 rounded-xl transition-all group-hover:bg-brand-orange group-hover:rotate-6">
              <Ship className="w-7 h-7 text-brand-orange group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black tracking-tighter text-brand-blue leading-none">DRAKAR</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-brand-orange uppercase leading-none">COMPTABLE</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors hover:text-brand-orange ${
                  location.pathname === link.path ? 'text-brand-orange' : 'text-brand-blue/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-brand-orange text-white px-7 py-3 rounded-xl text-sm font-bold shadow-xl shadow-orange-500/20 hover:bg-brand-orange-hover transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-blue hover:text-brand-orange focus:outline-none p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden bg-white border-b absolute w-full transition-all duration-300 ease-in-out ${isOpen ? 'top-full opacity-100 pointer-events-auto' : '-top-96 opacity-0 pointer-events-none'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-bold text-brand-blue hover:bg-brand-slate rounded-lg"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-brand-orange text-white px-3 py-4 rounded-xl font-black mt-4"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
