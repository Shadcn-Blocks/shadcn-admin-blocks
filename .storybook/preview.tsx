import '../registry/globals.css'

import type { Preview } from '@storybook/react-vite'
;(globalThis as any).mockUseTranslation = () => ({
  t: (key: string) => key,
  i18n: { language: 'en', changeLanguage: () => Promise.resolve() },
})

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
}

export default preview
