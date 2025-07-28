import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export type Organization = {
  name: string
  logo: React.ComponentType<{ className?: string }>
  plan: string
}
export type OrganizationList = Organization[]

interface OrganizationSwitchProps {
  data: OrganizationList
}

export const OrganizationSwitch: React.FC<OrganizationSwitchProps> = ({ data }) => {
  const [activeTeam, setActiveTeam] = React.useState<Organization | null>(
    data.length ? data[0] : null
  )
  if (!activeTeam) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ChevronsUpDown className="ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Organizations
        </DropdownMenuLabel>
        {data.map((team, index) => (
          <DropdownMenuItem
            key={team.name}
            onClick={() => setActiveTeam(team)}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-md border">
              <team.logo className="size-3.5 shrink-0" />
            </div>
            {team.name}
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
            <Plus className="size-4" />
          </div>
          <div className="text-muted-foreground font-medium">Add Organization</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
