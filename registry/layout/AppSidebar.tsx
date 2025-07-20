import { ComponentProps } from 'react'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { OrganizationSwitch } from './OrganizationSwitch'
import { SidebarMainNav } from './SidebarMainNav'

export const AppSidebar = (props: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar className="h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <OrganizationSwitch />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainNav />
      </SidebarContent>
    </Sidebar>
  )
}
