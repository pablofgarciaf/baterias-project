// estado: ""
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
import { motion } from 'motion/react';
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
  Download,
  Upload,
} from 'lucide-react';
import { downloadSpreadsheet, readSpreadsheetRows } from '@/lib/spreadsheet';
import { GlassCard } from './ui/GlassCard';
import { GLASS_TOKENS } from '@/types/admin';
import { DistributorLocation } from '@/types/sinergia';
import { provinces } from '@/data/provinces';
import { coordsFromMapsEmbed, embedSrcFromIframe } from '@/lib/mapsIframe';
import { auth } from '@/lib/firebase';
import {
  getDistributors,
  saveDistributor,
  removeDistributor,
} from '@/lib/firebaseStore';

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
    schedule: '',
    latitude: 0,
    longitude: 0,
    services: [],
    isAuthorized: false,
    rating: 0,
    published: false,
    approvalSource: '',
    reviewedBy: '',
    mapsIframe: '',
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchPublishing, setBatchPublishing] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    loadDistributors();
  }, []);

  const loadDistributors = async () => {
    setIsLoading(true);
    try {
      const data = await getDistributors(true);
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
        phone: newDistributor.phone || '',
        whatsapp: newDistributor.whatsapp || '',
        schedule: newDistributor.schedule || '',
        latitude: coordsFromMapsEmbed(newDistributor.mapsIframe)?.latitude ?? (Number(newDistributor.latitude) || 0),
        longitude: coordsFromMapsEmbed(newDistributor.mapsIframe)?.longitude ?? (Number(newDistributor.longitude) || 0),
        services: newDistributor.services || [],
        isAuthorized: false,
        rating: 0,
        published: false,
        approvalSource: newDistributor.approvalSource || '',
        reviewedBy: newDistributor.reviewedBy || '',
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
        schedule: '',
        latitude: 0,
        longitude: 0,
        services: [],
        isAuthorized: false,
        rating: 0,
        published: false,
        approvalSource: '',
        reviewedBy: '',
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

  // Validacion unica para publicar (individual y por lote). Devuelve lo que falta.
  const missingForPublish = (dist: DistributorLocation): string[] => {
    const missing: string[] = [];
    if ((dist.name || '').trim().length < 2) missing.push('nombre');
    if ((dist.city || '').trim().length < 2) missing.push('ciudad');
    if ((dist.address || '').trim().length < 5) missing.push('dirección');
    if ((dist.phone || '').trim().length < 7) missing.push('teléfono');
    if (!dist.schedule?.trim()) missing.push('horario');
    if ((dist.approvalSource?.trim().length || 0) < 5) missing.push('fuente de aprobación');
    const coords = coordsFromMapsEmbed(dist.mapsIframe) ?? { latitude: dist.latitude, longitude: dist.longitude };
    const okCoords = Number.isFinite(coords.latitude) && Number.isFinite(coords.longitude)
      && coords.latitude >= -5 && coords.latitude <= 2 && coords.longitude >= -92 && coords.longitude <= -75;
    if (!okCoords) missing.push('ubicación (iframe de Google Maps)');
    return missing;
  };

  const publishedPayload = (dist: DistributorLocation): DistributorLocation => {
    const coords = coordsFromMapsEmbed(dist.mapsIframe);
    return {
      ...dist,
      ...(coords ?? {}),
      published: true,
      isAuthorized: true,
      reviewedBy: auth.currentUser?.displayName || auth.currentUser?.email || 'Administrador',
      reviewedAt: new Date().toISOString(),
    };
  };

  const handlePublish = async (dist: DistributorLocation) => {
    if (!dist.published) {
      const missing = missingForPublish(dist);
      if (missing.length > 0) {
        alert(`Antes de publicar completa: ${missing.join(', ')}.`);
        return;
      }
      if (!window.confirm('Confirma que la empresa aprobó esta ubicación, contacto y horario. Al publicar será visible para todos.')) return;
    }
    setSaving(dist.id);
    try {
      const updated = dist.published
        ? { ...dist, published: false, isAuthorized: false }
        : publishedPayload(dist);
      await saveDistributor(updated);
      setDistributors(previous => previous.map(item => item.id === dist.id ? updated : item));
    } catch {
      alert('No se pudo cambiar el estado de publicación.');
    } finally {
      setSaving(null);
    }
  };

  const buildEmbed = (latitude: number, longitude: number) =>
    `<iframe src="https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed" width="600" height="450" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

  const handleFillIframes = async () => {
    const targets = distributors.filter(d =>
      !d.mapsIframe?.trim()
      && Number.isFinite(d.latitude) && Number.isFinite(d.longitude)
      && d.latitude >= -5 && d.latitude <= 2 && d.longitude >= -92 && d.longitude <= -75);
    if (targets.length === 0) {
      alert('Todas las agencias ya tienen iframe o no tienen coordenadas válidas para generarlo.');
      return;
    }
    if (!window.confirm(`Se generará el iframe de Google Maps para ${targets.length} agencia(s) sin él, usando su ubicación guardada. ¿Continuar?`)) return;
    setBatchPublishing(true);
    const done = new Map<string, DistributorLocation>();
    const failed: string[] = [];
    for (const dist of targets) {
      try {
        const updated = { ...dist, mapsIframe: buildEmbed(dist.latitude, dist.longitude) };
        await saveDistributor(updated);
        done.set(dist.id, updated);
      } catch {
        failed.push(dist.name);
      }
    }
    setDistributors(prev => prev.map(item => done.get(item.id) ?? item));
    setBatchPublishing(false);
    alert(`Iframes generados: ${done.size}.${failed.length ? `\nFallaron: ${failed.join(', ')}.` : ''}`);
  };

  const toggleSelected = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const pendingIds = distributors.filter(d => !d.published).map(d => d.id);
  const allPendingSelected = pendingIds.length > 0 && pendingIds.every(id => selectedIds.has(id));
  const toggleSelectAllPending = () => {
    setSelectedIds(allPendingSelected ? new Set() : new Set(pendingIds));
  };

  const handlePublishSelected = async () => {
    let targets = distributors.filter(d => selectedIds.has(d.id) && !d.published);
    if (targets.length === 0) {
      alert('Marca al menos una agencia en borrador.');
      return;
    }
    const withoutSource = targets.filter(d => (d.approvalSource?.trim().length || 0) < 5);
    if (withoutSource.length > 0) {
      const source = window.prompt(
        `${withoutSource.length} agencia(s) no tienen fuente de aprobación. Indica una para todas (por ejemplo: "Aprobado por Corporación Maresa"):`,
        'Aprobado por Corporación Maresa',
      );
      if (source === null) return;
      if (source.trim().length < 5) {
        alert('Escribe una fuente de aprobación de al menos 5 caracteres.');
        return;
      }
      targets = targets.map(d => (d.approvalSource?.trim().length || 0) < 5 ? { ...d, approvalSource: source.trim() } : d);
    }
    const valid: DistributorLocation[] = [];
    const rejected: string[] = [];
    targets.forEach(dist => {
      const missing = missingForPublish(dist);
      if (missing.length === 0) valid.push(dist);
      else rejected.push(`• ${dist.name}: falta ${missing.join(', ')}`);
    });
    if (valid.length === 0) {
      alert(`Ninguna de las seleccionadas cumple los requisitos:\n\n${rejected.join('\n')}`);
      return;
    }
    const detail = rejected.length > 0 ? `\n\nNo se publicarán ${rejected.length} por datos incompletos:\n${rejected.join('\n')}` : '';
    if (!window.confirm(`¿Publicar ${valid.length} agencia(s)? Confirmas que la empresa aprobó su ubicación, contacto y horario. Serán visibles para todos.${detail}`)) return;

    setBatchPublishing(true);
    const failed: string[] = [];
    const done = new Map<string, DistributorLocation>();
    for (const dist of valid) {
      try {
        const updated = publishedPayload(dist);
        await saveDistributor(updated);
        done.set(dist.id, updated);
      } catch {
        failed.push(dist.name);
      }
    }
    setDistributors(prev => prev.map(item => done.get(item.id) ?? item));
    setSelectedIds(prev => {
      const next = new Set(prev);
      done.forEach((_, id) => next.delete(id));
      return next;
    });
    setBatchPublishing(false);
    alert(`Publicadas: ${done.size}.${failed.length ? `\nFallaron al guardar: ${failed.join(', ')}.` : ''}${rejected.length ? `\nSin publicar por datos incompletos: ${rejected.length}.` : ''}`);
  };

  const handleEditSave = async (id: string) => {
    setSaving(id);
    try {
      const detected = coordsFromMapsEmbed(editedDistributor.mapsIframe);
      const toSave = (detected ? { ...editedDistributor, ...detected } : editedDistributor) as DistributorLocation;
      await saveDistributor(toSave);
      setDistributors(prev => prev.map(d => d.id === id ? { ...d, ...toSave } : d));
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

  const exportToExcel = async () => {
    if (distributors.length === 0) return;
    try {
      await downloadSpreadsheet(distributors.map(d => ({
      'Nombre': d.name,
      'Provincia': d.province,
      'Ciudad': d.city,
      'Dirección': d.address,
      'Teléfono': d.phone,
      'WhatsApp': d.whatsapp,
      'Horario': d.schedule,
      'Latitud': d.latitude,
      'Longitud': d.longitude,
      'Servicios': d.services?.join(', ') || '',
      'Rating': d.rating,
      'Publicado': d.published === true ? 'Sí' : 'No',
      'Fuente de aprobación': d.approvalSource || '',
      'Revisado por': d.reviewedBy || '',
    })), 'Puntos de Venta', `Puntos_Venta_Maresa_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo exportar el archivo.');
    }
  };

  const importFromExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const rows = await readSpreadsheetRows(file);
      let imported = 0;
      for (const row of rows) {
        const dist: DistributorLocation = {
          id: `dist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: row['Nombre'] || '',
          province: row['Provincia'] || 'Pichincha',
          city: row['Ciudad'] || '',
          address: row['Dirección'] || row['Direccion'] || '',
          phone: row['Teléfono'] || row['Telefono'] || '',
          whatsapp: row['WhatsApp'] || row['Whatsapp'] || '',
          schedule: row['Horario'] || '',
          latitude: Number(row['Latitud']) || 0,
          longitude: Number(row['Longitud']) || 0,
          services: (row['Servicios'] || '').split(',').map(s => s.trim()).filter(Boolean),
          isAuthorized: false,
          rating: 0,
          published: false,
          approvalSource: '',
          reviewedBy: '',
          mapsIframe: '',
        };
        if (dist.name) {
          await saveDistributor(dist);
          setDistributors(prev => [dist, ...prev]);
          imported++;
        }
      }
      alert(`Se importaron ${imported} puntos de venta como borradores.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo importar el archivo.');
    }
  };

  const getThemeStyles = () => {
    const bg = darkMode ? GLASS_TOKENS.bgDark : GLASS_TOKENS.bg;
    const border = darkMode ? GLASS_TOKENS.borderDark : GLASS_TOKENS.border;
    const textPrimary = darkMode ? 'text-white' : 'text-slate-950';
    const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';
    const inputBg = darkMode ? 'rgba(30, 30, 29, 0.6)' : 'rgba(255, 255, 255, 0.6)';
    const inputBorder = darkMode ? GLASS_TOKENS.borderDark : GLASS_TOKENS.border;
    const inputText = darkMode ? '#eeeeea' : '#1e1e1d';
    const placeholder = darkMode ? '#8c8c86' : '#b6b6b0';
    const hoverBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(182, 182, 176, 0.1)';
    const accentBlue = darkMode ? 'rgba(247, 148, 29, 0.4)' : 'rgba(247, 148, 29, 0.1)';
    const accentRed = darkMode ? 'rgba(211, 17, 69, 0.2)' : 'rgba(211, 17, 69, 0.1)';
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
      setEditedDistributor(prev => ({ ...prev, [key]: key === 'latitude' || key === 'longitude' ? Number(e.target.value) : e.target.value }));

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
              Publica solo ubicaciones y contactos verificados por la empresa. Las entradas actuales sin aprobación siguen como borrador.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => void handleFillIframes()}
              disabled={batchPublishing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Globe className="w-3.5 h-3.5" />
              Completar iframes
            </button>
            <button
              type="button"
              onClick={() => void handlePublishSelected()}
              disabled={selectedIds.size === 0 || batchPublishing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary-500 hover:bg-secondary-400 text-primary-950 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {batchPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Publicar seleccionadas{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
            </button>
            <button
              onClick={exportToExcel}
              disabled={distributors.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success-600 hover:bg-success-500 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Excel
            </button>
            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-warning-600 hover:bg-warning-500 text-white font-semibold text-xs transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Cargar Excel
              <input type="file" accept=".xlsx,.csv" onChange={importFromExcel} className="hidden" />
            </label>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Ubicación
            </button>
          </div>
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
            {renderFormField('Fuente de aprobación', 'approvalSource')}
          </div>
          {renderFormField('Iframe de Google Maps (de ahí se toma la ubicación)', 'mapsIframe', 'textarea')}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
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
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todas las agencias en borrador"
                    checked={allPendingSelected}
                    disabled={pendingIds.length === 0}
                    onChange={toggleSelectAllPending}
                    className="h-4 w-4 cursor-pointer accent-[#f7941d]"
                  />
                </th>
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
                  <td colSpan={7} className="p-8 text-center" style={{ color: styles.textSecondary }}>
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" />
                    <p className="mt-2">Cargando distribuidores...</p>
                  </td>
                </tr>
              ) : distributors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center" style={{ color: styles.textSecondary }}>
                    No hay puntos de venta registrados. Haz clic en «Nueva Ubicación».
                  </td>
                </tr>
              ) : (
                distributors.map((d, idx) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className={`transition-colors ${editingId === d.id ? '' : darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}
                    style={{ background: editingId === d.id ? styles.accentBlue : undefined }}
                  >
                    {editingId === d.id ? (
                      <td colSpan={7} className="p-4 sm:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h3 className="text-base font-bold" style={{ color: styles.textPrimary }}>Editar punto de venta</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-xs" style={{ color: styles.textSecondary }}>{d.published ? 'Publicado' : 'Borrador · no visible al público'}</span>
                            <button
                              type="button"
                              onClick={() => { setEditingId(null); setEditedDistributor({}); }}
                              aria-label="Cerrar edición"
                              title="Cerrar"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-600 text-white transition-colors hover:bg-slate-500 cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="lg:col-span-3">{renderEditField('Nombre', 'name')}</div>
                          <div style={styles.card} className="p-3">
                            <label style={{ ...styles.label, marginBottom: '0.25rem' }}>Provincia</label>
                            <select
                              value={editedDistributor.province || ''}
                              onChange={e => setEditedDistributor(prev => ({ ...prev, province: e.target.value }))}
                              style={styles.input}
                            >
                              {provinces.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                            </select>
                          </div>
                          {renderEditField('Ciudad', 'city')}
                          {renderEditField('Teléfono', 'phone')}
                          <div className="sm:col-span-2 lg:col-span-3">{renderEditField('Dirección', 'address')}</div>
                          {renderEditField('WhatsApp', 'whatsapp')}
                          <div className="sm:col-span-1 lg:col-span-2">{renderEditField('Horario', 'schedule')}</div>
                          {renderEditField('Fuente de aprobación', 'approvalSource')}
                        </div>
                        <div className="mt-3">
                          {renderEditField('Iframe de Google Maps', 'mapsIframe', 'textarea')}
                          {(() => {
                            const detected = coordsFromMapsEmbed(editedDistributor.mapsIframe);
                            const hasIframe = Boolean(editedDistributor.mapsIframe?.trim());
                            return (
                              <p className="mt-2 text-xs" style={{ color: detected ? '#16a34a' : styles.textSecondary }}>
                                {detected
                                  ? `Ubicación detectada automáticamente: ${detected.latitude.toFixed(5)}, ${detected.longitude.toFixed(5)}`
                                  : hasIframe
                                    ? 'No se pudo leer la ubicación de este iframe. Copia el código desde Google Maps → Compartir → Insertar un mapa.'
                                    : 'Pega el iframe de Google Maps: de ahí se toma la ubicación para el mapa.'}
                              </p>
                            );
                          })()}
                          {(() => {
                            const src = embedSrcFromIframe(editedDistributor.mapsIframe);
                            return src ? (
                              <iframe
                                src={src}
                                title="Vista previa del mapa"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="mt-3 h-56 w-full rounded-xl border-0"
                              />
                            ) : null;
                          })()}
                        </div>
                        <div className="mt-5 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => { setEditingId(null); setEditedDistributor({}); }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-500 cursor-pointer"
                          >
                            <X className="h-4 w-4" />Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditSave(d.id)}
                            disabled={saving === d.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-success-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-success-500 cursor-pointer disabled:opacity-50"
                          >
                            {saving === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Guardar cambios
                          </button>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="p-3 w-10">
                          <input
                            type="checkbox"
                            aria-label={`Seleccionar ${d.name}`}
                            checked={selectedIds.has(d.id)}
                            disabled={d.published === true}
                            onChange={() => toggleSelected(d.id)}
                            className="h-4 w-4 cursor-pointer accent-[#f7941d] disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </td>
                        <td className="p-3 font-semibold" style={{ color: styles.textPrimary }}>{d.name}<span className="block text-xs font-normal">{d.published ? 'Publicado' : 'Borrador · no visible al público'}</span></td>
                        <td className="p-3">
                          <span className="text-primary-500 font-medium text-xs">{d.province}</span>
                          <span className="block text-xs" style={{ color: styles.textSecondary }}>{d.city}</span>
                        </td>
                        <td className="p-3 max-w-xs truncate">{d.address}</td>
                        <td className="p-3">
                          <span className="block text-xs">{d.phone}</span>
                          <span className="block text-xs text-success-500 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            WA: {d.whatsapp}
                          </span>
                        </td>
                        <td className="p-3">
                          {d.mapsIframe ? (
                            <button
                              type="button"
                              onClick={() => setPreviewId(d.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-success-500/20 text-success-400 hover:bg-success-500/30 transition-colors cursor-pointer"
                            >
                              <Globe className="w-3 h-3" />
                              Ver mapa
                            </button>
                          ) : (
                            <span className="text-xs" style={{ color: styles.textSecondary }}>Sin iframe</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => void handlePublish(d)}
                              disabled={saving === d.id}
                              className="px-2 py-1 rounded-lg text-xs font-semibold bg-primary-600 text-white disabled:opacity-50"
                            >
                              {d.published ? 'Retirar' : 'Publicar'}
                            </button>
                            <button
                              onClick={() => handleEditStart(d)}
                              className="p-1.5 rounded-lg text-primary-400 hover:bg-primary-500/10 transition-colors cursor-pointer"
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
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {previewId && (() => {
        const dist = distributors.find(item => item.id === previewId);
        const src = embedSrcFromIframe(dist?.mapsIframe);
        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Vista previa del mapa"
            onClick={() => setPreviewId(null)}
          >
            <div
              className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-primary-950 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{dist?.name}</p>
                  <p className="truncate text-xs text-white/60">{dist?.address}, {dist?.city}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewId(null)}
                  aria-label="Cerrar vista previa"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-600 text-white hover:bg-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {src ? (
                <iframe
                  src={src}
                  title={`Mapa de ${dist?.name ?? 'la agencia'}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[420px] w-full border-0"
                />
              ) : (
                <p className="p-8 text-center text-sm text-white/70">
                  El iframe guardado no es un enlace válido de Google Maps. Edítalo y pega el código desde Compartir → Insertar un mapa.
                </p>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
