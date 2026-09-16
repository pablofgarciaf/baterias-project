/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — (site)/page.tsx (Home)
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/page.tsx
 * 🏷️ Type: Client Component (Home Landing Page)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L020  → Imports (Hero, GeoQuickAnswer, About, Features, Dealers)
 *   L022-L046  → HomePage component (Hero + GEO capsule + About + Features + Dealers CTA)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import Hero from '@/components/Hero';
import GeoQuickAnswer from '@/components/GeoQuickAnswer';
import About from '@/components/About';
import Features from '@/components/Features';
import Dealers from '@/components/Dealers';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Principal — Identidad Corporación Maresa */}
      <Hero />

      {/* GEO Capsule — AI search optimization (first 1KB of DOM) */}
      <GeoQuickAnswer />

      {/* 2. Quiénes Somos — 45 Años de Liderazgo */}
      <About />

      {/* 3. Diferenciales de Servicio */}
      <Features />

      {/* 4. CTA Distribuidores */}
      <Dealers />
    </>
  );
}
