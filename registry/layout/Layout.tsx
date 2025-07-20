import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PropsWithChildren } from 'react'
import { AppHeader, type AppHeaderProps } from './AppHeader'
import { AppSidebar } from './AppSidebar'

interface RootLayoutProps {
  appHeader?: AppHeaderProps
}

export function Layout({ children, appHeader }: PropsWithChildren<RootLayoutProps>) {
  return (
    <>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <AppHeader {...appHeader} />
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  )
}
