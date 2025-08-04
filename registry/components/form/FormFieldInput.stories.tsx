import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormFieldInput } from './FormFieldInput'

const meta: Meta<typeof FormFieldInput> = {
  title: 'Form/FormFieldInput',
  component: FormFieldInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormFieldInput>

const formSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof formSchema>

const FormDemo = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
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
      <FormFieldInput
        name="username"
        label="Username"
        placeholder="Enter your username"
        description="This is your public display name."
      />
    </FormDemo>
  ),
}

export const WithoutLabel: Story = {
  render: () => (
    <FormDemo>
      <FormFieldInput
        name="username"
        placeholder="Enter your username"
        description="Username without a label"
      />
    </FormDemo>
  ),
}

export const WithoutDescription: Story = {
  render: () => (
    <FormDemo>
      <FormFieldInput
        name="username"
        label="Username"
        placeholder="Enter your username"
      />
    </FormDemo>
  ),
}

export const EmailType: Story = {
  render: () => (
    <FormDemo>
      <FormFieldInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
        description="We'll never share your email with anyone else."
      />
    </FormDemo>
  ),
}

export const PasswordType: Story = {
  render: () => (
    <FormDemo>
      <FormFieldInput
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        description="Password must be at least 8 characters long."
      />
    </FormDemo>
  ),
}

export const Disabled: Story = {
  render: () => (
    <FormDemo>
      <FormFieldInput
        name="username"
        label="Username"
        placeholder="This field is disabled"
        disabled
        description="This field cannot be edited."
      />
    </FormDemo>
  ),
}

export const MultipleFields: Story = {
  render: () => (
    <FormDemo>
      <FormFieldInput
        name="username"
        label="Username"
        placeholder="Enter your username"
        description="This is your public display name."
      />
      <FormFieldInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
        description="We'll never share your email with anyone else."
      />
      <FormFieldInput
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        description="Password must be at least 8 characters long."
      />
    </FormDemo>
  ),
}