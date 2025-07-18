# Shadcn Admin Blocks

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Documentation-blue)](https://shadcn-blocks.github.io/shadcn-admin-blocks/)

Shadcn Admin Blocks is a collection of reusable admin dashboard components built with Shadcn UI and designed for rapid integration into Vite projects using TanStack Router. It provides ready-to-use layouts and UI elements to help developers quickly scaffold modern admin interfaces with minimal setup.

## Installation

To set up the admin layout from scratch, first initialize a new Vite project with TanStack Router:

```bash
npx create-tsrouter-app@latest my-app --template file-router --tailwind --add-ons shadcn
```

Next, add the layout components:

```bash
npx shadcn add https://raw.githubusercontent.com/Shadcn-Blocks/shadcn-admin-blocks/refs/heads/main/public/r/Layout.json
```

Update your `src/routes/__root.tsx` file as follows:

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

Once everything is set up, launch your development server:

```bash
npm run dev
```

Your admin dashboard should now be running locally and ready for customization.
