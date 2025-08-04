import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormFieldSelect, SelectItem, SelectGroup, SelectLabel, SelectSeparator } from './index'

const meta: Meta<typeof FormFieldSelect> = {
  title: 'Form/FormFieldSelect',
  component: FormFieldSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormFieldSelect>

const formSchema = z.object({
  country: z.string().min(1, 'Please select a country'),
  role: z.string().min(1, 'Please select a role'),
  theme: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const FormDemo = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: '',
      role: '',
      theme: '',
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
      <FormFieldSelect
        name="country"
        label="Country"
        placeholder="Select a country"
        description="Select your country of residence."
      >
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
      </FormFieldSelect>
    </FormDemo>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <FormDemo>
      <FormFieldSelect
        name="role"
        label="Role"
        placeholder="Select a role"
        description="Choose your user role."
      >
        <SelectGroup>
          <SelectLabel>Management</SelectLabel>
          <SelectItem value="admin">Administrator</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Development</SelectLabel>
          <SelectItem value="developer">Developer</SelectItem>
          <SelectItem value="designer">Designer</SelectItem>
          <SelectItem value="qa">QA Engineer</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Other</SelectLabel>
          <SelectItem value="viewer">Viewer</SelectItem>
          <SelectItem value="guest">Guest</SelectItem>
        </SelectGroup>
      </FormFieldSelect>
    </FormDemo>
  ),
}

export const WithoutLabel: Story = {
  render: () => (
    <FormDemo>
      <FormFieldSelect
        name="theme"
        placeholder="Select a theme"
        description="Choose your preferred color theme."
      >
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </FormFieldSelect>
    </FormDemo>
  ),
}

export const Disabled: Story = {
  render: () => (
    <FormDemo>
      <FormFieldSelect
        name="country"
        label="Country"
        placeholder="This field is disabled"
        disabled
        description="This field cannot be changed."
      >
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
      </FormFieldSelect>
    </FormDemo>
  ),
}

export const MultipleSelects: Story = {
  render: () => (
    <FormDemo>
      <FormFieldSelect
        name="country"
        label="Country"
        placeholder="Select a country"
        description="Select your country of residence."
      >
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
      </FormFieldSelect>

      <FormFieldSelect
        name="role"
        label="Role"
        placeholder="Select a role"
        description="Choose your user role."
      >
        <SelectItem value="admin">Administrator</SelectItem>
        <SelectItem value="developer">Developer</SelectItem>
        <SelectItem value="designer">Designer</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </FormFieldSelect>

      <FormFieldSelect
        name="theme"
        label="Theme"
        placeholder="Select a theme"
      >
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </FormFieldSelect>
    </FormDemo>
  ),
}