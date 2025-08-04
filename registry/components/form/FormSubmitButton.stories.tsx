import type { Meta, StoryObj } from '@storybook/react'
import { z } from 'zod'
import { Form, FormSubmitButton, FormFieldInput } from './index'

const meta: Meta<typeof FormSubmitButton> = {
  title: 'Form/FormSubmitButton',
  component: FormSubmitButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loadingText: {
      control: 'text',
      description: 'Text to show when form is submitting',
    },
    showLoadingIcon: {
      control: 'boolean',
      description: 'Whether to show loading spinner',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
  },
}

export default meta
type Story = StoryObj<typeof FormSubmitButton>

const demoSchema = z.object({
  message: z.string().min(1, 'Message is required'),
})

type DemoFormData = z.infer<typeof demoSchema>

export const Default: Story = {
  render: (args) => {
    const DemoForm = () => {
      const onSubmit = async (data: DemoFormData) => {
        console.log('Demo form submitted:', data)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert('Form submitted successfully!')
      }

      return (
        <Form 
          schema={demoSchema}
          defaultValues={{ message: '' }}
          onSubmit={onSubmit} 
          className="space-y-4 w-96"
        >
          <FormFieldInput
            name="message"
            label="Message"
            placeholder="Enter your message"
          />

          <FormSubmitButton {...args}>
            Submit
          </FormSubmitButton>
        </Form>
      )
    }

    return <DemoForm />
  },
  args: {
    loadingText: 'Submitting...',
    showLoadingIcon: true,
  },
}

export const CustomLoadingText: Story = {
  render: () => {
    const CustomLoadingForm = () => {
      const onSubmit = async () => {
        // Simulate longer API call
        await new Promise(resolve => setTimeout(resolve, 3000))
        alert('Message sent!')
      }

      return (
        <Form 
          schema={demoSchema}
          defaultValues={{ message: '' }}
          onSubmit={onSubmit} 
          className="space-y-4 w-96"
        >
          <FormFieldInput
            name="message"
            label="Message"
            placeholder="Enter your message"
          />

          <FormSubmitButton loadingText="Sending message..." className="w-full">
            Send Message
          </FormSubmitButton>
        </Form>
      )
    }

    return <CustomLoadingForm />
  },
}

export const NoLoadingIcon: Story = {
  render: () => {
    const NoIconForm = () => {
      const onSubmit = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert('Saved!')
      }

      return (
        <Form 
          schema={demoSchema}
          defaultValues={{ message: '' }}
          onSubmit={onSubmit} 
          className="space-y-4 w-96"
        >
          <FormFieldInput
            name="message"
            label="Message"
            placeholder="Enter your message"
          />

          <FormSubmitButton 
            loadingText="Saving..." 
            showLoadingIcon={false}
            variant="outline"
          >
            Save Draft
          </FormSubmitButton>
        </Form>
      )
    }

    return <NoIconForm />
  },
}

export const DestructiveAction: Story = {
  render: () => {
    const DestructiveForm = () => {
      const onSubmit = async () => {
        await new Promise(resolve => setTimeout(resolve, 2500))
        alert('Account deleted!')
      }

      return (
        <Form 
          schema={demoSchema}
          defaultValues={{ message: '' }}
          onSubmit={onSubmit} 
          className="space-y-4 w-96"
        >
          <FormFieldInput
            name="message"
            label="Confirmation Message"
            placeholder="Type 'DELETE' to confirm"
          />

          <FormSubmitButton 
            loadingText="Deleting account..." 
            variant="destructive"
            className="w-full"
          >
            Delete Account
          </FormSubmitButton>
        </Form>
      )
    }

    return <DestructiveForm />
  },
}

export const MultipleButtons: Story = {
  render: () => {
    const MultiButtonForm = () => {
      const onSave = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500))
        alert('Draft saved!')
      }

      const onPublish = async () => {
        await new Promise(resolve => setTimeout(resolve, 2500))
        alert('Published!')
      }

      return (
        <div className="space-y-6">
          <Form 
            schema={demoSchema}
            defaultValues={{ message: '' }}
            onSubmit={onSave} 
            className="space-y-4 w-96"
          >
            <FormFieldInput
              name="message"
              label="Post Content"
              placeholder="Write your post..."
            />

            <div className="flex gap-2">
              <FormSubmitButton 
                variant="outline" 
                loadingText="Saving..."
                className="flex-1"
              >
                Save Draft
              </FormSubmitButton>
            </div>
          </Form>

          <Form 
            schema={demoSchema}
            defaultValues={{ message: '' }}
            onSubmit={onPublish} 
            className="space-y-4 w-96"
          >
            <FormFieldInput
              name="message"
              label="Post Content"
              placeholder="Write your post..."
            />

            <FormSubmitButton 
              loadingText="Publishing..." 
              className="w-full"
            >
              Publish Post
            </FormSubmitButton>
          </Form>
        </div>
      )
    }

    return <MultiButtonForm />
  },
}