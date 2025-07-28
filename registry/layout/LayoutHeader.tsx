import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { PropsWithChildren } from 'react'
import { Breadcrumbs } from './Breadcrumbs'

export const LayoutHeader = ({ children }: PropsWithChildren) => {
  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />

        <div className="ml-auto">{children}</div>
      </div>
    </header>
  )
}
