import { createContext, useContext, useState, useCallback, ElementType } from 'react'

export type Workspace = {
  name: string
  logo: ElementType
  plan: string
}

interface WorkspacesContextValue {
  workspaces: Workspace[]
  activeWorkspace: Workspace | null
  initializeWorkspaces: (data: Workspace[]) => void
  switchWorkspace: (workspace: Workspace) => void
}

const WorkspacesContext = createContext<WorkspacesContextValue | undefined>(undefined)

export const WorkspacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)

  const initializeWorkspaces = useCallback((data: Workspace[]) => {
    setWorkspaces(data)
    setActiveWorkspace(data[0] || null)
  }, [])

  const switchWorkspace = useCallback((workspace: Workspace) => {
    setActiveWorkspace(workspace)
  }, [])

  return (
    <WorkspacesContext.Provider
      value={{ workspaces, activeWorkspace, initializeWorkspaces, switchWorkspace }}
    >
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
