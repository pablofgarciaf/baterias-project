/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ADMIN SHELL — Unified Workspace, Sidebar & Responsive Drawer
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/admin/AdminShell.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Admin
 * ─────────────────────────────────────────────────────────────
 * 📱 Mobile: Google Apps style off-canvas drawer (zero double header)
 * 💻 Desktop: Collapsible sidebar with glassmorphic luxury tokens
 * 👥 Added "Usuarios" module for user access management
 * ─────────────────────────────────────────────────────────────
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  MapPin,
  Users as UsersIcon,
  Car,
  UserCheck,
  LogOut,
  RotateCw,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
} from 'lucide-react';
import ContentEditor from './ContentEditor';
import DistributorsManager from './DistributorsManager';
import LeadsManager from './LeadsManager';
import CatalogManager from './CatalogManager';
import UsersManager from './UsersManager';
import { AdminSidebarSection, GLASS_TOKENS } from '@/types/admin';
import { getDistributors, getB2BLeads } from '@/lib/firebaseStore';
import { getAdminUsers } from '@/lib/authService';
import { useSiteContent } from '@/context/SiteContentContext';

export default function AdminShell() {
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<AdminSidebarSection>('content');
  const [distributors, setDistributors] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState<number>(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { isSaved, resetToDefaults } = useSiteContent();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) setDarkMode(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dists, leadsData, usersList] = await Promise.all([
        getDistributors(),
        getB2BLeads(),
        getAdminUsers(),
      ]);
      setDistributors(dists);
      setLeads(leadsData);
      setUsersCount(usersList.length);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const pendingLeadsCount = leads.filter((l: any) => l.status === 'Pendiente').length;

  const navItems = [
    { id: 'content' as const, icon: FileText, label: 'Contenidos', badge: '7' },
    { id: 'distributors' as const, icon: MapPin, label: 'Puntos de Venta', badge: distributors.length },
    { id: 'leads' as const, icon: UsersIcon, label: 'CRM B2B', badge: pendingLeadsCount, highlight: true },
    { id: 'catalog' as const, icon: Car, label: 'Catálogo', badge: '0' },
    { id: 'users' as const, icon: UserCheck, label: 'Usuarios', badge: usersCount },
  ];

  const getModuleInfo = (nav: AdminSidebarSection) => {
    switch (nav) {
      case 'content':
        return { title: 'Editor de Contenidos', description: 'Modifica textos, imágenes y CTAs en vivo.' };
      case 'distributors':
        return { title: 'Puntos de Venta', description: 'Agencias Maresa en las 24 provincias del Ecuador.' };
      case 'leads':
        return { title: 'CRM Proveedores B2B', description: 'Gestión de postulaciones para distribución.' };
      case 'catalog':
        return { title: 'Catálogo Vehicular', description: 'Especificaciones técnicas y líneas de producto.' };
      case 'users':
        return { title: 'Usuarios y Accesos', description: 'Cuentas de administradores y operadores autorizados.' };
    }
  };

  const moduleInfo = getModuleInfo(activeNav);

  const handleLogout = () => {
    sessionStorage.removeItem('maresa_admin_auth');
    sessionStorage.removeItem('maresa_admin_email');
    window.location.href = '/admin';
  };

  const renderWorkspace = () => {
    switch (activeNav) {
      case 'content':
        return <ContentEditor darkMode={darkMode} />;
      case 'distributors':
        return <DistributorsManager darkMode={darkMode} />;
      case 'leads':
        return <LeadsManager darkMode={darkMode} />;
      case 'catalog':
        return <CatalogManager darkMode={darkMode} />;
      case 'users':
        return <UsersManager />;
    }
  };

  return (
    <div
      className={`h-screen flex flex-col font-sans transition-colors overflow-hidden ${
        darkMode ? 'bg-[#060B14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. UNIFIED TOP APP BAR (Single header for both Mobile & Desktop)
      ───────────────────────────────────────────────────────────── */}
      <header
        className={`h-14 border-b flex items-center justify-between px-4 sm:px-6 z-30 transition-all ${
          isSidebarOpen ? 'md:ml-56 lg:ml-60' : 'md:ml-16 lg:ml-20'
        } ${darkMode ? 'bg-[#0A0F1C]/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-xl`}
      >
        {/* Left: Mobile hamburger + Active module title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden p-2 -ml-1 rounded-xl hover:bg-slate-800/40 text-slate-400 hover:text-white transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-sm sm:text-base tracking-tight truncate">
              {moduleInfo.title}
            </span>
            <span
              className={`hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full border ${
                darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Maresa Admin
            </span>
          </div>
        </div>

        {/* Right: Actions (Theme toggle, Reset, Logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isSaved && (
            <span
              className={`hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                darkMode ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40' : 'text-emerald-600 bg-emerald-50 border border-emerald-200'
              }`}
            >
              <Check className="w-3 h-3" />
              Guardado
            </span>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              darkMode ? 'text-slate-400 hover:text-amber-400 hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`hidden md:flex w-8 h-8 rounded-xl items-center justify-center transition-colors cursor-pointer ${
              darkMode ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            aria-label={isSidebarOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <button
            onClick={resetToDefaults}
            className={`hidden sm:flex px-2.5 py-1.5 rounded-xl text-xs font-medium items-center gap-1.5 transition-colors cursor-pointer ${
              darkMode ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Restablecer</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ml-1"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE DRAWER BACKDROP (Google Apps style overlay)
      ───────────────────────────────────────────────────────────── */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. SIDEBAR (Fixed on desktop, Slide-over Drawer on mobile)
      ───────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 border-r border-white/5 bg-[#060B14] text-slate-100 ${
          // Mobile state: off-canvas drawer
          isMobileDrawerOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full'
        } ${
          // Desktop state: always visible, collapsible width
          'md:translate-x-0 ' + (isSidebarOpen ? 'md:w-56 lg:w-60' : 'md:w-16 lg:w-20')
        }`}
      >
        {/* Branding Top */}
        <div
          className="h-14 px-4 flex items-center justify-between border-b border-slate-800"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
              <span className="font-extrabold text-xs text-white tracking-tighter">MBT</span>
            </div>
            {(isSidebarOpen || isMobileDrawerOpen) && (
              <div className="leading-none min-w-0 truncate">
                <span className="font-bold text-sm tracking-tight block truncate text-white">
                  Maresa CMS
                </span>
                <span className="text-[10px] text-blue-500 font-semibold block mt-0.5">
                  Panel Corporativo
                </span>
              </div>
            )}
          </div>

          {/* Close button inside mobile drawer */}
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="md:hidden p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-slate-800/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modules Section Header */}
        <div className="px-4 py-2.5">
          {(isSidebarOpen || isMobileDrawerOpen) && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Módulos Principales
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setIsMobileDrawerOpen(false); // Close drawer on mobile click
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)] border border-blue-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:border-white/10 border border-transparent hover:text-white'
                }`}
                title={!isSidebarOpen && !isMobileDrawerOpen ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <item.icon className="w-4 h-4 shrink-0" />
                  {(isSidebarOpen || isMobileDrawerOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {(isSidebarOpen || isMobileDrawerOpen) && item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.highlight
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User info */}
        <div
          className="p-3 border-t border-slate-800 text-[11px] text-slate-500"
        >
          {(isSidebarOpen || isMobileDrawerOpen) && (
            <div className="flex items-center gap-2 px-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span className="truncate font-medium">pablofgarciaf@gmail.com</span>
            </div>
          )}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          4. WORKSPACE (Adapts to desktop sidebar margin, full width on mobile)
      ───────────────────────────────────────────────────────────── */}
      <main
        className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-56 lg:ml-60' : 'md:ml-16 lg:ml-20'
        }`}
      >
        <div className="max-w-6xl mx-auto">{renderWorkspace()}</div>
      </main>
    </div>
  );
}