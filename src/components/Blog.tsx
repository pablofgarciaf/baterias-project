/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Blog.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Blog.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L026-L043  → Imports & dependencies
 *   L044-L054  → Type definitions / interfaces (BlogPost)
 *   L056-L188  → Constants / static data (blogPostsData)
 *   L190-L209  → Component function start & state declarations
 *   L211-L243  → Lifecycle hooks & effects (resize, sync, auto-play)
 *   L245-L275  → Event handlers (navigation & touch swipe gestures)
 *   L277-L488  → JSX render: header, category filter & article carousel
 *   L490-L574  → JSX render: article reader modal dialog (AnimatePresence)
 *   L575-L577  → Section close & component export end
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect, useRef, type TouchEvent } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  X, 
  CheckCircle2, 
  Share2, 
  Search,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export const blogPostsData: BlogPost[] = [
  {
    id: 'bateria-altitud-sierra-ecuador',
    title: 'Cómo elegir la batería correcta para el frío y altitud de la Sierra ecuatoriana',
    excerpt: 'La altitud de Quito (2.850 msnm), Cuenca y Riobamba reduce la densidad del aire y exige mayor amperaje de arranque en frío (CCA). Te explicamos qué buscar.',
    category: 'Altitud & Clima',
    date: '15 Sep 2026',
    readTime: '4 min de lectura',
    image: 'https://images.pexels.com/photos/3989166/pexels-photo-3989166.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Quito', 'Arranque en frío', 'CCA', 'Sierra'],
    content: `
En las ciudades andinas del Ecuador como Quito, Cuenca, Riobamba y Tulcán, las temperaturas nocturnas pueden descender a menos de 5°C. A esta temperatura, la reacción química dentro de la batería se ralentiza, disminuyendo su capacidad disponible hasta en un 30%, mientras que el aceite del motor se vuelve más denso y demanda un 40% más de energía para arrancar.

### 1. El factor clave: CCA (Cold Cranking Amps)
Al comprar una batería para la Sierra, no te fijes únicamente en los amperios-hora (Ah). El valor fundamental es el **CCA a -18°C**. En vehículos de motor 1.6L a 2.0L, recomendamos un mínimo de 550 a 650 CCA. En camionetas diésel (D-Max, Hilux), el estándar no debe ser menor a 750 u 850 CCA.

### 2. Tecnología Calcio-Plata
Las baterías con rejillas de aleación Calcio-Plata ofrecen una conductividad superior y eliminan prácticamente la evaporación de agua en climas andinos de presión atmosférica reducida.

### 3. Recomendación de Taller Maresa
Realiza una prueba de conductancia computarizada cada 6 meses en cualquiera de nuestros centros de servicio Maresa. Si la batería marca menos de 12.4V en reposo matutino, es momento de una recarga o reemplazo preventivo.
    `
  },
  {
    id: 'baterias-agm-efb-start-stop',
    title: 'Baterías AGM vs EFB: ¿Cuál necesita tu vehículo con sistema Start-Stop?',
    excerpt: 'Instalar una batería convencional en un auto con Start-Stop puede quemarla en menos de 6 meses. Descubre las diferencias tecnológicas y cuál te corresponde.',
    category: 'Tecnología',
    date: '10 Sep 2026',
    readTime: '5 min de lectura',
    image: 'https://images.pexels.com/photos/37177072/pexels-photo-37177072.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Start-Stop', 'AGM', 'EFB', 'Ahorro'],
    content: `
Los vehículos modernos equipados con sistemas automáticos de apagado y encendido de motor (Start-Stop) someten a la batería a cientos de ciclos de arranque diarios en el tráfico denso de Guayaquil o Quito.

### ¿Qué es una batería EFB?
EFB significa *Enhanced Flooded Battery* (Batería Inundada Mejorada). Incorpora una malla de fibra de poliéster sobre las placas de plomo positivas, lo que duplica la resistencia a ciclos profundos frente a una batería tradicional. Es ideal para autos medianos y pickups con Start-Stop básico.

### ¿Qué es una batería AGM?
AGM significa *Absorbent Glass Mat*. El electrolito no flota libremente; está 100% absorbido en esteras de microfibra de vidrio ultrafinas. Ofrece:
- Resistencia a ciclos 3 a 4 veces mayor.
- Aceptación de recarga ultra rápida proveniente del freno regenerativo.
- Nula posibilidad de derrames, incluso si la carcasa se fractura.

### Regla de Oro Maresa
**Nunca degradar la tecnología:** Si tu auto vino de fábrica con batería AGM, solo debes reemplazarla por otra AGM. Si vino con EFB, puedes poner EFB o mejorar a AGM, pero nunca una batería de plomo tradicional.
    `
  },
  {
    id: 'mantenimiento-costa-guayaquil-salitre',
    title: 'Protección contra calor extremo y salinidad en la Costa ecuatoriana',
    excerpt: 'Las altas temperaturas de Guayaquil, Manta y Machala aceleran la corrosión interna. Sigue estos tres consejos para duplicar su vida útil.',
    category: 'Mantenimiento',
    date: '05 Sep 2026',
    readTime: '3 min de lectura',
    image: 'https://images.pexels.com/photos/5562431/pexels-photo-5562431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Costa', 'Guayaquil', 'Salinidad', 'Calor'],
    content: `
Aunque comúnmente se cree que el frío daña las baterías, en realidad es el **calor extremo el que las destruye internamente**, y el frío simplemente revela el daño cuando el motor no puede arrancar.

Bajo el capó de un vehículo en Guayaquil al mediodía, las temperaturas pueden superar fácilmente los 80°C. Esto acelera la oxidación de las rejillas positivas y descompone el electrolito.

### Pasos de Mantenimiento Preventivo:
1. **Limpieza de Bornes:** La salinidad costera genera sulfatación blanquecina o verdosa en los bornes. Límpialos con agua tibia con bicarbonato y aplica grasa dieléctrica o vaselina neutra.
2. **Revisión del Protector Térmico:** Nunca deseches la funda o cubierta plástica térmica que rodea la batería en autos modernos; fue diseñada para aislar el calor del radiador.
3. **Chequeo del Alternador:** En zonas calurosas, si el regulador de voltaje envía más de 14.5V, hervirá el electrolito rápidamente.
    `
  },
  {
    id: 'flotas-pesadas-camiones-hino-chevrolet',
    title: 'Optimización energética para flotas de carga pesada e interprovinciales',
    excerpt: 'El tiempo detenido por batería descargada cuesta cientos de dólares por día en transporte. Cómo gestionar bancos de 24V en camiones Hino y cabezales.',
    category: 'Transporte Pesado',
    date: '28 Ago 2026',
    readTime: '6 min de lectura',
    image: 'https://images.pexels.com/photos/6940962/pexels-photo-6940962.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Flotas', 'Hino', 'Camiones', '24V'],
    content: `
Para empresas de transporte interprovincial que cruzan rutas exigentes como Quito - Guayaquil (vía Alóag o Santo Domingo), el sistema de doble batería en serie de 24V requiere un balanceo riguroso.

### Cuidado con el consumo parásito
Muchos transportistas conectan accesorios de 12V (radios, GPS, puertos USB) a una sola de las dos baterías de 12V en lugar de usar un convertidor reductor 24V a 12V. Esto desbalancea el banco, sobrecargando una batería y subcargando la otra, arruinando ambas en pocos meses.

### Programa Corporativo Maresa Flotas
En Corporación Maresa ofrecemos atención directa a flotas con precios mayoristas, entregas programadas en patio y diagnóstico de alternador en ruta nacional.
    `
  },
  {
    id: 'reciclaje-ecologico-bono-descuento',
    title: 'Economía circular: Cómo el bono de -$10 de Maresa protege el agua de Ecuador',
    excerpt: 'El plomo y el ácido sulfúrico son altamente tóxicos si terminan en quebradas o botaderos. Descubre qué pasa cuando entregas tu batería vieja en un punto oficial.',
    category: 'Sostenibilidad',
    date: '20 Ago 2026',
    readTime: '4 min de lectura',
    image: 'https://images.pexels.com/photos/35520664/pexels-photo-35520664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Reciclaje', 'Bono $10', 'Medio Ambiente'],
    content: `
En Ecuador se desechan anualmente más de 900.000 baterías automotrices. Cada batería contiene aproximadamente 10 kg de plomo y 3 litros de solución ácida.

### El proceso de reciclaje en plantas certificadas:
1. **Separación de polipropileno:** Las carcasas plásticas se trituran, lavan y funden para crear nuevas carcasas de baterías o piezas plásticas automotrices.
2. **Neutralización del ácido:** El electrolito se neutraliza químicamente o se convierte en sulfato de sodio para la industria de detergentes.
3. **Fundición y purificación del plomo:** El plomo se funde en hornos a 400°C y se refina hasta un 99.9% de pureza, reingresando a la cadena productiva.

Al entregar tu batería en cualquier agencia Maresa autorizada, no solo recibes **$10 de descuento inmediato** en tu nueva batería, sino que recibes un comprobante de disposición ambientalmente responsable.
    `
  },
  {
    id: 'diagnostico-bateria-o-alternador',
    title: '¿Se dañó la batería o es el alternador? Guía para diagnosticarlo tú mismo',
    excerpt: 'Si tu auto no enciende, no cambies la batería a ciegas. Aprende los síntomas específicos para saber si el culpable es el sistema de carga.',
    category: 'Mantenimiento',
    date: '12 Ago 2026',
    readTime: '3 min de lectura',
    image: 'https://images.pexels.com/photos/3817825/pexels-photo-3817825.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Alternador', 'Diagnóstico', 'Voltímetro'],
    content: `
Uno de los errores más comunes y costosos es comprar una batería nueva cuando el problema real es un alternador averiado que dejó de cargar, o viceversa.

### Síntomas de que el problema es la BATERÍA:
- El motor de arranque gira lento y con dificultad por las mañanas (*"ñe-ñe-ñe"* perezoso).
- Al pasar corriente con cables desde otro auto, el motor enciende inmediatamente y se mantiene encendido sin apagarse.
- La batería tiene más de 2.5 a 3 años de uso continuo.

### Síntomas de que el problema es el ALTERNADOR:
- Se encendió el testigo rojo con forma de batería en el tablero mientras ibas conduciendo.
- Las luces delanteras y el tablero parpadean o bajan de intensidad al acelerar.
- El auto arrancó con cables, pero al desconectarlos se apaga en pocos segundos.

Recuerda: en cualquier centro de servicio de Corporación Maresa te realizamos la prueba eléctrica con escáner de carga **totalmente gratis**.
    `
  }
];

