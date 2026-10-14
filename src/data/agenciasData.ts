// estado: ""
import { DistributorLocation } from '@/types/sinergia';

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
