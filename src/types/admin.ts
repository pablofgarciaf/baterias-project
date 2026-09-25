/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ADMIN TYPES - Shared TypeScript interfaces for Admin Panel
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/types/admin.ts
 * 🏷️ Type: Type Definitions Barrel
 * 📦 Module: Admin
 * ─────────────────────────────────────────────────────────────
 * 🔍 EXPORTS:
 *   - Navigation types (AdminSidebarSection, ContentSectionKey)
 *   - Component prop interfaces (GlassCard, GlassInput, GlassButton, etc.)
 *   - Data types (Leads, Distributors, Catalog)
 *   - Hook return types
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ═══════════════════════════════════════════════════════════════
 */

import { LucideIcon } from 'lucide-react';
import { B2BLead, DistributorLocation, VehicleBatteryMatch } from './sinergia';

// ============================================
// NAVIGATION TYPES
// ============================================

export type AdminSidebarSection = 'content' | 'distributors' | 'leads' | 'catalog' | 'users';
export type ContentSectionKey = 'hero' | 'about' | 'vehicleFinder' | 'storeLocator' | 'b2b' | 'recycling' | 'blog';

export interface NavItemConfig {
  id: AdminSidebarSection;
  icon: LucideIcon;
  label: string;
  badge: string | number;
  highlight?: boolean;
}

export interface EditorTabConfig {
  id: ContentSectionKey;
  label: string;
  icon: LucideIcon;
}

// ============================================
// GLASSMORPHISM DESIGN SYSTEM TYPES
// ============================================

export type GlassVariant = 'default' | 'elevated' | 'outlined' | 'subtle';
export type GlassSize = 'sm' | 'md' | 'lg' | 'xl';

export interface GlassCardProps {
  variant?: GlassVariant;
  size?: GlassSize;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  'data-testid'?: string;
}

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  variant?: GlassVariant;
  helperText?: string;
}

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: GlassVariant;
  helperText?: string;
  rows?: number;
}

export interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  variant?: GlassVariant;
  helperText?: string;
}

export type GlassButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
export type GlassButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export interface GlassBadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}

export interface GlassTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  renderRow?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  loading?: boolean;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}

// ============================================
// ADMIN DATA TYPES (extending sinergia)
// ============================================

export interface LeadFilters {
  status: 'Todos' | 'Pendiente' | 'Contactado' | 'Aprobado' | 'Descartado' | 'Aplica' | 'No Aplica';
  search: string;
}

export interface DistributorFilters {
  search: string;
  province?: string;
}

export interface CatalogFilters {
  search: string;
}

export interface AdminDataState {
  leads: B2BLead[];
  distributors: DistributorLocation[];
  catalog: VehicleBatteryMatch[];
  isLoading: boolean;
  error: string | null;
}

export interface AdminMutations {
  // Leads
  updateLeadStatus: (id: string, status: B2BLead['status']) => Promise<void>;
  exportLeadsToExcel: () => void;
  // Distributors
  saveDistributor: (distributor: DistributorLocation) => Promise<void>;
  deleteDistributor: (id: string) => Promise<void>;
  // Content
  saveContentSection: (section: ContentSectionKey, data: any) => void;
  resetContentToDefaults: () => void;
}

// ============================================
// HOOK RETURN TYPES
// ============================================

export interface UseAdminAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  authError: string;
  setAuthError: (error: string) => void;
}

export interface UseAdminDataReturn extends AdminDataState {
  refetch: () => Promise<void>;
  mutations: AdminMutations;
}

export interface UseContentEditorReturn {
  activeTab: ContentSectionKey;
  setActiveTab: (tab: ContentSectionKey) => void;
  sectionDraft: any;
  setSectionDraft: (data: any) => void;
  isSaved: boolean;
  saveCurrentSection: () => void;
  resetToDefaults: () => void;
  tabs: EditorTabConfig[];
}

export interface UseDistributorsReturn {
  distributors: DistributorLocation[];
  isLoading: boolean;
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
  newDistributor: Partial<DistributorLocation>;
  setNewDistributor: (data: Partial<DistributorLocation>) => void;
  saveDistributor: (e: React.FormEvent) => Promise<void>;
  deleteDistributor: (id: string) => Promise<void>;
  resetForm: () => void;
}

export interface UseLeadsReturn {
  leads: B2BLead[];
  isLoading: boolean;
  filters: LeadFilters;
  setFilters: (filters: Partial<LeadFilters>) => void;
  filteredLeads: B2BLead[];
  updateLeadStatus: (id: string, status: B2BLead['status']) => Promise<void>;
  exportToExcel: () => void;
}

