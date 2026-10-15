// estado: ""
'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { Battery, MapPin, Recycle, Smile, type LucideIcon } from 'lucide-react';

/**
 * ─────────────────────────────────────────────────────────────
 * DATOS DE EJEMPLO — reemplazar por cifras reales aprobadas.
 * ─────────────────────────────────────────────────────────────
 */
const STATS: {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  hint: string;
}[] = [
  { icon: Battery, value: 45, suffix: '', label: 'Años de trayectoria', hint: 'Experiencia en baterías' },
  { icon: MapPin, value: 32, suffix: '', label: 'Puntos de atención', hint: 'Presencia en el país' },
  { icon: Recycle, value: 120000, suffix: '+', label: 'Baterías recicladas', hint: 'Entrega responsable' },
  { icon: Smile, value: 97, suffix: '%', label: 'Satisfacción de clientes', hint: 'Experiencia de compra' },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const formatNumber = (n: number) => n.toLocaleString('es-EC');

/** Cuenta de 0 al objetivo cada vez que `active` pasa a verdadero; vuelve a 0 al salir de vista. */
function useCountUp(target: number, active: boolean, reduced: boolean, duration = 1.8) {
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    if (!active) {
      setValue(0);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [active, reduced, target, duration]);

  return value;
}

function StatItem({ stat, index, active, reduced }: { stat: (typeof STATS)[number]; index: number; active: boolean; reduced: boolean }) {
  const Icon = stat.icon;
  const count = useCountUp(stat.value, active, reduced);

  return (
    <motion.li
      initial={false}
      animate={active || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.55, delay: active ? index * 0.1 : 0, ease: EASE }}
      className="relative flex items-center gap-3 bg-primary-950/75 px-3 py-4 sm:px-5 sm:py-5"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-secondary-300 ring-1 ring-white/15 sm:h-10 sm:w-10">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-extrabold leading-none tabular-nums tracking-tight text-white sm:text-3xl">
          {formatNumber(count)}
          <span className="text-secondary-400">{stat.suffix}</span>
        </p>
        <p className="mt-1 truncate text-[11px] font-semibold text-white/80 sm:text-xs">{stat.label}</p>
        <p className="hidden truncate text-[10px] font-medium uppercase tracking-widest text-white/40 sm:block">{stat.hint}</p>
      </div>

      {/* Línea de progreso que se dibuja con cada entrada */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-3 bottom-0 h-px origin-left bg-gradient-to-r from-secondary-500 to-transparent sm:inset-x-5"
        initial={false}
        animate={active || reduced ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, delay: active ? 0.2 + index * 0.1 : 0, ease: EASE }}
      />
    </motion.li>
  );
}

export default function Stats() {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  // Sin `once`: cada vez que vuelve a entrar en pantalla, se reanima.
  const inView = useInView(ref, { amount: 0.5 });

  return (
    <section
      aria-label="Maresa en cifras"
      className="relative isolate overflow-hidden border-y border-white/10 bg-primary-950 py-5 text-white sm:py-7"
    >
      <div className="pointer-events-none absolute -left-16 top-0 -z-10 h-40 w-56 rounded-full bg-secondary-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 -z-10 h-40 w-56 rounded-full bg-secondary-600/10 blur-3xl" />

      <div ref={ref} className="container-max">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 shadow-xl shadow-black/10 backdrop-blur-xl sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} active={inView} reduced={reduced} />
          ))}
        </ul>
      </div>
    </section>
  );
}
