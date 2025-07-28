// registry/my-component/MyComponent.stories.ts

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
import { Layout, LayoutBase } from './Layout'
import { LayoutContent } from './LayoutContent'
import { LayoutHeader } from './LayoutHeader'
import { LayoutSidebar } from './LayoutSidebar'
import { LayoutSidebarContent } from './LayoutSidebarContent'
import { LayoutSidebarFooter } from './LayoutSidebarFooter'
import { LayoutSidebarHeader } from './LayoutSidebarHeader'

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

export const Customized: Story = {
  args: {
    children: (
      <LayoutBase>
        <LayoutSidebar>
          <LayoutSidebarHeader
            title="Your company"
            subtitle="Your company tagline"
            icon={<HouseIcon />}
          >
            <SidebarMenuItem>
              <SidebarMenuButton></SidebarMenuButton>
            </SidebarMenuItem>
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
    ),
  },
}
