import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteContent {
  hero: {
    badgeText: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    ctaButtonText: string;
    ctaButtonColor: string;
    backgroundImage: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
  about: {
    badge: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    yearsBadge: string;
    yearsSubtext: string;
    aboutImage: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    teamTitle: string;
    teamText: string;
    awardsTitle: string;
    awardsText: string;
  };
  vehicleFinder: {
    badge: string;
    title: string;
    subtitle: string;
    technicalHelpTitle: string;
    technicalHelpSubtitle: string;
    whatsappButtonText: string;
    whatsappButtonColor: string;
  };
  storeLocator: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    whatsappCtaText: string;
  };
  b2b: {
    badge: string;
    title: string;
    subtitle: string;
    benefit1Title: string;
    benefit1Desc: string;
    benefit2Title: string;
    benefit2Desc: string;
    benefit3Title: string;
    benefit3Desc: string;
    benefit4Title: string;
    benefit4Desc: string;
    submitButtonText: string;
    submitButtonColor: string;
  };
  recycling: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    backgroundImage: string;
    metricValue: string;
    metricLabel: string;
    point1Text: string;
    point2Text: string;
    point3Text: string;
    ctaButtonText: string;
    ctaButtonColor: string;
  };
  blog: {
    badge: string;
    title: string;
    subtitle: string;
  };
}

