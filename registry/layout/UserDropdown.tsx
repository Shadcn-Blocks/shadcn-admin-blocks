import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { LogOutIcon } from 'lucide-react'
import { ReactNode, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/hooks/useTranslation'

export interface UserDropdownProps {
  userName?: ReactNode
  signOut?: () => Promise<void>
}
export const UserDropdown = ({ userName, signOut }: UserDropdownProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const userAvatar = 'https://bundui-images.netlify.app/avatars/01.png'

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
          <Avatar className="size-6 rounded-lg">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="rounded-lg">{userName}</AvatarFallback>
          </Avatar>
          {/* TODO: this removal is inspired by OpenAI platform */}
          {/* <div className="truncate">{userName}</div> */}
          {/* <ChevronDown className="size-4" /> */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="rounded-lg">{userName}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userName}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-red-600!" onClick={signOut} disabled={!signOut}>
            <LogOutIcon className="text-red-600!" />
            {t('sideBar.userNav.logout')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
