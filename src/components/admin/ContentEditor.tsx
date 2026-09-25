/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 CONTENT EDITOR - Premium CMS editor with live preview,
 *    color pickers, glassmorphism cards & responsive grid
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/admin/ContentEditor.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Admin/Content
 * ─────────────────────────────────────────────────────────────
 * 🔍 7 tabs: Hero, Buscador, Agencias, Nosotros, B2B, Reciclaje, Blog
 * ♿ WCAG 2.1 AA accessible
 * 🎨 Glassmorphism dark/light with color pickers & live previews
 * 🖼️ Uses ImageUploader for ALL images (side-by-side layout)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-25
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Car,
  MapPin,
  Info,
  Briefcase,
  Recycle,
  BookOpen,
  Plus,
  Save,
  Loader2,
  Trash2,
  Palette,
  Eye,
} from 'lucide-react';
import ImageUploader from './ImageUploader';
import {
  ContentSectionKey,
  EditorTabConfig,
  ContentEditorProps,
} from '@/types/admin';
import { useSiteContent } from '@/context/SiteContentContext';

/* ═══════════════════════════════════════════════════
   TAB CONFIG
   ═══════════════════════════════════════════════════ */
const TABS: EditorTabConfig[] = [
  { id: 'hero', label: 'Hero', icon: Home },
  { id: 'vehicleFinder', label: 'Buscador', icon: Car },
  { id: 'storeLocator', label: 'Agencias', icon: MapPin },
  { id: 'about', label: 'Nosotros', icon: Info },
  { id: 'b2b', label: 'B2B', icon: Briefcase },
  { id: 'recycling', label: 'Reciclaje', icon: Recycle },
  { id: 'blog', label: 'Blog', icon: BookOpen },
];

const BLOG_FIELDS = [
  { key: 'title', label: 'Título', type: 'text' as const },
  { key: 'subtitle', label: 'Subtítulo', type: 'textarea' as const },
  { key: 'content', label: 'Contenido', type: 'textarea' as const },
  { key: 'image', label: 'Imagen', type: 'image' as const },
  { key: 'date', label: 'Fecha (ISO)', type: 'text' as const },
  { key: 'author', label: 'Autor', type: 'text' as const },
  { key: 'category', label: 'Categoría', type: 'text' as const },
];

/* ═══════════════════════════════════════════════════
   REUSABLE GLASS CARD WRAPPER
   ═══════════════════════════════════════════════════ */
