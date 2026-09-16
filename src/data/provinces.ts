export type Region = 'Sierra' | 'Costa' | 'Oriente' | 'Insular';

export interface Province {
  id: number;
  name: string;
  capital: string;
  region: Region;
  population: number;
  area: number;
}

export const provinces: Province[] = [
  { id: 1, name: 'Azuay', capital: 'Cuenca', region: 'Sierra', population: 801609, area: 8189 },
  { id: 2, name: 'Bolívar', capital: 'Guaranda', region: 'Sierra', population: 199078, area: 4148 },
  { id: 3, name: 'Cañar', capital: 'Azogues', region: 'Sierra', population: 227578, area: 3669 },
  { id: 4, name: 'Carchi', capital: 'Tulcán', region: 'Sierra', population: 172828, area: 3790 },
  { id: 5, name: 'Chimborazo', capital: 'Riobamba', region: 'Sierra', population: 471933, area: 5999 },
  { id: 6, name: 'Cotopaxi', capital: 'Latacunga', region: 'Sierra', population: 470210, area: 6085 },
  { id: 7, name: 'El Oro', capital: 'Machala', region: 'Costa', population: 714592, area: 5879 },
  { id: 8, name: 'Esmeraldas', capital: 'Esmeraldas', region: 'Costa', population: 591891, area: 15742 },
  { id: 9, name: 'Galápagos', capital: 'Puerto Baquerizo Moreno', region: 'Insular', population: 28583, area: 8010 },
  { id: 10, name: 'Guayas', capital: 'Guayaquil', region: 'Costa', population: 4391923, area: 16742 },
  { id: 11, name: 'Imbabura', capital: 'Ibarra', region: 'Sierra', population: 476257, area: 4559 },
  { id: 12, name: 'Loja', capital: 'Loja', region: 'Sierra', population: 521864, area: 11027 },
  { id: 13, name: 'Los Ríos', capital: 'Babahoyo', region: 'Costa', population: 918004, area: 7175 },
  { id: 14, name: 'Manabí', capital: 'Portoviejo', region: 'Costa', population: 1559015, area: 18879 },
  { id: 15, name: 'Morona Santiago', capital: 'Macas', region: 'Oriente', population: 196535, area: 25690 },
  { id: 16, name: 'Napo', capital: 'Tena', region: 'Oriente', population: 131675, area: 12476 },
  { id: 17, name: 'Orellana', capital: 'Puerto Francisco de Orellana', region: 'Oriente', population: 182166, area: 21691 },
  { id: 18, name: 'Pastaza', capital: 'Puyo', region: 'Oriente', population: 111915, area: 29068 },
  { id: 19, name: 'Pichincha', capital: 'Quito', region: 'Sierra', population: 3089473, area: 9692 },
  { id: 20, name: 'Santa Elena', capital: 'Santa Elena', region: 'Costa', population: 385735, area: 3696 },
  { id: 21, name: 'Santo Domingo de los Tsáchilas', capital: 'Santo Domingo', region: 'Costa', population: 492969, area: 4180 },
  { id: 22, name: 'Sucumbíos', capital: 'Nueva Loja', region: 'Oriente', population: 199014, area: 18612 },
  { id: 23, name: 'Tungurahua', capital: 'Ambato', region: 'Sierra', population: 563532, area: 3222 },
  { id: 24, name: 'Zamora Chinchipe', capital: 'Zamora', region: 'Oriente', population: 110546, area: 10556 },
];

export const regionColors: Record<Region, string> = {
  Sierra: 'bg-primary-100 text-primary-800 border-primary-200',
  Costa: 'bg-accent-100 text-accent-800 border-accent-200',
  Oriente: 'bg-secondary-100 text-secondary-800 border-secondary-200',
  Insular: 'bg-error-100 text-error-800 border-error-200',
};

export const regionDescriptions: Record<Region, string> = {
  Sierra: 'Región Interandina — baterías para clima frío y gran altitud',
  Costa: 'Región Litoral — baterías resistentes a calor y humedad',
  Oriente: 'Región Amazónica — baterías para terrenos difíciles y off-road',
  Insular: 'Región Insular — baterías para vehículos marinos y turísticos',
};
