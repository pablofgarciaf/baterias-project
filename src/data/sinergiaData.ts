/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — sinergiaData.ts
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/data/sinergiaData.ts
 * 🏷️ Type: Data / Constants
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L020-L020  → Imports (Sinergia type definitions)
 *   L022-L022  → Filter years array (vehicleYears)
 *   L024-L326  → Vehicle-to-battery compatibility catalog (vehicleCatalog)
 *   L328-L638  → Maresa nationwide distributor locations (defaultDistributors)
 *   L640-L683  → Initial sample B2B commercial leads (initialB2BLeads)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import { VehicleBatteryMatch, DistributorLocation, BatteryProduct, B2BLead } from '@/types/sinergia';

export const vehicleYears = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
  2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007,
  2006, 2005, 2004, 2003, 2002, 2001, 2000, 1998, 1996, 1995,
  1994, 1992, 1990
];

export const vehicleCatalog: VehicleBatteryMatch[] = [
  // ─── CHEVROLET (Líder histórico del mercado automotriz en Ecuador) ───
  {
    id: 'chev-dmax-2025',
    year: 2025,
    brand: 'Chevrolet',
    model: 'D-Max 2.5/3.0 CRDI Turbo Diésel',
    engine: '2.5 / 3.0 CRDI Turbo Diésel',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Arranque pesado diésel en altura (2.800+ msnm)', 'Resistencia a vibración extrema en trocha', 'Libre de mantenimiento sellada']
    }
  },
  {
    id: 'chev-dmax-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'D-Max 2.5/3.0 CRDI Turbo Diésel',
    engine: '2.5 / 3.0 CRDI Turbo Diésel',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Arranque pesado diésel en altura (2.800+ msnm)', 'Resistencia a vibración extrema en trocha', 'Libre de mantenimiento sellada']
    }
  },
  {
    id: 'chev-dmax-2022',
    year: 2022,
    brand: 'Chevrolet',
    model: 'D-Max 2.5/3.0 CRDI Turbo Diésel',
    engine: 'Diésel',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Arranque en frío a gran altitud', 'Aleación Calcio-Plata anti-sulfatación']
    }
  },
  {
    id: 'chev-dmax-2018',
    year: 2018,
    brand: 'Chevrolet',
    model: 'D-Max 3.0 Diésel / 3.5 V6',
    engine: '3.0 Diésel / 3.5 V6',
    recommendedBattery: {
      model: 'Andina Ultra HD 27F-750',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 135.00,
      features: ['Bornes reforzados para trabajo rural', 'Excelente retención de carga en reposo']
    }
  },
  {
    id: 'chev-sail-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'Sail 1.5 Sedán / Hatchback',
    engine: '1.5L Gasolina VVT',
    recommendedBattery: {
      model: 'Andina Power 42-500',
      bciGroup: '42 / DIN 44',
      cca: 500,
      ah: 45,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 78.50,
      features: ['Dimensiones compactas exactas para bahía de motor', 'Encendido instantáneo urbano']
    }
  },
  {
    id: 'chev-sail-2020',
    year: 2020,
    brand: 'Chevrolet',
    model: 'Sail 1.5 Sedán / Hatchback',
    engine: '1.5L Gasolina',
    recommendedBattery: {
      model: 'Andina Power 42-500',
      bciGroup: '42 / DIN 44',
      cca: 500,
      ah: 45,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 78.50,
      features: ['Ajuste perfecto a la base original', 'Malla expandida con aleación de calcio']
    }
  },
  {
    id: 'chev-tracker-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'Tracker Turbo 1.2',
    engine: '1.2 Turbo con Start-Stop',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H5 (LN2)',
      bciGroup: 'H5 / LN2',
      cca: 680,
      ah: 60,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 165.00,
      features: ['Certificada para ciclos continuos Start/Stop', 'Máxima absorción de electrolito en microfibra']
    }
  },
  {
    id: 'chev-onix-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'Onix Turbo Premier / RS 1.0',
    engine: '1.0 Turbo Ecotec',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H5 (LN2)',
      bciGroup: 'H5 / LN2',
      cca: 650,
      ah: 60,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 160.00,
      features: ['Recomendada para gestión inteligente de alternador', 'Cero emisiones de gas en habitáculo']
    }
  },
  {
    id: 'chev-aveo-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'Aveo Family / Emotion / Nueva Generación',
    engine: '1.5L Gasolina',
    recommendedBattery: {
      model: 'Andina Gold 24-600',
      bciGroup: '24',
      cca: 580,
      ah: 55,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 82.00,
      features: ['Excelente rendimiento precio-durabilidad', 'Ideal para recorridos diarios y servicio público']
    }
  },
  {
    id: 'chev-aveo-2016',
    year: 2016,
    brand: 'Chevrolet',
    model: 'Aveo Family / Emotion / Activo',
    engine: '1.5L Gasolina',
    recommendedBattery: {
      model: 'Andina Gold 24-600',
      bciGroup: '24',
      cca: 580,
      ah: 55,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 82.00,
      features: ['Encendido inmediato para vehículos de alta rotación']
    }
  },
  {
    id: 'chev-captiva-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'Captiva Premier 1.5 Turbo',
    engine: '1.5 Turbo Gasolina',
    recommendedBattery: {
      model: 'Andina Gold 24R-650',
      bciGroup: '24R',
      cca: 650,
      ah: 65,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 120.00,
      features: ['Soporte para pantalla táctil, climatizador y sensores ADAS']
    }
  },
  {
    id: 'chev-groove-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'Groove Premier 1.5',
    engine: '1.5L Gasolina',
    recommendedBattery: {
      model: 'Andina Power 24-550',
      bciGroup: '24',
      cca: 550,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 85.00,
      features: ['Ideal para SUV compacto con equipamiento eléctrico moderno']
    }
  },
  {
    id: 'chev-spark-2020',
    year: 2020,
    brand: 'Chevrolet',
    model: 'Spark GT / Spark Life 1.2',
    engine: '1.2L Gasolina',
    recommendedBattery: {
      model: 'Andina City NS40-420',
      bciGroup: 'NS40 / 35',
      cca: 420,
      ah: 40,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 68.00,
      features: ['Bornes delgados JIS y formato angosto', 'Bajo peso y alta reactividad']
    }
  },
  {
    id: 'chev-colorado-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'Colorado 2.8 Duramax Diésel 4x4',
    engine: '2.8 Turbo Diésel Duramax',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 800,
      ah: 85,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 155.00,
      features: ['Potencia de torque en frío para arranques de alta compresión']
    }
  },
  {
    id: 'chev-grand-vitara-sz',
    year: 2018,
    brand: 'Chevrolet',
    model: 'Grand Vitara SZ 2.0 / 2.4 4x4',
    engine: '2.0 / 2.4 Gasolina',
    recommendedBattery: {
      model: 'Andina Gold 24R-650',
      bciGroup: '24R',
      cca: 620,
      ah: 60,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 105.00,
      features: ['Polaridad reversible exacta para bandejas Suzuki/Chevrolet']
    }
  },

  // ─── TOYOTA (Líder en durabilidad y flotas en Ecuador) ───
  {
    id: 'toyota-hilux-2025',
    year: 2025,
    brand: 'Toyota',
    model: 'Hilux 2.4/2.8 D-4D Diésel 4x4',
    engine: '2.4 / 2.8 D-4D Diésel Intercooler',
    recommendedBattery: {
      model: 'Andina Ultra HD 31-850',
      bciGroup: '31',
      cca: 850,
      ah: 95,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 168.00,
      features: ['Soporte para wincha y faena minera', 'Carcasa reforzada anti-impacto en alta montaña']
    }
  },
  {
    id: 'toyota-hilux-2024',
    year: 2024,
    brand: 'Toyota',
    model: 'Hilux 2.4/2.8 D-4D Diésel 4x4',
    engine: '2.4 / 2.8 D-4D Diésel Intercooler',
    recommendedBattery: {
      model: 'Andina Ultra HD 31-850',
      bciGroup: '31',
      cca: 850,
      ah: 95,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 168.00,
      features: ['Soporte para wincha y faena minera', 'Carcasa reforzada anti-impacto']
    }
  },
  {
    id: 'toyota-hilux-2020',
    year: 2020,
    brand: 'Toyota',
    model: 'Hilux 2.7 Gasolina / 2.8 Diésel',
    engine: '2.7 VVTi / 2.8 D-4D',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 140.00,
      features: ['Resistencia probada en caminos de segundo y tercer orden']
    }
  },
  {
    id: 'toyota-fortuner-2024',
    year: 2024,
    brand: 'Toyota',
    model: 'Fortuner 2.7 / 4.0 V6 / 2.8 D-4D',
    engine: '2.7 / 4.0 V6 Gasolina / Diésel',
    recommendedBattery: {
      model: 'Andina Gold 27-720',
      bciGroup: '27',
      cca: 720,
      ah: 75,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 135.00,
      features: ['Reserva de energía para accesorios 4x4 y climatización triple']
    }
  },
  {
    id: 'toyota-corolla-2024',
    year: 2024,
    brand: 'Toyota',
    model: 'Corolla 1.8 / 2.0 / Hybrid',
    engine: 'Gasolina / Híbrido Auxiliar 12V',
    recommendedBattery: {
      model: 'Andina AGM Auxiliary LN1',
      bciGroup: 'LN1',
      cca: 540,
      ah: 50,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 36,
      priceEcuador: 140.00,
      features: ['Batería auxiliar de 12V para encendido de sistemas híbridos Toyota']
    }
  },
  {
    id: 'toyota-rav4-2024',
    year: 2024,
    brand: 'Toyota',
    model: 'RAV4 2.0 / 2.5 Hybrid AWD',
    engine: '2.0 / 2.5 Hybrid',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H5 (LN2)',
      bciGroup: 'H5 / LN2',
      cca: 650,
      ah: 60,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 165.00,
      features: ['Válvula VRLA hermética que evita corrosión en bornes']
    }
  },
  {
    id: 'toyota-yaris-2024',
    year: 2024,
    brand: 'Toyota',
    model: 'Yaris Sedán / Cross 1.5',
    engine: '1.5 Dual VVT-i',
    recommendedBattery: {
      model: 'Andina Power 35-520',
      bciGroup: '35',
      cca: 520,
      ah: 48,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 85.00,
      features: ['Eficiencia energética para trayectos urbanos y tráfico denso']
    }
  },
  {
    id: 'toyota-prado-2024',
    year: 2024,
    brand: 'Toyota',
    model: 'Land Cruiser Prado TX / VX 4.0 V6',
    engine: '4.0 V6 Dual VVT-i / 3.0 D-4D',
    recommendedBattery: {
      model: 'Andina Ultra HD 31-850',
      bciGroup: '31 / 27F',
      cca: 850,
      ah: 95,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 175.00,
      features: ['Capacidad extrema para expedición y refrigeración reforzada']
    }
  },
  {
    id: 'toyota-rush-2024',
    year: 2024,
    brand: 'Toyota',
    model: 'Rush 1.5 7 Pasajeros',
    engine: '1.5 Dual VVT-i',
    recommendedBattery: {
      model: 'Andina Gold 35-540',
      bciGroup: '35',
      cca: 540,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 89.00,
      features: ['Suministro continuo para entretenimiento familiar y luces']
    }
  },

  // ─── KIA (Gran volumen de ventas en Ecuador) ───
  {
    id: 'kia-sportage-2025',
    year: 2025,
    brand: 'Kia',
    model: 'Sportage (Active, R, GT-Line, 5ta Gen)',
    engine: '2.0 / 1.6 Turbo Smartstream',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 760,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 185.00,
      features: ['Compatible con sistema de frenado regenerativo y Start/Stop']
    }
  },
  {
    id: 'kia-sportage-2022',
    year: 2022,
    brand: 'Kia',
    model: 'Sportage (Active, R, GT-Line)',
    engine: '2.0 Gasolina MPI',
    recommendedBattery: {
      model: 'Andina Gold 24R-650',
      bciGroup: '24R',
      cca: 650,
      ah: 60,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 110.00,
      features: ['Alta durabilidad en tráfico pesado de Quito y Guayaquil']
    }
  },
  {
    id: 'kia-sportage-active',
    year: 2016,
    brand: 'Kia',
    model: 'Sportage Active 2.0 4x2 / 4x4',
    engine: '2.0 CVVT Gasolina',
    recommendedBattery: {
      model: 'Andina Gold 24R-600',
      bciGroup: '24R',
      cca: 600,
      ah: 60,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 98.00,
      features: ['Formato exacto con pestaña inferior de fijación original']
    }
  },
  {
    id: 'kia-soluto-2024',
    year: 2024,
    brand: 'Kia',
    model: 'Soluto 1.4 Sedán',
    engine: '1.4 Kappa MPI Gasolina',
    recommendedBattery: {
      model: 'Andina Power 42-500',
      bciGroup: '42',
      cca: 500,
      ah: 45,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 78.50,
      features: ['Economía y rendimiento probado para flotas y plataformas']
    }
  },
  {
    id: 'kia-picanto-2024',
    year: 2024,
    brand: 'Kia',
    model: 'Picanto / Picanto Ion / GT-Line 1.0/1.2',
    engine: '1.0 / 1.2 MPI',
    recommendedBattery: {
      model: 'Andina City NS40-420',
      bciGroup: 'NS40 / 35',
      cca: 420,
      ah: 40,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 68.00,
      features: ['Bornes delgados JIS, encendido rápido en frío']
    }
  },
  {
    id: 'kia-rio-2023',
    year: 2023,
    brand: 'Kia',
    model: 'Rio Sedán / Hatchback / Stylus 1.4',
    engine: '1.4 / 1.5 MPI',
    recommendedBattery: {
      model: 'Andina Power 42-520',
      bciGroup: '42 / 24R',
      cca: 520,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 82.00,
      features: ['Arranque uniforme con protección contra descargas lentas']
    }
  },
  {
    id: 'kia-seltos-2024',
    year: 2024,
    brand: 'Kia',
    model: 'Seltos 1.6 / 1.4 Turbo',
    engine: '1.6 Gamma / 1.4 T-GDi',
    recommendedBattery: {
      model: 'Andina Gold 24R-650',
      bciGroup: '24R / LN2',
      cca: 640,
      ah: 60,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 125.00,
      features: ['Soporte para asistencias de carril y cámaras 360']
    }
  },
  {
    id: 'kia-sonet-2024',
    year: 2024,
    brand: 'Kia',
    model: 'Sonet 1.5',
    engine: '1.5 Smartstream',
    recommendedBattery: {
      model: 'Andina Power 42-520',
      bciGroup: '42 / 24R',
      cca: 520,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 84.00,
      features: ['Batería sellada sin derrame, óptima para SUV citadino']
    }
  },

  // ─── HYUNDAI (Alta presencia en Ecuador) ───
  {
    id: 'hyundai-tucson-2025',
    year: 2025,
    brand: 'Hyundai',
    model: 'Tucson (NX4, TL, IX35) 2.0 / Turbo',
    engine: '2.0 Smartstream / 1.6 T-GDi',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 760,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 185.00,
      features: ['Compatible con sistema de frenado regenerativo y Start/Stop']
    }
  },
  {
    id: 'hyundai-tucson-2018',
    year: 2018,
    brand: 'Hyundai',
    model: 'Tucson TL 2.0 4x2 / 4x4',
    engine: '2.0 Nu MPi Gasolina',
    recommendedBattery: {
      model: 'Andina Gold 24R-650',
      bciGroup: '24R',
      cca: 650,
      ah: 60,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 110.00,
      features: ['Potencia estable para electrónica de inyección multipunto']
    }
  },
  {
    id: 'hyundai-accent-2024',
    year: 2024,
    brand: 'Hyundai',
    model: 'Accent Sedán / Hatchback 1.4/1.6',
    engine: '1.4 / 1.6 MPi Gasolina',
    recommendedBattery: {
      model: 'Andina Power 42-520',
      bciGroup: '42 / 24R',
      cca: 520,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 80.00,
      features: ['Diseño compacto y confiabilidad para recorridos extensos']
    }
  },
  {
    id: 'hyundai-creta-2024',
    year: 2024,
    brand: 'Hyundai',
    model: 'Creta / Creta Grand 1.5/1.6',
    engine: '1.5 Smartstream / 2.0 MPi',
    recommendedBattery: {
      model: 'Andina Gold 24R-650',
      bciGroup: '24R / LN2',
      cca: 620,
      ah: 60,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 120.00,
      features: ['Rendimiento superior en tráfico con aire acondicionado']
    }
  },
  {
    id: 'hyundai-santafe-2024',
    year: 2024,
    brand: 'Hyundai',
    model: 'Santa Fe 2.4 / 3.5 V6 / 2.2 CRDi',
    engine: '2.4 / 3.5 V6 / 2.2 Turbo Diésel',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H7 (LN4)',
      bciGroup: 'H7 / LN4',
      cca: 800,
      ah: 80,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 210.00,
      features: ['Arranque enérgico para motores V6 y turbodiésel de 7 plazas']
    }
  },
  {
    id: 'hyundai-grandi10-2024',
    year: 2024,
    brand: 'Hyundai',
    model: 'Grand i10 Sedán / Hatchback 1.2',
    engine: '1.2 Kappa MPi',
    recommendedBattery: {
      model: 'Andina City NS40-420',
      bciGroup: 'NS40 / 35',
      cca: 420,
      ah: 40,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 68.00,
      features: ['Batería liviana, ahorro de consumo de combustible']
    }
  },
  {
    id: 'hyundai-h1-2022',
    year: 2022,
    brand: 'Hyundai',
    model: 'H-1 Van / Pasajeros 2.5 CRDi',
    engine: '2.5 CRDi Turbo Diésel',
    recommendedBattery: {
      model: 'Andina Ultra HD 31-850',
      bciGroup: '31',
      cca: 850,
      ah: 95,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 168.00,
      features: ['Construcción robusta para transporte escolar y turístico']
    }
  },

  // ─── SUZUKI (Muy extendido en Ecuador: Grand Vitara, Jimny, Swift) ───
  {
    id: 'suzuki-jimny-2024',
    year: 2024,
    brand: 'Suzuki',
    model: 'Jimny 1.5 4x4 (3 y 5 Puertas)',
    engine: '1.5 K15B Gasolina 4x4',
    recommendedBattery: {
      model: 'Andina Gold 35-500',
      bciGroup: 'NS40 / 35',
      cca: 480,
      ah: 45,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 79.00,
      features: ['Dimensiones para bandeja angosta off-road']
    }
  },
  {
    id: 'suzuki-scross-2024',
    year: 2024,
    brand: 'Suzuki',
    model: 'S-Cross 1.4 Boosterjet AllGrip Turbo',
    engine: '1.4 Boosterjet Turbo / Mild-Hybrid',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H5 (LN2)',
      bciGroup: 'H5 / LN2',
      cca: 650,
      ah: 60,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 165.00,
      features: ['Certificada para sistema SHVS Mild-Hybrid y Turbo']
    }
  },
  {
    id: 'suzuki-vitara-live-2023',
    year: 2023,
    brand: 'Suzuki',
    model: 'Vitara Live 1.6 / 1.4 Turbo AllGrip',
    engine: '1.6 VVT / 1.4 Boosterjet',
    recommendedBattery: {
      model: 'Andina Gold 24R-620',
      bciGroup: '24R / LN2',
      cca: 620,
      ah: 60,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 115.00,
      features: ['Suministro continuo para tracción electrónica AllGrip']
    }
  },
  {
    id: 'suzuki-swift-2024',
    year: 2024,
    brand: 'Suzuki',
    model: 'Swift 1.2 / Hybrid',
    engine: '1.2 Dualjet / Mild Hybrid',
    recommendedBattery: {
      model: 'Andina City NS40-450',
      bciGroup: 'NS40 / LN1',
      cca: 450,
      ah: 42,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 85.00,
      features: ['Recarga ultrarrápida para desaceleración regenerativa']
    }
  },

  // ─── NISSAN (Frontier, Versa, Sentra, Kicks, X-Trail) ───
  {
    id: 'nissan-frontier-2025',
    year: 2025,
    brand: 'Nissan',
    model: 'Frontier / Navara 2.5 Diésel 4x4',
    engine: '2.5 YD25 Turbo Diésel Intercooler',
    recommendedBattery: {
      model: 'Andina Ultra HD 31-850',
      bciGroup: '31 / 27F',
      cca: 850,
      ah: 90,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 165.00,
      features: ['Máxima entrega en frío para arranques exigentes en la Sierra']
    }
  },
  {
    id: 'nissan-frontier-2020',
    year: 2020,
    brand: 'Nissan',
    model: 'Frontier / NP300 2.5 Gasolina / Diésel',
    engine: '2.5 QR25 Gasolina / YD25 Diésel',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 140.00,
      features: ['Chasis reforzado contra vibraciones en carreteras destapadas']
    }
  },
  {
    id: 'nissan-versa-2024',
    year: 2024,
    brand: 'Nissan',
    model: 'Versa 1.6 Sedán',
    engine: '1.6 HR16DE Gasolina',
    recommendedBattery: {
      model: 'Andina Power 42-500',
      bciGroup: '42 / 35',
      cca: 500,
      ah: 48,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 79.50,
      features: ['Recomendada para servicio ejecutivo y particular']
    }
  },
  {
    id: 'nissan-kicks-2024',
    year: 2024,
    brand: 'Nissan',
    model: 'Kicks 1.6',
    engine: '1.6 HR16DE Gasolina',
    recommendedBattery: {
      model: 'Andina Power 35-520',
      bciGroup: '35 / 42',
      cca: 520,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 85.00,
      features: ['Capacidad estable para panel digital y botón Start']
    }
  },
  {
    id: 'nissan-xtrail-2024',
    year: 2024,
    brand: 'Nissan',
    model: 'X-Trail 2.5 / e-Power',
    engine: '2.5 QR25 / e-Power Eléctrico Asistido',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 720,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 185.00,
      features: ['Suministro continuo para unidad de control e-Power y 12V auxiliar']
    }
  },

  // ─── RENAULT (Duster, Sandero, Stepway, Logan) ───
  {
    id: 'renault-duster-2024',
    year: 2024,
    brand: 'Renault',
    model: 'Duster 1.6 / 2.0 / 1.3 Turbo 4x4',
    engine: '1.6 / 2.0 / 1.3 TCe Turbo',
    recommendedBattery: {
      model: 'Andina European DIN 55 (LN2)',
      bciGroup: 'DIN 55 / LN2',
      cca: 600,
      ah: 60,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 110.00,
      features: ['Pestaña DIN estándar para sujeción europea original Renault']
    }
  },
  {
    id: 'renault-stepway-2023',
    year: 2023,
    brand: 'Renault',
    model: 'Stepway / Sandero 1.6',
    engine: '1.6 16V Gasolina',
    recommendedBattery: {
      model: 'Andina European DIN 50',
      bciGroup: 'DIN 44 / 50',
      cca: 500,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 82.00,
      features: ['Caja de altura baja DIN europea']
    }
  },
  {
    id: 'renault-logan-2023',
    year: 2023,
    brand: 'Renault',
    model: 'Logan 1.6 Sedán',
    engine: '1.6 8V / 16V Gasolina',
    recommendedBattery: {
      model: 'Andina European DIN 50',
      bciGroup: 'DIN 44 / 50',
      cca: 500,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 82.00,
      features: ['Excelente duración para trabajo diario']
    }
  },

  // ─── VOLKSWAGEN (Amarok, Gol, Polo, T-Cross, Tiguan) ───
  {
    id: 'vw-amarok-2025',
    year: 2025,
    brand: 'Volkswagen',
    model: 'Amarok 2.0 BiTDI / 3.0 V6 TDI 4Motion',
    engine: '2.0 BiTDI / 3.0 V6 Turbo Diésel',
    recommendedBattery: {
      model: 'Andina AGM Heavy DIN 80 (LN4)',
      bciGroup: 'H7 / LN4',
      cca: 850,
      ah: 85,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 220.00,
      features: ['Diseño para doble turbo y alta compresión alemana']
    }
  },
  {
    id: 'vw-gol-2022',
    year: 2022,
    brand: 'Volkswagen',
    model: 'Gol / Voyage 1.6',
    engine: '1.6 MSI 8V Gasolina',
    recommendedBattery: {
      model: 'Andina European DIN 50',
      bciGroup: 'DIN 44 / 50',
      cca: 500,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 79.00,
      features: ['Ajuste milimétrico para soporte original de batería VW']
    }
  },
  {
    id: 'vw-tcross-2024',
    year: 2024,
    brand: 'Volkswagen',
    model: 'T-Cross / Nivus 1.0 TSI Turbo',
    engine: '1.0 TSI Turbo con Start-Stop',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H5 (LN2)',
      bciGroup: 'H5 / LN2',
      cca: 640,
      ah: 60,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 165.00,
      features: ['Soporta ciclos de carga y descarga acelerada del alternador']
    }
  },
  {
    id: 'vw-tiguan-2024',
    year: 2024,
    brand: 'Volkswagen',
    model: 'Tiguan Allspace 2.0 TSI 4Motion',
    engine: '2.0 TSI Turbo Gasolina',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 760,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 185.00,
      features: ['Requerida por centralita electrónica de tracción total 4Motion']
    }
  },

  // ─── FORD (F-150, Ranger, Explorer, EcoSport) ───
  {
    id: 'ford-f150-2025',
    year: 2025,
    brand: 'Ford',
    model: 'F-150 3.5 EcoBoost / 5.0 V8 / Hybrid PowerBoost',
    engine: '3.5 EcoBoost V6 / 5.0 V8',
    recommendedBattery: {
      model: 'Andina AGM Truck Titan H8 (LN5)',
      bciGroup: '65 / H8 (LN5)',
      cca: 850,
      ah: 90,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 235.00,
      features: ['Suministro para generador Pro Power Onboard y cabina de aluminio']
    }
  },
  {
    id: 'ford-ranger-2024',
    year: 2024,
    brand: 'Ford',
    model: 'Ranger 2.0 Bi-Turbo / 3.2 Diésel 4x4',
    engine: '2.0 Bi-Turbo / 3.2 Diésel Puma',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H7 (LN4)',
      bciGroup: 'H7 / LN4',
      cca: 800,
      ah: 80,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 215.00,
      features: ['Arranque de alto amperaje para faenas exigentes']
    }
  },
  {
    id: 'ford-explorer-2024',
    year: 2024,
    brand: 'Ford',
    model: 'Explorer 2.3 EcoBoost / 3.0 V6 ST',
    engine: '2.3 EcoBoost / 3.0 V6 Twin-Turbo',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H7 (LN4)',
      bciGroup: '65 / H7',
      cca: 780,
      ah: 80,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 210.00,
      features: ['Protección contra sobrecargas para suite de seguridad Co-Pilot360']
    }
  },

  // ─── MAZDA (Representada por Corporación Maresa en Ecuador) ───
  {
    id: 'mazda-cx5-2025',
    year: 2025,
    brand: 'Mazda',
    model: 'CX-5 SkyActiv 2.0/2.5 i-Stop',
    engine: '2.0 / 2.5 SkyActiv-G i-Stop',
    recommendedBattery: {
      model: 'Andina Q85 EFB i-Stop Special',
      bciGroup: 'Q-85 (D23L)',
      cca: 660,
      ah: 65,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 30,
      priceEcuador: 175.00,
      features: ['Diseño especial para sistema Mazda i-Stop de alta recarga rápida']
    }
  },
  {
    id: 'mazda-cx30-2024',
    year: 2024,
    brand: 'Mazda',
    model: 'CX-30 SkyActiv 2.0/2.5 i-Stop',
    engine: '2.0 / 2.5 SkyActiv-G',
    recommendedBattery: {
      model: 'Andina Q85 EFB i-Stop Special',
      bciGroup: 'Q-85 (D23L)',
      cca: 660,
      ah: 65,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 30,
      priceEcuador: 175.00,
      features: ['Especificación requerida por el sensor de monitoreo de batería Mazda']
    }
  },
  {
    id: 'mazda-bt50-2024',
    year: 2024,
    brand: 'Mazda',
    model: 'BT-50 3.0 CRDI 4x4 Diésel',
    engine: '3.0 Turbo Diésel Intercooler',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Especificación oficial para camionetas de trabajo pesado Maresa']
    }
  },
  {
    id: 'mazda-3-2024',
    year: 2024,
    brand: 'Mazda',
    model: 'Mazda 3 SkyActiv 2.0/2.5 Sedán',
    engine: '2.0 / 2.5 SkyActiv-G i-Stop',
    recommendedBattery: {
      model: 'Andina Q85 EFB i-Stop Special',
      bciGroup: 'Q-85 (D23L)',
      cca: 660,
      ah: 65,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 30,
      priceEcuador: 175.00,
      features: ['Responde a las micro-paradas del motor en semáforos']
    }
  },

  // ─── CHERY (Marca comercializada por Maresa en Ecuador) ───
  {
    id: 'chery-tiggo7-2025',
    year: 2025,
    brand: 'Chery',
    model: 'Tiggo 7 Pro / Tiggo 8 Pro 1.6T',
    engine: '1.5 / 1.6 Turbo ACTECO',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 720,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 180.00,
      features: ['Suministro continuo a pantallas duales y asistencias ADAS']
    }
  },
  {
    id: 'chery-tiggo2-2024',
    year: 2024,
    brand: 'Chery',
    model: 'Tiggo 2 Pro / Tiggo 4 Pro 1.5',
    engine: '1.5L Gasolina VVT',
    recommendedBattery: {
      model: 'Andina European DIN 55 (LN2)',
      bciGroup: 'DIN 55 / LN2',
      cca: 550,
      ah: 55,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 90.00,
      features: ['Ajuste para soporte de motor de SUV crossover']
    }
  },

  // ─── GREAT WALL / HAVAL / POER (Líder en camionetas chinas en Ecuador) ───
  {
    id: 'gwm-poer-2025',
    year: 2025,
    brand: 'Great Wall',
    model: 'Poer 2.0 Turbo Diésel 4x4',
    engine: '2.0 GW4D20 Turbo Diésel',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 780,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 148.00,
      features: ['Resistencia para uso agropecuario y comercial en costa y sierra']
    }
  },
  {
    id: 'haval-h6-2024',
    year: 2024,
    brand: 'Great Wall',
    model: 'Haval H6 1.5T / 2.0T / Híbrida',
    engine: '1.5T / 2.0T GDIT',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 750,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 185.00,
      features: ['Certificada para computadoras de abordo y frenado automático']
    }
  },
  {
    id: 'gwm-wingle-2023',
    year: 2023,
    brand: 'Great Wall',
    model: 'Wingle 5 / Wingle 7 2.0 Diésel 4x4',
    engine: '2.0 Diésel / 2.4 Gasolina',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 75,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 138.00,
      features: ['Polaridad estándar y fijación superior con pernos largos']
    }
  },

  // ─── JAC (Camionetas T6, T8 y SUVs) ───
  {
    id: 'jac-t8-2025',
    year: 2025,
    brand: 'JAC',
    model: 'T8 / T8 Pro / T6 2.0 CTI Diésel 4x4',
    engine: '2.0 CTI Turbo Diésel Intercooler',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F / 31',
      cca: 780,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Robusta frente a vibraciones de caminos mineros y camaroneros']
    }
  },
  {
    id: 'jac-js4-2024',
    year: 2024,
    brand: 'JAC',
    model: 'JS4 / JS2 1.5 Turbo',
    engine: '1.5 Turbo / 1.5 VVT',
    recommendedBattery: {
      model: 'Andina European DIN 55',
      bciGroup: 'DIN 55 / LN2',
      cca: 550,
      ah: 55,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 88.00,
      features: ['Estabilidad para aire acondicionado y multimedia']
    }
  },

  // ─── DONGFENG (Representada por Corporación Maresa) ───
  {
    id: 'dongfeng-rich6-2025',
    year: 2025,
    brand: 'Dongfeng',
    model: 'Rich 6 2.5 Turbo Diésel 4x4',
    engine: '2.5 ZD25 Turbo Diésel Intercooler',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Batería con fijación para chasis de camioneta pickup Maresa']
    }
  },

  // ─── ISUZU (Camiones de carga liviana y media) ───
  {
    id: 'isuzu-dmax-2024',
    year: 2024,
    brand: 'Isuzu',
    model: 'D-Max 3.0 4JJ1 Diésel 4x4',
    engine: '3.0 4JJ1 Turbo Diésel',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 780,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Gran entrega amperimétrica para arranque en páramo andino']
    }
  },
  {
    id: 'isuzu-npr-2024',
    year: 2024,
    brand: 'Isuzu',
    model: 'NPR / NQR Camión 4.6/5.2 Diésel (24V)',
    engine: '4HK1 5.2 Turbo Diésel (Par 2x12V = 24V)',
    recommendedBattery: {
      model: 'Andina Truck Titan 31-900 (Juego 2x12V = 24V)',
      bciGroup: '31 HD',
      cca: 900,
      ah: 100,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 175.00,
      features: ['Instalación gemela en serie de 24 voltios para transporte interprovincial']
    }
  },

  // ─── HINO (Líder indiscutible en transporte pesado y carga en Ecuador) ───
  {
    id: 'hino-dutro-2024',
    year: 2024,
    brand: 'Hino',
    model: 'Dutro Serie 300 (3.5T a 6.5T)',
    engine: '4.0 N04C Turbo Diésel (Par 2x12V = 24V)',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max (Juego 2x12V = 24V)',
      bciGroup: '27F / 31',
      cca: 780,
      ah: 85,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 150.00,
      features: ['Juego gemelo para 24V de servicio urbano de distribución y logística']
    }
  },
  {
    id: 'hino-gd-2024',
    year: 2024,
    brand: 'Hino',
    model: 'Serie 500 GD / GH / FM (Volquete y Mula)',
    engine: '7.6L J08E Turbo Diésel (Par 2x12V = 24V)',
    recommendedBattery: {
      model: 'Andina Truck Titan 4D-1000 (Juego 2x12V = 24V)',
      bciGroup: '4D',
      cca: 1050,
      ah: 150,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 215.00,
      features: ['Máxima potencia de arranque para transporte pesado andino', 'Placas reforzadas de plomo puro con antimonio']
    }
  },

  // ─── BAIC (Marca de alta penetración en Ecuador) ───
  {
    id: 'baic-x35-2024',
    year: 2024,
    brand: 'BAIC',
    model: 'X35 1.5 Turbo',
    engine: '1.5L Turbo Gasolina',
    recommendedBattery: {
      model: 'Andina Gold 24R-620',
      bciGroup: '24R / LN2',
      cca: 620,
      ah: 60,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 115.00,
      features: ['Suministro estable para suite electrónica y pantalla multimedia']
    }
  },
  {
    id: 'baic-x55-2024',
    year: 2024,
    brand: 'BAIC',
    model: 'X55 II 1.5 Turbo',
    engine: '1.5L Turbo con Start-Stop',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H5 (LN2)',
      bciGroup: 'H5 / LN2',
      cca: 650,
      ah: 60,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 165.00,
      features: ['Certificada para sistema de arranque inteligente y cámaras 360']
    }
  },
  {
    id: 'baic-bj40-2024',
    year: 2024,
    brand: 'BAIC',
    model: 'BJ40 Plus 2.0/2.3 Turbo 4x4',
    engine: '2.0 / 2.3 Turbo 4x4',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Batería reforzada para uso 4x4 y tracción integral off-road']
    }
  },

  // ─── BYD (Líder en nueva energía y sedanes) ───
  {
    id: 'byd-yuan-pro-2024',
    year: 2024,
    brand: 'BYD',
    model: 'Yuan Pro / Plus EV (Auxiliar 12V)',
    engine: 'Eléctrico (Batería Auxiliar de Servicios 12V)',
    recommendedBattery: {
      model: 'Andina AGM Auxiliary LN1',
      bciGroup: 'LN1 / 35',
      cca: 500,
      ah: 45,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 36,
      priceEcuador: 135.00,
      features: ['Batería de soporte de 12V para encendido de contactores de alta tensión']
    }
  },
  {
    id: 'byd-f3-2022',
    year: 2022,
    brand: 'BYD',
    model: 'F3 1.5 Sedán',
    engine: '1.5L Gasolina',
    recommendedBattery: {
      model: 'Andina Power 42-500',
      bciGroup: '42 / DIN 44',
      cca: 500,
      ah: 45,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 78.50,
      features: ['Alta durabilidad en taxi y transporte urbano']
    }
  },

  // ─── CHANGAN (Muy vendido en Ecuador: CS15, CS35, CS55, Alsvin, Hunter) ───
  {
    id: 'changan-cs35-2024',
    year: 2024,
    brand: 'Changan',
    model: 'CS35 Plus 1.4 Turbo',
    engine: '1.4 Turbo Blue Core',
    recommendedBattery: {
      model: 'Andina Gold 24R-620',
      bciGroup: '24R / LN2',
      cca: 620,
      ah: 60,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 118.00,
      features: ['Suministro continuo para tablero digital dual']
    }
  },
  {
    id: 'changan-cs55-2024',
    year: 2024,
    brand: 'Changan',
    model: 'CS55 Plus 1.5 Turbo',
    engine: '1.5 Turbo Blue Core',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 720,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 180.00,
      features: ['Compatible con frenado autónomo y control crucero adaptativo']
    }
  },
  {
    id: 'changan-alsvin-2023',
    year: 2023,
    brand: 'Changan',
    model: 'Alsvin 1.4 / 1.5 Sedán',
    engine: '1.4 / 1.5 Blue Core Gasolina',
    recommendedBattery: {
      model: 'Andina Power 42-500',
      bciGroup: '42',
      cca: 500,
      ah: 45,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 78.50,
      features: ['Formato compacto y excelente retención de carga']
    }
  },
  {
    id: 'changan-hunter-2024',
    year: 2024,
    brand: 'Changan',
    model: 'Hunter 1.9 Turbo Diésel 4x4',
    engine: '1.9 Turbo Diésel Intercooler',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Capacidad de arranque para camioneta de trabajo pesado']
    }
  },

  // ─── GEELY (Coolray, Azkarra, Emgrand, GX3 Pro) ───
  {
    id: 'geely-coolray-2024',
    year: 2024,
    brand: 'Geely',
    model: 'Coolray 1.5 Turbo',
    engine: '1.5 Turbo Brec / Volvo Tech',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H5 (LN2)',
      bciGroup: 'H5 / LN2',
      cca: 650,
      ah: 60,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 165.00,
      features: ['Estándar europeo DIN para arquitectura Geely/Volvo']
    }
  },
  {
    id: 'geely-gx3-2024',
    year: 2024,
    brand: 'Geely',
    model: 'GX3 Pro 1.5',
    engine: '1.5L Gasolina',
    recommendedBattery: {
      model: 'Andina Power 24-550',
      bciGroup: '24 / DIN 55',
      cca: 550,
      ah: 52,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 85.00,
      features: ['Batería libre de mantenimiento para crossover urbano']
    }
  },

  // ─── JETOUR (X70, X70 Plus, Dashing) ───
  {
    id: 'jetour-x70-2024',
    year: 2024,
    brand: 'Jetour',
    model: 'X70 / X70 Plus 1.5/1.6 Turbo (7 Pasajeros)',
    engine: '1.5 / 1.6 Turbo ACTECO',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 720,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 180.00,
      features: ['Suministro para 3 filas de asientos, doble aire y techo panorámico']
    }
  },
  {
    id: 'jetour-dashing-2024',
    year: 2024,
    brand: 'Jetour',
    model: 'Dashing 1.5/1.6 Turbo',
    engine: '1.5 / 1.6 Turbo',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 750,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 185.00,
      features: ['Diseño para arquitectura electrónica de última generación']
    }
  },

  // ─── MG / MORRIS GARAGES (MG ZS, MG GT, MG HS, MG 5) ───
  {
    id: 'mg-zs-2024',
    year: 2024,
    brand: 'MG',
    model: 'MG ZS 1.5',
    engine: '1.5 NSE Plus Gasolina',
    recommendedBattery: {
      model: 'Andina European DIN 55 (LN2)',
      bciGroup: 'DIN 55 / LN2',
      cca: 550,
      ah: 55,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 90.00,
      features: ['Formato bajo DIN europeo con pestañas de anclaje']
    }
  },
  {
    id: 'mg-gt-2024',
    year: 2024,
    brand: 'MG',
    model: 'MG GT 1.5 Turbo',
    engine: '1.5 Turbo Mega Tech',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H5 (LN2)',
      bciGroup: 'H5 / LN2',
      cca: 650,
      ah: 60,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 165.00,
      features: ['Soporta ciclos de Start/Stop en sedán deportivo']
    }
  },

  // ─── MITSUBISHI (L200 Sportero, Montero Sport, Outlander, ASX) ───
  {
    id: 'mitsubishi-l200-2024',
    year: 2024,
    brand: 'Mitsubishi',
    model: 'L200 Sportero / Triton 2.4 Diésel 4x4',
    engine: '2.4 MIVEC Turbo Diésel Intercooler',
    recommendedBattery: {
      model: 'Andina Ultra HD 31-850',
      bciGroup: '31 / 27F',
      cca: 850,
      ah: 90,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 165.00,
      features: ['Arranque pesado para camioneta de mina y petróleo']
    }
  },
  {
    id: 'mitsubishi-montero-2023',
    year: 2023,
    brand: 'Mitsubishi',
    model: 'Montero Sport 3.0 V6 / 2.5 Diésel',
    engine: '3.0 V6 Gasolina / 2.5 DID',
    recommendedBattery: {
      model: 'Andina Gold 27-720',
      bciGroup: '27',
      cca: 720,
      ah: 75,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 135.00,
      features: ['Reserva de amperaje para 4x4 Super Select']
    }
  },

  // ─── HONDA (CR-V, Civic, HR-V, Pilot, Fit) ───
  {
    id: 'honda-crv-2024',
    year: 2024,
    brand: 'Honda',
    model: 'CR-V 1.5 Turbo / 2.4 / Hybrid',
    engine: '1.5 Turbo VTEC / 2.4 i-VTEC',
    recommendedBattery: {
      model: 'Andina Gold 35-550',
      bciGroup: '35 / 51R',
      cca: 550,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 95.00,
      features: ['Dimensiones para bandeja Honda original con sujeción superior']
    }
  },
  {
    id: 'honda-civic-2023',
    year: 2023,
    brand: 'Honda',
    model: 'Civic 1.5 Turbo / 2.0',
    engine: '1.5 Turbo / 2.0 i-VTEC',
    recommendedBattery: {
      model: 'Andina Power 51R-480',
      bciGroup: '51R',
      cca: 480,
      ah: 45,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 85.00,
      features: ['Formato angosto 51R japonés']
    }
  },

  // ─── PEUGEOT / CITROËN (208, 2008, 3008, Partner, C-Elysée, C3) ───
  {
    id: 'peugeot-2008-2024',
    year: 2024,
    brand: 'Peugeot',
    model: '2008 / 3008 PureTech Turbo',
    engine: '1.2 / 1.6 PureTech Turbo con Start-Stop',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 720,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 180.00,
      features: ['Certificada para gestión de energía BSI Peugeot/Citroën']
    }
  },
  {
    id: 'peugeot-partner-2023',
    year: 2023,
    brand: 'Peugeot',
    model: 'Partner Furgón 1.6 HDi Diésel',
    engine: '1.6 HDi Turbo Diésel',
    recommendedBattery: {
      model: 'Andina European DIN 60',
      bciGroup: 'DIN 60 / LN2',
      cca: 620,
      ah: 60,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 115.00,
      features: ['Robusta para reparto comercial urbano']
    }
  },
  {
    id: 'citroen-c3-2024',
    year: 2024,
    brand: 'Citroën',
    model: 'C3 / C4 Cactus 1.6',
    engine: '1.6 VTi / THP',
    recommendedBattery: {
      model: 'Andina European DIN 55',
      bciGroup: 'DIN 55 / LN2',
      cca: 550,
      ah: 55,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 88.00,
      features: ['Caja DIN europea de altura rebajada']
    }
  },

  // ─── FIAT / RAM (Strada, Cronos, Pulse, Uno, RAM 700, RAM 1500) ───
  {
    id: 'fiat-strada-2024',
    year: 2024,
    brand: 'Fiat',
    model: 'Strada / Pulse / Cronos 1.3 FireFly',
    engine: '1.3 FireFly 8V',
    recommendedBattery: {
      model: 'Andina Power 42-500',
      bciGroup: '42 / DIN 44',
      cca: 500,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 79.50,
      features: ['Excelente desempeño para uso urbano y carga ligera']
    }
  },
  {
    id: 'ram-700-2024',
    year: 2024,
    brand: 'RAM',
    model: 'RAM 700 Bighorn / Laramie 1.3',
    engine: '1.3 FireFly',
    recommendedBattery: {
      model: 'Andina Power 42-520',
      bciGroup: '42 / DIN 50',
      cca: 520,
      ah: 50,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 82.00,
      features: ['Formato exacto para van y pickup compacta']
    }
  },

  // ─── SUBARU (Forester, XV, Outback) ───
  {
    id: 'subaru-forester-2024',
    year: 2024,
    brand: 'Subaru',
    model: 'Forester / Outback 2.5 Boxer AWD',
    engine: '2.5 Boxer con Start-Stop',
    recommendedBattery: {
      model: 'Andina Q85 EFB i-Stop Special',
      bciGroup: 'Q-85 (D23L)',
      cca: 660,
      ah: 65,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 30,
      priceEcuador: 175.00,
      features: ['Especial para motor Boxer con sistema Start/Stop y tracción Symmetrical AWD']
    }
  }
];

