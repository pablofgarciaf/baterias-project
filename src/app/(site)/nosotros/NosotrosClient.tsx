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
      {/* Hero - Split on mobile, full on desktop */}
      <section className="relative flex flex-col lg:h-screen lg:min-h-[600px] lg:flex-row lg:items-end overflow-hidden -mt-14 lg:-mt-16 bg-slate-950">
        
        {/* Mobile Text (Top) */}
        <div className="lg:hidden container-max pt-32 pb-8 z-10 w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border bg-amber-500/20 border-amber-400/30 text-amber-300">
              <Award className="w-3 h-3" />
              {about.badge}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white mb-4">
              {about.title}
            </h1>
            <p className="text-sm leading-relaxed text-white/70">
              {about.paragraph1}
            </p>
          </motion.div>
        </div>

        {/* Image */}
        <div className="relative w-full h-[300px] lg:absolute lg:inset-0 lg:h-full lg:z-0">
          <picture className="absolute inset-0">
            <source media="(max-width: 767px)" srcSet="/quienes-somos-section-landing.webp" type="image/webp" />
            <source media="(min-width: 768px)" srcSet="/quienes-somos-hero-desktop.webp" type="image/webp" />
            <img
              src="/quienes-somos-hero-desktop.webp"
              alt="Corporación Maresa – Quiénes Somos"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent lg:from-black/80 lg:via-black/30 lg:to-black/10" />
        </div>

        {/* Desktop Text (Bottom overlay) */}
        <div className="hidden lg:block container-max relative z-10 pb-14 w-full">
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
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
              {about.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed max-w-2xl text-white/70">
              {about.paragraph1}
            </p>
          </motion.div>
        </div>
        
        {/* Stats */}
        <div className="container-max relative z-10 lg:absolute lg:bottom-14 lg:right-0 w-full lg:w-auto pb-10 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 lg:flex gap-3"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center lg:w-32"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] font-medium mt-1 text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Grid - Clean Flat Design */}
      <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/50">
        <div className="container-max">
          <div className="mb-16 text-center">
            <span className="inline-flex items-center justify-center px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-full">
              Nuestro Propósito
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Lo que nos impulsa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
              {values.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative bg-white dark:bg-slate-800 rounded-[20px] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="p-10 flex-1 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6">
                      <item.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 uppercase">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                      {item.text}
                    </p>
                  </div>
                  {/* Bottom Ribbon */}
                  <div className={`h-3 w-full ${i % 2 === 0 ? 'bg-amber-500' : 'bg-primary-600'}`} />
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