export interface UseCatalogReturn {
  catalog: VehicleBatteryMatch[];
  search: string;
  setSearch: (search: string) => void;
  filteredCatalog: VehicleBatteryMatch[];
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface AuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface LoginScreenProps {
  onLogin: (password: string) => Promise<boolean>;
  authError: string;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export interface TopBarProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  isSaved: boolean;
  onResetToDefaults: () => void;
  onLogout: () => void;
}

export interface SidebarNavigationProps {
  activeNav: AdminSidebarSection;
  onNavChange: (nav: AdminSidebarSection) => void;
  distributorsCount: number;
  pendingLeadsCount: number;
  catalogCount: number;
  darkMode: boolean;
}

export interface NavItemProps {
  config: NavItemConfig;
  isActive: boolean;
  onClick: () => void;
  darkMode: boolean;
}

export interface WorkspaceProps {
  activeNav: AdminSidebarSection;
  darkMode: boolean;
  children: React.ReactNode;
}

export interface ContentEditorProps {
  darkMode: boolean;
}

export interface SectionTabsProps {
  activeTab: ContentSectionKey;
  onTabChange: (tab: ContentSectionKey) => void;
  tabs: EditorTabConfig[];
  darkMode: boolean;
}

export interface SectionEditorProps {
  sectionDraft: any;
  onDraftChange: (data: any) => void;
  darkMode: boolean;
}

export interface SaveActionsProps {
  onSave: () => void;
  isSaved: boolean;
  darkMode: boolean;
}

export interface DistributorsCRUDProps {
  darkMode: boolean;
}

export interface DistributorsHeaderProps {
  count: number;
  onAddClick: () => void;
  darkMode: boolean;
}

export interface DistributorFormProps {
  distributor: Partial<DistributorLocation>;
  onChange: (data: Partial<DistributorLocation>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  provinces: { id: string; name: string }[];
  darkMode: boolean;
  isSubmitting?: boolean;
}

export interface DistributorsTableProps {
  distributors: DistributorLocation[];
  onDelete: (id: string) => Promise<void>;
  darkMode: boolean;
}

export interface DistributorRowProps {
  distributor: DistributorLocation;
  onDelete: (id: string) => Promise<void>;
  darkMode: boolean;
}

export interface LeadsCRMProps {
  darkMode: boolean;
}

export interface LeadsHeaderProps {
  count: number;
  onExport: () => void;
  darkMode: boolean;
}

export interface LeadsFiltersProps {
  filter: LeadFilters['status'];
  onFilterChange: (filter: LeadFilters['status']) => void;
  darkMode: boolean;
}

export interface LeadsSearchProps {
  search: string;
  onSearchChange: (search: string) => void;
  darkMode: boolean;
}

export interface LeadsTableProps {
  leads: B2BLead[];
  onStatusUpdate: (id: string, status: B2BLead['status']) => Promise<void>;
  darkMode: boolean;
  loading?: boolean;
}

export interface LeadRowProps {
  lead: B2BLead;
  onStatusUpdate: (id: string, status: B2BLead['status']) => Promise<void>;
  darkMode: boolean;
}

export interface VehicleCatalogProps {
  darkMode: boolean;
}

export interface CatalogHeaderProps {
  count: number;
  darkMode: boolean;
}

export interface CatalogSearchProps {
  search: string;
  onSearchChange: (search: string) => void;
  darkMode: boolean;
}

export interface CatalogGridProps {
  vehicles: VehicleBatteryMatch[];
  darkMode: boolean;
}

export interface VehicleCardProps {
  vehicle: VehicleBatteryMatch;
  darkMode: boolean;
}

// ============================================
// THEME & STYLING
// ============================================

export interface GlassmorphismTokens {
  bg: string;
  bgDark: string;
  border: string;
  borderDark: string;
  shadow: string;
  shadowHover: string;
  blur: string;
  blurStrong: string;
}

export const GLASS_TOKENS: GlassmorphismTokens = {
  bg: 'rgba(255, 255, 255, 0.08)',
  bgDark: 'rgba(15, 23, 42, 0.6)',
  border: 'rgba(255, 255, 255, 0.12)',
  borderDark: 'rgba(148, 163, 184, 0.15)',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  shadowHover: '0 16px 48px rgba(0, 0, 0, 0.18)',
  blur: 'blur(20px)',
  blurStrong: 'blur(30px)',
};

export const GLASS_VARIANTS: Record<GlassVariant, Partial<GlassmorphismTokens>> = {
  default: {},
  elevated: {
    bg: 'rgba(255, 255, 255, 0.12)',
    bgDark: 'rgba(15, 23, 42, 0.7)',
    border: 'rgba(255, 255, 255, 0.18)',
    borderDark: 'rgba(148, 163, 184, 0.2)',
    shadow: '0 16px 48px rgba(0, 0, 0, 0.18)',
  },
  outlined: {
    bg: 'transparent',
    bgDark: 'transparent',
    border: 'rgba(255, 255, 255, 0.2)',
    borderDark: 'rgba(148, 163, 184, 0.25)',
    shadow: 'none',
  },
  subtle: {
    bg: 'rgba(255, 255, 255, 0.04)',
    bgDark: 'rgba(15, 23, 42, 0.4)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderDark: 'rgba(148, 163, 184, 0.1)',
    shadow: 'none',
  },
};