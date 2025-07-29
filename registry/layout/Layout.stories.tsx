// registry/my-component/MyComponent.stories.ts

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { SidebarInset, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import { Link } from '@tanstack/react-router'
import { HouseIcon, LifeBuoy, Send, Sparkles } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { Layout, LayoutBase } from './Layout'
import { LayoutContent } from './LayoutContent'
import { LayoutHeader } from './LayoutHeader'
import { LayoutSidebar } from './LayoutSidebar'
import { LayoutSidebarContent } from './LayoutSidebarContent'
import { LayoutSidebarFooter } from './LayoutSidebarFooter'
import { LayoutSidebarHeader } from './LayoutSidebarHeader'
import { useWorkspaces, Workspace, WorkspacesProvider } from '@/components/WorkspaceContext'
import { WorkspaceSwitch } from '@/components/WorkspaceSwitch'
import { useEffect } from 'react'

const meta: Meta<typeof Fragment> = {
  component: Fragment,
  title: 'Example/Layout',
}
export default meta

type Story = StoryObj<typeof Fragment>

export const Default: Story = {
  args: {
    children: (
      <Layout
        sidebar={{
          footer: {
            signOut: () => alert('logging out'),
            user: {
              avatar: 'https://cat-avatars.vercel.app/api/cat?name=John%20Doe',
              email: 'john.doe@example.com',
              name: 'John Doe',
            },
          },
          header: {
            title: 'Dashboard',
            subtitle: 'Welcome back!',
            icon: <HouseIcon />,
          },
        }}
      >
        I am content
      </Layout>
    ),
  },
}

const StoryContent: React.FC = () => {
  const { initializeWorkspaces } = useWorkspaces()
  useEffect(() => {
    const data: Workspace[] = [
      { name: 'Acme Inc', logo: LifeBuoy, plan: 'Enterprise' },
      { name: 'Beta Co', logo: Send, plan: 'Pro' },
    ]
    initializeWorkspaces(data)
  }, [initializeWorkspaces])

  return (
    <LayoutBase>
      <LayoutSidebar>
        <LayoutSidebarHeader>
          <WorkspaceSwitch />
        </LayoutSidebarHeader>
        <LayoutSidebarContent>
          <SidebarInset>{/* Bottom Menu Items */}</SidebarInset>
        </LayoutSidebarContent>
        <LayoutSidebarFooter
          user={{
            name: 'Hello world',
            email: 'hello@example.com',
            avatar: 'https://cat-avatars.vercel.app/api/cat?name=Hello%20World',
          }}
        >
          {/* footer items... */}
        </LayoutSidebarFooter>
      </LayoutSidebar>
      <SidebarInset>
        <LayoutHeader />
        <LayoutContent>I am content</LayoutContent>
      </SidebarInset>
    </LayoutBase>
  )
}

const Template: StoryFn = (args) => (
  <WorkspacesProvider>
    <StoryContent />
  </WorkspacesProvider>
)

export const Customized = {
  render: Template,
}
