// registry/my-component/MyComponent.stories.ts

import type { Meta, StoryObj } from '@storybook/react'
import { UserDropdown } from './UserDropdown'

const meta: Meta<typeof UserDropdown> = {
  component: UserDropdown,
  title: 'Example/UserDropdown',
}
export default meta

type Story = StoryObj<typeof UserDropdown>

export const Default: Story = {}
