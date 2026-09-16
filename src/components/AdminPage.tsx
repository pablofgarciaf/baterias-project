/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — AdminPage.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/AdminPage.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Admin
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L025-L070  → Imports & dependencies (Lucide icons, XLSX, Firebase, types)
 *   L071-L076  → Type definitions & interfaces (AdminPageProps, tabs)
 *   L078-L078  → Component function start
 *   L079-L127  → State & hooks (auth, draft content, CRM, distributors)
 *   L129-L149  → Data loading & lifecycle effects (loadAllData)
 *   L151-L260  → Event handlers (auth, CRM updates, Excel export, distributors)
 *   L262-L1233 → JSX render (header, login screen, editor, CRM, catalog)
 *   L078-L078  → Export default AdminPage
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Users, 
  Battery, 
  MapPin, 
  Download, 
  LogOut, 
  Plus, 
  Check, 
  X, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw,
  Clock,
  Building,
  KeyRound,
  FileText,
  Home,
  Info,
  Car,
  Recycle,
  BookOpen,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  ArrowLeft,
  ExternalLink,
  Phone,
  MessageCircle,
  Globe
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { B2BLead, DistributorLocation } from '@/types/sinergia';
import { getB2BLeads, updateLeadStatus, getDistributors, saveDistributor, removeDistributor } from '@/lib/firebaseStore';
import { provinces } from '@/data/provinces';
import { useSiteContent } from '@/context/SiteContentContext';
import { vehicleCatalog } from '@/data/sinergiaData';

interface AdminPageProps {
  onBackToSite: () => void;
}

type AdminSidebarSection = 'content' | 'distributors' | 'leads' | 'catalog';
type ContentSectionKey = 'hero' | 'about' | 'vehicleFinder' | 'storeLocator' | 'b2b' | 'recycling' | 'blog';

