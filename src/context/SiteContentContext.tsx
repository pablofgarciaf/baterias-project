// estado: ""
/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — SiteContentContext.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/context/SiteContentContext.tsx
 * 🏷️ Type: Client Component (Context & State Provider)
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L023-L023  → Imports (React context & state hooks)
 *   L025-L108  → Type definition (SiteContent interface)
 *   L110-L195  → Default content values & storage key
 *   L197-L205  → Context interface & initialization (ContentContext)
 *   L207-L268  → Provider component (SiteContentProvider)
 *   L270-L276  → Custom hook (useSiteContent)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDocs, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';

export interface SiteContent {
  hero: {
    badgeText: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    ctaButtonText: string;
    secondaryButtonText: string;
    ctaButtonColor: string;
    backgroundImage: string;
    mobileImage?: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    badgeColor?: string;
    titleColor?: string;
    highlightColor?: string;
    subtitleColor?: string;
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
    badgeColor?: string;
    titleColor?: string;
  };
  vehicleFinder: {
    badge: string;
    title: string;
    subtitle: string;
    technicalHelpTitle: string;
    technicalHelpSubtitle: string;
    whatsappButtonText: string;
    whatsappButtonColor: string;
    badgeColor?: string;
    titleColor?: string;
  };
  storeLocator: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    whatsappCtaText: string;
    heroDesktop?: string;
    heroMobile?: string;
    badgeColor?: string;
    titleColor?: string;
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
    benefits?: any[];
    badgeColor?: string;
    titleColor?: string;
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
    secondaryButtonText: string;
    ctaButtonColor: string;
    titleColor?: string;
    titleColor2?: string;
  };
  blog: {
    badge: string;
    title: string;
    subtitle: string;
  };
  marquee: {
    enabled: boolean;
    badge: string;
    speedSeconds: number;
    items: Array<{
      id: string;
      title: string;
      subtitle: string;
      tag?: string;
    }>;
  };
}

export const defaultSiteContent: SiteContent = {
  hero: {
    badgeText: 'Baterías Maresa · Guía de elección',
    titleMain: 'Energía confiable',
    titleHighlight: 'para cada kilómetro',
    subtitle: 'Encuentra información para comparar baterías por tecnología, capacidad y corriente de arranque. Empieza por las especificaciones de tu vehículo.',
    ctaButtonText: 'Buscar batería',
    secondaryButtonText: 'Puntos de venta',
    ctaButtonColor: '#e11d48',
    backgroundImage: 'https://images.pexels.com/photos/37177070/pexels-photo-37177070.jpeg?auto=compress&cs=tinysrgb&w=1920',
    stat1Value: 'AGM',
    stat1Label: 'Tecnología',
    stat2Value: 'EFB',
    stat2Label: 'Tecnología',
    stat3Value: '12 V',
    stat3Label: 'Opciones'
  },
  about: {
    badge: 'Sobre Nosotros',
    title: 'Elegir una batería empieza por conocer tu vehículo',
    paragraph1: 'Una buena elección combina tecnología, capacidad, corriente de arranque, dimensiones y polaridad. Aquí puedes entender cada dato antes de comparar referencias.',
    paragraph2: 'Usa la ficha de tu vehículo y el manual del fabricante como punto de partida. La compatibilidad y las condiciones comerciales de cada modelo deben comprobarse antes de comprar.',
    yearsBadge: '5 claves',
    yearsSubtext: 'para elegir mejor',
    aboutImage: '/hero-reciclaje.webp',
    missionTitle: 'Compara con criterio',
    missionText: 'Revisa tecnología, CCA, Ah, tamaño y polaridad junto a la recomendación del fabricante.',
    visionTitle: 'Evita errores comunes',
    visionText: 'Una batería que cabe físicamente puede no cumplir los requisitos eléctricos del vehículo.',
    teamTitle: 'Consulta informada',
    teamText: 'Lleva el año, modelo, motor y referencia actual cuando solicites una cotización.',
    awardsTitle: 'Datos verificables',
    awardsText: 'Comprueba siempre ficha técnica, disponibilidad, precio y garantía del producto ofrecido.'
  },
  vehicleFinder: {
    badge: 'Buscador Inteligente de Baterías',
    title: 'Explora baterías compatibles con tu vehículo',
    subtitle: 'Selecciona año, marca y modelo cuando haya fichas publicadas. Confirma siempre la referencia en el manual del vehículo y con la ficha del fabricante.',
    technicalHelpTitle: '¿Dudas sobre el modelo de tu vehículo?',
    technicalHelpSubtitle: 'La recomendación automática es orientativa y debe comprobarse antes de comprar.',
    whatsappButtonText: 'Consultar con un Técnico Especialista',
    whatsappButtonColor: '#059669'
  },
  storeLocator: {
    badge: 'Ubicaciones y contacto',
    title: 'Puntos de Venta y Red de Distribuidores',
    subtitle: 'Consulta el directorio para encontrar un punto de atención. Confirma horario, ubicación y disponibilidad antes de desplazarte.',
    searchPlaceholder: 'Buscar por ciudad, local o dirección...',
    whatsappCtaText: 'Contactar por WhatsApp',
    heroDesktop: '/hero-agencias-desktop.webp',
    heroMobile: '/hero-agencias-mobile.webp'
  },
  b2b: {
    badge: 'Contacto para negocios',
    title: 'Hablemos de las necesidades de tu negocio',
    subtitle: 'Si tienes un taller, lubricadora o tienda de repuestos, describe lo que buscas para evaluar una propuesta comercial.',
    benefit1Title: 'Catálogo adecuado',
    benefit1Desc: 'Indica las tecnologías y referencias que necesitan tus clientes.',
    benefit2Title: 'Volumen y frecuencia',
    benefit2Desc: 'Cuéntanos cuánto compras y con qué frecuencia para preparar una propuesta pertinente.',
    benefit3Title: 'Condiciones por escrito',
    benefit3Desc: 'Solicita precio, disponibilidad, entrega y garantía antes de cerrar un pedido.',
    benefit4Title: 'Un canal de consulta',
    benefit4Desc: 'El formulario se habilitará cuando el canal comercial y la privacidad estén aprobados.',
    submitButtonText: 'Enviar Solicitud Comercial',
    submitButtonColor: '#2563eb'
  },
  recycling: {
    badge: 'Compromiso Ambiental',
    titleLine1: 'Una batería usada',
    titleLine2: 'necesita una entrega responsable',
    subtitle: 'No la abandones ni la abras. Consulta dónde puedes entregarla de acuerdo con las opciones disponibles en tu localidad.',
    backgroundImage: 'https://images.pexels.com/photos/35520664/pexels-photo-35520664.jpeg?auto=compress&cs=tinysrgb&w=1920',
    metricValue: '♻',
    metricLabel: 'Entrega responsable de baterías usadas',
    point1Text: 'Mantén la batería en posición vertical',
    point2Text: 'Evita golpes, fugas y contacto con el contenido',
    point3Text: 'Consulta un punto de recepción autorizado',
    ctaButtonText: 'Consultar puntos de atención',
    secondaryButtonText: 'Contactar B2B',
    ctaButtonColor: '#059669'
  },
  blog: {
    badge: 'Blog y Consejos',
    title: 'Todo lo que necesitas saber sobre baterías',
    subtitle: 'Guías, consejos de mantenimiento y novedades del mundo automotriz ecuatoriano.'
  },
  marquee: {
    enabled: true,
    badge: 'BENEFICIOS EXCLUSIVOS',
    speedSeconds: 30,
    items: [
      { id: '1', title: 'CORRIENTE DE ARRANQUE', subtitle: 'Compara el CCA con el requisito del vehículo', tag: 'CCA' },
      { id: '2', title: 'CAPACIDAD', subtitle: 'Revisa los Ah recomendados por el fabricante', tag: 'AH' },
      { id: '3', title: 'MEDIDAS Y BORNES', subtitle: 'Confirma tamaño, sujeción y polaridad', tag: 'BCI' },
      { id: '4', title: 'TECNOLOGÍA', subtitle: 'AGM, EFB o convencional según el vehículo', tag: 'GUÍA' },
      { id: '5', title: 'SISTEMA DE CARGA', subtitle: 'Revísalo si la batería falla repetidamente', tag: 'CUIDADO' },
      { id: '6', title: 'BATERÍA USADA', subtitle: 'Entrégala a un gestor autorizado', tag: 'RECICLAJE' }
    ]
  }
};

