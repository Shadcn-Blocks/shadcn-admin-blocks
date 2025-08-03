import {
  createContext,
  useContext,
  useState,
  useCallback,
  ElementType,
  ReactNode,
  FC,
  useEffect,
} from 'react'

export type Workspace = {
  id: string
  name: string
  logo: ElementType
  plan?: string
}

interface WorkspacesContextValue {
  workspaces: Workspace[]
  activeWorkspace: Workspace | null
  switchWorkspace: (workspace: Workspace) => void
}

interface WorkspacesProviderProps {
  children: ReactNode
  /** Initial list of workspaces to load */
  workspaces?: Workspace[]
  onWorkspaceChange?: (workspace: Workspace) => void
  selectedWorkspaceId?: string
}

const WorkspacesContext = createContext<WorkspacesContextValue | undefined>(undefined)

export const WorkspacesProvider: FC<WorkspacesProviderProps> = ({
  children,
  onWorkspaceChange = () => {},
  workspaces = [],
  selectedWorkspaceId,
}) => {
  // Find workspace by id
  const selectedWorkspace = workspaces.find((ws) => ws.id === selectedWorkspaceId)

  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    selectedWorkspace ?? workspaces[0] ?? null
  )

  // Update active workspace when selectedWorkspaceId or workspaces change
  useEffect(() => {
    if (selectedWorkspaceId && workspaces.length > 0) {
      const foundWorkspace = workspaces.find((ws) => ws.id === selectedWorkspaceId)
      if (foundWorkspace && foundWorkspace.id !== activeWorkspace?.id) {
        setActiveWorkspace(foundWorkspace)
      }
    } else if (workspaces.length > 0 && !activeWorkspace) {
      // Set first workspace if no active workspace and workspaces are available
      setActiveWorkspace(workspaces[0] ?? null)
    }
  }, [selectedWorkspaceId, workspaces, activeWorkspace])

  const switchWorkspace = useCallback(
    (workspace: Workspace) => {
      setActiveWorkspace(workspace)
      onWorkspaceChange(workspace)
    },
    [onWorkspaceChange]
  )

  return (
    <WorkspacesContext.Provider value={{ workspaces, activeWorkspace, switchWorkspace }}>
      {children}
    </WorkspacesContext.Provider>
  )
}

export const useWorkspaces = (): WorkspacesContextValue => {
  const context = useContext(WorkspacesContext)
  if (!context) {
    throw new Error('useWorkspaces must be used inside a WorkspacesProvider')
  }
  return context
}
