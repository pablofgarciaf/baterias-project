/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — ThemeContext.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/context/ThemeContext.tsx
 * 🏷️ Type: Client Component (Theme Context & Provider)
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L022-L022  → Imports (React hooks & context)
 *   L024-L030  → Type definitions (Theme, ThemeContextType)
 *   L032-L032  → Context creation (ThemeContext)
 *   L034-L072  → ThemeProvider component (state, DOM class sync, handlers)
 *   L074-L080  → Custom hook (useTheme)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('maresa_theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      // If user system prefers dark, check, but default to 'light' per customer feedback
      return 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('maresa_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
