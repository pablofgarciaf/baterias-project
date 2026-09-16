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
  Image as ImageIcon
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { B2BLead, DistributorLocation } from '@/types/sinergia';
import { getB2BLeads, updateLeadStatus, getDistributors, saveDistributor, removeDistributor } from '@/lib/firebaseStore';
import { provinces } from '@/data/provinces';
import { useSiteContent } from '@/context/SiteContentContext';
import { vehicleCatalog } from '@/data/sinergiaData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminSidebarSection = 'content' | 'distributors' | 'leads' | 'catalog';
type ContentSectionKey = 'hero' | 'about' | 'vehicleFinder' | 'storeLocator' | 'b2b' | 'recycling' | 'blog';

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Sidebar navigation
  const [activeNav, setActiveNav] = useState<AdminSidebarSection>('content');
  const [activeContentTab, setActiveContentTab] = useState<ContentSectionKey>('hero');

  // Site content context
  const { content, updateSection, resetToDefaults, isSaved } = useSiteContent();

  // Local draft state for the current active section to edit
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
    services: ['Diagnóstico gratis', 'Instalación express'],
    isAuthorized: true,
    rating: 4.8
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
      console.error(err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      loadAllData();
    }
  }, [isAuthenticated, isOpen]);

  if (!isOpen) return null;

  // Simple secure backoffice authentication
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'maresa2026' || password === 'admin' || password === 'sinergia') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. (Prueba con "maresa2026")');
    }
  };

  // Export to Excel (.xlsx) as requested in SinergIA Technical Document
  const handleExportExcel = () => {
    if (leads.length === 0) return;

    const dataToExport = leads.map(l => ({
      'ID Solicitud': l.id,
      'Fecha': new Date(l.createdAt).toLocaleDateString('es-EC'),
      'Razón Social': l.companyName,
      'Contacto': l.contactName,
      'Email': l.email,
      'Teléfono': l.phone,
      'Provincia': l.province,
      'Ciudad': l.city,
      'Tipo de Negocio': l.businessType,
      'Volumen Mensual': l.estimatedVolume,
      'Dictamen / Estado': l.status,
      'Notas': l.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Proveedores B2B');

    // Generate Excel file
    XLSX.writeFile(workbook, `Maresa_Proveedores_B2B_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Lead approval / rejection handlers
  const handleLeadDecision = async (id: string, decision: 'Aplica' | 'No Aplica' | 'Pendiente') => {
    await updateLeadStatus(id, decision);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: decision } : l));
  };

  // Save Content Section
  const handleSaveContentSection = (e: FormEvent) => {
    e.preventDefault();
    updateSection(activeContentTab, sectionDraft);
  };

  const handleSaveNewDistributor = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDistributor.name || !newDistributor.city) return;

    const distToSave: DistributorLocation = {
      id: 'dist-' + Date.now(),
      name: newDistributor.name || '',
      province: newDistributor.province || 'Pichincha',
      city: newDistributor.city || '',
      address: newDistributor.address || '',
      phone: newDistributor.phone || '',
      whatsapp: newDistributor.whatsapp || '',
      schedule: newDistributor.schedule || 'Lunes a Viernes',
      latitude: Number(newDistributor.latitude) || -0.1807,
      longitude: Number(newDistributor.longitude) || -78.4678,
      services: newDistributor.services || ['Diagnóstico gratis'],
      isAuthorized: true,
      rating: 4.8
    };

    await saveDistributor(distToSave);
    setDistributors(prev => [distToSave, ...prev]);
    setIsAddingDistributor(false);
  };

  const handleDeleteDistributor = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este distribuidor de la red?')) {
      await removeDistributor(id);
      setDistributors(prev => prev.filter(d => d.id !== id));
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesFilter = 
      leadsFilter === 'Todos' ? true :
      leadsFilter === 'Aplica' ? (l.status === 'Aplica' || l.status === 'Aprobado') :
      leadsFilter === 'No Aplica' ? (l.status === 'No Aplica' || l.status === 'Descartado') :
      (l.status === 'Pendiente' || l.status === 'Contactado');

    const matchesSearch = 
      l.companyName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.contactName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.city.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.phone.includes(leadsSearch);

    return matchesFilter && matchesSearch;
  });

  const filteredCatalog = vehicleCatalog.filter(v => 
    v.brand.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    v.model.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    v.recommendedBattery.model.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto h-[92vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 bg-gray-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center font-bold shadow-md shadow-primary-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                Panel Administrativo Maresa • SinergIA
              </h2>
              <p className="text-xs text-gray-400 hidden sm:block">
                Administrador de Contenidos (CMS), Puntos de Venta y Aprobación de Proveedores B2B
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                Cambios actualizados en vivo
              </span>
            )}

            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              title="Cerrar panel"
            >
              ✕
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">
                Acceso al Administrador Maresa
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Ingresa tus credenciales autorizadas para gestionar contenidos, puntos de venta y prospectos.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Contraseña (p. ej. maresa2026)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>

              {authError && (
                <p className="text-xs text-red-600 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full btn-primary py-3 text-sm font-bold shadow-lg shadow-primary-600/30"
              >
                Ingresar al Panel
              </button>
            </form>
          </div>
        ) : (
          /* Main Dashboard Layout with Sidebar */
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Sidebar */}
            <aside className="w-64 sm:w-72 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-gray-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Módulos de Gestión
                </span>
              </div>

              <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
                <button
                  onClick={() => setActiveNav('content')}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    activeNav === 'content'
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : 'text-gray-700 hover:bg-gray-200/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    Editor de Contenidos
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeNav === 'content' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    Landing
                  </span>
                </button>

                <button
                  onClick={() => setActiveNav('distributors')}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    activeNav === 'distributors'
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : 'text-gray-700 hover:bg-gray-200/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    Puntos de Venta & Mapa
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeNav === 'distributors' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {distributors.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveNav('leads')}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    activeNav === 'leads'
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : 'text-gray-700 hover:bg-gray-200/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    Proveedores B2B
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeNav === 'leads' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {leads.length} leads
                  </span>
                </button>

                <button
                  onClick={() => setActiveNav('catalog')}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    activeNav === 'catalog'
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : 'text-gray-700 hover:bg-gray-200/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Car className="w-4 h-4" />
                    Catálogo de Baterías
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeNav === 'catalog' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {vehicleCatalog.length}
                  </span>
                </button>
              </nav>

              <div className="p-4 border-t border-gray-200 bg-white/50">
                <div className="text-[11px] text-gray-500 font-medium leading-tight">
                  <span className="font-bold text-gray-800 block mb-1">Maresa Ecuador</span>
                  Los cambios se reflejan inmediatamente en el sitio web en tiempo real.
                </div>
              </div>
            </aside>

            {/* Right Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-white">

              {/* 1. CONTENT EDITOR (CMS) */}
              {activeNav === 'content' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Content Sections Tabs */}
                  <div className="px-6 py-3 bg-gray-100/80 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 overflow-x-auto flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 'hero', label: '1. Home / Hero', icon: Home },
                        { id: 'about', label: '2. Quiénes somos', icon: Info },
                        { id: 'vehicleFinder', label: '3. Escoge tu batería', icon: Car },
                        { id: 'storeLocator', label: '4. Puntos de venta', icon: MapPin },
                        { id: 'b2b', label: '5. Quiero ser proveedor', icon: Briefcase },
                        { id: 'recycling', label: '6. Reciclaje', icon: Recycle },
                        { id: 'blog', label: '7. Blog', icon: BookOpen },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveContentTab(tab.id as ContentSectionKey);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                            activeContentTab === tab.id
                              ? 'bg-white text-primary-700 shadow-sm border border-gray-200'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                          }`}
                        >
                          <tab.icon className="w-3.5 h-3.5" />
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={resetToDefaults}
                      className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors px-2 py-1 rounded cursor-pointer"
                      title="Restablecer textos y colores por defecto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restablecer originales
                    </button>
                  </div>

                  {/* Content Edit Form */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSaveContentSection} className="max-w-4xl space-y-6">
                      
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <div>
                          <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-tight">
                            Editando Sección: {activeContentTab.toUpperCase()}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Modifica con precisión los textos, puntos, comas, fotos y colores de botones para esta sección.
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 shadow-md shadow-primary-600/20"
                        >
                          <Save className="w-4 h-4" />
                          Guardar Cambios de Esta Sección
                        </button>
                      </div>

                      {/* SECTION 1: HERO */}
                      {activeContentTab === 'hero' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Badge Superior</label>
                              <input
                                type="text"
                                value={sectionDraft?.badgeText || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, badgeText: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Imagen de Fondo (URL)</label>
                              <input
                                type="text"
                                value={sectionDraft?.backgroundImage || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, backgroundImage: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Título Principal (Línea 1)</label>
                              <input
                                type="text"
                                value={sectionDraft?.titleMain || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, titleMain: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-primary-500 outline-none font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Título Resaltado en Gradiente</label>
                              <input
                                type="text"
                                value={sectionDraft?.titleHighlight || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, titleHighlight: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-primary-500 outline-none font-bold text-primary-600"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Subtítulo Descriptivo</label>
                            <textarea
                              rows={3}
                              value={sectionDraft?.subtitle || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Texto del Botón CTA Principal</label>
                              <input
                                type="text"
                                value={sectionDraft?.ctaButtonText || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, ctaButtonText: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                                <Palette className="w-3.5 h-3.5 text-primary-600" />
                                Color del Botón CTA (Hexadecimal)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={sectionDraft?.ctaButtonColor || '#e11d48'}
                                  onChange={(e) => setSectionDraft({ ...sectionDraft, ctaButtonColor: e.target.value })}
                                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                                />
                                <input
                                  type="text"
                                  value={sectionDraft?.ctaButtonColor || '#e11d48'}
                                  onChange={(e) => setSectionDraft({ ...sectionDraft, ctaButtonColor: e.target.value })}
                                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 bg-white font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 pt-2">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">Stat 1</label>
                              <input
                                type="text"
                                value={sectionDraft?.stat1Value || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, stat1Value: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-300 mb-1"
                              />
                              <input
                                type="text"
                                value={sectionDraft?.stat1Label || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, stat1Label: e.target.value })}
                                className="w-full px-2 py-1 text-[11px] rounded border border-gray-300"
                              />
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">Stat 2</label>
                              <input
                                type="text"
                                value={sectionDraft?.stat2Value || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, stat2Value: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-300 mb-1"
                              />
                              <input
                                type="text"
                                value={sectionDraft?.stat2Label || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, stat2Label: e.target.value })}
                                className="w-full px-2 py-1 text-[11px] rounded border border-gray-300"
                              />
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">Stat 3</label>
                              <input
                                type="text"
                                value={sectionDraft?.stat3Value || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, stat3Value: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-300 mb-1"
                              />
                              <input
                                type="text"
                                value={sectionDraft?.stat3Label || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, stat3Label: e.target.value })}
                                className="w-full px-2 py-1 text-[11px] rounded border border-gray-300"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SECTION 2: QUIÉNES SOMOS */}
                      {activeContentTab === 'about' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Badge</label>
                              <input
                                type="text"
                                value={sectionDraft?.badge || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, badge: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Imagen Institucional (URL)</label>
                              <input
                                type="text"
                                value={sectionDraft?.aboutImage || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, aboutImage: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Título de la Sección</label>
                            <input
                              type="text"
                              value={sectionDraft?.title || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-gray-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Párrafo 1 (Historia)</label>
                            <textarea
                              rows={3}
                              value={sectionDraft?.paragraph1 || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, paragraph1: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Párrafo 2 (Tecnología y Calidad)</label>
                            <textarea
                              rows={3}
                              value={sectionDraft?.paragraph2 || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, paragraph2: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <label className="block text-xs font-bold text-gray-700 mb-1">Misión</label>
                              <input
                                type="text"
                                placeholder="Título"
                                value={sectionDraft?.missionTitle || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, missionTitle: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-300 mb-1.5"
                              />
                              <textarea
                                rows={2}
                                value={sectionDraft?.missionText || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, missionText: e.target.value })}
                                className="w-full px-2 py-1 text-xs rounded border border-gray-300"
                              />
                            </div>

                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <label className="block text-xs font-bold text-gray-700 mb-1">Visión</label>
                              <input
                                type="text"
                                placeholder="Título"
                                value={sectionDraft?.visionTitle || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, visionTitle: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-300 mb-1.5"
                              />
                              <textarea
                                rows={2}
                                value={sectionDraft?.visionText || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, visionText: e.target.value })}
                                className="w-full px-2 py-1 text-xs rounded border border-gray-300"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SECTION 3: ESCOGE TU BATERÍA */}
                      {activeContentTab === 'vehicleFinder' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Badge Superior</label>
                            <input
                              type="text"
                              value={sectionDraft?.badge || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, badge: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Título Principal</label>
                            <input
                              type="text"
                              value={sectionDraft?.title || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-gray-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Subtítulo</label>
                            <textarea
                              rows={2}
                              value={sectionDraft?.subtitle || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>

                          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                            <h4 className="text-xs font-bold text-gray-800">Banner de Asesoría Técnica</h4>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Título Banner</label>
                              <input
                                type="text"
                                value={sectionDraft?.technicalHelpTitle || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, technicalHelpTitle: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Subtítulo Banner</label>
                              <input
                                type="text"
                                value={sectionDraft?.technicalHelpSubtitle || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, technicalHelpSubtitle: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Texto Botón WhatsApp</label>
                                <input
                                  type="text"
                                  value={sectionDraft?.whatsappButtonText || ''}
                                  onChange={(e) => setSectionDraft({ ...sectionDraft, whatsappButtonText: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Color Botón WhatsApp</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={sectionDraft?.whatsappButtonColor || '#059669'}
                                    onChange={(e) => setSectionDraft({ ...sectionDraft, whatsappButtonColor: e.target.value })}
                                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
                                  />
                                  <input
                                    type="text"
                                    value={sectionDraft?.whatsappButtonColor || '#059669'}
                                    onChange={(e) => setSectionDraft({ ...sectionDraft, whatsappButtonColor: e.target.value })}
                                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SECTION 4: PUNTOS DE VENTA */}
                      {activeContentTab === 'storeLocator' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Badge</label>
                            <input
                              type="text"
                              value={sectionDraft?.badge || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, badge: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Título</label>
                            <input
                              type="text"
                              value={sectionDraft?.title || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Subtítulo</label>
                            <textarea
                              rows={2}
                              value={sectionDraft?.subtitle || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Placeholder de Búsqueda</label>
                            <input
                              type="text"
                              value={sectionDraft?.searchPlaceholder || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, searchPlaceholder: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>
                        </div>
                      )}

                      {/* SECTION 5: B2B LEADS */}
                      {activeContentTab === 'b2b' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Badge</label>
                            <input
                              type="text"
                              value={sectionDraft?.badge || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, badge: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Título de Expansión Comercial</label>
                            <input
                              type="text"
                              value={sectionDraft?.title || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Subtítulo</label>
                            <textarea
                              rows={2}
                              value={sectionDraft?.subtitle || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">Beneficio 1</label>
                              <input
                                type="text"
                                value={sectionDraft?.benefit1Title || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, benefit1Title: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-300 mb-1"
                              />
                              <input
                                type="text"
                                value={sectionDraft?.benefit1Desc || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, benefit1Desc: e.target.value })}
                                className="w-full px-2 py-1 text-[11px] rounded border border-gray-300"
                              />
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">Beneficio 2</label>
                              <input
                                type="text"
                                value={sectionDraft?.benefit2Title || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, benefit2Title: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-300 mb-1"
                              />
                              <input
                                type="text"
                                value={sectionDraft?.benefit2Desc || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, benefit2Desc: e.target.value })}
                                className="w-full px-2 py-1 text-[11px] rounded border border-gray-300"
                              />
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">Beneficio 3</label>
                              <input
                                type="text"
                                value={sectionDraft?.benefit3Title || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, benefit3Title: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-300 mb-1"
                              />
                              <input
                                type="text"
                                value={sectionDraft?.benefit3Desc || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, benefit3Desc: e.target.value })}
                                className="w-full px-2 py-1 text-[11px] rounded border border-gray-300"
                              />
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">Beneficio 4</label>
                              <input
                                type="text"
                                value={sectionDraft?.benefit4Title || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, benefit4Title: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-300 mb-1"
                              />
                              <input
                                type="text"
                                value={sectionDraft?.benefit4Desc || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, benefit4Desc: e.target.value })}
                                className="w-full px-2 py-1 text-[11px] rounded border border-gray-300"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Texto del Botón de Envío</label>
                              <input
                                type="text"
                                value={sectionDraft?.submitButtonText || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, submitButtonText: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Color del Botón de Envío</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={sectionDraft?.submitButtonColor || '#2563eb'}
                                  onChange={(e) => setSectionDraft({ ...sectionDraft, submitButtonColor: e.target.value })}
                                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                                />
                                <input
                                  type="text"
                                  value={sectionDraft?.submitButtonColor || '#2563eb'}
                                  onChange={(e) => setSectionDraft({ ...sectionDraft, submitButtonColor: e.target.value })}
                                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 bg-white font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SECTION 6: RECICLAJE */}
                      {activeContentTab === 'recycling' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Badge</label>
                              <input
                                type="text"
                                value={sectionDraft?.badge || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, badge: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Fondo Foto (URL)</label>
                              <input
                                type="text"
                                value={sectionDraft?.backgroundImage || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, backgroundImage: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Título Línea 1</label>
                              <input
                                type="text"
                                value={sectionDraft?.titleLine1 || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, titleLine1: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Título Línea 2 (Destacado)</label>
                              <input
                                type="text"
                                value={sectionDraft?.titleLine2 || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, titleLine2: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-gray-300 text-emerald-600"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Subtítulo</label>
                            <textarea
                              rows={3}
                              value={sectionDraft?.subtitle || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Métrica Impacto (ej: 190L)</label>
                              <input
                                type="text"
                                value={sectionDraft?.metricValue || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, metricValue: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Etiqueta Métrica</label>
                              <input
                                type="text"
                                value={sectionDraft?.metricLabel || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, metricLabel: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Texto Botón</label>
                              <input
                                type="text"
                                value={sectionDraft?.ctaButtonText || ''}
                                onChange={(e) => setSectionDraft({ ...sectionDraft, ctaButtonText: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Color Botón</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={sectionDraft?.ctaButtonColor || '#059669'}
                                  onChange={(e) => setSectionDraft({ ...sectionDraft, ctaButtonColor: e.target.value })}
                                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                                />
                                <input
                                  type="text"
                                  value={sectionDraft?.ctaButtonColor || '#059669'}
                                  onChange={(e) => setSectionDraft({ ...sectionDraft, ctaButtonColor: e.target.value })}
                                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 bg-white font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SECTION 7: BLOG */}
                      {activeContentTab === 'blog' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Badge</label>
                            <input
                              type="text"
                              value={sectionDraft?.badge || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, badge: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Título</label>
                            <input
                              type="text"
                              value={sectionDraft?.title || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Subtítulo</label>
                            <textarea
                              rows={2}
                              value={sectionDraft?.subtitle || ''}
                              onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300"
                            />
                          </div>
                        </div>
                      )}

                    </form>
                  </div>
                </div>
              )}

              {/* 2. PUNTOS DE VENTA & UBICACIONES */}
              {activeNav === 'distributors' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">
                        Puntos de Venta & Red de Distribuidores ({distributors.length})
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Locales que se visualizan en el mapa interactivo geoespacial de las 24 provincias.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingDistributor(!isAddingDistributor)}
                      className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      {isAddingDistributor ? 'Cancelar' : 'Agregar Nuevo Local'}
                    </button>
                  </div>

                  {isAddingDistributor && (
                    <form onSubmit={handleSaveNewDistributor} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-fade-in">
                      <h4 className="font-bold text-sm text-gray-800">Nuevo Punto de Distribución</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre del Local *</label>
                          <input
                            type="text"
                            required
                            placeholder="Maresa Center..."
                            value={newDistributor.name}
                            onChange={(e) => setNewDistributor({ ...newDistributor, name: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Provincia *</label>
                          <select
                            value={newDistributor.province}
                            onChange={(e) => setNewDistributor({ ...newDistributor, province: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                          >
                            {provinces.map(p => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Ciudad *</label>
                          <input
                            type="text"
                            required
                            placeholder="Quito, Manta, Cuenca..."
                            value={newDistributor.city}
                            onChange={(e) => setNewDistributor({ ...newDistributor, city: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección Exacta</label>
                          <input
                            type="text"
                            placeholder="Av. Principal y Secundaria"
                            value={newDistributor.address}
                            onChange={(e) => setNewDistributor({ ...newDistributor, address: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono</label>
                          <input
                            type="text"
                            placeholder="(02) 234-5678"
                            value={newDistributor.phone}
                            onChange={(e) => setNewDistributor({ ...newDistributor, phone: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp (593...)</label>
                          <input
                            type="text"
                            placeholder="593998123456"
                            value={newDistributor.whatsapp}
                            onChange={(e) => setNewDistributor({ ...newDistributor, whatsapp: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn-primary py-2 px-5 text-xs font-bold">
                        Guardar Punto en Base de Datos
                      </button>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {distributors.map(d => (
                      <div key={d.id} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                              {d.province}
                            </span>
                            <button
                              onClick={() => handleDeleteDistributor(d.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                              title="Eliminar punto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4 className="font-extrabold text-sm text-gray-900">{d.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{d.address}, {d.city}</p>
                          <p className="text-xs text-gray-500 mt-1 font-mono">Tel: {d.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* 3. PROVEEDORES B2B - REVISIÓN & APROBACIÓN */}
              {activeNav === 'leads' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Top Bar: Controls, Filters and Export */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">
                        Revisión de Proveedores & Talleres Postulantes ({filteredLeads.length})
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        En esta sección apruebas si los solicitantes <strong>Aplican</strong> o <strong>No Aplican</strong> para la red oficial.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={loadAllData}
                        disabled={isLoadingLeads}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                        Recargar
                      </button>

                      <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Exportar a Excel (.xlsx)
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Filtrar dictamen:</span>
                      {[
                        { id: 'Todos', label: 'Todos' },
                        { id: 'Aplica', label: '✓ Aplica' },
                        { id: 'No Aplica', label: '✕ No Aplica' },
                        { id: 'Pendiente', label: '⏳ En Revisión' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setLeadsFilter(f.id as any)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            leadsFilter === f.id
                              ? f.id === 'Aplica' ? 'bg-emerald-600 text-white' :
                                f.id === 'No Aplica' ? 'bg-red-600 text-white' :
                                f.id === 'Pendiente' ? 'bg-amber-500 text-white' :
                                'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-72">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar por empresa, contacto, ciudad..."
                        value={leadsSearch}
                        onChange={(e) => setLeadsSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Leads Cards Grid with Direct "Aplica" / "No Aplica" decision buttons */}
                  <div className="space-y-3">
                    {filteredLeads.length === 0 ? (
                      <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-200">
                        <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-600">No se encontraron solicitudes en esta categoría.</p>
                      </div>
                    ) : (
                      filteredLeads.map((lead) => {
                        const isAplica = lead.status === 'Aplica' || lead.status === 'Aprobado';
                        const isNoAplica = lead.status === 'No Aplica' || lead.status === 'Descartado';
                        
                        return (
                          <div
                            key={lead.id}
                            className={`p-5 rounded-2xl border transition-all ${
                              isAplica ? 'bg-emerald-50/40 border-emerald-300 shadow-sm' :
                              isNoAplica ? 'bg-red-50/30 border-red-200 opacity-80' :
                              'bg-white border-gray-200 shadow-sm'
                            }`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              
                              {/* Company details */}
                              <div className="space-y-1 max-w-xl">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-sm text-gray-900">
                                    {lead.companyName}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                                    {lead.businessType}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                  </span>
                                </div>

                                <div className="text-xs text-gray-700 font-medium">
                                  Contacto: <strong>{lead.contactName}</strong> • Tel: <a href={`tel:${lead.phone}`} className="text-primary-600 hover:underline">{lead.phone}</a> • Email: <span className="text-gray-500">{lead.email}</span>
                                </div>

                                <div className="text-xs text-gray-600 flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span>{lead.city}, {lead.province}</span>
                                  <span className="text-gray-300">•</span>
                                  <span>Volumen mensual estimado: <strong>{lead.estimatedVolume}</strong></span>
                                </div>

                                {lead.notes && (
                                  <p className="text-xs text-gray-500 italic bg-white/70 p-2 rounded-lg border border-gray-200 mt-2">
                                    "{lead.notes}"
                                  </p>
                                )}
                              </div>

                              {/* Decision buttons */}
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-[11px] font-bold">
                                  Estado: {' '}
                                  <span className={`px-2.5 py-1 rounded-full ${
                                    isAplica ? 'bg-emerald-100 text-emerald-800' :
                                    isNoAplica ? 'bg-red-100 text-red-800' :
                                    'bg-amber-100 text-amber-800'
                                  }`}>
                                    {lead.status}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                  <button
                                    onClick={() => handleLeadDecision(lead.id!, 'Aplica')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                      isAplica
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Aplica
                                  </button>

                                  <button
                                    onClick={() => handleLeadDecision(lead.id!, 'No Aplica')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                      isNoAplica
                                        ? 'bg-red-600 text-white shadow-sm'
                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                    }`}
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    No Aplica
                                  </button>

                                  <button
                                    onClick={() => handleLeadDecision(lead.id!, 'Pendiente')}
                                    className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 cursor-pointer"
                                  >
                                    Revisión
                                  </button>
                                </div>
                              </div>

                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              )}

              {/* 4. CATÁLOGO VEHICULAR Y BATERÍAS */}
              {activeNav === 'catalog' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">
                        Catálogo de Compatibilidad Vehicular (Interstate / Maresa)
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Base de datos de correspondencia Año &gt; Marca &gt; Modelo con especificaciones BCI y CCA.
                      </p>
                    </div>

                    <div className="relative w-72">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar vehículo o modelo de batería..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                        <tr>
                          <th className="p-3">Año & Vehículo</th>
                          <th className="p-3">Motor</th>
                          <th className="p-3">Batería Asignada</th>
                          <th className="p-3">Grupo BCI & CCA</th>
                          <th className="p-3">Tecnología</th>
                          <th className="p-3">Garantía</th>
                          <th className="p-3 text-right">Precio Ref. (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredCatalog.map((v) => (
                          <tr key={v.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-gray-900">
                              {v.year} {v.brand} {v.model}
                            </td>
                            <td className="p-3 text-gray-600">{v.engine}</td>
                            <td className="p-3 font-extrabold text-primary-700">
                              {v.recommendedBattery.model}
                            </td>
                            <td className="p-3 font-mono text-gray-700">
                              Grupo {v.recommendedBattery.bciGroup} • {v.recommendedBattery.cca} CCA
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                                {v.recommendedBattery.technology}
                              </span>
                            </td>
                            <td className="p-3 text-gray-600">
                              {v.recommendedBattery.warrantyMonths} meses
                            </td>
                            <td className="p-3 text-right font-extrabold text-gray-900">
                              ${v.recommendedBattery.priceEcuador.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </main>

          </div>
        )}

      </div>
    </div>
  );
}
