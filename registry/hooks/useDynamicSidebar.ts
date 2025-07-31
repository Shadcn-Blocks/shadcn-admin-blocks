import { type AnyRoute, useRouter } from '@tanstack/react-router'
import { ReactNode } from 'react'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    title?: string
    icon?: any
    showInSidebar?: boolean
  }
}

export type SidebarItem = {
  key: string
  url: string
  icon?: ReactNode
  title: ReactNode
  children: SidebarItem[]
}

const buildSidebarItems = (allFlatRoutes: AnyRoute[]): SidebarItem[] => {
  const sidebarRoutes = allFlatRoutes.filter((route) => {
    return route.options?.staticData?.showInSidebar
  })

  return getSidebarItemsForParent(sidebarRoutes)
}

const getSidebarItemsForParent = (flatRoutes: AnyRoute[], parentFullPath = '/'): SidebarItem[] => {
  const fullPaths = flatRoutes.map((r) => r.fullPath).filter((p): p is string => typeof p === 'string')
  const validFullPaths = fullPaths.filter((p) => {
    return p.startsWith(parentFullPath) && p !== parentFullPath
  })
  if (validFullPaths.length === 0) {
    return []
  }
  const validClosestPaths = validFullPaths.filter((p) => {
    return !validFullPaths.some((other) => {
      return other !== p && p.startsWith(other)
    })
  })
  const closestRoutes = validClosestPaths
    .map((r) => {
      return flatRoutes.find((route) => route.fullPath === r)
    })
    .filter(Boolean) as AnyRoute[]

  return [
    ...closestRoutes.map((r) => {
      return {
        key: r.fullPath,
        url: r.fullPath,
        icon: r.options?.staticData?.icon,
        title: r.options?.staticData?.title || 'untitled',
        children: getSidebarItemsForParent(flatRoutes, r.fullPath),
      }
    }),
  ]
}

export const useDynamicSidebar = (): SidebarItem[] => {
  const router = useRouter()
  const allRoutes = router?.flatRoutes

  if (!allRoutes) {
    return []
  }

  return buildSidebarItems(allRoutes)
}
