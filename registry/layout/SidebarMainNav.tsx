import { ChevronRight, Link } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useMemo } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { useMatches } from '@tanstack/react-router'
import { SidebarItem } from '@/hooks/useDynamicSidebar'

const CollapsibleSidebarItem = ({ item }: { item: SidebarItem }) => {
  const { t } = useTranslation()
  const matches = useMatches()

  const defaultOpen = useMemo(() => {
    return matches.some((match) => match.pathname === item.url)
  }, [matches, item.url])

  return (
    <Collapsible asChild className="group/collapsible" defaultOpen={defaultOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={t(`sideBar.mainNav.${item.title}` as any)}>
            <item.icon />
            <span className="text-sm">{t(`sideBar.mainNav.${item.title}` as any)}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((child) => (
              <Link to={child.url} key={child.url}>
                {({ isActive }) => (
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive}>
                      <span className="font-inherit">
                        {t(`sideBar.mainNav.${child.title}` as any)}
                      </span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )}
              </Link>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarItemComponent = ({ item }: { item: SidebarItem }) => {
  const { t } = useTranslation()

  if (item.children.length > 0) {
    return <CollapsibleSidebarItem item={item} />
  }

  return (
    <Link to={item.url} key={item.url}>
      {({ isActive }) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isActive}>
            <span>
              <item.icon />
              <span>{t(`sideBar.mainNav.${item.title}` as any)}</span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </Link>
  )
}

export const SidebarMainNav = () => {
  const sidebarItems = useDynamicSidebar()

  return (
    <div className="p-2">
      <SidebarMenu>
        {sidebarItems.map((item) => (
          <SidebarItemComponent key={item.url} item={item} />
        ))}
      </SidebarMenu>
    </div>
  )
}

function useDynamicSidebar() {
  return [
    { url: '/', title: 'Home', icon: Link, children: [] },
    { url: '/', title: 'Home', icon: Link, children: [] },
  ] as SidebarItem[]
  // throw new Error('Function not implemented.')
}
