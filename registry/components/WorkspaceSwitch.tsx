import React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { useWorkspaces, Workspace } from '@/components/WorkspaceContext'
import { useTranslation } from 'react-i18next'

interface WorkspaceSwitchProps {
  onAddWorkspace?: () => void
}

export const WorkspaceSwitch: React.FC<WorkspaceSwitchProps> = ({ onAddWorkspace }) => {
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspaces()
  const { t } = useTranslation()

  if (!activeWorkspace) return null

  const handleWorkspaceSwitch = (workspace: Workspace) => {
    // Only switch if it's different from current active workspace
    if (workspace.id !== activeWorkspace.id) {
      switchWorkspace(workspace)
    }
  }

  const handleAddWorkspace = () => {
    if (onAddWorkspace) {
      onAddWorkspace()
    } else {
      // Default behavior - you might want to navigate to a create workspace page
      console.log('Add workspace clicked - no handler provided')
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeWorkspace.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeWorkspace.name}</span>
                <span className="truncate text-xs">{activeWorkspace.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t('workspaceSwitch.label')}
            </DropdownMenuLabel>
            {workspaces.map((ws: Workspace) => (
              <DropdownMenuItem
                key={ws.id} // Use id instead of name for better uniqueness
                onClick={() => handleWorkspaceSwitch(ws)}
                className={`gap-2 p-2 ${
                  ws.id === activeWorkspace.id ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <ws.logo className="size-3.5 shrink-0" />
                </div>
                {ws.name}
                {ws.id === activeWorkspace.id && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {t('workspaceSwitch.current', { defaultValue: 'Current' })}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={handleAddWorkspace}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                {t('workspaceSwitch.addWorkspace')}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
