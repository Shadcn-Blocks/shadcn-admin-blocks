import { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'

interface RootLayoutProps {
  children: ReactNode
}

export function Layout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <AppHeader />
          <div className="flex flex-1">
            {/* <AppSidebar /> */}
            {/* <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset> */}
          </div>
        </SidebarProvider>
      </div>
    </>
  )
}
