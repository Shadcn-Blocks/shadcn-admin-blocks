import { Link, useMatches } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { SidebarItem, useDynamicSidebar } from '@/hooks/useDynamicSidebar'
import { useMemo } from 'react'
import { TooltipContent } from '@/components/ui/tooltip'

const CollapsibleSidebarItem = ({ item }: { item: SidebarItem }) => {
  const matches = useMatches()

  const defaultOpen = useMemo(() => {
    return matches.some((match) => match.pathname === item.url)
  }, [matches, item.url])

  return (
    <Collapsible asChild className="group/collapsible" defaultOpen={defaultOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title ? <TooltipContent>{item.title}</TooltipContent> : undefined}
          >
            {item.icon}
            <span className="text-sm">{item.title}</span>
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
                      <span className="font-inherit">{child.title}</span>
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
  if (item.children.length > 0) {
    return <CollapsibleSidebarItem item={item} />
  }

  return (
    <Link to={item.url} key={item.url}>
      {({ isActive }) => (
        <SidebarMenuItem key={item.key}>
          <SidebarMenuButton asChild isActive={isActive}>
            <span>
              {item.icon}
              <span>{item.title}</span>
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
          <SidebarItemComponent key={item.key} item={item} />
        ))}
      </SidebarMenu>
    </div>
  )
}
