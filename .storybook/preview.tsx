import '../registry/globals.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

import type { Preview } from '@storybook/react-vite'
;(globalThis as any).mockUseTranslation = () => ({
  t: (key: string) => key,
  i18n: { language: 'en', changeLanguage: () => Promise.resolve() },
})

const queryClient = new QueryClient()

// 🟢 6️⃣ Final preview export
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => {
      const rootRoute = createRootRoute({ component: () => <Story /> })
      const router = createRouter({ routeTree: rootRoute })
      return (
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {/* <Story /> */}
          <ReactQueryDevtools />
        </QueryClientProvider>
      )
    },
  ],
}

export default preview
