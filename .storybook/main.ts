import type { StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../registry/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.base = '/shadcn-repository/storybook/'

    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': import.meta.resolve('../registry'),
      'react-i18next': import.meta.resolve('./mocks/react-i18next.ts'),
    }

    // Vite define plugin pro globální replacement
    config.define = {
      ...config.define,
      global: 'globalThis',
    }

    // Přidáme custom plugin pro mock
    config.plugins = config.plugins || []
    config.plugins.push({
      name: 'mock-react-i18next',
      resolveId(id) {
        if (id === 'react-i18next') {
          return import.meta.resolve('./mocks/react-i18next.ts')
        }
        return null
      },
    })

    return config
  },
}

export default config
