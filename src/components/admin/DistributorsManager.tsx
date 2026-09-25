/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 DISTRIBUTORS MANAGER - CRUD for Maresa distributors
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/admin/DistributorsManager.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Admin/Distributors
 * ─────────────────────────────────────────────────────────────
 * 🔍 Inline editable table + iframe Google Maps field
 * ♿ WCAG 2.1 AA accessible
 * 🎨 Glassmorphism dark/light using design tokens
 * 💾 Firebase sync via firebaseStore
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  Plus,
  Save,
  X,
  Trash2,
  MapPin,
  Phone,
  MessageSquare,
  Globe,
  Edit3,
  Check,
  Loader2,
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { GLASS_TOKENS } from '@/types/admin';
import { DistributorLocation } from '@/types/sinergia';
import { provinces } from '@/data/provinces';
import { getDistributors, saveDistributor, removeDistributor } from '@/lib/firebaseStore';

export default function DistributorsManager({ darkMode }: { darkMode: boolean }) {
  const [distributors, setDistributors] = useState<DistributorLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDistributor, setEditedDistributor] = useState<Partial<DistributorLocation>>({});
  const [newDistributor, setNewDistributor] = useState<Partial<DistributorLocation>>({
    name: '',
    province: 'Pichincha',
    city: '',
    address: '',
    phone: '',
    whatsapp: '',
    schedule: 'Lunes a Sábado 08:00 - 18:00',
    latitude: -0.1807,
    longitude: -78.4678,
    services: ['Diagnóstico gratis', 'Instalación express', 'Reciclaje con bono -$10'],
    isAuthorized: true,
    rating: 4.9,
    mapsIframe: '',
  });
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadDistributors();
  }, []);

  const loadDistributors = async () => {
    setIsLoading(true);
    try {
      const data = await getDistributors();
      setDistributors(data);
    } catch (err) {
      console.error('Error loading distributors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNew = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDistributor.name || !newDistributor.city || !newDistributor.address) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    setSaving('new');
    try {
      const distToSave: DistributorLocation = {
        id: `dist-${Date.now()}`,
        name: newDistributor.name || '',
        province: newDistributor.province || 'Pichincha',
        city: newDistributor.city || '',
        address: newDistributor.address || '',
        phone: newDistributor.phone || '(02) 225-8800',
        whatsapp: newDistributor.whatsapp || '593998123456',
        schedule: newDistributor.schedule || 'Lunes a Sábado 08:00 - 18:00',
        latitude: Number(newDistributor.latitude) || -0.1807,
        longitude: Number(newDistributor.longitude) || -78.4678,
        services: newDistributor.services || ['Diagnóstico gratis', 'Instalación express'],
        isAuthorized: true,
        rating: 4.9,
        mapsIframe: newDistributor.mapsIframe || '',
      };

      await saveDistributor(distToSave);
      setDistributors(prev => [distToSave, ...prev]);
      setIsAdding(false);
      setNewDistributor({
        name: '',
        province: 'Pichincha',
        city: '',
        address: '',
        phone: '',
        whatsapp: '',
        schedule: 'Lunes a Sábado 08:00 - 18:00',
        latitude: -0.1807,
        longitude: -78.4678,
        services: ['Diagnóstico gratis', 'Instalación express'],
        isAuthorized: true,
        rating: 4.9,
        mapsIframe: '',
      });
    } catch (err) {
      console.error('Error saving distributor:', err);
      alert('Error al guardar');
    } finally {
      setSaving(null);
    }
  };

  const handleEditStart = (dist: DistributorLocation) => {
    setEditingId(dist.id);
    setEditedDistributor({ ...dist });
  };

  const handleEditSave = async (id: string) => {
    setSaving(id);
    try {
      await saveDistributor(editedDistributor as DistributorLocation);
      setDistributors(prev => prev.map(d => d.id === id ? { ...d, ...editedDistributor } : d));
      setEditingId(null);
      setEditedDistributor({});
    } catch (err) {
      console.error('Error saving distributor:', err);
      alert('Error al guardar');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este punto de venta?')) return;
    try {
      await removeDistributor(id);
      setDistributors(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting distributor:', err);
      alert('Error al eliminar');
    }
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
    const accentBlue = darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)';
    const accentRed = darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)';
    const accentGreen = darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)';

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
      textarea: {
        width: '100%',
        padding: '0.625rem 0.875rem',
        borderRadius: '0.625rem',
        border: `1px solid ${inputBorder}`,
        background: inputBg,
        color: inputText,
        fontSize: '0.8125rem',
        outline: 'none',
        transition: 'all 0.2s ease',
        resize: 'vertical' as const,
        minHeight: '80px',
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
      accentBlue,
      accentRed,
      accentGreen,
      border,
    };
  };

  const styles = getThemeStyles();

  const renderFormField = (label: string, key: keyof Partial<DistributorLocation>, type: 'text' | 'textarea' | 'select' | 'number' = 'text', options?: { value: string; label: string }[]) => {
    const value = (type === 'number' ? Number(newDistributor[key]) || '' : newDistributor[key] || '') as string;
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.value;
      setNewDistributor(prev => ({ ...prev, [key]: type === 'number' ? Number(val) : val }));
    };

    const labelStyle = { ...styles.label, marginBottom: '0.25rem' };

    if (type === 'textarea') {
      return (
        <div style={styles.card} className="p-4" key={key}>
          <label style={labelStyle}>{label}</label>
          <textarea
            value={value}
            onChange={onChange}
            style={styles.textarea}
            rows={3}
          />
        </div>
      );
    }

    if (type === 'select' && options) {
      return (
        <div style={styles.card} className="p-4" key={key}>
          <label style={labelStyle}>{label}</label>
          <select value={value} onChange={onChange} style={styles.input}>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      );
    }

    return (
      <div style={styles.card} className="p-4" key={key}>
        <label style={labelStyle}>{label}</label>
        <input
          type={type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={onChange}
          style={styles.input}
          step={type === 'number' ? 'any' : undefined}
        />
      </div>
    );
  };

  const renderEditField = (label: string, key: keyof DistributorLocation, type: 'text' | 'textarea' = 'text') => {
    const rawValue = editedDistributor[key];
    const value = Array.isArray(rawValue) ? rawValue.join(', ') : String(rawValue ?? '');
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEditedDistributor(prev => ({ ...prev, [key]: e.target.value }));

    const labelStyle = { ...styles.label, marginBottom: '0.25rem' };

    if (type === 'textarea') {
      return (
        <div style={styles.card} className="p-3" key={key}>
          <label style={labelStyle}>{label}</label>
          <textarea
            value={value}
            onChange={onChange}
            style={{ ...styles.textarea, minHeight: '60px' }}
            rows={2}
          />
        </div>
      );
    }

    return (
      <div style={styles.card} className="p-3" key={key}>
        <label style={labelStyle}>{label}</label>
        <input
          type="text"
          value={value}
          onChange={onChange}
          style={styles.input}
        />
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div style={styles.card} className="p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: styles.textPrimary }}>
              Puntos de Venta ({distributors.length})
            </h2>
            <p className="text-xs mt-0.5" style={{ color: styles.textSecondary }}>
              Agencias Maresa en las 24 provincias del Ecuador.
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nueva Ubicación
          </button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleSaveNew} style={styles.card} className="p-4 sm:p-6 mb-6 space-y-4">
          <h3 className="text-base font-semibold" style={{ color: styles.textPrimary }}>Nueva Agencia</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderFormField('Nombre *', 'name')}
            {renderFormField('Provincia *', 'province', 'select', provinces.map(p => ({ value: p.name, label: p.name })))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderFormField('Ciudad *', 'city')}
            {renderFormField('Dirección *', 'address')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderFormField('Teléfono', 'phone')}
            {renderFormField('WhatsApp', 'whatsapp')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderFormField('Horario', 'schedule')}
            {renderFormField('Rating', 'rating', 'number')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderFormField('Latitud', 'latitude', 'number')}
            {renderFormField('Longitud', 'longitude', 'number')}
          </div>
          {renderFormField('Iframe Google Maps', 'mapsIframe', 'textarea')}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              style={{
                ...styles.input,
                background: styles.hoverBg,
                color: styles.textSecondary,
                border: `1px solid ${darkMode ? GLASS_TOKENS.borderDark : GLASS_TOKENS.border}`,
                width: 'auto',
                padding: '0.625rem 1.25rem',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving === 'new'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving === 'new' && <Loader2 className="w-4 h-4 animate-spin" />}
              {!saving && <Save className="w-4 h-4" />}
              {saving === 'new' ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div style={styles.card} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ color: styles.textSecondary }}>
            <thead>
              <tr className="uppercase text-xs tracking-wider border-b" style={{ borderColor: styles.border }}>
                <th className="p-3 font-semibold" style={{ color: styles.textPrimary }}>Agencia</th>
                <th className="p-3 font-semibold" style={{ color: styles.textPrimary }}>Ubicación</th>
                <th className="p-3 font-semibold" style={{ color: styles.textPrimary }}>Dirección</th>
                <th className="p-3 font-semibold" style={{ color: styles.textPrimary }}>Contacto</th>
                <th className="p-3 font-semibold" style={{ color: styles.textPrimary }}>Maps</th>
                <th className="p-3 font-semibold text-right" style={{ color: styles.textPrimary }}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: styles.border }}>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: styles.textSecondary }}>
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                    <p className="mt-2">Cargando distribuidores...</p>
                  </td>
                </tr>
              ) : distributors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: styles.textSecondary }}>
                    No hay puntos de venta registrados. Haz clic en "Nueva Ubicación".
                  </td>
                </tr>
              ) : (
                distributors.map((d) => (
                  <tr
                    key={d.id}
                    className={`transition-colors ${editingId === d.id ? '' : darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}
                    style={{ background: editingId === d.id ? styles.accentBlue : undefined }}
                  >
                    {editingId === d.id ? (
                      <>
                        <td className="p-3 font-semibold" style={{ color: styles.textPrimary }}>
                          <input
                            value={editedDistributor.name || ''}
                            onChange={e => setEditedDistributor(prev => ({ ...prev, name: e.target.value }))}
                            style={styles.input}
                            autoFocus
                          />
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div style={styles.card} className="p-2">
                              <label style={styles.label}>Provincia</label>
                              <select
                                value={editedDistributor.province || ''}
                                onChange={e => setEditedDistributor(prev => ({ ...prev, province: e.target.value }))}
                                style={styles.input}
                              >
                                {provinces.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                              </select>
                            </div>
                            <div style={styles.card} className="p-2">
                              <label style={styles.label}>Ciudad</label>
                              <input
                                value={editedDistributor.city || ''}
                                onChange={e => setEditedDistributor(prev => ({ ...prev, city: e.target.value }))}
                                style={styles.input}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 max-w-xs">
                          <div style={styles.card} className="p-2">
                            <label style={styles.label}>Dirección</label>
                            <input
                              value={editedDistributor.address || ''}
                              onChange={e => setEditedDistributor(prev => ({ ...prev, address: e.target.value }))}
                              style={styles.input}
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div style={styles.card} className="p-2">
                              <label style={styles.label}>Teléfono</label>
                              <input
                                value={editedDistributor.phone || ''}
                                onChange={e => setEditedDistributor(prev => ({ ...prev, phone: e.target.value }))}
                                style={styles.input}
                              />
                            </div>
                            <div style={styles.card} className="p-2">
                              <label style={styles.label}>WhatsApp</label>
                              <input
                                value={editedDistributor.whatsapp || ''}
                                onChange={e => setEditedDistributor(prev => ({ ...prev, whatsapp: e.target.value }))}
                                style={styles.input}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div style={styles.card} className="p-2">
                            <label style={styles.label}>Iframe Google Maps</label>
                            <textarea
                              value={editedDistributor.mapsIframe || ''}
                              onChange={e => setEditedDistributor(prev => ({ ...prev, mapsIframe: e.target.value }))}
                              style={styles.textarea}
                              rows={2}
                              placeholder="Pega el <iframe> de Google Maps"
                            />
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditSave(d.id)}
                              disabled={saving === d.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {saving === d.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-600 text-white hover:bg-slate-500 transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 font-semibold" style={{ color: styles.textPrimary }}>{d.name}</td>
                        <td className="p-3">
                          <span className="text-blue-500 font-medium text-xs">{d.province}</span>
                          <span className="block text-xs" style={{ color: styles.textSecondary }}>{d.city}</span>
                        </td>
                        <td className="p-3 max-w-xs truncate">{d.address}</td>
                        <td className="p-3">
                          <span className="block text-xs">{d.phone}</span>
                          <span className="block text-xs text-emerald-500 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            WA: {d.whatsapp}
                          </span>
                        </td>
                        <td className="p-3">
                          {d.mapsIframe ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                              <Globe className="w-3 h-3" />
                              Configurado
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: styles.textSecondary }}>Sin iframe</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditStart(d)}
                              className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                              aria-label="Editar"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              aria-label="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}