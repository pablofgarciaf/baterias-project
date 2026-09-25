/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 GLASS CARD - Glassmorphism card component
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/admin/ui/GlassCard.tsx
 * 🏷️ Type: UI Primitive
 * 📦 Module: Admin/UI
 * ─────────────────────────────────────────────────────────────
 * 🔍 Glassmorphism card with multiple variants
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import React from 'react';
import { GlassCardProps, GlassVariant, GLASS_VARIANTS, GLASS_TOKENS } from '@/types/admin';

const variantStyles: Record<GlassVariant, React.CSSProperties> = {
  default: {
    background: GLASS_TOKENS.bg,
    backdropFilter: GLASS_TOKENS.blur,
    WebkitBackdropFilter: GLASS_TOKENS.blur,
    border: `1px solid ${GLASS_TOKENS.border}`,
    boxShadow: GLASS_TOKENS.shadow,
  },
  elevated: {
    background: GLASS_VARIANTS.elevated.bg,
    backdropFilter: GLASS_VARIANTS.elevated.blur || GLASS_TOKENS.blur,
    WebkitBackdropFilter: GLASS_VARIANTS.elevated.blur || GLASS_TOKENS.blur,
    border: `1px solid ${GLASS_VARIANTS.elevated.border}`,
    boxShadow: GLASS_VARIANTS.elevated.shadow,
  },
  outlined: {
    background: GLASS_VARIANTS.outlined.bg,
    backdropFilter: GLASS_VARIANTS.outlined.blur || GLASS_TOKENS.blur,
    WebkitBackdropFilter: GLASS_VARIANTS.outlined.blur || GLASS_TOKENS.blur,
    border: `1px solid ${GLASS_VARIANTS.outlined.border}`,
    boxShadow: GLASS_VARIANTS.outlined.shadow,
  },
  subtle: {
    background: GLASS_VARIANTS.subtle.bg,
    backdropFilter: GLASS_VARIANTS.subtle.blur || GLASS_TOKENS.blur,
    WebkitBackdropFilter: GLASS_VARIANTS.subtle.blur || GLASS_TOKENS.blur,
    border: `1px solid ${GLASS_VARIANTS.subtle.border}`,
    boxShadow: GLASS_VARIANTS.subtle.shadow,
  },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '0.75rem', borderRadius: '0.75rem' },
  md: { padding: '1.25rem', borderRadius: '1rem' },
  lg: { padding: '1.5rem', borderRadius: '1.25rem' },
  xl: { padding: '2rem', borderRadius: '1.5rem' },
};

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = 'default', size = 'md', className = '', children, onClick, 'data-testid': testId, ...props }, ref) => {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    const baseStyle: React.CSSProperties = {
      ...variantStyles[variant],
      ...sizeStyles[size],
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      ...(onClick && { cursor: 'pointer' }),
    };

    // Dark mode adjustments
    if (isDark) {
      const darkVariant = GLASS_VARIANTS[variant];
      baseStyle.background = darkVariant.bgDark || baseStyle.background;
      baseStyle.border = `1px solid ${darkVariant.borderDark || GLASS_TOKENS.borderDark}`;
      baseStyle.boxShadow = darkVariant.shadow || baseStyle.boxShadow;
    }

    const hoverStyle: React.CSSProperties = onClick
      ? {
          transform: 'translateY(-2px)',
          boxShadow: isDark ? GLASS_TOKENS.shadowHover : GLASS_TOKENS.shadowHover,
        }
      : {};

    return (
      <div
        ref={ref}
        data-testid={testId}
        style={baseStyle}
        className={className}
        onClick={onClick}
        onMouseEnter={() => onClick && Object.assign(baseStyle, hoverStyle)}
        onMouseLeave={() => onClick && Object.assign(baseStyle, baseStyle)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;