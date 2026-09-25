"use client";

import { useTheme } from "@/context/ThemeContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { motion } from "motion/react";
import {
  Battery,
  Target,
  Eye,
  Users,
  Award,
  ShieldCheck,
  MapPin,
  Factory,
  Leaf,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { value: "45+", label: "Años de experiencia", icon: Award },
  { value: "24", label: "Provincias cubiertas", icon: MapPin },
  { value: "150+", label: "Distribuidores activos", icon: Users },
  { value: "500K+", label: "Baterías vendidas", icon: Battery },
];

const timeline = [
  {
    year: "1979",
    title: "Fundación",
    desc: "Nace Corporación Maresa como importadora y distribuidora automotriz en Ecuador.",
  },
  {
    year: "1995",
    title: "Expansión Nacional",
    desc: "Cobertura en las 24 provincias con red propia de distribución.",
  },
  {
    year: "2008",
    title: "Laboratorio ISO 9001",
    desc: "Inauguración del laboratorio de control de calidad certificado internacionalmente.",
  },
  {
    year: "2018",
    title: "Tecnología AGM & EFB",
    desc: "Incorporación de baterías de alta tecnología para vehículos Start-Stop.",
  },
  {
    year: "2024",
    title: "Transformación Digital",
    desc: "Plataforma digital con buscador inteligente y CRM cloud para distribuidores.",
  },
];

const values = [
  {
    icon: Target,
    title: "Misión",
    text: "Proveer soluciones energéticas confiables y accesibles para cada vehículo en Ecuador, con tecnología adaptada a la exigente geografía andina.",
  },
  {
    icon: Eye,
    title: "Visión",
    text: "Ser la marca de baterías más reconocida y confiable de Latinoamérica, liderando innovación en almacenamiento energético vehicular.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad",
    text: "Cada batería pasa por rigurosos controles en nuestro laboratorio ISO 9001, garantizando rendimiento desde el nivel del mar hasta los 4,500 msnm.",
  },
  {
    icon: Leaf,
    title: "Sostenibilidad",
    text: "Programa Canje Verde: reciclamos el 95% de componentes. Compromiso real con la economía circular y el medio ambiente ecuatoriano.",
  },
];

const differentials = [
  { icon: Factory, text: "Laboratorio propio ISO 9001" },
  { icon: Globe, text: "Red en 24 provincias" },
  { icon: Zap, text: "Tecnología Calcio, EFB y AGM" },
  { icon: TrendingUp, text: "Garantía hasta 36 meses" },
];

export default function NosotrosClient() {
  const { theme } = useTheme();
  const { content } = useSiteContent();
  const isDark = theme === "dark";
  const about = content.about;

  return (
    <>
      {/* Hero 100vh con imagen de fondo y stats */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden -mt-14 lg:-mt-16">
        <picture className="absolute inset-0 z-0">
          <source
            media="(max-width: 767px)"
            srcSet="/quienes-somos-hero-movile.webp"
            type="image/webp"
          />
          <source
            media="(min-width: 768px)"
            srcSet="/quienes-somos-hero-desktop.webp"
            type="image/webp"
          />
          <img
            src="/quienes-somos-hero-desktop.webp"
            alt="Corporación Maresa — Quiénes Somos"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="container-max relative z-10 pb-10 sm:pb-14 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border bg-amber-500/20 border-amber-400/30 text-amber-300">
              <Award className="w-3.5 h-3.5" />
              {about.badge}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
              {about.title}
            </h1>

            <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl text-white/70">
              {about.paragraph1}
            </p>
          </motion.div>

          {/* Stats dentro del hero */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary-300" />
                <div className="text-3xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="text-xs font-medium mt-1 text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section
        className={`py-20 sm:py-28 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="container-max">
          <div className="mb-12 text-center">
            <span
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] mb-4 ${isDark ? "text-primary-400" : "text-primary-600"}`}
            >
              <span className="w-6 h-px bg-current" />
              Nuestros Pilares
              <span className="w-6 h-px bg-current" />
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}
            >
              Lo que nos impulsa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              {/* Background ambient glow behind the grid */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
              
              {values.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`group relative p-8 sm:p-10 rounded-[32px] border backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 ${
                    isDark
                      ? "bg-slate-900/40 border-white/10 hover:bg-slate-800/60 hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] hover:border-white/20"
                      : "bg-white/60 border-white/80 hover:bg-white/90 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:border-white"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner ${
                      isDark 
                        ? "bg-slate-800/80 border border-white/10 text-primary-400 shadow-black/50" 
                        : "bg-gradient-to-br from-white to-primary-50 border border-primary-100 text-primary-600 shadow-primary-500/10"
                    }`}>
                      <item.icon className="w-6 h-6 drop-shadow-sm" />
                    </div>
                    
                    <h3 className={`text-xl font-extrabold mb-3 tracking-tight transition-colors duration-300 ${
                      isDark ? "text-white group-hover:text-primary-300" : "text-slate-950 group-hover:text-primary-700"
                    }`}>
                      {item.title}
                    </h3>
                    
                    <p className={`text-[15px] leading-relaxed transition-colors duration-300 ${
                      isDark ? "text-slate-400 group-hover:text-slate-300" : "text-slate-600 group-hover:text-slate-700"
                    }`}>
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

      {/* Timeline */}
      <section
        className={`py-20 sm:py-28 ${isDark ? "bg-slate-950" : "bg-white"}`}
      >
        <div className="container-max">
          <div className="mb-12">
            <span
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] mb-4 ${isDark ? "text-primary-400" : "text-primary-600"}`}
            >
              <span className="w-6 h-px bg-current" />
              Nuestra Trayectoria
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}
            >
              Hitos que nos definen
            </h2>
          </div>

          <div className="relative">
            <div
              className={`absolute left-4 sm:left-1/2 top-0 bottom-0 w-px ${isDark ? "bg-slate-800" : "bg-slate-200"}`}
            />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex items-start gap-6 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                >
                  <div
                    className={`sm:w-1/2 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}
                  >
                    <span
                      className={`text-sm font-extrabold ${isDark ? "text-primary-400" : "text-primary-600"}`}
                    >
                      {item.year}
                    </span>
                    <h3
                      className={`text-lg font-bold mt-1 ${isDark ? "text-white" : "text-slate-950"}`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <div
                    className={`absolute left-4 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 ${
                      isDark
                        ? "bg-primary-500 border-slate-950"
                        : "bg-primary-600 border-white"
                    }`}
                  />
                  <div className="hidden sm:block sm:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Text & Differentials */}
      <section
        className={`py-16 sm:py-24 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <p
              className={`text-lg sm:text-xl leading-relaxed mb-10 ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              {about.paragraph2}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {differentials.map((d, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border ${
                    isDark
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <d.icon
                    className={`w-8 h-8 ${isDark ? "text-primary-400" : "text-primary-600"}`}
                  />
                  <span
                    className={`text-sm font-semibold text-center leading-tight ${isDark ? "text-slate-200" : "text-slate-700"}`}
                  >
                    {d.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