// UBICACIONES REALES DE CORPORACIÓN MARESA EN ECUADOR
export const defaultDistributors: DistributorLocation[] = [
  // QUITO (PICHINCHA)
  {
    id: 'maresa-quito-norte-matriz',
    name: 'Corporación Maresa Matriz Norte - Quito',
    province: 'Pichincha',
    city: 'Quito',
    address: 'Av. Galo Plaza Lasso N60-120 y De Los Cedros (Sector Carcelén)',
    phone: '(02) 398-9000',
    whatsapp: '593998123456',
    schedule: 'Lunes a Viernes 08:00 - 18:00 | Sábados 08:30 - 13:00',
    latitude: -0.1189,
    longitude: -78.4823,
    services: ['Centro de Diagnóstico Computarizado Gratuito', 'Instalación Express', 'Reciclaje con bono -$10', 'Venta a talleres y mayoristas'],
    isAuthorized: true,
    rating: 4.9
  },
  {
    id: 'maresa-quito-amazonas',
    name: 'Maresa Center Centro Norte - Amazonas',
    province: 'Pichincha',
    city: 'Quito',
    address: 'Av. Amazonas N34-451 y Atahualpa (Frente a CCI)',
    phone: '(02) 225-8800',
    whatsapp: '593998123457',
    schedule: 'Lunes a Viernes 08:30 - 18:30 | Sábados 09:00 - 14:00',
    latitude: -0.1776,
    longitude: -78.4878,
    services: ['Instalación inmediata a domicilio', 'Chequeo de alternador sin costo', 'Garantía directa nacional'],
    isAuthorized: true,
    rating: 4.9
  },
  {
    id: 'maresa-quito-cumbaya',
    name: 'Maresa Valle Cumbayá',
    province: 'Pichincha',
    city: 'Quito (Cumbayá)',
    address: 'Av. Interoceánica Km 10 y Pasaje La Esquina',
    phone: '(02) 289-4500',
    whatsapp: '593998123458',
    schedule: 'Lunes a Viernes 08:00 - 17:30 | Sábados 08:30 - 13:00',
    latitude: -0.1989,
    longitude: -78.4312,
    services: ['Especialistas en vehículos de alta gama y baterías AGM Start-Stop', 'Servicio a domicilio Cumbayá y Tumbaco'],
    isAuthorized: true,
    rating: 4.8
  },
  {
    id: 'maresa-quito-los-chillos',
    name: 'Maresa Los Chillos - San Rafael',
    province: 'Pichincha',
    city: 'Rumiñahui (Los Chillos)',
    address: 'Av. General Rumiñahui e Isla Pinzón (Sector San Rafael)',
    phone: '(02) 286-9900',
    whatsapp: '593998123459',
    schedule: 'Lunes a Sábado 08:00 - 18:00',
    latitude: -0.2987,
    longitude: -78.4554,
    services: ['Instalación en sitio', 'Recepción de baterías usadas con bono ecológico'],
    isAuthorized: true,
    rating: 4.8
  },
  {
    id: 'maresa-quito-sur-recreo',
    name: 'Maresa Centro Sur - El Recreo',
    province: 'Pichincha',
    city: 'Quito',
    address: 'Av. Pedro Vicente Maldonado S11-45 y Moraspungo',
    phone: '(02) 267-4321',
    whatsapp: '593998123460',
    schedule: 'Lunes a Sábado 08:00 - 18:00',
    latitude: -0.2512,
    longitude: -78.5234,
    services: ['Atención rápida a cooperativas de taxis y particulares', 'Chequeo de sistema eléctrico'],
    isAuthorized: true,
    rating: 4.7
  },

  // GUAYAQUIL (GUAYAS)
  {
    id: 'maresa-guayaquil-orellana',
    name: 'Corporación Maresa Matriz Costa - Francisco de Orellana',
    province: 'Guayas',
    city: 'Guayaquil',
    address: 'Av. Francisco de Orellana Mz 111 y Av. Plaza Dañín',
    phone: '(04) 398-9000',
    whatsapp: '593998765432',
    schedule: 'Lunes a Viernes 08:00 - 18:00 | Sábados 08:30 - 13:30',
    latitude: -2.1643,
    longitude: -79.8976,
    services: ['Stock completo todas las tecnologías AGM, EFB y Marinas', 'Despacho mayorista a talleres', 'Reciclaje certificado'],
    isAuthorized: true,
    rating: 4.9
  },
  {
    id: 'maresa-guayaquil-juan-tanca',
    name: 'Maresa Juan Tanca Marengo',
    province: 'Guayas',
    city: 'Guayaquil',
    address: 'Av. Juan Tanca Marengo Km 1.5 y Av. Rodrigo Chávez',
    phone: '(04) 229-8800',
    whatsapp: '593998765434',
    schedule: 'Lunes a Viernes 08:00 - 18:00 | Sábados 08:30 - 13:00',
    latitude: -2.1587,
    longitude: -79.9123,
    services: ['Instalación inmediata', 'Diagnóstico computarizado', 'Garantía nacional'],
    isAuthorized: true,
    rating: 4.8
  },
  {
    id: 'maresa-guayaquil-samborondon',
    name: 'Maresa Plaza Lagos - Vía Samborondón',
    province: 'Guayas',
    city: 'Samborondón',
    address: 'Km 5.5 Vía a Samborondón junto a Plaza Lagos',
    phone: '(04) 283-7700',
    whatsapp: '593998765435',
    schedule: 'Lunes a Sábado 09:00 - 18:30',
    latitude: -2.1432,
    longitude: -79.8654,
    services: ['Baterías AGM para marcas europeas y americanas', 'Instalación VIP a domicilio'],
    isAuthorized: true,
    rating: 4.9
  },
  {
    id: 'maresa-guayaquil-via-daule',
    name: 'Centro Maresa Transporte Pesado & Flotas - Vía a Daule',
    province: 'Guayas',
    city: 'Guayaquil',
    address: 'Km 8.5 Vía a Daule (Junto al Parque Industrial California)',
    phone: '(04) 211-5544',
    whatsapp: '593998765433',
    schedule: 'Lunes a Sábado 07:30 - 18:00',
    latitude: -2.1287,
    longitude: -79.9412,
    services: ['Atención especializada a flotas, cabezales y transporte pesado', 'Baterías 4D y 8D en stock permanente'],
    isAuthorized: true,
    rating: 4.8
  },

  // CUENCA (AZUAY)
  {
    id: 'maresa-cuenca-espana',
    name: 'Corporación Maresa Cuenca - Av. España',
    province: 'Azuay',
    city: 'Cuenca',
    address: 'Av. España 14-89 y Huayna Cápac (Cerca al Terminal Terrestre)',
    phone: '(07) 398-9000',
    whatsapp: '593995544332',
    schedule: 'Lunes a Viernes 08:00 - 18:00 | Sábados 08:30 - 13:00',
    latitude: -2.8921,
    longitude: -79.0012,
    services: ['Garantía nacional directa', 'Calibración de batería para altura andina', 'Instalación a domicilio'],
    isAuthorized: true,
    rating: 4.9
  },

  // AMBATO (TUNGURAHUA)
  {
    id: 'maresa-ambato-atahualpa',
    name: 'Corporación Maresa Ambato',
    province: 'Tungurahua',
    city: 'Ambato',
    address: 'Av. Atahualpa y Los Shyris (Frente al Mall de Los Andes)',
    phone: '(03) 284-9988',
    whatsapp: '593993322110',
    schedule: 'Lunes a Sábado 08:00 - 18:00',
    latitude: -1.2543,
    longitude: -78.6298,
    services: ['Cobertura regional Sierra Centro', 'Baterías para transporte interprovincial y agrícola'],
    isAuthorized: true,
    rating: 4.8
  },

  // SANTO DOMINGO (SANTO DOMINGO DE LOS TSÁCHILAS)
  {
    id: 'maresa-santo-domingo',
    name: 'Corporación Maresa Santo Domingo',
    province: 'Santo Domingo de los Tsáchilas',
    city: 'Santo Domingo',
    address: 'Av. Quevedo Km 2 y Av. Chone (Redondel del Indio Tsáchila)',
    phone: '(02) 275-6677',
    whatsapp: '593992211009',
    schedule: 'Lunes a Domingo 07:30 - 18:30',
    latitude: -0.2534,
    longitude: -79.1754,
    services: ['Punto neurálgico Costa-Sierra', 'Servicio expreso para transporte pesado y camiones de carga'],
    isAuthorized: true,
    rating: 4.8
  },

  // MANTA (MANABÍ)
  {
    id: 'maresa-manta-noviembre',
    name: 'Corporación Maresa Manta',
    province: 'Manabí',
    city: 'Manta',
    address: 'Av. 4 de Noviembre y Calle 114',
    phone: '(05) 262-1100',
    whatsapp: '593994433221',
    schedule: 'Lunes a Sábado 08:00 - 17:30',
    latitude: -0.9621,
    longitude: -80.7123,
    services: ['Baterías marinas de ciclo profundo para pesca y embarcaciones', 'Protección anticorrosiva por salitre'],
    isAuthorized: true,
    rating: 4.9
  },

  // PORTOVIEJO (MANABÍ)
  {
    id: 'maresa-portoviejo',
    name: 'Corporación Maresa Portoviejo',
    province: 'Manabí',
    city: 'Portoviejo',
    address: 'Av. Metropolitana Eloy Alfaro Km 1.5',
    phone: '(05) 265-4400',
    whatsapp: '593994433222',
    schedule: 'Lunes a Sábado 08:00 - 17:30',
    latitude: -1.0543,
    longitude: -80.4567,
    services: ['Atención directa y repuestos automotrices', 'Garantía oficial'],
    isAuthorized: true,
    rating: 4.7
  },

  // MACHALA (EL ORO)
  {
    id: 'maresa-machala-junio',
    name: 'Corporación Maresa Machala',
    province: 'El Oro',
    city: 'Machala',
    address: 'Av. 25 de Junio y Palmeras',
    phone: '(07) 298-4455',
    whatsapp: '593991100998',
    schedule: 'Lunes a Sábado 08:00 - 18:00',
    latitude: -3.2587,
    longitude: -79.9554,
    services: ['Suministro a camaroneras, sector bananero y agroindustria', 'Baterías de arranque pesado'],
    isAuthorized: true,
    rating: 4.8
  },

  // IBARRA (IMBABURA)
  {
    id: 'maresa-ibarra',
    name: 'Corporación Maresa Ibarra',
    province: 'Imbabura',
    city: 'Ibarra',
    address: 'Panamericana Norte Km 2 vía a Tulcán (Sector Los Ceibos)',
    phone: '(06) 295-8822',
    whatsapp: '593993344556',
    schedule: 'Lunes a Sábado 08:00 - 17:30',
    latitude: 0.3543,
    longitude: -78.1234,
    services: ['Chequeo de rendimiento en frío para vehículos de la Sierra Norte', 'Instalación express'],
    isAuthorized: true,
    rating: 4.8
  },

  // RIOBAMBA (CHIMBORAZO)
  {
    id: 'maresa-riobamba',
    name: 'Corporación Maresa Riobamba',
    province: 'Chimborazo',
    city: 'Riobamba',
    address: 'Av. Pedro Vicente Maldonado y Av. De La Prensa',
    phone: '(03) 296-1122',
    whatsapp: '593992233445',
    schedule: 'Lunes a Sábado 08:00 - 17:30',
    latitude: -1.6678,
    longitude: -78.6543,
    services: ['Baterías de alta capacidad para altitud 2.750+ msnm', 'Diagnóstico de batería'],
    isAuthorized: true,
    rating: 4.8
  },

  // LOJA (LOJA)
  {
    id: 'maresa-loja',
    name: 'Corporación Maresa Loja',
    province: 'Loja',
    city: 'Loja',
    address: 'Av. 8 de Diciembre y Jaime Roldós Aguilera',
    phone: '(07) 258-4411',
    whatsapp: '593991122334',
    schedule: 'Lunes a Sábado 08:00 - 17:30',
    latitude: -3.9876,
    longitude: -79.2012,
    services: ['Atención al Austro ecuatoriano', 'Garantía nacional y chequeo de carga'],
    isAuthorized: true,
    rating: 4.7
  },

  // ESMERALDAS (ESMERALDAS)
  {
    id: 'maresa-esmeraldas',
    name: 'Corporación Maresa Esmeraldas',
    province: 'Esmeraldas',
    city: 'Esmeraldas',
    address: 'Av. Jaime Roldós Aguilera y Av. Del Pacífico',
    phone: '(06) 272-3344',
    whatsapp: '593990011223',
    schedule: 'Lunes a Sábado 08:00 - 17:00',
    latitude: 0.9587,
    longitude: -79.6543,
    services: ['Baterías para transporte provincial y sector pesquero', 'Protección salina'],
    isAuthorized: true,
    rating: 4.7
  },

  // COTOPAXI (LATACUNGA)
  {
    id: 'maresa-cotopaxi-latacunga',
    name: 'Corporación Maresa Latacunga - Cotopaxi',
    province: 'Cotopaxi',
    city: 'Latacunga',
    address: 'Panamericana Norte Km 3 y Av. Eloy Alfaro',
    phone: '(03) 281-2244',
    whatsapp: '593998123460',
    schedule: 'Lunes a Viernes 08:00 - 18:00 | Sábados 08:30 - 13:00',
    latitude: -0.9234,
    longitude: -78.6145,
    services: ['Diagnóstico computarizado', 'Baterías para transporte andino y altura', 'Garantía oficial'],
    isAuthorized: true,
    rating: 4.8
  },

  // LOS RÍOS (QUEVEDO / BABAHOYO)
  {
    id: 'maresa-los-rios-quevedo',
    name: 'Corporación Maresa Quevedo - Los Ríos',
    province: 'Los Ríos',
    city: 'Quevedo',
    address: 'Av. Walter Andrade Km 1.5 vía a Santo Domingo',
    phone: '(05) 275-8899',
    whatsapp: '593998123461',
    schedule: 'Lunes a Sábado 08:00 - 18:00',
    latitude: -1.0286,
    longitude: -79.4635,
    services: ['Baterías pesadas para maquinaria agrícola y flotas', 'Instalación express'],
    isAuthorized: true,
    rating: 4.8
  },

  // CARCHI (TULCÁN)
  {
    id: 'maresa-carchi-tulcan',
    name: 'Corporación Maresa Tulcán - Carchi',
    province: 'Carchi',
    city: 'Tulcán',
    address: 'Av. Veintimilla y Av. Coral (Sector Terminal)',
    phone: '(06) 298-5522',
    whatsapp: '593998123462',
    schedule: 'Lunes a Sábado 08:00 - 17:30',
    latitude: 0.8123,
    longitude: -77.7178,
    services: ['Atención a flotas de transporte pesado de frontera', 'Chequeo sin costo'],
    isAuthorized: true,
    rating: 4.7
  },

  // SANTA ELENA (SALINAS / LA LIBERTAD)
  {
    id: 'maresa-santa-elena',
    name: 'Corporación Maresa Santa Elena - Península',
    province: 'Santa Elena',
    city: 'La Libertad',
    address: 'Av. Eleodoro Solórzano y Calle 24 (Vía Salinas)',
    phone: '(04) 278-4411',
    whatsapp: '593998123463',
    schedule: 'Lunes a Sábado 08:00 - 18:00',
    latitude: -2.2289,
    longitude: -80.9123,
    services: ['Tratamiento anticorrosivo marino', 'Instalación a domicilio en Salinas y Ballenita'],
    isAuthorized: true,
    rating: 4.9
  },

  // CAÑAR (AZOGUES)
  {
    id: 'maresa-canar-azogues',
    name: 'Centro Autorizado Maresa Azogues - Cañar',
    province: 'Cañar',
    city: 'Azogues',
    address: 'Av. 24 de Mayo y Aurelio Jaramillo',
    phone: '(07) 224-1188',
    whatsapp: '593998123464',
    schedule: 'Lunes a Viernes 08:30 - 18:00 | Sábados 08:30 - 13:00',
    latitude: -2.7398,
    longitude: -78.8472,
    services: ['Garantía interprovincial Maresa', 'Baterías para transporte y vehículos livianos'],
    isAuthorized: true,
    rating: 4.8
  },

  // BOLÍVAR (GUARANDA)
  {
    id: 'maresa-bolivar-guaranda',
    name: 'Centro Autorizado Maresa Guaranda - Bolívar',
    province: 'Bolívar',
    city: 'Guaranda',
    address: 'Av. Guayaquil y Convención de 1884',
    phone: '(03) 298-0044',
    whatsapp: '593998123465',
    schedule: 'Lunes a Sábado 08:00 - 17:30',
    latitude: -1.5912,
    longitude: -79.0045,
    services: ['Servicio de carga y prueba de alternador', 'Venta y reciclaje de baterías usadas'],
    isAuthorized: true,
    rating: 4.7
  },

  // PASTAZA (PUYO)
  {
    id: 'maresa-pastaza-puyo',
    name: 'Corporación Maresa Puyo - Pastaza',
    province: 'Pastaza',
    city: 'Puyo',
    address: 'Av. Alberto Zambrano y Ceslao Marín',
    phone: '(03) 288-7711',
    whatsapp: '593998123466',
    schedule: 'Lunes a Sábado 08:00 - 18:00',
    latitude: -1.4889,
    longitude: -77.9982,
    services: ['Baterías para 4x4, camionetas y maquinaria de la Amazonía', 'Diagnóstico express'],
    isAuthorized: true,
    rating: 4.8
  },

  // SUCUMBÍOS (LAGO AGRIO / NUEVA LOJA)
  {
    id: 'maresa-sucumbios-lago-agrio',
    name: 'Corporación Maresa Lago Agrio - Sucumbíos',
    province: 'Sucumbíos',
    city: 'Nueva Loja',
    address: 'Av. Quito y Colombia (Sector Central)',
    phone: '(06) 283-0099',
    whatsapp: '593998123467',
    schedule: 'Lunes a Sábado 07:30 - 18:00',
    latitude: 0.0889,
    longitude: -76.8834,
    services: ['Baterías reforzadas para el sector petrolero y flotas pesadas', 'Garantía Maresa'],
    isAuthorized: true,
    rating: 4.9
  },

  // ORELLANA (EL COCA)
  {
    id: 'maresa-orellana-coca',
    name: 'Corporación Maresa El Coca - Orellana',
    province: 'Orellana',
    city: 'Puerto Francisco de Orellana',
    address: 'Av. 9 de Octubre y Napo',
    phone: '(06) 288-2233',
    whatsapp: '593998123468',
    schedule: 'Lunes a Sábado 08:00 - 18:00',
    latitude: -0.4682,
    longitude: -76.9881,
    services: ['Soporte para camionetas petroleras e industriales', 'Pruebas de CCA sin costo'],
    isAuthorized: true,
    rating: 4.8
  },

  // NAPO (TENA)
  {
    id: 'maresa-napo-tena',
    name: 'Centro Autorizado Maresa Tena - Napo',
    province: 'Napo',
    city: 'Tena',
    address: 'Av. 15 de Noviembre y Jumandy',
    phone: '(06) 288-6677',
    whatsapp: '593998123469',
    schedule: 'Lunes a Sábado 08:00 - 17:30',
    latitude: -0.9945,
    longitude: -77.8134,
    services: ['Instalación inmediata', 'Revisión técnica de sistema de carga'],
    isAuthorized: true,
    rating: 4.7
  },

  // MORONA SANTIAGO (MACAS)
  {
    id: 'maresa-morona-macas',
    name: 'Centro Autorizado Maresa Macas - Morona Santiago',
    province: 'Morona Santiago',
    city: 'Macas',
    address: 'Av. 24 de Mayo y Soasti',
    phone: '(07) 270-1122',
    whatsapp: '593998123470',
    schedule: 'Lunes a Sábado 08:00 - 17:30',
    latitude: -2.3089,
    longitude: -78.1178,
    services: ['Baterías para transporte y todoterreno', 'Garantía oficial'],
    isAuthorized: true,
    rating: 4.7
  },

  // ZAMORA CHINCHIPE (ZAMORA)
  {
    id: 'maresa-zamora',
    name: 'Centro Autorizado Maresa Zamora - Zamora Chinchipe',
    province: 'Zamora Chinchipe',
    city: 'Zamora',
    address: 'Av. Héroes de Paquisha y Diego de Vaca',
    phone: '(07) 260-5544',
    whatsapp: '593998123471',
    schedule: 'Lunes a Sábado 08:00 - 17:00',
    latitude: -4.0689,
    longitude: -78.9567,
    services: ['Suministro para minería y flotas locales', 'Diagnóstico de batería'],
    isAuthorized: true,
    rating: 4.7
  },

  // GALÁPAGOS (SANTA CRUZ)
  {
    id: 'maresa-galapagos-santa-cruz',
    name: 'Centro Autorizado Maresa Galápagos - Santa Cruz',
    province: 'Galápagos',
    city: 'Puerto Ayora',
    address: 'Av. Baltra y Charles Darwin (Sector Terminal Marítimo)',
    phone: '(05) 252-6633',
    whatsapp: '593998123472',
    schedule: 'Lunes a Viernes 08:00 - 17:00 | Sábados 08:30 - 13:00',
    latitude: -0.7432,
    longitude: -90.3123,
    services: ['Baterías selladas ecológicas con certificación insular', 'Logística marítima'],
    isAuthorized: true,
    rating: 4.9
  }
];