export default function AdminPage({ onBackToSite }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('maresa_admin_auth') === 'true';
    }
    return false;
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Sidebar navigation
  const [activeNav, setActiveNav] = useState<AdminSidebarSection>('content');
  const [activeContentTab, setActiveContentTab] = useState<ContentSectionKey>('hero');

  // Site content context
  const { content, updateSection, resetToDefaults, isSaved } = useSiteContent();

  // Local draft state for the current active section
  const [sectionDraft, setSectionDraft] = useState<any>(content[activeContentTab]);

  useEffect(() => {
    setSectionDraft(content[activeContentTab]);
  }, [activeContentTab, content]);

  // Leads CRM State
  const [leads, setLeads] = useState<B2BLead[]>([]);
  const [leadsFilter, setLeadsFilter] = useState<'Todos' | 'Aplica' | 'No Aplica' | 'Pendiente'>('Todos');
  const [leadsSearch, setLeadsSearch] = useState('');
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Distributors State
  const [distributors, setDistributors] = useState<DistributorLocation[]>([]);
  const [isAddingDistributor, setIsAddingDistributor] = useState(false);
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
    rating: 4.9
  });

  // Catalog search state
  const [catalogSearch, setCatalogSearch] = useState('');

  const loadAllData = async () => {
    setIsLoadingLeads(true);
    try {
      const [leadsData, distsData] = await Promise.all([
        getB2BLeads(),
        getDistributors()
      ]);
      setLeads(leadsData);
      setDistributors(distsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'maresa2026' || password === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('maresa_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. Intenta con "maresa2026"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('maresa_admin_auth');
    setPassword('');
  };

  // Lead status update
  const handleUpdateLeadStatus = async (id: string, status: B2BLead['status']) => {
    try {
      await updateLeadStatus(id, status);
      setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  // Export leads to Excel
  const exportLeadsToExcel = () => {
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

  // Save changes to current content section
  const handleSaveCurrentSection = () => {
    updateSection(activeContentTab, sectionDraft);
  };

  // Distributor actions
  const handleSaveNewDistributor = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDistributor.name || !newDistributor.city || !newDistributor.address) {
      alert('Por favor completa los campos requeridos');
      return;
    }

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
      services: newDistributor.services || ['Diagnóstico gratis', 'Instalación'],
      isAuthorized: true,
      rating: 4.9
    };

    try {
      await saveDistributor(distToSave);
      setDistributors(prev => [distToSave, ...prev]);
      setIsAddingDistributor(false);
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
        rating: 4.9
      });
    } catch (err) {
      console.error('Error saving distributor:', err);
    }
  };

  const handleDeleteDistributor = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este punto de venta?')) return;
    try {
      await removeDistributor(id);
      setDistributors(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting distributor:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Corporate Navigation Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al Sitio Web</span>
            <span className="sm:hidden">Sitio</span>
          </button>
          
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Battery className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-white block leading-none">
                CMS & CRM Maresa
              </span>
              <span className="text-[10px] text-blue-400 font-semibold block">
                Panel Administrativo Oficial
              </span>
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg animate-pulse">
                <Check className="w-3.5 h-3.5" />
                Guardado en Vivo
              </span>
            )}
            
            <button
              onClick={resetToDefaults}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Restablecer textos a los originales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Restablecer</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      {!isAuthenticated ? (
        /* Login Screen */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Acceso al Administrador Maresa
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                Ingresa con tu clave autorizada para editar en vivo todos los textos, imágenes, puntos de venta y revisar solicitudes B2B.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Contraseña (maresa2026)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                />
              </div>

              {authError && (
                <p className="text-xs text-red-400 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                Ingresar al Administrador
              </button>

              <button
                type="button"
                onClick={() => {
                  setPassword('maresa2026');
                  setIsAuthenticated(true);
                  sessionStorage.setItem('maresa_admin_auth', 'true');
                }}
                className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ⚡ Ingreso Rápido con 1 Clic (maresa2026)
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Full Dashboard Layout with Sidebar & Main Workspace */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Navigation Sidebar */}
          <aside className="w-full md:w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Módulos de Gestión
              </span>
            </div>

            <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
              <button
                onClick={() => setActiveNav('content')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'content'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  Editor de Contenidos
                </span>
                <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded text-slate-300">
                  7 Secciones
                </span>
              </button>

              <button
                onClick={() => setActiveNav('distributors')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'distributors'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  Puntos de Venta Maresa
                </span>
                <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded text-slate-300">
                  {distributors.length}
                </span>
              </button>

              <button
                onClick={() => setActiveNav('leads')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'leads'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  Proveedores B2B (CRM)
                </span>
                <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {leads.filter(l => l.status === 'Pendiente').length} Nuevos
                </span>
              </button>

              <button
                onClick={() => setActiveNav('catalog')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'catalog'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Car className="w-4 h-4" />
                  Catálogo y Aplicaciones
                </span>
                <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded text-slate-300">
                  {vehicleCatalog.length}
                </span>
              </button>
            </nav>

            {/* Quick Link back to live site */}
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={onBackToSite}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Landing en Vivo
              </button>
            </div>
          </aside>

          {/* Right Workspace */}
          <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8">
            
            {/* 1. MÓDULO: EDITOR DE CONTENIDOS DEL LANDING */}
            {activeNav === 'content' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      Editor Visual de Contenidos
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Modifica titulares, subtítulos, textos, colores de botones y fotos que se muestran en el sitio web.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveCurrentSection}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </button>
                </div>

                {/* Sub-tabs for each section */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
                  {[
                    { id: 'hero', label: '1. Portada / Hero', icon: Home },
                    { id: 'vehicleFinder', label: '2. Buscador Vehicular', icon: Car },
                    { id: 'storeLocator', label: '3. Puntos de Venta', icon: MapPin },
                    { id: 'about', label: '4. Quiénes Somos', icon: Info },
                    { id: 'b2b', label: '5. Módulo B2B', icon: Briefcase },
                    { id: 'recycling', label: '6. Reciclaje', icon: Recycle },
                    { id: 'blog', label: '7. Blog & Guías', icon: BookOpen },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveContentTab(tab.id as ContentSectionKey)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeContentTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content Editor Fields based on active section */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-6">
                  
                  {/* HERO TAB */}
                  {activeContentTab === 'hero' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Badge Superior
                        </label>
                        <input
                          type="text"
                          value={sectionDraft.badgeText || ''}
                          onChange={(e) => setSectionDraft({ ...sectionDraft, badgeText: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Título Principal (Blanco)
                          </label>
                          <input
                            type="text"
                            value={sectionDraft.titleMain || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, titleMain: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Título Resaltado (Gradiente Azul)
                          </label>
                          <input
                            type="text"
                            value={sectionDraft.titleHighlight || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, titleHighlight: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Subtítulo Descriptivo
                        </label>
                        <textarea
                          rows={3}
                          value={sectionDraft.subtitle || ''}
                          onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Texto Botón Principal
                          </label>
                          <input
                            type="text"
                            value={sectionDraft.ctaButtonText || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, ctaButtonText: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            URL Imagen de Fondo
                          </label>
                          <input
                            type="text"
                            value={sectionDraft.backgroundImage || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, backgroundImage: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1">Stat 1 (Valor / Etiqueta)</label>
                          <input
                            type="text"
                            value={sectionDraft.stat1Value || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, stat1Value: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs mb-1.5"
                          />
                          <input
                            type="text"
                            value={sectionDraft.stat1Label || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, stat1Label: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1">Stat 2 (Valor / Etiqueta)</label>
                          <input
                            type="text"
                            value={sectionDraft.stat2Value || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, stat2Value: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs mb-1.5"
                          />
                          <input
                            type="text"
                            value={sectionDraft.stat2Label || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, stat2Label: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1">Stat 3 (Valor / Etiqueta)</label>
                          <input
                            type="text"
                            value={sectionDraft.stat3Value || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, stat3Value: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs mb-1.5"
                          />
                          <input
                            type="text"
                            value={sectionDraft.stat3Label || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, stat3Label: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ABOUT TAB */}
                  {activeContentTab === 'about' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Badge</label>
                          <input
                            type="text"
                            value={sectionDraft.badge || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, badge: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Título</label>
                          <input
                            type="text"
                            value={sectionDraft.title || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Párrafo 1 (Historia)</label>
                        <textarea
                          rows={3}
                          value={sectionDraft.paragraph1 || ''}
                          onChange={(e) => setSectionDraft({ ...sectionDraft, paragraph1: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Párrafo 2 (Calidad)</label>
                        <textarea
                          rows={3}
                          value={sectionDraft.paragraph2 || ''}
                          onChange={(e) => setSectionDraft({ ...sectionDraft, paragraph2: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Misión</label>
                          <input
                            type="text"
                            value={sectionDraft.missionText || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, missionText: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Visión</label>
                          <input
                            type="text"
                            value={sectionDraft.visionText || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, visionText: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* B2B TAB */}
                  {activeContentTab === 'b2b' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Título B2B</label>
                          <input
                            type="text"
                            value={sectionDraft.title || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Texto Botón</label>
                          <input
                            type="text"
                            value={sectionDraft.submitButtonText || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, submitButtonText: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Subtítulo B2B</label>
                        <textarea
                          rows={2}
                          value={sectionDraft.subtitle || ''}
                          onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* RECYCLING TAB */}
                  {activeContentTab === 'recycling' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Título Línea 1</label>
                          <input
                            type="text"
                            value={sectionDraft.titleLine1 || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, titleLine1: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Título Línea 2</label>
                          <input
                            type="text"
                            value={sectionDraft.titleLine2 || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, titleLine2: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Métrica de Impacto</label>
                          <input
                            type="text"
                            value={sectionDraft.metricValue || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, metricValue: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Descripción Métrica</label>
                          <input
                            type="text"
                            value={sectionDraft.metricLabel || ''}
                            onChange={(e) => setSectionDraft({ ...sectionDraft, metricLabel: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OTHER TABS */}
                  {(activeContentTab === 'vehicleFinder' || activeContentTab === 'storeLocator' || activeContentTab === 'blog') && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Título</label>
                        <input
                          type="text"
                          value={sectionDraft.title || ''}
                          onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Subtítulo</label>
                        <textarea
                          rows={2}
                          value={sectionDraft.subtitle || ''}
                          onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Save current draft button */}
                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={handleSaveCurrentSection}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/30"
                    >
                      <Save className="w-4 h-4" />
                      Aplicar y Guardar Cambios
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* 2. MÓDULO: PUNTOS DE VENTA MARESA */}
            {activeNav === 'distributors' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      Puntos de Venta y Agencias Maresa ({distributors.length})
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Gestiona las sucursales oficiales de Corporación Maresa en las 24 provincias del Ecuador.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingDistributor(!isAddingDistributor)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Ubicación
                  </button>
                </div>

                {/* Add Distributor Form */}
                {isAddingDistributor && (
                  <form onSubmit={handleSaveNewDistributor} className="bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 animate-fade-in">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Registrar Nueva Agencia Maresa
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Agencia *</label>
                        <input
                          type="text"
                          required
                          value={newDistributor.name || ''}
                          onChange={(e) => setNewDistributor({ ...newDistributor, name: e.target.value })}
                          placeholder="Ej: Maresa Center Norte"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Provincia *</label>
                        <select
                          value={newDistributor.province}
                          onChange={(e) => setNewDistributor({ ...newDistributor, province: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                        >
                          {provinces.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad *</label>
                        <input
                          type="text"
                          required
                          value={newDistributor.city || ''}
                          onChange={(e) => setNewDistributor({ ...newDistributor, city: e.target.value })}
                          placeholder="Ej: Quito"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección Exacta *</label>
                        <input
                          type="text"
                          required
                          value={newDistributor.address || ''}
                          onChange={(e) => setNewDistributor({ ...newDistributor, address: e.target.value })}
                          placeholder="Ej: Av. Galo Plaza Lasso y De Los Cedros"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
                        <input
                          type="text"
                          value={newDistributor.phone || ''}
                          onChange={(e) => setNewDistributor({ ...newDistributor, phone: e.target.value })}
                          placeholder="(02) 398-9000"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp</label>
                        <input
                          type="text"
                          value={newDistributor.whatsapp || ''}
                          onChange={(e) => setNewDistributor({ ...newDistributor, whatsapp: e.target.value })}
                          placeholder="593998123456"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingDistributor(false)}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      >
                        Guardar Ubicación
                      </button>
                    </div>
                  </form>
                )}

                {/* Distributors Table */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Agencia Maresa</th>
                          <th className="p-3.5">Provincia / Ciudad</th>
                          <th className="p-3.5">Dirección</th>
                          <th className="p-3.5">Contacto</th>
                          <th className="p-3.5 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {distributors.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-3.5 font-bold text-white">
                              {d.name}
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300 font-semibold text-[11px]">
                                {d.province}
                              </span>
                              <span className="block text-[11px] text-slate-400 mt-0.5">{d.city}</span>
                            </td>
                            <td className="p-3.5 max-w-xs truncate text-slate-300">
                              {d.address}
                            </td>
                            <td className="p-3.5 space-y-0.5">
                              <span className="block">{d.phone}</span>
                              <span className="block text-emerald-400 font-medium">WA: {d.whatsapp}</span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleDeleteDistributor(d.id)}
                                className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors cursor-pointer"
                                title="Eliminar agencia"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. MÓDULO: BANDEJA CRM PROVEEDORES B2B */}
            {activeNav === 'leads' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      Bandeja de Proveedores & Distribuidores B2B ({leads.length})
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Revisa, califica con "Aplica" / "No Aplica" y contacta a los talleres o distribuidores que solicitaron unirse a la red Maresa.
                    </p>
                  </div>

                  <button
                    onClick={exportLeadsToExcel}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Exportar a Excel
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
                    {(['Todos', 'Pendiente', 'Aplica', 'No Aplica'] as const).map((filterOpt) => (
                      <button
                        key={filterOpt}
                        onClick={() => setLeadsFilter(filterOpt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          leadsFilter === filterOpt
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {filterOpt}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por empresa o ciudad..."
                      value={leadsSearch}
                      onChange={(e) => setLeadsSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Leads Table */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Empresa & Contacto</th>
                          <th className="p-3.5">Ubicación</th>
                          <th className="p-3.5">Tipo & Volumen</th>
                          <th className="p-3.5">Estado CRM</th>
                          <th className="p-3.5 text-right">Calificación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {leads
                          .filter(l => {
                            const matchFilter = 
                              leadsFilter === 'Todos' ? true :
                              leadsFilter === 'Aplica' ? (l.status === 'Aprobado') :
                              leadsFilter === 'No Aplica' ? (l.status === 'Descartado') :
                              (l.status === leadsFilter as any);
                            const matchSearch = 
                              l.companyName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                              l.city.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                              l.contactName.toLowerCase().includes(leadsSearch.toLowerCase());
                            return matchFilter && matchSearch;
                          })
                          .map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                              <td className="p-3.5">
                                <span className="font-bold text-white block">{lead.companyName}</span>
                                <span className="text-[11px] text-slate-400">{lead.contactName}</span>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-blue-400">
                                  <span>{lead.phone}</span>
                                  <span>•</span>
                                  <span className="text-slate-400">{lead.email}</span>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <span className="font-semibold text-slate-200 block">{lead.province}</span>
                                <span className="text-slate-400">{lead.city}</span>
                              </td>

                              <td className="p-3.5">
                                <span className="font-medium text-slate-200 block">{lead.businessType}</span>
                                <span className="text-[11px] text-emerald-400">{lead.estimatedVolume}</span>
                              </td>

                              <td className="p-3.5">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                  lead.status === 'Aprobado' || lead.status === 'Aplica' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                                  lead.status === 'No Aplica' || lead.status === 'Descartado' ? 'bg-red-950 text-red-300 border border-red-800' :
                                  lead.status === 'Contactado' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                                  'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}>
                                  {lead.status === 'Aprobado' || lead.status === 'Aplica' ? '✓ Aplica' :
                                   lead.status === 'No Aplica' || lead.status === 'Descartado' ? '✕ No Aplica' :
                                   lead.status}
                                </span>
                              </td>

                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleUpdateLeadStatus(lead.id!, 'Aplica')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                                    title="Aprobar prospecto"
                                  >
                                    Aplica
                                  </button>
                                  <button
                                    onClick={() => handleUpdateLeadStatus(lead.id!, 'No Aplica')}
                                    className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                                    title="Rechazar prospecto"
                                  >
                                    No Aplica
                                  </button>
                                  <button
                                    onClick={() => handleUpdateLeadStatus(lead.id!, 'Contactado')}
                                    className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
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
                </div>
              </div>
            )}

            {/* 4. MÓDULO: CATÁLOGO Y ESPECIFICACIONES */}
            {activeNav === 'catalog' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      Base de Datos Vehicular & Baterías ({vehicleCatalog.length})
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Catálogo con calibración de amperaje (CCA), tecnología (AGM, EFB, Calcio) y PVP oficial para Ecuador.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filtrar por marca o modelo..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicleCatalog
                    .filter(v => 
                      v.brand.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                      v.model.toLowerCase().includes(catalogSearch.toLowerCase())
                    )
                    .map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-400 uppercase">
                              {item.brand} • {item.year}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                              {item.engine}
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold text-white mt-1">
                            {item.model}
                          </h3>

                          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                              <span>{item.recommendedBattery.model}</span>
                              <span className="text-blue-400">${item.recommendedBattery.priceEcuador.toFixed(2)}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              BCI: {item.recommendedBattery.bciGroup} • {item.recommendedBattery.cca} CCA • {item.recommendedBattery.ah} Ah • {item.recommendedBattery.technology}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Garantía: <strong>{item.recommendedBattery.warrantyMonths} meses</strong></span>
                          <span className="text-emerald-400 font-semibold">100% Calibrado Ecuador</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </main>
        </div>
      )}

    </div>
  );
}
