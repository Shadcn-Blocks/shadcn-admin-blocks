import { AnyRoute, useRouter } from '@tanstack/react-router'
import { Home } from 'lucide-react'

export type SidebarItem = {
  url: string
  icon: any
  title: string
  children: SidebarItem[]
}

const buildSidebarItems = (allFlatRoutes: AnyRoute[]): SidebarItem[] => {
  const items: SidebarItem[] = []

  const parents = allFlatRoutes.filter((route) => {
    if (!route.fullPath) return false

    // remove initial "/" and trailing "/" if present
    const cleanPath = route.fullPath.replace(/^\/+/, '').replace(/\/+$/, '')

    const segments = cleanPath.split('/')
    return segments.length === 1 && segments[0] !== ''
  })

  // root route
  const rootRoute = allFlatRoutes.find(
    (route) => route.fullPath === '/' && route.options?.staticData?.showInSidebar
  )
  if (rootRoute && rootRoute.options?.staticData) {
    items.push({
      url: '/',
      icon: rootRoute.options.staticData.icon || Home,
      title: rootRoute.options.staticData.title || 'Home',
      children: [],
    })
  }

  parents.forEach((parentRoute) => {
    if (!parentRoute.options?.staticData?.showInSidebar) return

    const parentPath = parentRoute.fullPath
    const parentStaticData = parentRoute.options.staticData

    const parentItem: SidebarItem = {
      url: parentPath,
      icon: parentStaticData.icon || Home,
      title: parentStaticData.title || 'untitled',
      children: [],
    }

    const childRoutes = allFlatRoutes.filter((route) => {
      if (!route.fullPath || !route.options?.staticData?.showInSidebar) return false
      if (route.fullPath === parentPath) return false // skip the parent itself
      if (route.fullPath.includes('$')) return false // skip dynamic routes

      // check if this route is a child of the current parent
      const cleanPath = route.fullPath.replace(/^\/+/, '').replace(/\/+$/, '')
      const segments = cleanPath.split('/')

      // child routes should have more than 1 segment and start with the parent segment
      return (
        segments.length > 1 && segments[0] === parentPath.replace(/^\/+/, '').replace(/\/+$/, '')
      )
    })

    childRoutes.forEach((childRoute) => {
      if (childRoute.options?.staticData) {
        parentItem.children.push({
          url: childRoute.fullPath,
          icon: childRoute.options.staticData.icon || Home,
          title: childRoute.options.staticData.title || 'untitled',
          children: [],
        })
      }
    })

    items.push(parentItem)
  })

  return items
}

export const useDynamicSidebar = (): SidebarItem[] => {
  const router = useRouter()
  const allRoutes = router.flatRoutes

  if (!allRoutes) {
    return []
  }

  return buildSidebarItems(allRoutes)
}