export default function Blog() {
  const { content } = useSiteContent();
  const blog = content.blog;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [itemsPerView, setItemsPerView] = useState<number>(3);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const categories = ['Todas', 'Altitud & Clima', 'Tecnología', 'Mantenimiento', 'Transporte Pesado', 'Sostenibilidad'];

  const filteredPosts = blogPostsData.filter(post => 
    activeCategory === 'Todas' ? true : post.category === activeCategory
  );

  // Responsive items per view listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory, itemsPerView]);

  const maxIndex = Math.max(0, filteredPosts.length - itemsPerView);

  // Auto-play infinite carousel (every 5 seconds when not hovered)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    const track = document.getElementById('blog-carousel-track');
    if (track) {
      track.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    const track = document.getElementById('blog-carousel-track');
    if (track) {
      track.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  // Touch gesture handlers
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      id="blog" 
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-slate-900 text-white border-slate-800' 
          : 'bg-white text-slate-900 border-slate-200'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {blog.badge}
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              {blog.title}
            </h2>
            <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {blog.subtitle}
            </p>
          </div>


        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : isDark 
                      ? 'text-slate-400 hover:text-white bg-slate-800/60 border border-slate-700' 
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 shadow-sm'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-blog-cat"
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/25"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Controls (below tabs, aligned right) */}
        <div className="flex md:hidden items-center justify-end gap-3 mb-6">
            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
              isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}>
              {String(currentIndex + 1).padStart(2, '0')} / {String(maxIndex + 1).padStart(2, '0')}
            </span>
            <button onClick={handlePrev} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer border ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-sm'}`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNext} className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-600/30">
              <ChevronRight className="w-5 h-5" />
            </button>
        </div>

        {/* Fluid Responsive Carousel Track with Touch Swipe */}
        <div className="relative group">
          {/* Desktop Controls (flanking) */}
          <button onClick={handlePrev} className={`hidden md:flex absolute -left-5 lg:-left-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center transition-all active:scale-95 cursor-pointer border shadow-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'}`}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={handleNext} className="hidden md:flex absolute -right-5 lg:-right-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xl shadow-blue-600/30">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none -mx-4 px-4 sm:mx-0 sm:px-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="px-3 shrink-0"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div 
                  className={`h-full flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 ${
                    isDark 
                      ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 shadow-xl' 
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl text-slate-900'
                  }`}
                >
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-800">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur shadow-md">
                      {post.category}
                    </span>

                    <span className="absolute bottom-3 right-3 text-white text-xs font-semibold flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className={`flex items-center gap-2 text-xs mb-2 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{post.date}</span>
                      </div>

                      <h3 className={`text-base sm:text-lg font-extrabold leading-snug line-clamp-2 ${
                        isDark ? 'text-white' : 'text-slate-950'
                      }`}>
                        {post.title}
                      </h3>

                      <p className={`mt-2 text-xs sm:text-sm line-clamp-3 leading-relaxed ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {post.excerpt}
                      </p>
                    </div>

                    <div className={`mt-5 pt-4 border-t flex items-center justify-between ${
                      isDark ? 'border-slate-800' : 'border-slate-100'
                    }`}>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span 
                            key={tag} 
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedArticle(post)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        <span>Leer Guía</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir a artículo ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-7 bg-blue-600'
                  : isDark ? 'w-2 bg-slate-800 hover:bg-slate-700' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

      </div>

      {/* Reader Modal Dialog with Motion */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-8 ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Cover Image & Close */}
              <div className="relative h-60 sm:h-72 overflow-hidden bg-slate-800">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cerrar artículo"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-[11px] font-bold uppercase tracking-wider">
                      {selectedArticle.category}
                    </span>
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedArticle.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold leading-snug">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {selectedArticle.content}
                </div>

                <div className={`mt-6 pt-5 border-t flex flex-wrap items-center justify-between gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                          isDark ? 'bg-slate-800 text-blue-300' : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`https://wa.me/593998123456?text=Hola%20Maresa,%20le%C3%AD%20el%20art%C3%ADculo%20"${encodeURIComponent(selectedArticle.title)}"%20y%20deseo%20asesor%C3%ADa.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30"
                  >
                    <span>Consultar a un Experto</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