export const initialB2BLeads: B2BLead[] = [
  {
    id: 'lead-001',
    companyName: 'Mecánica Automotriz Los Andes Cía. Ltda.',
    contactName: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@mecanicalosandes.ec',
    phone: '0994567890',
    province: 'Pichincha',
    city: 'Quito',
    businessType: 'Taller Mecánico',
    estimatedVolume: '30 - 50 baterías / mes',
    notes: 'Interesado en línea AGM y baterías para flotas de camionetas D-Max.',
    status: 'Pendiente',
    createdAt: '2026-09-15T14:30:00Z'
  },
  {
    id: 'lead-002',
    companyName: 'Repuestos & Servicios del Pacífico',
    contactName: 'Lcda. Mariana Solórzano',
    email: 'ventas@repuestospacifico.com',
    phone: '0987654321',
    province: 'Guayas',
    city: 'Guayaquil',
    businessType: 'Distribuidora de Repuestos',
    estimatedVolume: '80 - 120 baterías / mes',
    notes: 'Requiere línea de crédito comercial a 30 días y material publicitario para local en vía a Daule.',
    status: 'Contactado',
    createdAt: '2026-09-14T10:15:00Z'
  },
  {
    id: 'lead-003',
    companyName: 'Transportes Pesados TransAzuay',
    contactName: 'Sr. Rodrigo Vásquez',
    email: 'logistica@transazuay.ec',
    phone: '0978901234',
    province: 'Azuay',
    city: 'Cuenca',
    businessType: 'Flota de Transporte',
    estimatedVolume: '20 - 40 baterías / mes (Diésel HD)',
    notes: 'Consumo propio para flota de 28 cabezales Hino e International.',
    status: 'Aprobado',
    createdAt: '2026-09-12T16:45:00Z'
  }
];
