/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 LEADS MANAGER - CRM B2B leads from Firebase only
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/admin/LeadsManager.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Admin/Leads
 * ─────────────────────────────────────────────────────────────
 * 🔍 Solo datos reales Firebase (getB2BLeads), NO seed data
 * ♿ WCAG 2.1 AA accessible
 * 🎨 Glassmorphism dark/light using design tokens
 * 📊 Filtros + Export Excel
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Users,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  TrendingUp,
  Loader2,
  Filter,
  Search,
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { GLASS_TOKENS } from '@/types/admin';
import { B2BLead } from '@/types/sinergia';
import { getB2BLeads, updateLeadStatus } from '@/lib/firebaseStore';
import * as XLSX from 'xlsx';

type LeadStatus = 'Todos' | 'Pendiente' | 'Contactado' | 'Aprobado' | 'Descartado' | 'Aplica' | 'No Aplica';

export default function LeadsManager({ darkMode }: { darkMode: boolean }) {
  const [leads, setLeads] = useState<B2BLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<LeadStatus>('Todos');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await getB2BLeads();
      setLeads(data);
    } catch (err) {
      console.error('Error loading leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: B2BLead['status']) => {
    setUpdatingId(id);
    try {
      await updateLeadStatus(id, status);
      setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
    } catch (err) {
      console.error('Error updating lead status:', err);
      alert('Error al actualizar estado');
    } finally {
      setUpdatingId(null);
    }
  };

  const exportToExcel = () => {
    if (leads.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(leads.map(l => ({
      'ID': l.id,
      'Empresa': l.companyName,
      'Contacto': l.contactName,
      'Email': l.email,
      'Teléfono': l.phone,
      'Provincia': l.province,
      'Ciudad': l.city,
      'Tipo Negocio': l.businessType,
      'Volumen Estimado': l.estimatedVolume,
      'Estado CRM': l.status,
      'Fecha Creación': new Date(l.createdAt).toLocaleDateString('es-EC'),
      'Notas': l.notes || ''
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Prospectos B2B Maresa');
    XLSX.writeFile(workbook, `Prospectos_B2B_Maresa_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchFilter = filter === 'Todos' ? true :
        filter === 'Aplica' ? (lead.status === 'Aprobado') :
        filter === 'No Aplica' ? (lead.status === 'Descartado') :
        (lead.status === filter);
      const matchSearch = lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
        lead.city.toLowerCase().includes(search.toLowerCase()) ||
        lead.contactName.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [leads, filter, search]);

  const getStatusConfig = (status: B2BLead['status']) => {
    const configs: Record<string, { label: string; bg: string; border: string; text: string }> = {
      'Aprobado': { label: '✓ Aplica', bg: 'bg-emerald-950', border: 'border-emerald-800', text: 'text-emerald-300' },
      'Aplica': { label: '✓ Aplica', bg: 'bg-emerald-950', border: 'border-emerald-800', text: 'text-emerald-300' },
      'Descartado': { label: '✕ No Aplica', bg: 'bg-red-950', border: 'border-red-800', text: 'text-red-300' },
      'No Aplica': { label: '✕ No Aplica', bg: 'bg-red-950', border: 'border-red-800', text: 'text-red-300' },
      'Contactado': { label: 'Contactado', bg: 'bg-blue-950', border: 'border-blue-800', text: 'text-blue-300' },
      'Pendiente': { label: 'Pendiente', bg: 'bg-amber-950', border: 'border-amber-800', text: 'text-amber-300' },
    };
    return configs[status] || { label: status, bg: 'bg-slate-950', border: 'border-slate-800', text: 'text-slate-300' };
  };

  const getThemeStyles = () => {
    const bg = darkMode ? GLASS_TOKENS.bgDark : GLASS_TOKENS.bg;
    const border = darkMode ? GLASS_TOKENS.borderDark : GLASS_TOKENS.border;
    const textPrimary = darkMode ? 'text-white' : 'text-slate-950';
    const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';
    const inputBg = darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)';
    const inputBorder = darkMode ? GLASS_TOKENS.borderDark : GLASS_TOKENS.border;
    const inputText = darkMode ? '#f1f5f9' : '#0f172a';
    const placeholder = darkMode ? '#64748b' : '#94a3b8';
    const hoverBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)';

    return {
      card: {
        background: bg,
        backdropFilter: GLASS_TOKENS.blur,
        WebkitBackdropFilter: GLASS_TOKENS.blur,
        border: `1px solid ${border}`,
        boxShadow: GLASS_TOKENS.shadow,
        borderRadius: '1rem',
      },
      input: {
        width: '100%',
        padding: '0.625rem 0.875rem',
        borderRadius: '0.625rem',
        border: `1px solid ${inputBorder}`,
        background: inputBg,
        color: inputText,
        fontSize: '0.8125rem',
        outline: 'none',
        transition: 'all 0.2s ease',
        placeholder: { color: placeholder },
      },
      label: {
        display: 'block',
        fontSize: '0.6875rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.375rem',
        color: textSecondary,
      },
      textPrimary,
      textSecondary,
      hoverBg,
      border,
    };
  };

  const styles = getThemeStyles();

  const EmptyState = () => (
    <div style={styles.card} className="p-12 text-center">
      <Users className="w-16 h-16 mx-auto mb-4" style={{ color: styles.textSecondary, opacity: 0.5 }} />
      <h3 className="text-lg font-semibold mb-2" style={{ color: styles.textPrimary }}>No hay prospectos aún</h3>
      <p className="text-sm" style={{ color: styles.textSecondary }}>
        Los formularios B2B del sitio público aparecerán aquí automáticamente.
      </p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div style={styles.card} className="p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: styles.textPrimary }}>
              CRM Proveedores B2B ({leads.length})
            </h2>
            <p className="text-xs mt-0.5" style={{ color: styles.textSecondary }}>
              Califica y contacta distribuidores que quieren unirse a Maresa.
            </p>
          </div>
          <button
            onClick={exportToExcel}
            disabled={leads.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={styles.card} className="p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className={`flex items-center gap-1 p-1 rounded-lg border w-full sm:w-auto ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            {(['Todos', 'Pendiente', 'Aplica', 'No Aplica'] as const).map((filterOpt) => (
              <button
                key={filterOpt}
                onClick={() => setFilter(filterOpt)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  filter === filterOpt
                    ? 'bg-blue-600 text-white'
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {filterOpt}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar empresa o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none ${
                darkMode
                  ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500'
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
              } focus:border-blue-500`}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={styles.card} className="overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            <p className="mt-3" style={{ color: styles.textSecondary }}>Cargando prospectos...</p>
          </div>
        ) : filteredLeads.length === 0 && leads.length === 0 ? (
          <EmptyState />
        ) : filteredLeads.length === 0 ? (
          <div style={styles.card} className="p-8 text-center">
            <Filter className="w-12 h-12 mx-auto mb-3" style={{ color: styles.textSecondary, opacity: 0.5 }} />
            <p style={{ color: styles.textSecondary }}>No hay resultados para los filtros actuales</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ color: styles.textSecondary }}>
              <thead>
                <tr className="uppercase text-xs tracking-wider border-b" style={{ borderColor: styles.border }}>
                  <th className="p-3.5 font-semibold" style={{ color: styles.textPrimary }}>Empresa & Contacto</th>
                  <th className="p-3.5 font-semibold" style={{ color: styles.textPrimary }}>Ubicación</th>
                  <th className="p-3.5 font-semibold" style={{ color: styles.textPrimary }}>Tipo & Volumen</th>
                  <th className="p-3.5 font-semibold" style={{ color: styles.textPrimary }}>Estado CRM</th>
                  <th className="p-3.5 font-semibold text-right" style={{ color: styles.textPrimary }}>Calificación</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: styles.border }}>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className={`transition-colors ${darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                    <td className="p-3">
                      <span className="font-semibold block" style={{ color: styles.textPrimary }}>{lead.companyName}</span>
                      <span className="text-xs" style={{ color: styles.textSecondary }}>{lead.contactName}</span>
                      <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: styles.textSecondary }}>
                        <span><Phone className="w-3 h-3 inline" /> {lead.phone}</span>
                        <span>•</span>
                        <span><Mail className="w-3 h-3 inline" /> {lead.email}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold block">{lead.province}</span>
                      <span className="text-xs">{lead.city}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium block">{lead.businessType}</span>
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {lead.estimatedVolume}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {(() => {
                        const statusConfig = getStatusConfig(lead.status);
                        return (
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-extrabold ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border`}>
                            {statusConfig.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusUpdate(lead.id!, 'Aplica')}
                          disabled={updatingId === lead.id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                          title="Aprobar prospecto"
                        >
                          Aplica
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(lead.id!, 'No Aplica')}
                          disabled={updatingId === lead.id}
                          className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                          title="Rechazar prospecto"
                        >
                          No Aplica
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(lead.id!, 'Contactado')}
                          disabled={updatingId === lead.id}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                          title="Marcar como contactado"
                        >
                          Contactado
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}