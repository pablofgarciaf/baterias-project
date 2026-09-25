# Admin Panel Refactoring - Component Architecture Specification

## Overview
Refactor the monolithic `src/app/admin/page.tsx` (1047 lines) into 10 modular components following CRM Google-style design with glassmorphism aesthetics.

## Component Hierarchy

```
AdminRoute (page.tsx)
├── AdminLayout
│   ├── AuthGate
│   │   └── LoginScreen
│   ├── TopBar
│   ├── SidebarNavigation
│   │   └── NavItem (x4)
│   └── Workspace
│       ├── ContentEditor
│       │   ├── SectionTabs
│       │   ├── SectionEditor (dynamic based on active tab)
│       │   │   ├── HeroEditor
│       │   │   ├── AboutEditor
│       │   │   ├── VehicleFinderEditor
│       │   │   ├── StoreLocatorEditor
│       │   │   ├── B2BEditor
│       │   │   ├── RecyclingEditor
│       │   │   └── BlogEditor
│       │   └── SaveActions
│       ├── DistributorsCRUD
│       │   ├── DistributorsHeader
│       │   ├── DistributorForm (modal/slide-in)
│       │   └── DistributorsTable
│       │       └── DistributorRow
│       ├── LeadsCRM
│       │   ├── LeadsHeader
│       │   ├── LeadsFilters
│       │   ├── LeadsSearch
│       │   └── LeadsTable
│       │       └── LeadRow
│       └── VehicleCatalog
│           ├── CatalogHeader
│           ├── CatalogSearch
│           └── CatalogGrid
│               └── VehicleCard
```

## 10 Specialists Assignment

| Specialist | Component(s) | Responsibility |
|------------|--------------|----------------|
| 1 | AdminLayout, AuthGate, LoginScreen, TopBar | Shell, authentication, top-level layout |
| 2 | SidebarNavigation, NavItem | Navigation sidebar with badges |
| 3 | ContentEditor, SectionTabs, 7 SectionEditors, SaveActions | Landing content editor (7 tabs) |
| 4 | DistributorsCRUD, DistributorsHeader, DistributorForm, DistributorsTable, DistributorRow | Distributors management |
| 5 | LeadsCRM, LeadsHeader, LeadsFilters, LeadsSearch, LeadsTable, LeadRow | B2B Leads CRM |
| 6 | VehicleCatalog, CatalogHeader, CatalogSearch, CatalogGrid, VehicleCard | Vehicle catalog viewer |
| 7 | GlassCard, GlassInput, GlassButton, GlassSelect, GlassTextarea, GlassBadge, GlassTable | Shared UI primitives (glassmorphism) |
| 8 | useAdminAuth, useAdminData, useContentEditor, useDistributors, useLeads, useCatalog | Custom hooks for state/logic |
| 9 | types/admin.ts | Shared types, interfaces, props |
| 10 | page.tsx (new) | Main composition, integration, providers |

## Shared Types (types/admin.ts)

```typescript
// Navigation types
export type AdminSidebarSection = 'content' | 'distributors' | 'leads' | 'catalog';
export type ContentSectionKey = 'hero' | 'about' | 'vehicleFinder' | 'storeLocator' | 'b2b' | 'recycling' | 'blog';

// Navigation item
export interface NavItemConfig {
  id: AdminSidebarSection;
  icon: LucideIcon;
  label: string;
  badge: string | number;
  highlight?: boolean;
}

// Editor section config
export interface EditorTabConfig {
  id: ContentSectionKey;
  label: string;
  icon: LucideIcon;
}

// Glassmorphism variants
export type GlassVariant = 'default' | 'elevated' | 'outlined' | 'subtle';
export type GlassSize = 'sm' | 'md' | 'lg' | 'xl';

// Component prop interfaces
export interface GlassCardProps {
  variant?: GlassVariant;
  size?: GlassSize;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  variant?: GlassVariant;
}

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export interface GlassTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  renderRow: (item: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}
```

## Glassmorphism Design System

### Color Tokens (from globals.css + extensions)
```css
/* Glassmorphism base */
--glass-bg: rgba(255, 255, 255, 0.08);
--glass-bg-dark: rgba(15, 23, 42, 0.6);
--glass-border: rgba(255, 255, 255, 0.12);
--glass-border-dark: rgba(148, 163, 184, 0.15);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
--glass-shadow-hover: 0 16px 48px rgba(0, 0, 0, 0.18);

/* Blur */
--glass-blur: blur(20px);
--glass-blur-strong: blur(30px);
```

### Component Variants

| Variant | Background | Border | Shadow | Use Case |
|---------|-----------|--------|--------|----------|
| default | rgba(255,255,255,0.08) | rgba(255,255,255,0.12) | 0 8px 32px | Standard cards |
| elevated | rgba(255,255,255,0.12) | rgba(255,255,255,0.18) | 0 16px 48px | Hover/focus states |
| outlined | transparent | rgba(255,255,255,0.2) | none | Form containers |
| subtle | rgba(255,255,255,0.04) | rgba(255,255,255,0.08) | none | Background panels |

