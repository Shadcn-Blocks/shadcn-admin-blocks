import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/components/ui/sidebar'
import { SidebarIcon } from 'lucide-react'
import { Breadcrumbs } from './Breadcrumbs'
import { UserDropdown, type UserDropdownProps } from './UserDropdown'

export interface AppHeaderProps {
  userDropdown?: UserDropdownProps
}

export const AppHeader = ({ userDropdown }: AppHeaderProps) => {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />

        <div className="ml-auto">
          <UserDropdown {...userDropdown} />
        </div>
      </div>
    </header>
  )
}
