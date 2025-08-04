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

## Storybook Notes

- Storybook is always running on http://localhost:6006 no need to start it. Just ask user to start it if not running
- Never start Storybook as user is always running it locally when using claude code

## Project Architecture

This is a **shadcn UI component library** that provides admin dashboard building blocks, not a full application. The project structure is organized around component registry distribution:

### Core Structure

- **`registry/`** - Main component source code directory
  - `components/` - All reusable UI components organized by feature:
    - `layout/` - Layout components (Layout, Breadcrumbs, Header, Sidebar)
    - `data-table/` - DataTable components and related functionality
    - `form/` - Enhanced form field components (FormInput, FormCheckbox, FormDatePicker, etc.)
    - `ui/` - Base shadcn/ui components (input, button, select, form, label, etc.)
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

**Form Field Components**: Enhanced form components for use with native shadcn/ui Form:

- `FormInput`, `FormTextarea`, `FormSelect` - Enhanced versions of basic inputs
- `FormCheckbox` - Checkbox with integrated label
- `FormDatePicker` - Date picker with calendar popup and min/max date support
- All components work with the standard shadcn/ui FormField pattern

**Data Sources**: Abstraction layer for data fetching:

- `DataSource` interface for execute/executeQueries methods
- `StaticDataSource` implementation for static data
- Designed for SQL.js integration

### Technology Stack

- **React 19** with TypeScript
- **TanStack Router** for routing (target integration)
- **TanStack Query** for data fetching
- **TanStack Table** for advanced table functionality
- **React Hook Form** for form state management and validation
- **Zod** for schema validation and TypeScript type inference
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
- Form components: `@/components/form/FormInput`, `@/components/form/FormCheckbox`
- UI components: `@/components/ui/input`, `@/components/ui/form`, `@/components/ui/label`

### Development Workflow

1. Develop components in `registry/` directory
2. Create Storybook stories for documentation
3. Build registry with `pnpm build-registry` to generate public JSON files
4. Deploy to GitHub Pages for distribution

The project emphasizes component reusability, TypeScript safety, and integration with the broader shadcn/ui ecosystem.

## Import Patterns and Code Conventions

### Import Standards

**ALWAYS use @ imports instead of relative imports** throughout the codebase:

```typescript
// ✅ Correct - Use @ imports
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/DataTable'
import { FormInput } from '@/components/form/FormInput'

// ❌ Incorrect - Avoid relative imports
import { Button } from '../ui/button'
import { DataTable } from './DataTable'
```

### TypeScript Configuration

- **Base URL**: Set to `.` (project root)
- **Path Mapping**: `@/*` maps to `./registry/*`
- **Strict Mode**: Enabled with comprehensive type checking
- **Import Aliases**:
  - `@/components` → `registry/components`
  - `@/lib` → `registry/lib`
  - `@/hooks` → `registry/hooks`

## Component Development Patterns

### UI Component Architecture

**Follow shadcn/ui patterns consistently**:

```typescript
// 1. Use forwardRef for all UI components
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("base-styles", className)}
      {...props}
    />
  )
)
Component.displayName = "Component"

// 2. Use class-variance-authority for variants
const componentVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "default-classes",
      destructive: "destructive-classes"
    }
  }
})

// 3. Follow data-slot pattern for styling consistency
<input data-slot="control" className="..." />
```

### Enhanced Form Field Components

**Form components work with native shadcn/ui Form pattern**:

```typescript
// Example usage with FormField
<FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <FormInput placeholder="Enter username" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// FormCheckbox with integrated label
<FormField
  control={form.control}
  name="terms"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <FormCheckbox
          checked={field.value}
          onCheckedChange={field.onChange}
        >
          I agree to the terms and conditions
        </FormCheckbox>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// FormDatePicker with min/max constraints
<FormField
  control={form.control}
  name="birthDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Birth Date</FormLabel>
      <FormControl>
        <FormDatePicker
          value={field.value}
          onChange={field.onChange}
          max={new Date()}
          placeholder="Select your birth date"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Registry System Management

### Adding New Components to Registry

1. **Create component files** in appropriate `registry/components/` directory
2. **Update `registry.json`** with component entry:

```json
{
  "name": "ComponentName",
  "type": "registry:block",
  "title": "Component Title",
  "description": "Brief description of component functionality",
  "registryDependencies": ["button", "input"],
  "dependencies": ["react-hook-form", "zod"],
  "files": [{ "path": "registry/components/feature/Component.tsx", "type": "registry:component" }]
}
```

3. **Build registry** with `pnpm build-registry`
4. **Verify JSON generation** in `public/r/ComponentName.json`

### Registry Dependencies

- **registryDependencies**: Other shadcn/ui components needed
- **dependencies**: npm packages required
- **devDependencies**: Development-only packages

## Quality Assurance Workflow

### Pre-Commit Checklist

1. **Run linting**: `pnpm lint` (must pass with 0 warnings)
2. **Build registry**: `pnpm build-registry` (verify no errors)
3. **Test Storybook**: `pnpm storybook` (verify stories load correctly)
4. **TypeScript check**: Ensure all types are properly defined

### Code Review Standards

- **Accessibility**: WCAG 2.2 AA compliance for all interactive components
- **TypeScript**: Strict typing with proper generics and inference
- **Performance**: Memoization for expensive calculations, proper React patterns
- **Maintainability**: Clear component structure and documentation

## Registry Management Guidelines

- **Keep only necessary components in registry files**
  - Avoid including documentation or unnecessary files
  - Focus on core component implementation
