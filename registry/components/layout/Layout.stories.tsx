import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { SidebarInset, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import type { Meta, StoryObj } from '@storybook/react'
import { Link } from '@tanstack/react-router'
import { BadgeCheck, Bell, CreditCard, HouseIcon, LifeBuoy, Send, Sparkles } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { Layout, LayoutBase } from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import { LayoutHeader } from '@/components/layout/LayoutHeader'
import { LayoutSidebar } from '@/components/layout/LayoutSidebar'
import { LayoutSidebarContent } from '@/components/layout/LayoutSidebarContent'
import { LayoutSidebarFooter } from '@/components/layout/LayoutSidebarFooter'
import { LayoutSidebarHeader } from '@/components/layout/LayoutSidebarHeader'
import { Workspace, WorkspacesProvider } from '@/components/layout/WorkspaceContext'
import { WorkspaceSwitch } from '@/components/layout/WorkspaceSwitch'
import { FC } from 'react'

const meta: Meta<typeof Fragment> = {
  component: Fragment,
  title: 'Layout/Layout',
  parameters: {
    docs: {
      description: {
        component: `
# Layout System

<div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border">
  <h2 className="text-xl font-semibold mb-3">Built for Real Admin Applications</h2>
  <p className="text-muted-foreground mb-4">
    This layout system handles the complex requirements of modern admin interfaces: 
    workspace switching, responsive navigation, user management, and breadcrumbs.
  </p>
  
  <div className="grid md:grid-cols-3 gap-4">
    <div className="text-center">
      <div className="text-2xl mb-2">📱</div>
      <h4 className="font-semibold">Mobile-First</h4>
      <p className="text-sm text-muted-foreground">Collapsible sidebar, touch-friendly navigation</p>
    </div>
    <div className="text-center">
      <div className="text-2xl mb-2">🏢</div>
      <h4 className="font-semibold">Multi-Workspace</h4>
      <p className="text-sm text-muted-foreground">Switch between organizations seamlessly</p>
    </div>
    <div className="text-center">
      <div className="text-2xl mb-2">🧩</div>
      <h4 className="font-semibold">Composable</h4>
      <p className="text-sm text-muted-foreground">Mix and match components as needed</p>
    </div>
  </div>
</div>

## Installation

\`\`\`bash
npx shadcn add https://raw.githubusercontent.com/Shadcn-Blocks/shadcn-admin-blocks/refs/heads/main/public/r/Layout.json
\`\`\`

## Common Navigation Patterns

### 1. Simple App Navigation
Perfect for single-purpose admin tools:

\`\`\`tsx
const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
]
\`\`\`

### 2. Grouped Navigation
For complex applications with multiple sections:

\`\`\`tsx
const navigation = [
  {
    name: 'Core',
    items: [
      { name: 'Dashboard', href: '/' },
      { name: 'Analytics', href: '/analytics' },
    ]
  },
  {
    name: 'Management', 
    items: [
      { name: 'Users', href: '/users' },
      { name: 'Roles', href: '/roles' },
    ]
  }
]
\`\`\`

### 3. Dynamic Routing Support
For multi-tenant or workspace-based applications:

\`\`\`tsx
// Workspace-based app
<LayoutSidebarContent dynamicParams={{ workspaceId: "workspace-123" }} />

// Tenant-based app  
<LayoutSidebarContent dynamicParams={{ tenantId: "tenant-456" }} />

// Simple app without dynamic parameters
<LayoutSidebarContent />
\`\`\`

### 4. With Secondary Actions
Add workspace-specific actions:

\`\`\`tsx
<LayoutSidebarContent>
  {/* Main navigation */}
  <NavigationItems items={navigation} />
  
  {/* Secondary actions */}
  <div className="mt-auto pt-4 border-t">
    <SidebarMenuItem>
      <SidebarMenuButton>
        <LifeBuoy />
        Support
      </SidebarMenuButton>
    </SidebarMenuItem>
  </div>
</LayoutSidebarContent>
\`\`\`
        `,
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof Fragment>

export const SimpleLayout: Story = {
  name: '1. Simple Layout',
  parameters: {
    docs: {
      description: {
        story:
          'The simplest possible layout setup. Just pass sidebar configuration and content - responsive behavior and user management are handled automatically.',
      },
    },
  },
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
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Welcome to your admin panel!</h1>
          <p className="text-muted-foreground">
            This is your main content area. The sidebar automatically handles responsive behavior,
            user management, and navigation state.
          </p>
        </div>
      </Layout>
    ),
  },
}

const workspacesData: Workspace[] = [
  { id: 'acme-inc', name: 'Acme Inc', logo: LifeBuoy, plan: 'Enterprise' },
  { id: 'beta-co', name: 'Beta Co', logo: Send, plan: 'Pro' },
]

const CustomLayoutStoryContent: FC = () => (
  <WorkspacesProvider workspaces={workspacesData}>
    <LayoutBase>
      <LayoutSidebar>
        <LayoutSidebarHeader>
          <WorkspaceSwitch />
        </LayoutSidebarHeader>
        <LayoutSidebarContent>
          {/* Bottom Menu Items */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <LifeBuoy />
                Support
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <Send />
                Feedback
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </LayoutSidebarContent>
        <LayoutSidebarFooter
          user={{
            name: 'Hello world',
            email: 'hello@example.com',
            avatar: 'https://cat-avatars.vercel.app/api/cat?name=Hello%20World',
          }}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/">
                <Sparkles />
                Upgrade to Pro
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/">
                <BadgeCheck />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/">
                <CreditCard />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/">
                <Bell />
                Notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </LayoutSidebarFooter>
      </LayoutSidebar>
      <SidebarInset>
        <LayoutHeader />
        <LayoutContent>I am content</LayoutContent>
      </SidebarInset>
    </LayoutBase>
  </WorkspacesProvider>
)

export const AdvancedLayout: Story = {
  name: '2. Advanced with Workspaces',
  parameters: {
    docs: {
      description: {
        story:
          'Fully composable layout with workspace switching, custom navigation, and advanced user dropdown. This shows the full power of the layout system.',
      },
    },
  },
  render: () => <CustomLayoutStoryContent />,
}

export const DynamicRoutingLayout: Story = {
  name: '3. Dynamic Routing Layout',
  parameters: {
    docs: {
      description: {
        story:
          'Layout with dynamic routing support for multi-tenant or workspace-based applications. The sidebar automatically handles URL pattern matching for dynamic parameters.',
      },
    },
  },
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
            title: 'Multi-Tenant App',
            subtitle: 'Workspace: Acme Corp',
            icon: <HouseIcon />,
          },
          dynamicParams: {
            workspaceId: 'workspace-123',
            tenantId: 'tenant-456'
          }
        }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Dynamic Routing Example</h1>
          <p className="text-muted-foreground mb-4">
            This layout demonstrates support for dynamic routing parameters. The sidebar can handle URLs like:
          </p>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-muted rounded-md">
              <code>/workspace/$workspaceId/dashboard</code>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <code>/tenant/$tenantId/users</code>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <code>/organization/$orgId/settings</code>
            </div>
          </div>
          <p className="text-muted-foreground mt-4">
            Pass dynamic parameters through the sidebar configuration to enable this functionality.
          </p>
        </div>
      </Layout>
    ),
  },
}
