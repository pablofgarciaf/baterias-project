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

export const vehicleYears = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010, 2008];

export const vehicleCatalog: VehicleBatteryMatch[] = [
  // CHEVROLET (Líder en ventas Ecuador)
  {
    id: 'chev-dmax-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'D-Max 2.5/3.0 CRDI',
    engine: 'Diésel Turbo',
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
    model: 'D-Max 2.5/3.0 CRDI',
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
    id: 'chev-sail-2023',
    year: 2023,
    brand: 'Chevrolet',
    model: 'Sail 1.5',
    engine: 'Gasolina',
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
    id: 'chev-tracker-2024',
    year: 2024,
    brand: 'Chevrolet',
    model: 'Tracker Turbo 1.2',
    engine: 'Turbo Gasolina con Start-Stop',
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
    id: 'chev-aveo-2020',
    year: 2020,
    brand: 'Chevrolet',
    model: 'Aveo Family / Emotion 1.5',
    engine: 'Gasolina 1.5L',
    recommendedBattery: {
      model: 'Andina Gold 24-600',
      bciGroup: '24',
      cca: 580,
      ah: 55,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 82.00,
      features: ['Excelente rendimiento precio-durabilidad', 'Ideal para recorridos diarios y taxis']
    }
  },

  // TOYOTA
  {
    id: 'toyota-hilux-2024',
    year: 2024,
    brand: 'Toyota',
    model: 'Hilux 2.4/2.8 D-4D',
    engine: 'Diésel Intercooler',
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
    id: 'toyota-fortuner-2023',
    year: 2023,
    brand: 'Toyota',
    model: 'Fortuner 2.7 / 4.0 V6',
    engine: 'Gasolina VVT-i',
    recommendedBattery: {
      model: 'Andina Gold 27-720',
      bciGroup: '27',
      cca: 720,
      ah: 75,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 135.00,
      features: ['Reserva de energía para accesorios 4x4']
    }
  },
  {
    id: 'toyota-corolla-2024',
    year: 2024,
    brand: 'Toyota',
    model: 'Corolla 1.8 / 2.0 / Hybrid',
    engine: 'Gasolina / Híbrido Auxiliar',
    recommendedBattery: {
      model: 'Andina AGM Auxiliary LN1',
      bciGroup: 'LN1',
      cca: 540,
      ah: 50,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 36,
      priceEcuador: 140.00,
      features: ['Batería auxiliar de 12V para encendido de sistemas híbridos']
    }
  },

  // KIA
  {
    id: 'kia-sportage-2024',
    year: 2024,
    brand: 'Kia',
    model: 'Sportage R / GT Line 2.0',
    engine: 'Gasolina MPI',
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
    id: 'kia-soluto-2023',
    year: 2023,
    brand: 'Kia',
    model: 'Soluto 1.4',
    engine: 'Gasolina',
    recommendedBattery: {
      model: 'Andina Power 42-500',
      bciGroup: '42',
      cca: 500,
      ah: 45,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 18,
      priceEcuador: 78.50,
      features: ['Economía y rendimiento probado para flotas']
    }
  },

  // HYUNDAI
  {
    id: 'hyundai-tucson-2024',
    year: 2024,
    brand: 'Hyundai',
    model: 'Tucson NX4 2.0 / Turbo',
    engine: 'Gasolina',
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

  // MAZDA (Representada históricamente por Maresa)
  {
    id: 'mazda-cx5-2024',
    year: 2024,
    brand: 'Mazda',
    model: 'CX-5 SkyActiv 2.0/2.5 i-Stop',
    engine: 'Gasolina SkyActiv-G',
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
    id: 'mazda-bt50-2023',
    year: 2023,
    brand: 'Mazda',
    model: 'BT-50 3.0 CRDI 4x4',
    engine: 'Turbo Diésel',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Especificación oficial para camionetas de trabajo pesado']
    }
  },

  // CHERY / DONGFENG (Marcas representadas en Ecuador por Corporación Maresa)
  {
    id: 'chery-tiggo7-2024',
    year: 2024,
    brand: 'Chery',
    model: 'Tiggo 7 Pro / Tiggo 8 Pro',
    engine: '1.5/1.6 Turbo',
    recommendedBattery: {
      model: 'Andina AGM Start-Stop H6 (LN3)',
      bciGroup: 'H6 / LN3',
      cca: 720,
      ah: 70,
      voltage: 12,
      technology: 'AGM',
      warrantyMonths: 30,
      priceEcuador: 180.00,
      features: ['Suministro continuo a pantallas y asistencias ADAS']
    }
  },
  {
    id: 'dongfeng-rich6-2024',
    year: 2024,
    brand: 'Dongfeng',
    model: 'Rich 6 2.4/2.5 Diésel 4x4',
    engine: 'Turbo Diésel',
    recommendedBattery: {
      model: 'Andina Pro HD-27F Max',
      bciGroup: '27F',
      cca: 750,
      ah: 80,
      voltage: 12,
      technology: 'EFB',
      warrantyMonths: 24,
      priceEcuador: 145.00,
      features: ['Batería con fijación para chasis de camioneta pickup']
    }
  },

  // HINO (Transporte Pesado)
  {
    id: 'hino-gd-2024',
    year: 2024,
    brand: 'Hino',
    model: 'Serie 500 GD / GH',
    engine: 'Diésel 7.6L Turbo',
    recommendedBattery: {
      model: 'Andina Truck Titan 4D-1000 (Juego 2x12V = 24V)',
      bciGroup: '4D',
      cca: 1050,
      ah: 150,
      voltage: 12,
      technology: 'Plomo-Ácido',
      warrantyMonths: 24,
      priceEcuador: 215.00,
      features: ['Máxima potencia de arranque para transporte interprovincial', 'Placas reforzadas de plomo puro con antimonio']
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
