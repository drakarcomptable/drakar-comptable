
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Agencies from './pages/Agencies';
import AgencyDetail from './pages/AgencyDetail';
import MentionsLegales from './pages/MentionsLegales';
import Confidentialite from './pages/Confidentialite';
import CGV from './pages/CGV';
import SEOServicePage from './pages/SEOServicePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

// Composant utilitaire pour remonter en haut de page à chaque changement de route
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/expertises" element={<Services />} />
            <Route path="/expertises/:categorySlug" element={<ServiceDetail />} />
            <Route path="/expertises/:categorySlug/:subSlug" element={<ServiceDetail />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/agences" element={<Agencies />} />
            <Route path="/comptabilite" element={<SEOServicePage />} />
            <Route path="/fiscalite" element={<SEOServicePage />} />
            <Route path="/conseil-gestion" element={<SEOServicePage />} />
            <Route path="/gestion-sociale-paie" element={<SEOServicePage />} />
            <Route path="/conseil-juridique" element={<SEOServicePage />} />
            <Route path="/creation-reprise-entreprise" element={<SEOServicePage />} />
            <Route path="/gestion-patrimoine" element={<SEOServicePage />} />
            <Route path="/commissariat-aux-comptes" element={<SEOServicePage />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/:citySlug" element={<AgencyDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <CookieBanner />
    </HashRouter>
  );
};

export default App;
