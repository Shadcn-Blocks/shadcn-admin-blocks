import type { Meta, StoryObj } from '@storybook/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Fragment } from 'react/jsx-runtime'
import { BreadcrumbsBase } from './Breadcrumbs'

const meta: Meta<typeof Fragment> = {
  component: Fragment,
  title: 'Example/Breadcrumbs',
}
export default meta

type Story = StoryObj<typeof Fragment>

export const Static: Story = {
  args: {
    children: (
      <BreadcrumbsBase
        items={[
          { href: '/', label: 'Home', isClickable: true },
          { href: '/about', label: 'About', isClickable: true },
          { href: '/contact', label: 'Contact', isClickable: false },
        ]}
      />
    ),
  },
}

const DelayedCrumb = ({ delay }: { delay: number }) => {
  useSuspenseQuery({
    queryKey: ['delayed-crumb', delay],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return 'Tada!'
    },
  })
  return <>{delay}ms</>
}

export const DynamicWithSuspense: Story = {
  args: {
    children: (
      <BreadcrumbsBase
        items={[
          { href: '/', label: <DelayedCrumb delay={1000} />, isClickable: true },
          { href: '/about', label: <DelayedCrumb delay={2000} />, isClickable: true },
          { href: '/contact', label: <DelayedCrumb delay={3000} />, isClickable: false },
          { href: '/contact', label: <DelayedCrumb delay={4000} />, isClickable: false },
          { href: '/contact', label: <DelayedCrumb delay={5000} />, isClickable: false },
          { href: '/contact', label: <DelayedCrumb delay={6000} />, isClickable: false },
          { href: '/contact', label: <DelayedCrumb delay={12000} />, isClickable: false },
          { href: '/contact', label: <DelayedCrumb delay={30000} />, isClickable: false },
        ]}
      />
    ),
  },
}
