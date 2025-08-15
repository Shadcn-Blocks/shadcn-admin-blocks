import type { Meta, StoryObj } from '@storybook/react'
import { Spin } from '@/components/feedback/Spin'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const meta = {
  title: 'Feedback/Spin',
  component: Spin,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spin>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    spinning: true,
    children: (
      <div className="w-[400px] rounded-lg border bg-background p-6">
        <h3 className="text-lg font-semibold">Example Content</h3>
        <p className="mt-2 text-sm text-muted-foreground">This content has a loading overlay</p>
        <div className="mt-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    ),
  },
}

export const Interactive = () => {
  const [spinning, setSpinning] = useState(false)

  const handleClick = () => {
    setSpinning(true)
    setTimeout(() => setSpinning(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Spin spinning={spinning} className="inline-block">
        <div className="w-[400px] rounded-lg border bg-background p-6">
          <h3 className="text-lg font-semibold">Interactive Example</h3>
          <p className="mt-2 text-sm text-muted-foreground">Click the button to simulate loading</p>
          <div className="mt-4 space-y-4">
            <p>This content will show a loading overlay when the button is clicked.</p>
            <Button onClick={handleClick} disabled={spinning}>
              {spinning ? 'Loading...' : 'Simulate Loading'}
            </Button>
          </div>
        </div>
      </Spin>
    </div>
  )
}

export const CustomStyling: Story = {
  args: {
    spinning: true,
    overlayClassName: 'bg-black/30',
    spinnerClassName: 'text-white',
    spinnerSize: 32,
    children: (
      <div className="w-[400px] rounded-lg border bg-background p-6">
        <h3 className="text-lg font-semibold">Custom Styled Spinner</h3>
        <p className="mt-2 text-sm text-muted-foreground">With darker overlay and white spinner</p>
        <div className="mt-4">
          <p>The overlay and spinner can be customized with className props.</p>
        </div>
      </div>
    ),
  },
}

export const NoBlur: Story = {
  args: {
    spinning: true,
    noBlur: true,
    children: (
      <div className="w-[400px] rounded-lg border bg-background p-6">
        <h3 className="text-lg font-semibold">No Blur Effect</h3>
        <p className="mt-2 text-sm text-muted-foreground">Only gray background without blur</p>
        <div className="mt-4">
          <p>The blur effect is disabled, showing only the semi-transparent overlay.</p>
        </div>
      </div>
    ),
  },
}

export const FormExample = () => {
  const [spinning, setSpinning] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSpinning(true)
    setTimeout(() => setSpinning(false), 3000)
  }

  return (
    <Spin spinning={spinning}>
      <div className="w-[400px] rounded-lg border bg-background p-6">
        <h3 className="text-lg font-semibold">Form Submission</h3>
        <p className="mt-2 text-sm text-muted-foreground">Shows spinner during form submission</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border px-3 py-2"
              placeholder="Enter your email"
              disabled={spinning}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              className="w-full rounded-md border px-3 py-2"
              rows={3}
              placeholder="Enter your message"
              disabled={spinning}
            />
          </div>
          <Button type="submit" disabled={spinning} className="w-full">
            {spinning ? 'Submitting...' : 'Submit Form'}
          </Button>
        </form>
      </div>
    </Spin>
  )
}

export const TableExample = () => {
  const [spinning, setSpinning] = useState(false)

  const handleRefresh = () => {
    setSpinning(true)
    setTimeout(() => setSpinning(false), 1500)
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleRefresh} disabled={spinning}>
        Refresh Table Data
      </Button>
      <Spin spinning={spinning}>
        <div className="w-[600px] rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">John Doe</td>
                <td className="p-3">john@example.com</td>
                <td className="p-3">Active</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Jane Smith</td>
                <td className="p-3">jane@example.com</td>
                <td className="p-3">Active</td>
              </tr>
              <tr>
                <td className="p-3">Bob Johnson</td>
                <td className="p-3">bob@example.com</td>
                <td className="p-3">Inactive</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Spin>
    </div>
  )
}
