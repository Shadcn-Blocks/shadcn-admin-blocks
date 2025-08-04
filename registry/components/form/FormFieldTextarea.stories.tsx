import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormFieldTextarea } from './FormFieldTextarea'

const meta: Meta<typeof FormFieldTextarea> = {
  title: 'Form/FormFieldTextarea',
  component: FormFieldTextarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormFieldTextarea>

const formSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  feedback: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const FormDemo = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: '',
      message: '',
      feedback: '',
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
      <FormFieldTextarea
        name="bio"
        label="Biography"
        placeholder="Tell us about yourself..."
        description="Optional - maximum 500 characters."
      />
    </FormDemo>
  ),
}

export const WithoutLabel: Story = {
  render: () => (
    <FormDemo>
      <FormFieldTextarea
        name="bio"
        placeholder="Enter your bio without a label"
        description="Bio field without a label"
      />
    </FormDemo>
  ),
}

export const WithoutDescription: Story = {
  render: () => (
    <FormDemo>
      <FormFieldTextarea
        name="bio"
        label="Biography"
        placeholder="Tell us about yourself..."
      />
    </FormDemo>
  ),
}

export const CustomRows: Story = {
  render: () => (
    <FormDemo>
      <FormFieldTextarea
        name="message"
        label="Message"
        placeholder="Write your message here..."
        rows={6}
        description="Please provide detailed feedback (minimum 10 characters)."
      />
    </FormDemo>
  ),
}

export const Disabled: Story = {
  render: () => (
    <FormDemo>
      <FormFieldTextarea
        name="bio"
        label="Biography"
        placeholder="This field is disabled"
        disabled
        description="This field cannot be edited."
      />
    </FormDemo>
  ),
}

export const WithResize: Story = {
  render: () => (
    <FormDemo>
      <FormFieldTextarea
        name="feedback"
        label="Feedback"
        placeholder="Share your thoughts..."
        className="resize-y"
        description="You can resize this textarea vertically."
      />
    </FormDemo>
  ),
}

export const MultipleTextareas: Story = {
  render: () => (
    <FormDemo>
      <FormFieldTextarea
        name="bio"
        label="Biography"
        placeholder="Tell us about yourself..."
        rows={3}
        description="Optional - maximum 500 characters."
      />
      <FormFieldTextarea
        name="message"
        label="Message"
        placeholder="Write your message here..."
        rows={4}
        description="Please provide detailed feedback (minimum 10 characters)."
      />
      <FormFieldTextarea
        name="feedback"
        label="Additional Feedback"
        placeholder="Any additional comments..."
        rows={2}
        description="Optional feedback or suggestions."
      />
    </FormDemo>
  ),
}