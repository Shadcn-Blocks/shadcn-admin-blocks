import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PropsWithChildren } from 'react'
import { LayoutHeader } from '@/components/layout/LayoutHeader'
import { LayoutSidebar } from '@/components/layout/LayoutSidebar'
import { LayoutSidebarFooter, LayoutSidebarFooterProps } from '@/components/layout/LayoutSidebarFooter'
import { LayoutSidebarHeader, LayoutSidebarHeaderProps } from '@/components/layout/LayoutSidebarHeader'
import { LayoutSidebarContent } from '@/components/layout/LayoutSidebarContent'
import { LayoutContent } from '@/components/layout/LayoutContent'

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
