# Shadcn Admin Blocks

Shadcn Admin Blocks is a collection of reusable admin dashboard components built with Shadcn UI and designed for rapid integration into Vite projects using TanStack Router. It provides ready-to-use layouts and UI elements to help developers quickly scaffold modern admin interfaces with minimal setup.

## Installation

To set up the admin layout from scratch, first initialize a new Vite project with TanStack Router:

```bash
bunx --bun create-tsrouter-app@latest . --template file-router --tailwind --add-ons shadcn
```

Next, add the layout components:

```bash
bunx shadcn add https://raw.githubusercontent.com/Shadcn-Blocks/shadcn-admin-blocks/refs/heads/main/public/r/Layout.json
```

Update your `routes/__root.tsx` file as follows:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Layout } from '@/components/Layout'

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <TanStackRouterDevtools />
    </Layout>
  ),
})
```
