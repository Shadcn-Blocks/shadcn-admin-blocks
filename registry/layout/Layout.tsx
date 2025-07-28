import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PropsWithChildren } from 'react'
import { LayoutHeader } from './LayoutHeader'
import { LayoutSidebar } from './LayoutSidebar'
import { LayoutSidebarFooter, LayoutSidebarFooterProps } from './LayoutSidebarFooter'
import { LayoutSidebarHeader, LayoutSidebarHeaderProps } from './LayoutSidebarHeader'
import { LayoutSidebarContent } from './LayoutSidebarContent'
import { LayoutContent } from './LayoutContent'

interface LayoutBaseProps {}

export function LayoutBase({ children }: PropsWithChildren<LayoutBaseProps>) {
  return (
    <>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider>
          <div className="flex flex-1">{children}</div>
        </SidebarProvider>
      </div>
    </>
  )
}

interface LayoutProps extends LayoutBaseProps {
  sidebar?: { footer?: LayoutSidebarFooterProps; header?: LayoutSidebarHeaderProps }
}

export function Layout({ sidebar, children }: PropsWithChildren<LayoutProps>) {
  return (
    <LayoutBase>
      <LayoutSidebar>
        <LayoutSidebarHeader {...sidebar?.header} />
        <LayoutSidebarContent />
        <LayoutSidebarFooter {...sidebar?.footer} />
      </LayoutSidebar>
      <SidebarInset>
        <LayoutHeader />
        <LayoutContent>{children}</LayoutContent>
      </SidebarInset>
    </LayoutBase>
  )
}
