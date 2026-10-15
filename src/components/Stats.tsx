'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { Battery, MapPin, Recycle, Search, TrendingUp, type LucideIcon } from 'lucide-react';

/**
 * ─────────────────────────────────────────────────────────────
 * DATOS DE EJEMPLO — reemplazar por cifras reales aprobadas.
 * Toda la sección lee de este bloque; no hay números sueltos en el JSX.
 * ─────────────────────────────────────────────────────────────
 */
const STATS: {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  hint: string;
  trend: number[];
}[] = [
  { icon: Battery, value: 45, suffix: '', label: 'Años de trayectoria', hint: 'Experiencia en baterías', trend: [18, 24, 22, 31, 38, 44, 52, 61] },
  { icon: MapPin, value: 32, suffix: '', label: 'Puntos de atención', hint: 'Presencia en el país', trend: [12, 14, 15, 19, 22, 25, 29, 32] },
  { icon: Recycle, value: 120000, suffix: '+', label: 'Baterías recicladas', hint: 'Entrega responsable', trend: [10, 16, 21, 33, 41, 58, 74, 96] },
  { icon: Search, value: 85000, suffix: '+', label: 'Consultas de compatibilidad', hint: 'Búsquedas por vehículo', trend: [8, 12, 20, 24, 37, 49, 63, 82] },
];

const TECH_SHARE = [
  { label: 'AGM', value: 38 },
  { label: 'EFB', value: 27 },
  { label: 'Convencional', value: 35 },
];

const MONTHLY = [42, 55, 48, 63, 71, 66, 79, 88, 74, 92, 85, 100];
const MONTH_LABELS = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const SATISFACTION = 97;

/* ─── Hooks y utilidades ─── */

function useCountUp(target: number, active: boolean, reduced: boolean, duration = 2.2) {
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [active, reduced, target, duration]);

  return value;
}

const formatNumber = (n: number) => n.toLocaleString('es-EC');

function sparklinePath(points: number[], width: number, height: number) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  return points
    .map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / span) * (height - 6) - 3;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

/* ─── Tarjeta de cifra ─── */

function StatCard({ stat, index, reduced }: { stat: (typeof STATS)[number]; index: number; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useCountUp(stat.value, inView, reduced);
  const Icon = stat.icon;
  const path = sparklinePath(stat.trend, 160, 44);

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduced ? undefined : { y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7"
    >
      {/* Resplandor que sigue al hover */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary-500/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-500/15 text-secondary-400 ring-1 ring-secondary-500/30">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
          <TrendingUp className="h-3 w-3 text-secondary-400" />
          {stat.hint}
        </span>
      </div>

      <p className="relative mt-6 font-display text-5xl font-extrabold tabular-nums tracking-tight text-white sm:text-6xl">
        {formatNumber(count)}
        <span className="text-secondary-400">{stat.suffix}</span>
      </p>
      <p className="relative mt-1.5 text-sm font-semibold text-white/70">{stat.label}</p>

      {/* Mini tendencia que se dibuja al entrar */}
      <svg viewBox="0 0 160 44" className="relative mt-5 h-11 w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`spark-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7941d" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f7941d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${path} L160,44 L0,44 Z`}
          fill={`url(#spark-${index})`}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#f7941d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.6, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
}

/* ─── Barras por tecnología ─── */

function TechBars({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
      <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Consultas por tecnología</h3>
      <div className="mt-6 space-y-5">
        {TECH_SHARE.map((item, i) => (
          <div key={item.label}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-white">{item.label}</span>
              <span className="font-mono text-sm font-bold tabular-nums text-secondary-400">{item.value}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-secondary-600 to-secondary-400"
                initial={reduced ? false : { width: 0 }}
                animate={inView ? { width: `${item.value}%` } : undefined}
                transition={{ duration: 1.3, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Barras mensuales ─── */

function MonthlyChart({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
      <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Baterías recibidas para reciclaje</h3>
      <div className="mt-6 flex h-40 items-end gap-1.5 sm:gap-2">
        {MONTHLY.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <motion.div
              className={`w-full rounded-t-md ${i === MONTHLY.length - 1 ? 'bg-secondary-500' : 'bg-white/20'}`}
              initial={reduced ? false : { height: 0 }}
              animate={inView ? { height: `${v}%` } : undefined}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="text-[10px] font-bold text-white/40">{MONTH_LABELS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Anillo de satisfacción ─── */

function RingGauge({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useCountUp(SATISFACTION, inView, reduced, 2);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <div ref={ref} className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center sm:p-7">
      <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Satisfacción de clientes</h3>
      <div className="relative mt-5 h-36 w-36">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#f7941d"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: reduced ? circumference * (1 - SATISFACTION / 100) : circumference }}
            animate={inView ? { strokeDashoffset: circumference * (1 - SATISFACTION / 100) } : undefined}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-4xl font-extrabold tabular-nums text-white">
          {count}
          <span className="text-xl text-secondary-400">%</span>
        </span>
      </div>
    </div>
  );
}

/* ─── Sección ─── */

export default function Stats() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-labelledby="stats-title"
      className="relative isolate overflow-hidden bg-primary-950 py-16 text-white sm:py-20 lg:py-24"
    >
      {/* Fondo: malla suave + resplandores de marca */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-secondary-600/10 blur-3xl" />

      <div className="container-max">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 max-w-2xl sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-400">
            <span className="h-px w-6 bg-current" />
            Maresa en cifras
          </span>
          <h2 id="stats-title" className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Números que respaldan cada kilómetro
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} reduced={reduced} />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:mt-5 lg:grid-cols-[1fr_1.3fr_0.8fr] lg:gap-5">
          <TechBars reduced={reduced} />
          <MonthlyChart reduced={reduced} />
          <RingGauge reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