### Dark Mode Variants
```css
/* Dark mode adjustments */
.dark --glass-bg: rgba(15, 23, 42, 0.6);
.dark --glass-bg-dark: rgba(15, 23, 42, 0.8);
.dark --glass-border: rgba(148, 163, 184, 0.15);
.dark --glass-border-dark: rgba(148, 163, 184, 0.25);
```

## State Management Architecture

### Global State (Context)
- `SiteContentContext` - Already exists, used by ContentEditor
- `AdminAuthContext` - New: auth state, login/logout
- `AdminDataContext` - New: leads, distributors, loading states

### Local State (Hooks)
- `useAdminAuth` - Authentication state & actions
- `useAdminData` - Data fetching (leads, distributors) + mutations
- `useContentEditor` - Active tab, draft state, save actions
- `useDistributors` - Distributors CRUD state
- `useLeads` - Leads filtering, search, status updates
- `useCatalog` - Search filter state

## Quality Gates

### Level 1: Specialist (Code)
- [ ] TypeScript compiles (zero errors)
- [ ] ESLint passes
- [ ] Component renders without console errors
- [ ] Props interface matches usage

### Level 2: Tech Lead (Architecture)
- [ ] Build passes (`npm run build`)
- [ ] Visual matches glassmorphism spec
- [ ] Responsive breakpoints work
- [ ] Dark/light mode works
- [ ] Accessibility (ARIA, keyboard nav)

### Level 3: Tech Manager (7-Gate)
- [ ] Architecture: Component separation correct
- [ ] Design: Glassmorphism consistent
- [ ] Security: No XSS, auth gates work
- [ ] Performance: No unnecessary re-renders
- [ ] Scalability: Easy to add new sections
- [ ] Accessibility: WCAG AA
- [ ] Business: All CRUD operations work

### Level 4: Director Hermes (Quality)
- [ ] "Mejor empresa del mundo" standard
- [ ] Code is production-ready
- [ ] Documentation complete
- [ ] No technical debt introduced

## File Structure (New)

```
src/
├── components/
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── AuthGate.tsx
│       ├── LoginScreen.tsx
│       ├── TopBar.tsx
│       ├── SidebarNavigation.tsx
│       ├── NavItem.tsx
│       ├── ContentEditor/
│       │   ├── index.tsx
│       │   ├── ContentEditor.tsx
│       │   ├── SectionTabs.tsx
│       │   ├── SectionEditors/
│       │   │   ├── HeroEditor.tsx
│       │   │   ├── AboutEditor.tsx
│       │   │   ├── VehicleFinderEditor.tsx
│       │   │   ├── StoreLocatorEditor.tsx
│       │   │   ├── B2BEditor.tsx
│       │   │   ├── RecyclingEditor.tsx
│       │   │   └── BlogEditor.tsx
│       │   └── SaveActions.tsx
│       ├── DistributorsCRUD/
│       │   ├── index.tsx
│       │   ├── DistributorsCRUD.tsx
│       │   ├── DistributorsHeader.tsx
│       │   ├── DistributorForm.tsx
│       │   ├── DistributorsTable.tsx
│       │   └── DistributorRow.tsx
│       ├── LeadsCRM/
│       │   ├── index.tsx
│       │   ├── LeadsCRM.tsx
│       │   ├── LeadsHeader.tsx
│       │   ├── LeadsFilters.tsx
│       │   ├── LeadsSearch.tsx
│       │   ├── LeadsTable.tsx
│       │   └── LeadRow.tsx
│       ├── VehicleCatalog/
│       │   ├── index.tsx
│       │   ├── VehicleCatalog.tsx
│       │   ├── CatalogHeader.tsx
│       │   ├── CatalogSearch.tsx
│       │   ├── CatalogGrid.tsx
│       │   └── VehicleCard.tsx
│       ├── ui/
│       │   ├── GlassCard.tsx
│       │   ├── GlassInput.tsx
│       │   ├── GlassButton.tsx
│       │   ├── GlassSelect.tsx
│       │   ├── GlassTextarea.tsx
│       │   ├── GlassBadge.tsx
│       │   └── GlassTable.tsx
│       └── hooks/
│           ├── useAdminAuth.ts
│           ├── useAdminData.ts
│           ├── useContentEditor.ts
│           ├── useDistributors.ts
│           ├── useLeads.ts
│           └── useCatalog.ts
├── types/
│   └── admin.ts
└── app/
    └── admin/
        └── page.tsx (refactored - ~50 lines)
```

## Delegation Sequence

1. **Specialist 9** - Types & interfaces barrel file (foundation)
2. **Specialist 7** - Shared UI primitives (glassmorphism components)
3. **Specialist 8** - Custom hooks (state management)
4. **Specialist 1** - AdminLayout, AuthGate, LoginScreen, TopBar (shell)
5. **Specialist 2** - SidebarNavigation, NavItem (navigation)
6. **Specialist 3** - ContentEditor module (7 tabs)
7. **Specialist 4** - DistributorsCRUD module
8. **Specialist 5** - LeadsCRM module
9. **Specialist 6** - VehicleCatalog module
10. **Specialist 10** - Main page composition + integration

Each specialist delivers → Tech Lead reviews → Tech Manager 7-gate → Director approves → Next specialist