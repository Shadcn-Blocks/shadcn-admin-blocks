import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Command } from 'lucide-react'
import { PropsWithChildren, ReactNode } from 'react'
import { OrganizationList, OrganizationSwitch } from './OrganizationSwitch'

export interface LayoutSidebarHeaderProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  organizations?: OrganizationList
}

export const LayoutSidebarHeader = ({
  children,
  title,
  subtitle,
  icon,
  organizations,
}: PropsWithChildren<LayoutSidebarHeaderProps>) => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            asChild
          >
            <Link to="/">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {icon ? <>{icon}</> : <Command className="size-4" />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{title}</span>
                <span className="truncate text-xs">{subtitle}</span>
              </div>
              {organizations && <OrganizationSwitch data={organizations} />}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {children}
      </SidebarMenu>
    </SidebarHeader>
  )
}
