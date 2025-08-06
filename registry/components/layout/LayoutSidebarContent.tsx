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

interface LayoutSidebarContentProps extends PropsWithChildren {
  /** Dynamic parameters to pass to all sidebar links */
  dynamicParams?: Record<string, string>
}

/**
 * Universal sidebar content component that works with any dynamic routing parameters.
 * 
 * @example
 * // For a workspace-based app:
 * <LayoutSidebarContent dynamicParams={{ workspaceId: "workspace-123" }} />
 * 
 * @example
 * // For a tenant-based app:
 * <LayoutSidebarContent dynamicParams={{ tenantId: "tenant-456" }} />
 * 
 * @example
 * // For a simple app without dynamic parameters:
 * <LayoutSidebarContent />
 */
export const LayoutSidebarContent = ({ children, dynamicParams = {} }: LayoutSidebarContentProps) => {
  const sidebarItems = useDynamicSidebar()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarItemComponent key={item.key} item={item} dynamicParams={dynamicParams} />
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

const CollapsibleSidebarItem = ({
  item,
  dynamicParams
}: {
  item: SidebarItem
  dynamicParams: Record<string, string>
}) => {
  const matches = useMatches()

  const defaultOpen = useMemo(() => {
    return matches.some((match) => {
      // Check if the current pathname matches the item URL pattern
      // For dynamic URLs, we need to handle the pattern matching
      if (item.url.includes('/$')) {
        // If the item URL contains dynamic parameters, check if current path matches the pattern
        let urlPattern = item.url
        // Replace all dynamic parameters with regex patterns
        Object.keys(dynamicParams).forEach(param => {
          urlPattern = urlPattern.replace(`/$${param}`, '/[^/]+')
        })
        const regex = new RegExp(`^${urlPattern}$`)
        return regex.test(match.pathname)
      }
      return match.pathname === item.url
    })
  }, [matches, item.url, dynamicParams])

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
              <Link to={child.url} key={child.url} params={dynamicParams}>
                {({ isActive }) => (
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

const SidebarItemComponent = ({
  item,
  dynamicParams
}: {
  item: SidebarItem
  dynamicParams: Record<string, string>
}) => {
  if (item.children.length > 0) {
    return <CollapsibleSidebarItem item={item} dynamicParams={dynamicParams} />
  }

  return (
    <Link to={item.url} key={item.url} params={dynamicParams}>
      {({ isActive }) => (
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
