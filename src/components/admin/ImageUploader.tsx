/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 IMAGE UPLOADER - Reusable drag & drop + URL image uploader
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/admin/ImageUploader.tsx
 * 🏷️ Type: Admin UI Component
 * 📦 Module: Admin/UI
 * ─────────────────────────────────────────────────────────────
 * 🔍 Features: Drag & drop, click to pick, URL input, preview, loading/error states
 * ♿ WCAG 2.1 AA accessible
 * 🎨 Glassmorphism dark/light using design tokens
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import React, { useState, useCallback, useRef, DragEvent, ChangeEvent, FocusEvent } from 'react';
import { Upload, Image as ImageIcon, X, Loader2, AlertCircle, CheckCircle, Link2 } from 'lucide-react';
import { GLASS_TOKENS, GLASS_VARIANTS } from '@/types/admin';

export interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  onUrlChange: (url: string) => void;
  accept?: string;
  label?: string;
  currentPreview?: string | null;
  disabled?: boolean;
  maxSizeMB?: number;
}

const DEFAULT_ACCEPT = 'image/webp,image/png,image/jpeg,image/gif,image/avif';
const DEFAULT_MAX_SIZE_MB = 10;

export const ImageUploader = React.forwardRef<HTMLDivElement, ImageUploaderProps>(
  (
    {
      onFileSelect,
      onUrlChange,
      accept = DEFAULT_ACCEPT,
      label = 'Imagen',
      currentPreview = null,
      disabled = false,
      maxSizeMB = DEFAULT_MAX_SIZE_MB,
    },
    ref
  ) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [urlInput, setUrlInput] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const urlInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    // Glassmorphism styles based on theme
    const cardStyle: React.CSSProperties = {
      background: isDark ? GLASS_TOKENS.bgDark : GLASS_TOKENS.bg,
      backdropFilter: GLASS_TOKENS.blur,
      WebkitBackdropFilter: GLASS_TOKENS.blur,
      border: `1px solid ${isDark ? GLASS_TOKENS.borderDark : GLASS_TOKENS.border}`,
      boxShadow: GLASS_TOKENS.shadow,
      borderRadius: '1rem',
      transition: 'all 0.2s ease',
    };

    const dropZoneStyle: React.CSSProperties = {
      ...cardStyle,
      border: `2px dashed ${isDragActive
        ? 'rgb(59 130 246 / 0.8)'
        : isDark
        ? 'rgba(148, 163, 184, 0.3)'
        : 'rgba(148, 163, 184, 0.4)'}`,
      background: isDragActive
        ? isDark
          ? 'rgba(30, 58, 138, 0.15)'
          : 'rgba(59, 130, 246, 0.08)'
        : cardStyle.background,
      cursor: disabled ? 'not-allowed' : 'pointer',
    };

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      border: `1px solid ${isDark ? GLASS_TOKENS.borderDark : GLASS_TOKENS.border}`,
      background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      color: isDark ? '#f1f5f9' : '#0f172a',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s ease',
    };

    const validateFile = useCallback((file: File): boolean => {
      if (!file.type.startsWith('image/')) {
        setError('El archivo debe ser una imagen');
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`La imagen no debe superar ${maxSizeMB}MB`);
        return false;
      }
      setError(null);
      return true;
    }, [maxSizeMB]);

    const handleFileSelect = useCallback((file: File | null) => {
      if (!file) return;
      if (validateFile(file)) {
        setIsLoading(true);
        // Simulate async processing
        setTimeout(() => {
          onFileSelect(file);
          setIsLoading(false);
        }, 150);
      }
    }, [onFileSelect, validateFile]);

    const handleDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (disabled) return;

        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
      },
      [disabled, handleFileSelect]
    );

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragActive(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
    }, []);

    const handleClick = useCallback(() => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, [disabled]);

    const handleFileInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        handleFileSelect(file);
        // Reset input to allow selecting same file again
        e.target.value = '';
      },
      [handleFileSelect]
    );

    const handleUrlChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUrlInput(value);
        onUrlChange(value);
        setError(null);
      },
      [onUrlChange]
    );

    const handleUrlBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (value) {
          try {
            new URL(value);
            setError(null);
          } catch {
            setError('URL inválida');
            setUrlInput('');
            onUrlChange('');
          }
        }
      },
      [onUrlChange]
    );

    const handleRemoveImage = useCallback(() => {
      setUrlInput('');
      onUrlChange('');
      onFileSelect(new File([''], '', { type: 'image/png' }));
    }, [onFileSelect, onUrlChange]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          handleClick();
        }
      },
      [disabled, handleClick]
    );

    const previewSrc = currentPreview || urlInput;

    return (
      <div ref={ref} className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          aria-label={`Subir ${label}`}
          disabled={disabled}
        />

        {/* Drop Zone / Preview Area */}
        <div
          ref={dropZoneRef}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          style={dropZoneStyle}
          className="relative min-h-[140px] flex flex-col items-center justify-center gap-3 p-4"
          aria-label={disabled ? undefined : `Área para subir ${label}, arrastra o haz clic`}
          aria-describedby={error ? 'uploader-error' : undefined}
        >
          {/* Preview Image */}
          {previewSrc && !isLoading && (
            <div className="relative w-full max-w-xs">
              <img
                src={previewSrc}
                alt={`Vista previa de ${label}`}
                className="w-full aspect-[16/9] object-cover rounded-lg border border-white/10"
                onError={() => {
                  setError('No se pudo cargar la imagen');
                  onUrlChange('');
                  setUrlInput('');
                }}
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  aria-label={`Eliminar ${label}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center gap-2 text-center" role="status" aria-live="polite">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" aria-hidden="true" />
              <span className="text-sm font-medium" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                Procesando imagen...
              </span>
            </div>
          )}

          {/* Empty State - Upload Prompt */}
          {!previewSrc && !isLoading && (
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDragActive
                    ? 'bg-blue-500/20'
                    : isDark
                    ? 'bg-white/5'
                    : 'bg-slate-100'
                }`}
              >
                <Upload className={`w-6 h-6 ${isDragActive ? 'text-blue-400' : isDark ? 'text-slate-500' : 'text-slate-400'}`} aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
                  {isDragActive ? 'Suelta para subir' : `Arrastra o haz clic para subir ${label}`}
                </p>
                <p className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                  Formatos: WebP, PNG, JPG, GIF, AVIF • Máx. {maxSizeMB}MB
                </p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(true);
                    setTimeout(() => urlInputRef.current?.focus(), 0);
                  }}
                  className="mt-1 text-xs font-medium text-blue-500 hover:text-blue-400 underline underline-offset-2"
                >
                  O pegar una URL
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div id="uploader-error" className="w-full max-w-xs px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}
        </div>

        {/* URL Input */}
        {showUrlInput && (
          <div className="mt-3 flex gap-2" role="group" aria-label="Entrada de URL de imagen">
            <label htmlFor="image-url-input" className="sr-only">
              URL de la imagen
            </label>
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: isDark ? '#64748b' : '#94a3b8' }} aria-hidden="true" />
              <input
                ref={urlInputRef}
                id="image-url-input"
                type="url"
                value={urlInput}
                onChange={handleUrlChange}
                onBlur={handleUrlBlur}
                placeholder="https://ejemplo.com/imagen.jpg"
                style={inputStyle}
                className="pl-10"
                disabled={disabled}
                autoComplete="off"
                aria-label="URL de la imagen"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput('');
                onUrlChange('');
              }}
              disabled={disabled}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              style={{
                background: isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)',
                color: isDark ? '#94a3b8' : '#64748b',
                border: `1px solid ${isDark ? GLASS_TOKENS.borderDark : GLASS_TOKENS.border}`,
              }}
              aria-label="Cancelar entrada de URL"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Success indicator when image is set via URL */}
        {urlInput && !previewSrc && !isLoading && !showUrlInput && (
          <div className="mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30" role="status">
            <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span className="text-sm text-emerald-300">URL de imagen configurada</span>
          </div>
        )}
      </div>
    );
  }
);

ImageUploader.displayName = 'ImageUploader';

export default ImageUploader;