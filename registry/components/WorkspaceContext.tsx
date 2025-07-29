import { createContext, useContext, useState, useCallback, ElementType, ReactNode, FC } from 'react'

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

export const WorkspacesProvider: FC<WorkspacesProviderProps> = ({
  children,
  workspaces = [],
}) => {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(workspaces[0] ?? null)

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
