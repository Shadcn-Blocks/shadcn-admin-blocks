import { Link, useMatches } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { SidebarItem, useDynamicSidebar } from '@/hooks/useDynamicSidebar'
import { PropsWithChildren, useMemo } from 'react'
import { TooltipContent } from '@/components/ui/tooltip'

export const LayoutSidebarContent = ({ children }: PropsWithChildren) => {
  const sidebarItems = useDynamicSidebar()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarItemComponent key={item.key} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {children && (
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>{children}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </SidebarContent>
  )
}

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
                {({ isActive }: { isActive: boolean }) => (
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      asChild 
                      isActive={isActive}
                      className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
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
      {({ isActive }: { isActive: boolean }) => (
        <SidebarMenuItem key={item.key}>
          <SidebarMenuButton 
            asChild 
            isActive={isActive}
            className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          >
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
