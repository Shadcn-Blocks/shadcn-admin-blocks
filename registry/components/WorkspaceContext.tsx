import React, { createContext, useContext, useState, useEffect } from 'react'
import { Command } from 'lucide-react'

export type Workspace = {
  name: string
  logo: React.ElementType
  plan: string
}

interface WorkspacesContextValue {
  workspaces: Workspace[]
  activeWorkspace: Workspace | null
  switchWorkspace: (workspace: Workspace) => void
}

const WorkspacesContext = createContext<WorkspacesContextValue | undefined>(undefined)

export const WorkspacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)

  useEffect(() => {
    // TODO: nahradit skutečným fetch requestem
    const data: Workspace[] = [
      { name: 'Acme Inc', logo: Command, plan: 'Enterprise' },
      // další workspaces...
    ]
    setWorkspaces(data)
    setActiveWorkspace(data[0])
  }, [])

  const switchWorkspace = (workspace: Workspace) => {
    setActiveWorkspace(workspace)
  }

  return (
    <WorkspacesContext.Provider value={{ workspaces, activeWorkspace, switchWorkspace }}>
      {children}
    </WorkspacesContext.Provider>
  )
}

export const useWorkspaces = (): WorkspacesContextValue => {
  const context = useContext(WorkspacesContext)
  if (!context) {
    throw new Error('useWorkspaces musí být použit uvnitř WorkspacesProvider')
  }
  return context
}
