import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormFieldCheckbox } from './FormFieldCheckbox'

const meta: Meta<typeof FormFieldCheckbox> = {
  title: 'Form/FormFieldCheckbox',
  component: FormFieldCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormFieldCheckbox>

const formSchema = z.object({
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  marketing: z.boolean().optional(),
  notifications: z.boolean().optional(),
})

type FormData = z.infer<typeof formSchema>

const FormDemo = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newsletter: false,
      terms: false,
      marketing: false,
      notifications: true,
    },
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-96">
        {children}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export const Basic: Story = {
  render: () => (
    <FormDemo>
      <FormFieldCheckbox name="newsletter">
        Subscribe to our newsletter
      </FormFieldCheckbox>
    </FormDemo>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <FormDemo>
      <FormFieldCheckbox
        name="marketing"
        description="We'll send you marketing emails about our products and services."
      >
        I want to receive marketing emails
      </FormFieldCheckbox>
    </FormDemo>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <FormDemo>
      <FormFieldCheckbox
        name="notifications"
        label="Enable notifications"
        description="Get notified about important updates."
      />
    </FormDemo>
  ),
}

export const Required: Story = {
  render: () => (
    <FormDemo>
      <FormFieldCheckbox name="terms">
        I agree to the{' '}
        <a href="#" className="text-primary underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-primary underline">
          Privacy Policy
        </a>
      </FormFieldCheckbox>
    </FormDemo>
  ),
}

export const Disabled: Story = {
  render: () => (
    <FormDemo>
      <FormFieldCheckbox
        name="newsletter"
        disabled
        description="This option is currently unavailable."
      >
        Subscribe to newsletter (disabled)
      </FormFieldCheckbox>
    </FormDemo>
  ),
}

export const MultipleCheckboxes: Story = {
  render: () => (
    <FormDemo>
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Email Preferences</h3>
        
        <FormFieldCheckbox name="newsletter">
          Newsletter - Weekly updates about new features
        </FormFieldCheckbox>

        <FormFieldCheckbox
          name="marketing"
          description="Promotional offers and announcements"
        >
          Marketing emails
        </FormFieldCheckbox>

        <FormFieldCheckbox
          name="notifications"
          description="Important account and security updates"
        >
          System notifications
        </FormFieldCheckbox>

        <FormFieldCheckbox name="terms">
          I agree to the terms and conditions
        </FormFieldCheckbox>
      </div>
    </FormDemo>
  ),
}