export const defaultSiteContent: SiteContent = {
  hero: {
    badgeText: 'Servicio técnico en todo el país • Red Oficial Maresa',
    titleMain: 'Energía confiable',
    titleHighlight: 'para cada kilómetro',
    subtitle: 'Baterías para autos, camiones, motos, lanchas y maquinaria. Distribución directa a las 24 provincias del Ecuador con garantía y soporte técnico.',
    ctaButtonText: 'Buscar batería',
    ctaButtonColor: '#e11d48',
    backgroundImage: 'https://images.pexels.com/photos/37177070/pexels-photo-37177070.jpeg?auto=compress&cs=tinysrgb&w=1920',
    stat1Value: '70+',
    stat1Label: 'Años de experiencia',
    stat2Value: '150+',
    stat2Label: 'Distribuidores en Ecuador',
    stat3Value: '24/24',
    stat3Label: 'Provincias cubiertas'
  },
  about: {
    badge: 'Sobre Nosotros',
    title: 'Cuatro décadas energizando el país',
    paragraph1: 'Baterías Andinas nació en Quito en 1985 con una misión simple: llevar baterías confiables a cada esquina del Ecuador. Hoy somos el distribuidor líder del país, con cobertura en las 24 provincias y más de 150 puntos de venta.',
    paragraph2: 'Trabajamos con tecnología de punta y procesos certificados para entregar productos que aguantan la altitud de los Andes, el calor de la Costa, la humedad de la Amazonía y la salinidad de Galápagos.',
    yearsBadge: 'Desde 1985',
    yearsSubtext: 'Energizando el Ecuador',
    aboutImage: 'https://images.pexels.com/photos/18589218/pexels-photo-18589218.jpeg?auto=compress&cs=tinysrgb&w=1200',
    missionTitle: 'Misión',
    missionText: 'Proveer energía confiable a cada ecuatoriano, sin importar dónde esté.',
    visionTitle: 'Visión',
    visionText: 'Ser la marca de baterías más confiable y sostenible del país.',
    teamTitle: 'Equipo',
    teamText: 'Más de 500 colaboradores comprometidos con la calidad.',
    awardsTitle: 'Reconocimientos',
    awardsText: 'Certificación ISO 9001 y premio Nacional de Calidad.'
  },
  vehicleFinder: {
    badge: 'Buscador Inteligente de Baterías',
    title: 'Encuentra la batería exacta para tu vehículo',
    subtitle: 'Filtro en cascada (Año > Marca > Modelo) con especificaciones oficiales de amperaje (CCA), tecnología y dimensiones para Ecuador.',
    technicalHelpTitle: '¿Dudas sobre el modelo de tu vehículo?',
    technicalHelpSubtitle: 'Nuestros ingenieros de producto te asisten en vivo por WhatsApp para asegurar el grupo BCI y amperaje perfecto.',
    whatsappButtonText: 'Consultar con un Técnico Especialista',
    whatsappButtonColor: '#059669'
  },
  storeLocator: {
    badge: 'Estrategia Drive-To-Store • Inteligencia Geoespacial',
    title: 'Puntos de Venta y Red de Distribuidores',
    subtitle: 'Localiza el centro de instalación y distribuidor autorizado más cercano con stock inmediato en las 24 provincias de Ecuador.',
    searchPlaceholder: 'Buscar por ciudad, local o dirección...',
    whatsappCtaText: 'Contactar por WhatsApp'
  },
  b2b: {
    badge: 'Módulo B2B • Expansión Comercial Ecuador',
    title: 'Únete a la Red de Distribuidores Maresa',
    subtitle: 'Multiplica la rentabilidad de tu taller, lubricadora o repuestera con el respaldo de la marca líder en baterías automotrices, pesadas e industriales.',
    benefit1Title: 'Márgenes de ganancia preferenciales',
    benefit1Desc: 'Precios mayoristas competitivos con escalas por volumen y bonificaciones.',
    benefit2Title: 'Logística y despacho en 24-48 horas',
    benefit2Desc: 'Entrega directa en tu local comercial en cualquiera de las 24 provincias.',
    benefit3Title: 'Garantía Nacional y Recambio Inmediato',
    benefit3Desc: 'Soporte técnico posventa que respalda tu reputación ante tus clientes.',
    benefit4Title: 'Integración en Panel CRM y Exportación',
    benefit4Desc: 'Gestión transparente y atención comercial personalizada de nuestro equipo.',
    submitButtonText: 'Enviar Solicitud Comercial',
    submitButtonColor: '#2563eb'
  },
  recycling: {
    badge: 'Compromiso Ambiental',
    titleLine1: 'Reciclamos cada batería',
    titleLine2: 'para proteger el Ecuador',
    subtitle: 'Una batería abandonada contamina hasta 190 litros de agua. Por eso recibimos tu batería usada en cualquier distribuidor del país y la procesamos en plantas certificadas. Tú ganas, el planeta gana.',
    backgroundImage: 'https://images.pexels.com/photos/35520664/pexels-photo-35520664.jpeg?auto=compress&cs=tinysrgb&w=1920',
    metricValue: '190L',
    metricLabel: 'Litros de agua que una batería puede contaminar si no se recicla',
    point1Text: 'Reciclaje certificado bajo normas ambientales ecuatorianas',
    point2Text: 'Puntos de entrega en las 24 provincias',
    point3Text: 'Hasta 99% de los materiales son reutilizados',
    ctaButtonText: 'Encuentra un punto de reciclaje',
    ctaButtonColor: '#059669'
  },
  blog: {
    badge: 'Blog y Consejos',
    title: 'Todo lo que necesitas saber sobre baterías',
    subtitle: 'Guías, consejos de mantenimiento y novedades del mundo automotriz ecuatoriano.'
  }
};

const STORAGE_KEY = 'maresa_site_content_v1';

interface ContentContextType {
  content: SiteContent;
  updateSection: <K extends keyof SiteContent>(section: K, data: Partial<SiteContent[K]>) => void;
  resetToDefaults: () => void;
  saveContent: () => void;
  isSaved: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...defaultSiteContent, ...parsed };
        } catch {
          return defaultSiteContent;
        }
      }
    }
    return defaultSiteContent;
  });

  const [isSaved, setIsSaved] = useState(false);

  const updateSection = <K extends keyof SiteContent>(section: K, data: Partial<SiteContent[K]>) => {
    setContent(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          ...data
        }
      };
      // Auto-persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const saveContent = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('¿Seguro que deseas restablecer todos los textos, imágenes y colores originales?')) {
      setContent(defaultSiteContent);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSiteContent));
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateSection, resetToDefaults, saveContent, isSaved }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
