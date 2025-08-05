import type { Meta, StoryObj } from '@storybook/react'
import { Fragment } from 'react'
import { LayoutSidebarHeader } from '@/components/layout/LayoutSidebarHeader'
import { Layout, LayoutBase } from '@/components/layout/Layout'
import { LifeBuoy } from 'lucide-react'
import { LayoutSidebar } from '@/components/layout/LayoutSidebar'
import { WorkspacesProvider } from '@/components/layout/WorkspaceContext'
import { WorkspaceSwitch } from '@/components/layout/WorkspaceSwitch'

const meta: Meta<typeof Fragment> = {
  component: Fragment,
  title: 'Layout/LayoutSidebarHeader',
}
export default meta

type Story = StoryObj<typeof Fragment>

export const TitleAndSubtitleAndIcon: Story = {
  args: {
    children: (
      <Layout
        sidebar={{ header: { title: 'Acme Inc', subtitle: 'Enterprise', icon: <LifeBuoy /> } }}
      />
    ),
  },
}

export const TitleOnly: Story = {
  args: {
    children: <Layout sidebar={{ header: { title: 'Acme Inc' } }} />,
  },
}
export const SubTitleOnly: Story = {
  args: {
    children: <Layout sidebar={{ header: { subtitle: 'Enterprise' } }} />,
  },
}

export const NoIcon: Story = {
  args: {
    children: <Layout sidebar={{ header: { title: 'Acme Inc', subtitle: 'Free plan' } }} />,
  },
}

export const CustomContent: Story = {
  args: {
    children: (
      <WorkspacesProvider workspaces={[{ name: 'Acme Inc', logo: LifeBuoy, plan: 'Enterprise' }]}>
        <LayoutBase>
          <LayoutSidebar>
            <LayoutSidebarHeader>
              <WorkspaceSwitch />
            </LayoutSidebarHeader>
          </LayoutSidebar>
        </LayoutBase>
      </WorkspacesProvider>
    ),
  },
}
