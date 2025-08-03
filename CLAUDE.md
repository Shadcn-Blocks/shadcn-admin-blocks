# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Storybook Development**: `pnpm storybook` - Start Storybook development server for component documentation
- **Build Storybook**: `pnpm build-storybook` - Build static Storybook files
- **Registry Build**: `pnpm build-registry` - Build shadcn component registry
- **Linting**: `pnpm lint` - Run ESLint with max 0 warnings on registry directory
- **Formatting**: `pnpm format` - Format code with Prettier
- **Tests**: `pnpm test` - Currently returns placeholder (no tests configured)
- **Deploy**: `pnpm deploy-gh` - Deploy to GitHub Pages (builds both Storybook and registry)

## Project Architecture

This is a **shadcn UI component library** that provides admin dashboard building blocks, not a full application. The project structure is organized around component registry distribution:

### Core Structure
- **`registry/`** - Main component source code directory
  - `components/` - All reusable UI components organized by feature:
    - `layout/` - Layout components (Layout, Breadcrumbs, Header, Sidebar)
    - `data-table/` - DataTable components and related functionality
    - `ui/` - Base shadcn/ui components
    - Individual components (WorkspaceSwitch, WorkspaceContext, etc.)
  - `hooks/` - Custom React hooks (useDynamicSidebar, useTranslation, use-mobile)
  - `lib/` - Utility libraries and data sources
- **`public/r/`** - Published registry JSON files for shadcn CLI consumption
- **Storybook** - Component documentation and testing environment

### Key Components

**Layout System**: Modular layout components built on shadcn/ui Sidebar primitives:
- `Layout.tsx` - Main layout wrapper with sidebar provider
- `LayoutSidebar`, `LayoutHeader`, `LayoutContent` - Composable layout parts
- Uses CSS custom properties for theming (`--header-height`, etc.)

**DataTable**: Advanced table component with TanStack Table integration:
- Server-side pagination, sorting, filtering
- Uses `@jakub.knejzlik/ts-query` for SQL query building
- Supports `StaticDataSource` for data fetching
- Column definition system with `DataTableColumn` interface

**Data Sources**: Abstraction layer for data fetching:
- `DataSource` interface for execute/executeQueries methods
- `StaticDataSource` implementation for static data
- Designed for SQL.js integration

### Technology Stack
- **React 19** with TypeScript
- **TanStack Router** for routing (target integration)
- **TanStack Query** for data fetching
- **TanStack Table** for advanced table functionality
- **Radix UI** components via shadcn/ui
- **Tailwind CSS v4** for styling
- **Storybook** for component development
- **Vitest** for testing framework (configured but not actively used)

### Component Distribution
Components are published via shadcn registry system. Users install with:
```bash
npx shadcn add https://raw.githubusercontent.com/Shadcn-Blocks/shadcn-admin-blocks/refs/heads/main/public/r/Layout.json
```

After installation, components are imported with organized paths:
- Layout components: `@/components/layout/Layout`, `@/components/layout/Breadcrumbs`
- DataTable components: `@/components/data-table/DataTable`
- This structure prevents confusion between shared library components and project-specific components

### Development Workflow
1. Develop components in `registry/` directory
2. Create Storybook stories for documentation
3. Build registry with `pnpm build-registry` to generate public JSON files
4. Deploy to GitHub Pages for distribution

The project emphasizes component reusability, TypeScript safety, and integration with the broader shadcn/ui ecosystem.