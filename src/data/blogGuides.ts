import type { BlogPost } from '@/components/Blog';

// Educational drafts. Review technical wording and add named reviewers before publication.
export const blogPostsData: BlogPost[] = [
  {
    id: 'elegir-bateria-vehiculo',
    title: 'Cómo elegir una batería para tu vehículo',
    excerpt: 'Una lista sencilla de datos que conviene comprobar antes de reemplazar la batería.',
    category: 'Mantenimiento', date: 'Guía de referencia', readTime: '3 min',
    image: 'https://images.pexels.com/photos/3989166/pexels-photo-3989166.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Compatibilidad', 'Manual del vehículo'],
    content: 'Antes de comprar, revisa el manual del vehículo o la etiqueta de la batería instalada. Comprueba dimensiones, sujeción, posición de bornes, capacidad y corriente de arranque. La referencia del buscador de esta web es orientativa hasta que se valide el catálogo oficial. Si el vehículo utiliza Start-Stop, confirma la tecnología exigida por el fabricante. En caso de duda, pide una comprobación profesional del sistema de carga.',
  },
  {
    id: 'agm-efb-start-stop',
    title: 'AGM, EFB y Start-Stop: qué comprobar',
    excerpt: 'Las tecnologías de batería no siempre son intercambiables. Revisa el requisito del fabricante.',
    category: 'Tecnología', date: 'Guía de referencia', readTime: '3 min',
    image: 'https://images.pexels.com/photos/37177072/pexels-photo-37177072.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['AGM', 'EFB', 'Start-Stop'],
    content: 'AGM y EFB son tecnologías usadas en distintos sistemas de arranque y gestión energética. La elección depende del vehículo y de sus especificaciones. Comprueba la tecnología de la batería original y el procedimiento de reemplazo en el manual. Algunos vehículos requieren registrar la batería nueva en el sistema electrónico. Un taller puede verificar la compatibilidad y realizar ese procedimiento cuando corresponda.',
  },
  {
    id: 'clima-y-bateria',
    title: 'Clima y batería: señales que conviene observar',
    excerpt: 'Temperatura, corrosión y trayectos cortos pueden influir en el rendimiento.',
    category: 'Altitud & Clima', date: 'Guía de referencia', readTime: '3 min',
    image: 'https://images.pexels.com/photos/5562431/pexels-photo-5562431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Clima', 'Mantenimiento'],
    content: 'Si el arranque se vuelve lento, se enciende el testigo de batería o aparecen depósitos en los bornes, conviene revisar el vehículo. La temperatura puede influir en el rendimiento, pero por sí sola no determina una referencia universal de batería. Evita comprar basándote solo en el clima: verifica las especificaciones del fabricante y solicita una prueba de batería y alternador.',
  },
  {
    id: 'flotas-mantenimiento',
    title: 'Baterías en flotas: una rutina de revisión',
    excerpt: 'Registra fallos de arranque y revisa el sistema eléctrico para planificar el mantenimiento.',
    category: 'Transporte Pesado', date: 'Guía de referencia', readTime: '3 min',
    image: 'https://images.pexels.com/photos/6940962/pexels-photo-6940962.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Flotas', 'Mantenimiento'],
    content: 'Para una flota, conviene documentar edad de las baterías, resultados de pruebas y fallos de arranque. Un técnico debe comprobar conexiones, sistema de carga y posibles consumos anómalos. Si el vehículo usa varias baterías, respeta la configuración del fabricante. Las condiciones de servicio para flotas de Baterías Maresa están pendientes de confirmación.',
  },
  {
    id: 'entrega-bateria-usada',
    title: 'Qué hacer con una batería usada',
    excerpt: 'La entrega a un gestor autorizado evita que el residuo termine en la basura común.',
    category: 'Sostenibilidad', date: 'Guía de referencia', readTime: '2 min',
    image: 'https://images.pexels.com/photos/35520664/pexels-photo-35520664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Reciclaje', 'Seguridad'],
    content: 'No abras ni abandones una batería usada. Consulta un punto de recepción o un gestor ambiental autorizado y transpórtala de forma segura, evitando golpes y derrames. Los puntos asociados a esta web y cualquier incentivo comercial se publicarán solo cuando la empresa confirme sus condiciones.',
  },
  {
    id: 'bateria-o-alternador',
    title: '¿Falla la batería o el sistema de carga?',
    excerpt: 'Los síntomas pueden parecer iguales; una prueba evita reemplazos innecesarios.',
    category: 'Mantenimiento', date: 'Guía de referencia', readTime: '3 min',
    image: 'https://images.pexels.com/photos/3817825/pexels-photo-3817825.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Diagnóstico', 'Alternador'],
    content: 'Un arranque lento puede deberse a una batería descargada, conexiones deficientes u otros problemas. Un testigo de carga encendido también requiere revisión. Evita diagnosticar solo por un síntoma. Un profesional puede medir el estado de la batería y del sistema de carga para decidir si corresponde recargar, reparar o reemplazar.',
  },
];