interface ContentContextType {
  content: SiteContent;
  updateSection: <K extends keyof SiteContent>(section: K, data: Partial<SiteContent[K]>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isSaved: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    getDocs(collection(db, 'site_content')).then((snapshot) => {
      setContent((previous) => {
        const next = { ...previous };
        for (const item of snapshot.docs) {
          const section = item.id as keyof SiteContent;
          if (section in defaultSiteContent && item.data().content) {
            next[section] = { ...defaultSiteContent[section], ...item.data().content } as never;
          }
        }
        return next;
      });
    }).catch((error) => console.error('No se pudo cargar el contenido público:', error));
  }, []);

  const updateSection = async <K extends keyof SiteContent>(section: K, data: Partial<SiteContent[K]>) => {
    if (!isFirebaseConfigured || !auth.currentUser?.emailVerified) throw new Error('El CMS no está conectado o la sesión no está verificada.');
    const merged = { ...content[section], ...data };
    await setDoc(doc(db, 'site_content', section), {
      content: merged, updatedAt: serverTimestamp(), updatedBy: auth.currentUser.uid,
    });
    setContent((previous) => ({ ...previous, [section]: merged }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const resetToDefaults = async () => {
    if (!window.confirm('¿Seguro que deseas restablecer todos los textos, imágenes y colores originales?')) return;
    if (!isFirebaseConfigured || !auth.currentUser?.emailVerified) throw new Error('El CMS no está conectado o la sesión no está verificada.');
    const batch = writeBatch(db);
    for (const section of Object.keys(defaultSiteContent) as (keyof SiteContent)[]) {
      batch.set(doc(db, 'site_content', section), {
        content: defaultSiteContent[section], updatedAt: serverTimestamp(), updatedBy: auth.currentUser.uid,
      });
    }
    await batch.commit();
    setContent(defaultSiteContent);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <ContentContext.Provider value={{ content, updateSection, resetToDefaults, isSaved }}>
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
