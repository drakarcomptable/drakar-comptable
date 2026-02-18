
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
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
            <Route path="/:citySlug" element={<AgencyDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
