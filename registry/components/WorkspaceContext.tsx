import { createContext, useContext, useState, useCallback, ElementType, ReactNode } from 'react'

export type Workspace = {
  name: string
  logo: ElementType
  plan: string
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
}

const WorkspacesContext = createContext<WorkspacesContextValue | undefined>(undefined)

export const WorkspacesProvider: React.FC<WorkspacesProviderProps> = ({
  children,
  workspaces: initialWorkspaces = [],
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces)
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    initialWorkspaces[0] ?? null
  )

  const switchWorkspace = useCallback((workspace: Workspace) => {
    setActiveWorkspace(workspace)
  }, [])

  return (
    <WorkspacesContext.Provider value={{ workspaces, activeWorkspace, switchWorkspace }}>
      {children}
    </WorkspacesContext.Provider>
  )
}

export const useWorkspaces = (): WorkspacesContextValue => {
  const context = useContext(WorkspacesContext)
  if (!context) {
    throw new Error('useWorkspaces must be inside a WorkspacesProvider')
  }
  return context
}
