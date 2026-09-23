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

import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Lock,
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
  KeyRound,
  FileText,
  Home,
  Info,
  Car,
  Recycle,
  BookOpen,
  Briefcase,
  Save,
  RotateCcw,
  Image as ImageIcon,
  ExternalLink,
  Sun,
  Moon,
  Upload
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { B2BLead, DistributorLocation } from '@/types/sinergia';
import { getB2BLeads, updateLeadStatus, getDistributors, saveDistributor, removeDistributor } from '@/lib/firebaseStore';
import { provinces } from '@/data/provinces';
import { useSiteContent } from '@/context/SiteContentContext';
import { vehicleCatalog } from '@/data/sinergiaData';



type AdminSidebarSection = 'content' | 'distributors' | 'leads' | 'catalog';
type ContentSectionKey = 'hero' | 'about' | 'vehicleFinder' | 'storeLocator' | 'b2b' | 'recycling' | 'blog';

export default function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('maresa_admin_auth') === 'true') {
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);
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

  const inputClass = `w-full px-3 py-2 rounded-lg border text-xs outline-none transition-colors ${
    darkMode
      ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500'
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
  }`;

  const cardClass = `rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`;

  const labelClass = `block text-[11px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Corporate Navigation Bar */}
      <header className={`h-14 border-b flex items-center justify-between px-4 sm:px-8 z-20 transition-colors ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            darkMode ? 'bg-blue-600' : 'bg-blue-600'
          }`}>
            <Battery className="w-4 h-4 text-white" />
          </div>
          <div className="leading-none">
            <span className={`font-bold text-sm tracking-tight block ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              CMS & CRM Maresa
            </span>
            <span className="text-[10px] text-blue-500 font-semibold block">
              Panel Administrativo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && isSaved && (
            <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              darkMode ? 'text-emerald-400 bg-emerald-950/60' : 'text-emerald-600 bg-emerald-50'
            }`}>
              <Check className="w-3 h-3" />
              Guardado
            </span>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              darkMode ? 'text-slate-400 hover:text-amber-400 hover:bg-white/[0.06]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated && (
            <>
              <button
                onClick={resetToDefaults}
                className={`hidden sm:flex px-2.5 py-1.5 rounded-lg text-[11px] font-medium items-center gap-1 transition-colors cursor-pointer ${
                  darkMode ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                Restablecer
              </button>

              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Container */}
      {!isAuthenticated ? (
        /* Login Screen */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className={`w-full max-w-sm rounded-2xl p-8 text-center space-y-6 border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Administrador Maresa
              </h2>
              <p className={`text-xs mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Ingresa tu clave para editar contenidos, imágenes y gestionar solicitudes B2B.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                    darkMode
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                />
              </div>

              {authError && (
                <p className="text-xs text-red-400 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer active:scale-[0.98]"
              >
                Ingresar
              </button>

              <button
                type="button"
                onClick={() => {
                  setPassword('maresa2026');
                  setIsAuthenticated(true);
                  sessionStorage.setItem('maresa_admin_auth', 'true');
                }}
                className={`w-full py-2 text-xs transition-colors cursor-pointer ${
                  darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Ingreso rápido (maresa2026)
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Full Dashboard Layout with Sidebar & Main Workspace */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Left Navigation Sidebar — fixed with scroll */}
          <aside className={`w-full md:w-56 lg:w-60 border-r flex flex-col flex-shrink-0 md:fixed md:top-14 md:bottom-0 md:overflow-hidden ${
            darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-3.5 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Módulos
              </span>
            </div>

            <nav className="p-2 space-y-0.5 flex-1 overflow-y-auto">
              {([
                { id: 'content' as const, icon: FileText, label: 'Contenidos', badge: '7' },
                { id: 'distributors' as const, icon: MapPin, label: 'Puntos de Venta', badge: String(distributors.length) },
                { id: 'leads' as const, icon: Users, label: 'CRM B2B', badge: `${leads.filter(l => l.status === 'Pendiente').length}`, highlight: true },
                { id: 'catalog' as const, icon: Car, label: 'Catálogo', badge: String(vehicleCatalog.length) },
              ]).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                    activeNav === item.id
                      ? 'bg-blue-600 text-white'
                      : darkMode
                        ? 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    activeNav === item.id
                      ? 'bg-white/20 text-white'
                      : item.highlight
                        ? 'bg-blue-500 text-white'
                        : darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Workspace */}
          <main className={`flex-1 overflow-y-auto p-4 sm:p-8 md:ml-56 lg:ml-60 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            
            {/* 1. MÓDULO: EDITOR DE CONTENIDOS DEL LANDING */}
            {activeNav === 'content' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Editor de Contenidos
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Modifica textos, imágenes y CTAs del sitio web en vivo.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveCurrentSection}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.97]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Guardar
                  </button>
                </div>

                {/* Sub-tabs for each section */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
                  {[
                    { id: 'hero', label: 'Hero', icon: Home },
                    { id: 'vehicleFinder', label: 'Buscador', icon: Car },
                    { id: 'storeLocator', label: 'Agencias', icon: MapPin },
                    { id: 'about', label: 'Nosotros', icon: Info },
                    { id: 'b2b', label: 'B2B', icon: Briefcase },
                    { id: 'recycling', label: 'Reciclaje', icon: Recycle },
                    { id: 'blog', label: 'Blog', icon: BookOpen },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveContentTab(tab.id as ContentSectionKey)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                        activeContentTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : darkMode
                            ? 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <tab.icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content Editor Fields based on active section */}
                <div className={`${cardClass} p-5 sm:p-6 space-y-6`}>
                  
                  {/* HERO TAB */}
                  {activeContentTab === 'hero' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Badge Superior
                        </label>
                        <input
                          type="text"
                          value={sectionDraft.badgeText || ''}
                          onChange={(e) => setSectionDraft({ ...sectionDraft, badgeText: e.target.value })}
                          className={inputClass}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Título Principal
                          </label>
                          <input type="text" value={sectionDraft.titleMain || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, titleMain: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Título Resaltado
                          </label>
                          <input type="text" value={sectionDraft.titleHighlight || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, titleHighlight: e.target.value })} className={inputClass} />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Subtítulo
                        </label>
                        <textarea rows={2} value={sectionDraft.subtitle || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })} className={inputClass} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Texto Botón CTA
                          </label>
                          <input type="text" value={sectionDraft.ctaButtonText || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, ctaButtonText: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            URL Imagen de Fondo
                          </label>
                          <input type="text" value={sectionDraft.backgroundImage || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, backgroundImage: e.target.value })} className={inputClass} />
                        </div>
                      </div>

                      {/* Image Upload Section */}
                      <div className={`p-4 rounded-xl border-2 border-dashed ${darkMode ? 'border-slate-700 bg-slate-950/50' : 'border-slate-300 bg-slate-100/50'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <ImageIcon className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          <span className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Imágenes del Hero</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${
                            darkMode ? 'border-slate-700 hover:border-blue-500 hover:bg-blue-950/20' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                          }`}>
                            <Upload className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            <span className={`text-[11px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Desktop (1920×800)</span>
                            <input type="file" accept="image/webp,image/png,image/jpeg" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSectionDraft({ ...sectionDraft, backgroundImage: URL.createObjectURL(file), _desktopFile: file });
                            }} />
                          </label>
                          <label className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${
                            darkMode ? 'border-slate-700 hover:border-blue-500 hover:bg-blue-950/20' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                          }`}>
                            <Upload className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            <span className={`text-[11px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Mobile (768×1024)</span>
                            <input type="file" accept="image/webp,image/png,image/jpeg" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSectionDraft({ ...sectionDraft, mobileImage: URL.createObjectURL(file), _mobileFile: file });
                            }} />
                          </label>
                        </div>
                        {(sectionDraft.backgroundImage || sectionDraft.mobileImage) && (
                          <div className="mt-3 flex gap-2">
                            {sectionDraft.backgroundImage && (
                              <img src={sectionDraft.backgroundImage} alt="Desktop preview" className="h-16 rounded-lg object-cover" />
                            )}
                            {sectionDraft.mobileImage && (
                              <img src={sectionDraft.mobileImage} alt="Mobile preview" className="h-16 rounded-lg object-cover" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className={`pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                        {[
                          { vKey: 'stat1Value', lKey: 'stat1Label', label: 'Stat 1' },
                          { vKey: 'stat2Value', lKey: 'stat2Label', label: 'Stat 2' },
                          { vKey: 'stat3Value', lKey: 'stat3Label', label: 'Stat 3' },
                        ].map((s) => (
                          <div key={s.vKey}>
                            <label className={`block text-[11px] font-semibold mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{s.label}</label>
                            <input type="text" value={sectionDraft[s.vKey] || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, [s.vKey]: e.target.value })} className={inputClass + ' mb-1'} placeholder="Valor" />
                            <input type="text" value={sectionDraft[s.lKey] || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, [s.lKey]: e.target.value })} className={inputClass} placeholder="Etiqueta" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ABOUT TAB */}
                  {activeContentTab === 'about' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Badge</label>
                          <input type="text" value={sectionDraft.badge || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, badge: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Título</label>
                          <input type="text" value={sectionDraft.title || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Párrafo 1 (Historia)</label>
                        <textarea rows={3} value={sectionDraft.paragraph1 || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, paragraph1: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Párrafo 2 (Calidad)</label>
                        <textarea rows={3} value={sectionDraft.paragraph2 || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, paragraph2: e.target.value })} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Misión</label>
                          <input type="text" value={sectionDraft.missionText || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, missionText: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Visión</label>
                          <input type="text" value={sectionDraft.visionText || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, visionText: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* B2B TAB */}
                  {activeContentTab === 'b2b' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Título B2B</label>
                          <input type="text" value={sectionDraft.title || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Texto Botón</label>
                          <input type="text" value={sectionDraft.submitButtonText || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, submitButtonText: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Subtítulo B2B</label>
                        <textarea rows={2} value={sectionDraft.subtitle || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                  )}

                  {/* RECYCLING TAB */}
                  {activeContentTab === 'recycling' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Título Línea 1</label>
                          <input type="text" value={sectionDraft.titleLine1 || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, titleLine1: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Título Línea 2</label>
                          <input type="text" value={sectionDraft.titleLine2 || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, titleLine2: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Métrica de Impacto</label>
                          <input type="text" value={sectionDraft.metricValue || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, metricValue: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Descripción Métrica</label>
                          <input type="text" value={sectionDraft.metricLabel || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, metricLabel: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OTHER TABS */}
                  {(activeContentTab === 'vehicleFinder' || activeContentTab === 'storeLocator' || activeContentTab === 'blog') && (
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Título</label>
                        <input type="text" value={sectionDraft.title || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Subtítulo</label>
                        <textarea rows={2} value={sectionDraft.subtitle || ''} onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                  )}

                  <div className={`pt-4 border-t flex justify-end ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <button
                      onClick={handleSaveCurrentSection}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.97]"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Guardar Cambios
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* 2. MÓDULO: PUNTOS DE VENTA MARESA */}
            {activeNav === 'distributors' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Puntos de Venta ({distributors.length})
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Agencias Maresa en las 24 provincias del Ecuador.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingDistributor(!isAddingDistributor)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-[0.97]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nueva Ubicación
                  </button>
                </div>

                {/* Add Distributor Form */}
                {isAddingDistributor && (
                  <form onSubmit={handleSaveNewDistributor} className={`${cardClass} p-5 space-y-4`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Nueva Agencia
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Nombre *</label>
                        <input type="text" required value={newDistributor.name || ''} onChange={(e) => setNewDistributor({ ...newDistributor, name: e.target.value })} placeholder="Maresa Center Norte" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Provincia *</label>
                        <select value={newDistributor.province} onChange={(e) => setNewDistributor({ ...newDistributor, province: e.target.value })} className={inputClass}>
                          {provinces.map(p => (<option key={p.id} value={p.name}>{p.name}</option>))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Ciudad *</label>
                        <input type="text" required value={newDistributor.city || ''} onChange={(e) => setNewDistributor({ ...newDistributor, city: e.target.value })} placeholder="Quito" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Dirección *</label>
                        <input type="text" required value={newDistributor.address || ''} onChange={(e) => setNewDistributor({ ...newDistributor, address: e.target.value })} placeholder="Av. Galo Plaza Lasso" className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Teléfono</label>
                        <input type="text" value={newDistributor.phone || ''} onChange={(e) => setNewDistributor({ ...newDistributor, phone: e.target.value })} placeholder="(02) 398-9000" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>WhatsApp</label>
                        <input type="text" value={newDistributor.whatsapp || ''} onChange={(e) => setNewDistributor({ ...newDistributor, whatsapp: e.target.value })} placeholder="593998123456" className={inputClass} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setIsAddingDistributor(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Cancelar</button>
                      <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer active:scale-[0.97]">Guardar</button>
                    </div>
                  </form>
                )}

                {/* Distributors Table */}
                <div className={`${cardClass} overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className={`w-full text-left text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <thead className={`uppercase text-[10px] tracking-wider border-b ${darkMode ? 'bg-slate-950 text-slate-500 border-slate-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        <tr>
                          <th className="p-3">Agencia</th>
                          <th className="p-3">Ubicación</th>
                          <th className="p-3">Dirección</th>
                          <th className="p-3">Contacto</th>
                          <th className="p-3 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                        {distributors.map((d) => (
                          <tr key={d.id} className={`transition-colors ${darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                            <td className={`p-3 font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{d.name}</td>
                            <td className="p-3">
                              <span className="text-blue-500 font-medium text-[11px]">{d.province}</span>
                              <span className={`block text-[11px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{d.city}</span>
                            </td>
                            <td className="p-3 max-w-xs truncate">{d.address}</td>
                            <td className="p-3">
                              <span className="block text-[11px]">{d.phone}</span>
                              <span className="block text-[11px] text-emerald-500">WA: {d.whatsapp}</span>
                            </td>
                            <td className="p-3 text-right">
                              <button onClick={() => handleDeleteDistributor(d.id)} className="p-1 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
                                <Trash2 className="w-3 h-3" />
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
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      CRM Proveedores B2B ({leads.length})
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Califica y contacta distribuidores que quieren unirse a Maresa.
                    </p>
                  </div>
                  <button
                    onClick={exportLeadsToExcel}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-[0.97]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Exportar Excel
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className={`flex items-center gap-1 p-0.5 rounded-lg border w-full sm:w-auto ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    {(['Todos', 'Pendiente', 'Aplica', 'No Aplica'] as const).map((filterOpt) => (
                      <button
                        key={filterOpt}
                        onClick={() => setLeadsFilter(filterOpt)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          leadsFilter === filterOpt
                            ? 'bg-blue-600 text-white'
                            : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {filterOpt}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full sm:w-56">
                    <Search className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Buscar empresa o ciudad..." value={leadsSearch} onChange={(e) => setLeadsSearch(e.target.value)} className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none ${
                      darkMode ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500' : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                    } focus:border-blue-500`} />
                  </div>
                </div>

                {/* Leads Table */}
                <div className={`${cardClass} overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className={`w-full text-left text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <thead className={`uppercase text-[10px] tracking-wider border-b ${darkMode ? 'bg-slate-950 text-slate-500 border-slate-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        <tr>
                          <th className="p-3.5">Empresa & Contacto</th>
                          <th className="p-3.5">Ubicación</th>
                          <th className="p-3.5">Tipo & Volumen</th>
                          <th className="p-3.5">Estado CRM</th>
                          <th className="p-3.5 text-right">Calificación</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
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
                            <tr key={lead.id} className={`transition-colors ${darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                              <td className="p-3">
                                <span className={`font-semibold block ${darkMode ? 'text-white' : 'text-slate-900'}`}>{lead.companyName}</span>
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
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Catálogo Vehicular ({vehicleCatalog.length})
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      CCA, tecnología y PVP oficial Ecuador.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-56">
                    <Search className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Buscar marca o modelo..." value={catalogSearch} onChange={(e) => setCatalogSearch(e.target.value)} className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none ${
                      darkMode ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500' : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                    } focus:border-blue-500`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicleCatalog
                    .filter(v => 
                      v.brand.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                      v.model.toLowerCase().includes(catalogSearch.toLowerCase())
                    )
                    .map((item) => (
                      <div key={item.id} className={`p-4 rounded-xl flex flex-col justify-between ${cardClass}`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-blue-500 uppercase">{item.brand} • {item.year}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{item.engine}</span>
                          </div>
                          <h3 className={`text-base font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.model}</h3>
                          <div className={`mt-2.5 p-2.5 rounded-lg ${darkMode ? 'bg-slate-950 border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
                            <div className={`flex items-center justify-between text-xs font-semibold mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              <span>{item.recommendedBattery.model}</span>
                              <span className="text-blue-500">${item.recommendedBattery.priceEcuador.toFixed(2)}</span>
                            </div>
                            <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              BCI: {item.recommendedBattery.bciGroup} • {item.recommendedBattery.cca} CCA • {item.recommendedBattery.ah} Ah • {item.recommendedBattery.technology}
                            </p>
                          </div>
                        </div>
                        <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                          <span>Garantía: <strong>{item.recommendedBattery.warrantyMonths}m</strong></span>
                          <span className="text-emerald-500 font-medium">Calibrado Ecuador</span>
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
