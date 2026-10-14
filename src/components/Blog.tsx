// estado: ""
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

import { useState, useEffect, useRef } from 'react';
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
import { blogPostsData } from '@/data/blogGuides';
export { blogPostsData };

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

export default function Blog({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? 'h1' : 'h2';
  const { content } = useSiteContent();
  const blog = content.blog;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsPerView, setItemsPerView] = useState<number>(2);

  const trackRef = useRef<HTMLDivElement>(null);

  const categories = ['Todas', 'Altitud & Clima', 'Tecnología', 'Mantenimiento', 'Transporte Pesado', 'Sostenibilidad'];

  const filteredPosts = blogPostsData.filter(post => 
    activeCategory === 'Todas' ? true : post.category === activeCategory
  );

  // Responsive items per view listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else {
        setItemsPerView(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [activeCategory, itemsPerView]);

  const maxIndex = Math.max(0, filteredPosts.length - itemsPerView);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const target = (index + maxIndex + 1) % (maxIndex + 1);
    const card = track?.querySelector<HTMLElement>('[data-blog-card]');
    if (track && card) track.scrollTo({ left: target * (card.offsetWidth + 24), behavior: 'smooth' });
    setCurrentIndex(target);
  };

  const handlePrev = () => goTo(currentIndex - 1);
  const handleNext = () => goTo(currentIndex + 1);

  const handleScroll = () => {
    const track = trackRef.current;
    const first = track?.querySelector<HTMLElement>('[data-blog-card]');
    if (track && first) setCurrentIndex(Math.min(maxIndex, Math.round(track.scrollLeft / (first.offsetWidth + 24))));
  };

  return (
    <section 
      id="blog" 
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-slate-900 text-white border-slate-800' 
          : 'bg-white text-slate-900 border-slate-200'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-success-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/15 border border-primary-400/30 text-primary-600 dark:text-primary-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              {blog.badge}
            </div>
            <Heading className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              {blog.title}
            </Heading>
            <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {blog.subtitle}
            </p>
          </div>


        </div>

        {/* Category Filter — Dropdown on mobile, pills on desktop */}
        <div className="mb-8">
          <select
            aria-label="Filtrar guías por categoría"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className={`sm:hidden w-full py-3 px-4 rounded-xl border text-sm font-bold outline-none transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500'
                : 'bg-white border-slate-200 text-slate-900 focus:border-primary-500 shadow-sm'
            }`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
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
                      className="absolute inset-0 bg-secondary-500 rounded-xl shadow-md shadow-secondary-500/25"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button type="button" onClick={handlePrev} disabled={maxIndex === 0} aria-label="Artículo anterior" className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors disabled:opacity-40 ${isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-300 hover:border-secondary-500'}`}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div 
            ref={trackRef}
            id="blog-carousel-track"
            onScroll={handleScroll}
            aria-label="Guías técnicas; desliza para explorar"
            className="flex min-w-0 max-w-[700px] flex-1 gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth pb-6 pt-3 scrollbar-hide"
          >
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                data-blog-card
                className="w-[88%] shrink-0 snap-start sm:w-[calc(50%-12px)]"
              >
                <div 
                  className={`h-full flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                    isDark 
                      ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 shadow-xl' 
                      : 'bg-white border-slate-200 hover:border-primary-300 shadow-sm hover:shadow-xl text-slate-900'
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
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-500 text-primary-950 text-[11px] font-bold uppercase tracking-wider shadow-md">
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
                        <Calendar className="w-3.5 h-3.5 text-primary-500" />
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
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors cursor-pointer"
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
          <button type="button" onClick={handleNext} disabled={maxIndex === 0} aria-label="Artículo siguiente" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary-500 text-primary-950 transition-colors hover:bg-secondary-400 disabled:opacity-40">
            <ChevronRight className="w-6 h-6" />
          </button>
      </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Ir a artículo ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-7 bg-secondary-500'
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
                    <span className="px-2.5 py-1 rounded-full bg-primary-600 text-[11px] font-bold uppercase tracking-wider">
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
                          isDark ? 'bg-slate-800 text-primary-300' : 'bg-primary-50 text-primary-700'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {process.env.NEXT_PUBLIC_CONTACT_WHATSAPP && <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, leí el artículo "${selectedArticle.title}" y deseo asesoría.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-primary-600/30"
                  >
                    <span>Consultar a un Experto</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
