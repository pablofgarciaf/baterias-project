import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import VehicleFinder from '@/components/VehicleFinder';
import Products from '@/components/Products';
import StoreLocator from '@/components/StoreLocator';
import About from '@/components/About';
import B2BLeadCapture from '@/components/B2BLeadCapture';
import Recycling from '@/components/Recycling';
import Blog from '@/components/Blog';
import Footer from '@/components/Footer';
import AdminPage from '@/components/AdminPage';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { initAnalytics } from '@/lib/firebase';
import { SiteContentProvider } from '@/context/SiteContentContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

interface MainSiteProps {
  selectedProvince: string | null;
  setSelectedProvince: (prov: string | null) => void;
  navigateToAdmin: () => void;
}

function MainSite({ selectedProvince, setSelectedProvince, navigateToAdmin }: MainSiteProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Sticky Header with integrated GEO announcement bar & navigation */}
      <Header
        selectedProvince={selectedProvince}
        onProvinceChange={setSelectedProvince}
        onNavigateToAdmin={navigateToAdmin}
      />

      <main id="main-content">
        {/* 1. Home / Hero Principal con identidad Corporación Maresa */}
        <Hero
          selectedProvince={selectedProvince}
          onProvinceChange={setSelectedProvince}
        />

        {/* 2. Quiénes Somos & 45 Años de Liderazgo de Corporación Maresa */}
        <About />

        {/* 3. Escoge tu Batería: Buscador Inteligente Vehicular en 3 Pasos */}
        <VehicleFinder 
          onLocateStore={(prov) => {
            if (prov) setSelectedProvince(prov);
            const el = document.getElementById('puntos-de-venta');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Catálogo de Baterías con Carrusel Infinito (3 Tarjetas en Escritorio) */}
        <Products />

        {/* 4. Puntos de Venta: Mapa y Red Real de Agencias Corporación Maresa */}
        <StoreLocator initialProvince={selectedProvince} />

        {/* 5. Quiero ser Proveedor: Módulo B2B & Captación CRM */}
        <B2BLeadCapture />

        {/* 6. Programa de Reciclaje Ecológico con Bono de Retorno (-$10) */}
        <Recycling />

        {/* 7. Blog & Recursos Técnicos con Carrusel Infinito y Lector Modal */}
        <Blog />
      </main>

      {/* Footer Corporativo con Enlace al Administrador y Ofuscación Anti-Spam */}
      <Footer onOpenAdmin={navigateToAdmin} />

      {/* Floating WhatsApp & Direct Call Assistance Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}

export default function App() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        return 'admin';
      }
    }
    return 'home';
  });

  useEffect(() => {
    initAnalytics();

    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <SiteContentProvider>
        {currentView === 'admin' ? (
          /* DEDICATED FULL-PAGE CMS & CRM MARESA */
          <AdminPage onBackToSite={navigateToHome} />
        ) : (
          /* PUBLIC HIGH-CONVERTING LANDING PAGE */
          <MainSite
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            navigateToAdmin={navigateToAdmin}
          />
        )}
      </SiteContentProvider>
    </ThemeProvider>
  );
}
