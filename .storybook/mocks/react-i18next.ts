import React from 'react'

// Mock implementace useTranslation
export const useTranslation = () => ({
  t: (key: string, options?: any) => {
    console.log('Mock useTranslation called with key:', key)
    const translations: Record<string, string> = {
      'workspaceSwitch.switch': 'Switch Workspace',
      'workspaceSwitch.label': 'Select Workspace',
      'workspaceSwitch.addWorkspace': 'Add Workspace',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
    }
    return translations[key] || key
  },
  i18n: {
    language: 'en',
    changeLanguage: () => Promise.resolve(),
    ready: true,
  },
  ready: true,
})

// Mock Trans komponenta
export const Trans = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('span', {}, children)
}

// Mock initReactI18next
export const initReactI18next = {
  type: '3rdParty',
  init: () => {},
}

// Default export
const mockModule = {
  useTranslation,
  Trans,
  initReactI18next,
}

export default mockModule