function GlassSection({
  children,
  className = '',
  darkMode,
}: {
  children: React.ReactNode;
  className?: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 backdrop-blur-xl border transition-all duration-200 ${
        darkMode
          ? 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.14] shadow-lg shadow-black/20'
          : 'bg-white/60 border-slate-200/80 hover:border-slate-300 shadow-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COLOR PICKER INLINE
   ═══════════════════════════════════════════════════ */
function ColorPicker({
  label,
  value,
  onChange,
  darkMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  darkMode: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer border-0 appearance-none bg-transparent [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0.5"
          title={label}
        />
      </div>
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff"
          className={`w-full text-xs font-mono px-2 py-1 rounded-lg border outline-none transition-all ${
            darkMode
              ? 'bg-slate-900/60 border-slate-700 text-slate-300 focus:border-blue-500'
              : 'bg-slate-50 border-slate-300 text-slate-700 focus:border-blue-600'
          }`}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LABEL COMPONENT
   ═══════════════════════════════════════════════════ */
function FieldLabel({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) {
  return (
    <label
      className={`block text-[11px] font-bold uppercase tracking-widest mb-2 ${
        darkMode ? 'text-slate-500' : 'text-slate-400'
      }`}
    >
      {children}
    </label>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function ContentEditor({ darkMode }: ContentEditorProps) {
  const { content, updateSection, resetToDefaults, isSaved } = useSiteContent();
  const [activeTab, setActiveTab] = useState<ContentSectionKey>('hero');
  const [sectionDraft, setSectionDraft] = useState<any>(content[activeTab]);
  const [saving, setSaving] = useState(false);
  const [blogArticles, setBlogArticles] = useState<any[]>((content.blog as any)?.articles || []);
  const [showNewArticle, setShowNewArticle] = useState(false);
  const [newArticle, setNewArticle] = useState<Record<string, any>>({});
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    setSectionDraft(content[activeTab]);
  }, [activeTab, content]);

  useEffect(() => {
    setBlogArticles((content.blog as any)?.articles || []);
  }, [content.blog]);

  const handleDraftChange = (data: any) => {
    setSectionDraft((prev: any) => ({ ...prev, ...data }));
  };

  const handleImageSelect = (field: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      handleDraftChange({ [field]: base64, [`_${field}File`]: file });
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (field: string, url: string) => {
    handleDraftChange({ [field]: url });
  };

  const saveCurrentSection = async () => {
    setSaving(true);
    updateSection(activeTab, sectionDraft);
    setSaving(false);
  };

  /* ─── input class helpers ─── */
  const inputCls = `w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors ${
    darkMode
      ? 'bg-[#1A2235] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600'
  }`;

  const textareaCls = `${inputCls} resize-y min-h-[80px]`;

  /* ─── renderField helper ─── */
  const renderField = (label: string, key: string, type: 'text' | 'textarea' = 'text') => {
    const value = sectionDraft?.[key] || '';
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleDraftChange({ [key]: e.target.value });

    return (
      <div key={key}>
        <FieldLabel darkMode={darkMode}>{label}</FieldLabel>
        {type === 'textarea' ? (
          <textarea value={value} onChange={onChange} className={textareaCls} rows={3} />
        ) : (
          <input type="text" value={value} onChange={onChange} className={inputCls} />
        )}
      </div>
    );
  };

  /* ─── render a field + its color picker side by side ─── */
  const renderFieldWithColor = (label: string, textKey: string, colorKey: string, type: 'text' | 'textarea' = 'text') => {
    return (
      <div key={textKey} className="space-y-2">
        <FieldLabel darkMode={darkMode}>
          <span className="flex items-center gap-1.5">
            <Palette className="w-3 h-3" />
            {label}
          </span>
        </FieldLabel>
        <div className="flex gap-3">
          <div className="flex-1">
            {type === 'textarea' ? (
              <textarea
                value={sectionDraft?.[textKey] || ''}
                onChange={(e) => handleDraftChange({ [textKey]: e.target.value })}
                className={textareaCls}
                rows={2}
              />
            ) : (
              <input
                type="text"
                value={sectionDraft?.[textKey] || ''}
                onChange={(e) => handleDraftChange({ [textKey]: e.target.value })}
                className={inputCls}
              />
            )}
          </div>
          <div className="w-28 shrink-0">
            <ColorPicker
              label={`Color de ${label}`}
              value={sectionDraft?.[colorKey] || '#ffffff'}
              onChange={(v) => handleDraftChange({ [colorKey]: v })}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════
     LIVE PREVIEW MINI CARDS
     ═══════════════════════════════════════════════════ */
  const renderHeroPreview = () => {
    const bg = sectionDraft?.backgroundImage || '';
    return (
      <div className="grid grid-cols-2 gap-3">
        {/* Preview Card 1: Badge */}
        <div
          className={`relative rounded-xl p-4 min-h-[100px] flex flex-col justify-end overflow-hidden border ${
            darkMode ? 'bg-slate-900/80 border-white/[0.08]' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {bg && (
            <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-xl" />
          )}
          <div className="relative z-10">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Texto de Badge</span>
            <p
              className="text-xs font-semibold mt-1 line-clamp-2"
              style={{ color: sectionDraft?.badgeColor || (darkMode ? '#60a5fa' : '#2563eb') }}
            >
              {sectionDraft?.badgeText || 'Badge preview'}
            </p>
          </div>
        </div>

        {/* Preview Card 2: Title */}
        <div
          className={`relative rounded-xl p-4 min-h-[100px] flex flex-col justify-end overflow-hidden border ${
            darkMode ? 'bg-slate-900/80 border-white/[0.08]' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {bg && (
            <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-xl" />
          )}
          <div className="relative z-10">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Título Principal</span>
            <p
              className="text-sm font-bold mt-1 line-clamp-2 tracking-tight"
              style={{ color: sectionDraft?.titleColor || '#ffffff' }}
            >
              {sectionDraft?.titleMain || 'Energía confiable'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════
     HERO TAB
     ═══════════════════════════════════════════════════ */
  const renderHeroTab = () => (
    <div className="space-y-5">
      {/* Live Preview Header */}
      {showPreview && (
        <GlassSection darkMode={darkMode}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              <Eye className="w-3 h-3" />
              Vista previa en vivo
            </span>
          </div>
          {renderHeroPreview()}
        </GlassSection>
      )}

      {/* Text Fields with Colors */}
      <GlassSection darkMode={darkMode}>
        <div className="space-y-4">
          {renderFieldWithColor('Texto de Badge', 'badgeText', 'badgeColor')}
          {renderFieldWithColor('Título Principal', 'titleMain', 'titleColor')}
          {renderFieldWithColor('Título Resaltado', 'titleHighlight', 'highlightColor')}
          {renderFieldWithColor('Subtítulo', 'subtitle', 'subtitleColor', 'textarea')}
        </div>
      </GlassSection>

      {/* Buttons Row */}
      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Botones de Acción</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField('Botón Principal', 'ctaButtonText')}
          {renderField('Botón Secundario', 'secondaryButtonText')}
        </div>
      </GlassSection>

      {/* Images SIDE BY SIDE */}
      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Imágenes de Fondo</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Desktop</p>
            <ImageUploader
              label="Hero Desktop"
              currentPreview={sectionDraft?.backgroundImage}
              onFileSelect={(file) => handleImageSelect('backgroundImage', file)}
              onUrlChange={(url) => handleUrlChange('backgroundImage', url)}
            />
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Mobile</p>
            <ImageUploader
              label="Hero Mobile"
              currentPreview={sectionDraft?.mobileImage}
              onFileSelect={(file) => handleImageSelect('mobileImage', file)}
              onUrlChange={(url) => handleUrlChange('mobileImage', url)}
            />
          </div>
        </div>
      </GlassSection>

      {/* Stats */}
      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Estadísticas (3 columnas)</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-xl p-3 space-y-2 border ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Stat {i}</span>
              <input
                type="text"
                value={sectionDraft?.[`stat${i}Value`] || ''}
                onChange={(e) => handleDraftChange({ [`stat${i}Value`]: e.target.value })}
                className={inputCls}
                placeholder="Valor"
              />
              <input
                type="text"
                value={sectionDraft?.[`stat${i}Label`] || ''}
                onChange={(e) => handleDraftChange({ [`stat${i}Label`]: e.target.value })}
                className={inputCls}
                placeholder="Label"
              />
            </div>
          ))}
        </div>
      </GlassSection>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     ABOUT TAB
     ═══════════════════════════════════════════════════ */
  const renderAboutTab = () => (
    <div className="space-y-5">
      <GlassSection darkMode={darkMode}>
        <div className="space-y-4">
          {renderFieldWithColor('Badge', 'badge', 'badgeColor')}
          {renderFieldWithColor('Título', 'title', 'titleColor')}
          {renderField('Párrafo 1', 'paragraph1', 'textarea')}
          {renderField('Párrafo 2', 'paragraph2', 'textarea')}
        </div>
      </GlassSection>

      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Experiencia</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField('Años (Badge)', 'yearsBadge')}
          {renderField('Subtexto Años', 'yearsSubtext')}
        </div>
      </GlassSection>

      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Imagen</FieldLabel>
        <div className="max-w-sm">
          <ImageUploader
            label="Nosotros"
            currentPreview={sectionDraft?.aboutImage}
            onFileSelect={(file) => handleImageSelect('aboutImage', file)}
            onUrlChange={(url) => handleUrlChange('aboutImage', url)}
          />
        </div>
      </GlassSection>

      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Misión y Visión</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="space-y-3">
            {renderField('Título Misión', 'missionTitle')}
            {renderField('Texto Misión', 'missionText', 'textarea')}
          </div>
          <div className="space-y-3">
            {renderField('Título Visión', 'visionTitle')}
            {renderField('Texto Visión', 'visionText', 'textarea')}
          </div>
        </div>
      </GlassSection>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     VEHICLE FINDER TAB
     ═══════════════════════════════════════════════════ */
  const renderVehicleFinderTab = () => (
    <div className="space-y-5">
      <GlassSection darkMode={darkMode}>
        <div className="space-y-4">
          {renderFieldWithColor('Badge', 'badge', 'badgeColor')}
          {renderFieldWithColor('Título', 'title', 'titleColor')}
          {renderField('Subtítulo', 'subtitle', 'textarea')}
        </div>
      </GlassSection>
      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Ayuda Técnica</FieldLabel>
        <div className="space-y-3">
          {renderField('Título Ayuda Técnica', 'technicalHelpTitle')}
          {renderField('Subtítulo Ayuda Técnica', 'technicalHelpSubtitle')}
          {renderField('Botón WhatsApp', 'whatsappButtonText')}
        </div>
      </GlassSection>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     STORE LOCATOR TAB
     ═══════════════════════════════════════════════════ */
  const renderStoreLocatorTab = () => (
    <div className="space-y-5">
      <GlassSection darkMode={darkMode}>
        <div className="space-y-4">
          {renderFieldWithColor('Badge', 'badge', 'badgeColor')}
          {renderFieldWithColor('Título', 'title', 'titleColor')}
          {renderField('Subtítulo', 'subtitle', 'textarea')}
          {renderField('Placeholder Buscador', 'searchPlaceholder')}
          {renderField('Botón WhatsApp', 'whatsappCtaText')}
        </div>
      </GlassSection>

      {/* Images SIDE BY SIDE */}
      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Imágenes Hero Agencias</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Desktop</p>
            <ImageUploader
              label="Hero Agencias Desktop"
              currentPreview={sectionDraft?.heroDesktop}
              onFileSelect={(file) => handleImageSelect('heroDesktop', file)}
              onUrlChange={(url) => handleUrlChange('heroDesktop', url)}
            />
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Mobile</p>
            <ImageUploader
              label="Hero Agencias Mobile"
              currentPreview={sectionDraft?.heroMobile}
              onFileSelect={(file) => handleImageSelect('heroMobile', file)}
              onUrlChange={(url) => handleUrlChange('heroMobile', url)}
            />
          </div>
        </div>
      </GlassSection>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     B2B TAB
     ═══════════════════════════════════════════════════ */
  const renderB2BTab = () => (
    <div className="space-y-5">
      <GlassSection darkMode={darkMode}>
        <div className="space-y-4">
          {renderFieldWithColor('Badge', 'badge', 'badgeColor')}
          {renderFieldWithColor('Título B2B', 'title', 'titleColor')}
          {renderField('Subtítulo', 'subtitle', 'textarea')}
        </div>
      </GlassSection>

      <GlassSection darkMode={darkMode}>
        <div className="flex items-center justify-between mb-4">
          <FieldLabel darkMode={darkMode}>Beneficios B2B</FieldLabel>
          <button
            onClick={() => {
              const current = sectionDraft?.benefits || [
                { title: sectionDraft?.benefit1Title || '', desc: sectionDraft?.benefit1Desc || '' },
                { title: sectionDraft?.benefit2Title || '', desc: sectionDraft?.benefit2Desc || '' },
                { title: sectionDraft?.benefit3Title || '', desc: sectionDraft?.benefit3Desc || '' },
                { title: sectionDraft?.benefit4Title || '', desc: sectionDraft?.benefit4Desc || '' },
              ].filter((b: any) => b.title);
              handleDraftChange({ benefits: [...current, { title: 'Nuevo Beneficio', desc: '' }] });
            }}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>

        <div className="space-y-3">
          {(sectionDraft?.benefits || [
            { title: sectionDraft?.benefit1Title || '', desc: sectionDraft?.benefit1Desc || '' },
            { title: sectionDraft?.benefit2Title || '', desc: sectionDraft?.benefit2Desc || '' },
            { title: sectionDraft?.benefit3Title || '', desc: sectionDraft?.benefit3Desc || '' },
            { title: sectionDraft?.benefit4Title || '', desc: sectionDraft?.benefit4Desc || '' },
          ].filter((b: any) => b.title)).map((benefit: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between gap-3 mb-2">
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => {
                    const newBenefits = [...(sectionDraft?.benefits || [])];
                    if (newBenefits.length === 0) {
                      newBenefits.push(
                        { title: sectionDraft?.benefit1Title || '', desc: sectionDraft?.benefit1Desc || '' },
                        { title: sectionDraft?.benefit2Title || '', desc: sectionDraft?.benefit2Desc || '' },
                        { title: sectionDraft?.benefit3Title || '', desc: sectionDraft?.benefit3Desc || '' },
                        { title: sectionDraft?.benefit4Title || '', desc: sectionDraft?.benefit4Desc || '' },
                      );
                    }
                    newBenefits[idx].title = e.target.value;
                    handleDraftChange({ benefits: newBenefits });
                  }}
                  className={inputCls}
                  placeholder="Título del beneficio"
                />
                <button
                  onClick={() => {
                    const newBenefits = [...(sectionDraft?.benefits || [])].filter((_, i) => i !== idx);
                    handleDraftChange({ benefits: newBenefits });
                  }}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer shrink-0 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={benefit.desc}
                onChange={(e) => {
                  const newBenefits = [...(sectionDraft?.benefits || [])];
                  newBenefits[idx].desc = e.target.value;
                  handleDraftChange({ benefits: newBenefits });
                }}
                className={textareaCls}
                placeholder="Descripción del beneficio"
                rows={2}
              />
            </div>
          ))}
        </div>
      </GlassSection>

      <GlassSection darkMode={darkMode}>
        {renderField('Texto Botón Enviar', 'submitButtonText')}
      </GlassSection>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     RECYCLING TAB
     ═══════════════════════════════════════════════════ */
  const renderRecyclingTab = () => (
    <div className="space-y-5">
      <GlassSection darkMode={darkMode}>
        <div className="space-y-4">
          {renderFieldWithColor('Título Línea 1', 'titleLine1', 'titleColor')}
          {renderFieldWithColor('Título Línea 2', 'titleLine2', 'titleColor2')}
          {renderField('Subtítulo', 'subtitle', 'textarea')}
        </div>
      </GlassSection>

      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Métrica de Impacto</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField('Valor Métrica', 'metricValue')}
          {renderField('Descripción Métrica', 'metricLabel')}
        </div>
      </GlassSection>

      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Puntos Clave</FieldLabel>
        <div className="space-y-3 mt-2">
          {renderField('Punto 1', 'point1Text')}
          {renderField('Punto 2', 'point2Text')}
          {renderField('Punto 3', 'point3Text')}
        </div>
      </GlassSection>

      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Botones</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField('Botón CTA', 'ctaButtonText')}
          {renderField('Botón Secundario', 'secondaryButtonText')}
        </div>
      </GlassSection>

      <GlassSection darkMode={darkMode}>
        <FieldLabel darkMode={darkMode}>Imagen de Fondo</FieldLabel>
        <div className="max-w-md">
          <ImageUploader
            label="Reciclaje"
            currentPreview={sectionDraft?.backgroundImage}
            onFileSelect={(file) => handleImageSelect('backgroundImage', file)}
            onUrlChange={(url) => handleUrlChange('backgroundImage', url)}
          />
        </div>
      </GlassSection>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     BLOG TAB
     ═══════════════════════════════════════════════════ */
  const renderBlogTab = () => (
    <div className="space-y-5">
      <GlassSection darkMode={darkMode}>
        <div className="flex items-center justify-between mb-4">
          <FieldLabel darkMode={darkMode}>Artículos del Blog</FieldLabel>
          <button
            onClick={() => setShowNewArticle(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nuevo Artículo
          </button>
        </div>

        {blogArticles.length === 0 ? (
          <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            No hay artículos aún. Crea el primero.
          </p>
        ) : (
          <div className="space-y-2">
            {blogArticles.map((article, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  darkMode ? 'border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {article.image && (
                    <img src={article.image} alt={article.title} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`font-medium text-sm truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{article.title}</p>
                    <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{article.date || 'Sin fecha'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const updated = [...blogArticles];
                    updated.splice(index, 1);
                    setBlogArticles(updated);
                    handleDraftChange({ articles: updated });
                  }}
                  className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                  aria-label="Eliminar artículo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New article form */}
        {showNewArticle && (
          <div className={`mt-5 p-5 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Nuevo Artículo
            </h3>
            {BLOG_FIELDS.map((field) =>
              field.type === 'image' ? (
                <div key={field.key}>
                  <FieldLabel darkMode={darkMode}>{field.label}</FieldLabel>
                  <div className="max-w-sm">
                    <ImageUploader
                      label="Artículo Blog"
                      currentPreview={newArticle[field.key]}
                      onFileSelect={(file) => {
                        const url = URL.createObjectURL(file);
                        setNewArticle((prev) => ({ ...prev, [field.key]: url, [`_${field.key}File`]: file }));
                      }}
                      onUrlChange={(url) => setNewArticle((prev) => ({ ...prev, [field.key]: url }))}
                    />
                  </div>
                </div>
              ) : field.type === 'textarea' ? (
                <div key={field.key}>
                  <FieldLabel darkMode={darkMode}>{field.label}</FieldLabel>
                  <textarea
                    value={newArticle[field.key] || ''}
                    onChange={(e) => setNewArticle((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className={textareaCls}
                    rows={4}
                    placeholder={field.label}
                  />
                </div>
              ) : (
                <div key={field.key}>
                  <FieldLabel darkMode={darkMode}>{field.label}</FieldLabel>
                  <input
                    type="text"
                    value={newArticle[field.key] || ''}
                    onChange={(e) => setNewArticle((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className={inputCls}
                    placeholder={field.label}
                  />
                </div>
              )
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowNewArticle(false);
                  setNewArticle({});
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                  darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const updated = [...blogArticles, { ...newArticle, id: Date.now().toString() }];
                  setBlogArticles(updated);
                  handleDraftChange({ articles: updated });
                  setShowNewArticle(false);
                  setNewArticle({});
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                Guardar Artículo
              </button>
            </div>
          </div>
        )}
      </GlassSection>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     TAB ROUTER
     ═══════════════════════════════════════════════════ */
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'hero': return renderHeroTab();
      case 'about': return renderAboutTab();
      case 'vehicleFinder': return renderVehicleFinderTab();
      case 'storeLocator': return renderStoreLocatorTab();
      case 'b2b': return renderB2BTab();
      case 'recycling': return renderRecyclingTab();
      case 'blog': return renderBlogTab();
    }
  };

  /* ═══════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════ */
  return (
    <div className="max-w-5xl mx-auto">
      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : darkMode
                ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}

        {/* Preview toggle */}
        <div className="ml-auto shrink-0">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-2.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
              showPreview
                ? darkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50'
                : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
            }`}
            title={showPreview ? 'Ocultar vista previa' : 'Mostrar vista previa'}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-5">
        {renderActiveTab()}

        {/* Save Actions */}
        <div className={`pt-4 border-t flex items-center justify-between ${darkMode ? 'border-white/[0.06]' : 'border-slate-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            Los cambios se aplican en tiempo real al guardar.
          </p>
          <button
            onClick={saveCurrentSection}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            <Loader2 className={`w-4 h-4 ${saving ? 'animate-spin' : 'hidden'}`} />
            <Save className={saving ? 'hidden' : 'w-4 h-4'} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}