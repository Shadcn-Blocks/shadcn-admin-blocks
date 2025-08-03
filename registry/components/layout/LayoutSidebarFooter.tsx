'use client'

import { SidebarFooter, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { PropsWithChildren } from 'react'
import { LayoutUserDropdown, LayoutUserDropdownProps } from './LayoutUserDropdown'

export interface LayoutSidebarFooterProps extends LayoutUserDropdownProps {}

export const LayoutSidebarFooter = ({
  children,
  ...userDropdown
}: PropsWithChildren<LayoutSidebarFooterProps>) => {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <LayoutUserDropdown {...userDropdown}>{children}</LayoutUserDropdown>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
