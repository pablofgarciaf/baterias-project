import { Recycle, Leaf, ArrowRight, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';

export default function Recycling() {
  const { content } = useSiteContent();
  const { theme } = useTheme();
  const rec = content.recycling;
  const isDark = theme === 'dark';

  const metrics = [
    { value: rec.metricValue, label: rec.metricLabel, color: 'text-emerald-500' },
    { value: '99%', label: 'De los componentes de la batería son reciclados bajo norma ambiental', color: 'text-blue-500' },
    { value: '50+ Tons', label: 'Plomo y plástico reciclados responsablemente cada mes en Ecuador', color: 'text-amber-500' },
    { value: '24 / 24', label: 'Provincias con centros de recepción y canje de baterías usadas', color: 'text-emerald-600 dark:text-emerald-400' }
  ];

  return (
    <section 
      id="reciclaje" 
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-slate-950 text-white border-slate-800' 
          : 'bg-emerald-50/40 text-slate-900 border-slate-200'
      }`}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={rec.backgroundImage}
          alt="Reciclaje ecológico de baterías en Ecuador"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isDark ? 'opacity-15' : 'opacity-10'
          }`}
        />
        <div 
          className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/80' 
              : 'bg-gradient-to-r from-white via-white/95 to-emerald-50/90'
          }`} 
        />
      </div>

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Editorial */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
              <Recycle className="w-4 h-4 text-emerald-500 animate-spin" />
              {rec.badge}
            </span>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              {rec.titleLine1}
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {rec.titleLine2}
              </span>
            </h2>

            <p className={`mt-5 text-base sm:text-lg leading-relaxed max-w-xl ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {rec.subtitle}
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                { icon: Leaf, text: rec.point1Text },
                { icon: MapPin, text: rec.point2Text },
                { icon: Recycle, text: rec.point3Text },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a 
                href="#puntos-de-venta" 
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>{rec.ctaButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right Metrics Bento Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {metrics.map((metric, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                  i % 2 === 1 ? 'sm:mt-6' : ''
                } ${
                  isDark 
                    ? 'bg-slate-900/80 border-slate-800 text-white shadow-xl shadow-slate-950/50' 
                    : 'bg-white border-slate-200/90 text-slate-900 shadow-md shadow-slate-900/5'
                }`}
              >
                <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${metric.color}`}>
                  {metric.value}
                </div>
                <p className={`text-xs sm:text-sm mt-2 font-medium leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {metric.label}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
