import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from './Form'
import {
  FormSubmitButton,
  FormFieldInput,
  FormFieldTextarea,
  FormFieldSelect,
  FormFieldCheckbox,
  FormFieldDatePicker,
  SelectItem,
} from './index'

const meta: Meta<typeof Form> = {
  title: 'Form/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Form Components

<div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border rounded-xl">
  <h2 className="text-xl font-semibold mb-3">The 80% Solution for React Forms</h2>
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h3 className="font-semibold mb-2">Before (Standard Pattern):</h3>
      <div className="text-xs bg-muted p-3 rounded font-mono">
        &lt;FormField control={form.control} name="email"<br/>
        &nbsp;&nbsp;render={({ field }) =&gt; (<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;FormItem&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;FormLabel&gt;Email&lt;/FormLabel&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;FormControl&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Input {...field} /&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/FormControl&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;FormMessage /&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;/FormItem&gt;<br/>
        &nbsp;&nbsp;)}<br/>
        /&gt;
      </div>
      <p className="text-sm text-muted-foreground mt-2">😫 15 lines of boilerplate</p>
    </div>
    
    <div>
      <h3 className="font-semibold mb-2">After (Enhanced Components):</h3>
      <div className="text-xs bg-muted p-3 rounded font-mono">
        &lt;FormFieldInput<br/>
        &nbsp;&nbsp;name="email"<br/>
        &nbsp;&nbsp;label="Email"<br/>
        &nbsp;&nbsp;placeholder="your@email.com"<br/>
        /&gt;
      </div>
      <p className="text-sm text-muted-foreground mt-2">✅ 4 lines, same functionality</p>
    </div>
  </div>
  
  <div className="mt-4 p-3 bg-white rounded border-l-4 border-primary">
    <strong>Result:</strong> 70% less code, 100% of the functionality, better developer experience.
  </div>
</div>

## Quick Reference

<div className="grid md:grid-cols-2 gap-6 my-8">
  <div className="space-y-4">
    <h3 className="font-semibold">Common Form Fields</h3>
    <div className="space-y-2 text-sm font-mono">
      <div>&lt;FormFieldInput name="email" label="Email" /&gt;</div>
      <div>&lt;FormFieldTextarea name="bio" label="Bio" /&gt;</div>
      <div>&lt;FormFieldSelect name="country" label="Country"&gt;</div>
      <div>&lt;FormFieldCheckbox name="terms"&gt;Accept terms&lt;/FormFieldCheckbox&gt;</div>
      <div>&lt;FormFieldDatePicker name="date" label="Date" /&gt;</div>
    </div>
  </div>
  
  <div className="space-y-4">
    <h3 className="font-semibold">Complete Form Pattern</h3>
    <div className="text-sm font-mono space-y-1">
      <div>&lt;Form schema={zodSchema} onSubmit={handleSubmit}&gt;</div>
      <div>&nbsp;&nbsp;&lt;FormFieldInput name="name" label="Name" /&gt;</div>
      <div>&nbsp;&nbsp;&lt;FormFieldInput name="email" label="Email" /&gt;</div>
      <div>&nbsp;&nbsp;&lt;FormSubmitButton&gt;Submit&lt;/FormSubmitButton&gt;</div>
      <div>&lt;/Form&gt;</div>
    </div>
  </div>
</div>

## Installation

\`\`\`bash
npx shadcn add https://raw.githubusercontent.com/Shadcn-Blocks/shadcn-admin-blocks/refs/heads/main/public/r/Form.json
\`\`\`

## Dependencies

\`\`\`bash
npm install react-hook-form @hookform/resolvers zod date-fns
\`\`\`
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Form>

const simpleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
})

const fullSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  country: z.string().min(1, 'Please select a country'),
  birthDate: z.date({
    message: 'Please select your birth date',
  }),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
})

type SimpleFormData = z.infer<typeof simpleSchema>
type FullFormData = z.infer<typeof fullSchema>

export const SimpleForm: Story = {
  name: '1. Simple Form',
  parameters: {
    docs: {
      description: {
        story:
          'The simplest possible form setup. Just pass a Zod schema and onSubmit handler - validation and error handling are automatic.',
      },
    },
  },
  render: () => {
    const SchemaFormExample = () => {
      const onSubmit = async (data: SimpleFormData) => {
        console.log('Schema form submitted:', data)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        alert(`Hello ${data.name}! Form submitted successfully.`)
      }

      return (
        <Form
          schema={simpleSchema}
          defaultValues={{ name: '', email: '' }}
          onSubmit={onSubmit}
          className="space-y-4 w-96"
        >
          <FormFieldInput
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            description="This will be displayed on your profile."
          />

          <FormFieldInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
          />

          <FormSubmitButton className="w-full">Submit</FormSubmitButton>
        </Form>
      )
    }

    return <SchemaFormExample />
  },
}

export const WithExistingFormInstance: Story = {
  name: '2. With Existing Form Hook',
  parameters: {
    docs: {
      description: {
        story:
          'Use your own useForm hook instance if you need custom configuration or want to access form state outside the component.',
      },
    },
  },
  render: () => {
    const ExistingFormExample = () => {
      const form = useForm<SimpleFormData>({
        resolver: zodResolver(simpleSchema),
        defaultValues: {
          name: '',
          email: '',
        },
      })

      const onSubmit = async (data: SimpleFormData) => {
        console.log('Existing form submitted:', data)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        alert(`Hello ${data.name}! Form submitted successfully.`)
      }

      return (
        <Form form={form} onSubmit={onSubmit} className="space-y-4 w-96">
          <FormFieldInput
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            description="This will be displayed on your profile."
          />

          <FormFieldInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
          />

          <FormSubmitButton className="w-full">Submit</FormSubmitButton>
        </Form>
      )
    }

    return <ExistingFormExample />
  },
}

export const FullRegistrationForm: Story = {
  name: '3. All Field Types',
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive form showing all available field types: inputs, textarea, select, date picker, and checkboxes.',
      },
    },
  },
  render: () => {
    const FullFormExample = () => {
      const onSubmit = async (data: FullFormData) => {
        console.log('Registration form submitted:', data)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 3000))
        alert('Registration successful!')
      }

      return (
        <Form
          schema={fullSchema}
          defaultValues={{ newsletter: false }}
          onSubmit={onSubmit}
          className="space-y-6 max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldInput
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              description="Your first name as it appears on official documents."
            />

            <FormFieldInput name="lastName" label="Last Name" placeholder="Enter your last name" />
          </div>

          <FormFieldInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            description="We'll never share your email with anyone else."
          />

          <FormFieldTextarea
            name="bio"
            label="Biography"
            placeholder="Tell us about yourself..."
            rows={4}
            description="Optional - maximum 500 characters."
          />

          <FormFieldSelect
            name="country"
            label="Country"
            placeholder="Select your country"
            description="Select your country of residence."
          >
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="de">Germany</SelectItem>
            <SelectItem value="fr">France</SelectItem>
          </FormFieldSelect>

          <FormFieldDatePicker
            name="birthDate"
            label="Birth Date"
            placeholder="Select your birth date"
            description="You must be 18 years or older."
            max={new Date()}
          />

          <div className="space-y-4">
            <FormFieldCheckbox name="newsletter">
              Subscribe to our newsletter for updates and tips
            </FormFieldCheckbox>

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
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              Reset
            </Button>
            <FormSubmitButton loadingText="Registering...">Register</FormSubmitButton>
          </div>
        </Form>
      )
    }

    return <FullFormExample />
  },
}

export const CustomStyling: Story = {
  name: '4. Custom Styling',
  parameters: {
    docs: {
      description: {
        story:
          'Form with custom styling classes applied to the wrapper. Shows how to create branded form layouts.',
      },
    },
  },
  render: () => {
    const CustomFormExample = () => {
      const onSubmit = async (data: SimpleFormData) => {
        console.log('Custom form submitted:', data)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        alert('Message sent!')
      }

      return (
        <Form
          schema={simpleSchema}
          defaultValues={{ name: '', email: '' }}
          onSubmit={onSubmit}
          className="space-y-8 p-6 border rounded-lg bg-muted/50 w-96"
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold">Contact Form</h2>
            <p className="text-sm text-muted-foreground">Custom styled form wrapper</p>
          </div>

          <FormFieldInput name="name" label="Name" placeholder="Your name" />

          <FormFieldInput name="email" label="Email" type="email" placeholder="your@email.com" />

          <FormSubmitButton className="w-full" loadingText="Sending...">
            Send Message
          </FormSubmitButton>
        </Form>
      )
    }

    return <CustomFormExample />
  },
}

export const CompleteRegistrationExample: Story = {
  name: '5. Production Example',
  parameters: {
    docs: {
      description: {
        story:
          "Real-world registration form with proper layout, headers, sections, and polished UI. This is what you'd ship to production.",
      },
    },
  },
  render: () => {
    const CompleteFormExample = () => {
      const onSubmit = async (data: FullFormData) => {
        console.log('Complete registration submitted:', data)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 3000))
        alert('Registration completed successfully!')
      }

      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">
              Join us today! Fill out the form below to get started.
            </p>
          </div>

          <Form
            schema={fullSchema}
            defaultValues={{ newsletter: false }}
            onSubmit={onSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldInput
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
                description="Your first name as it appears on official documents."
              />

              <FormFieldInput
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
              />
            </div>

            <FormFieldInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              description="We'll never share your email with anyone else."
            />

            <FormFieldTextarea
              name="bio"
              label="Biography"
              placeholder="Tell us about yourself..."
              rows={4}
              description="Optional - maximum 500 characters."
            />

            <FormFieldSelect
              name="country"
              label="Country"
              placeholder="Select your country"
              description="Select your country of residence."
            >
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
            </FormFieldSelect>

            <FormFieldDatePicker
              name="birthDate"
              label="Birth Date"
              placeholder="Select your birth date"
              description="You must be 18 years or older."
              max={new Date()}
            />

            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">Preferences</h3>

              <FormFieldCheckbox name="newsletter">
                📧 Subscribe to our newsletter for updates and tips
              </FormFieldCheckbox>

              <FormFieldCheckbox name="terms">
                ✅ I agree to the{' '}
                <a href="#" className="text-primary underline hover:no-underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary underline hover:no-underline">
                  Privacy Policy
                </a>
              </FormFieldCheckbox>
            </div>

            <div className="flex justify-end">
              <FormSubmitButton
                loadingText="Creating your account..."
                className="w-full md:w-auto min-w-32"
              >
                Create Account
              </FormSubmitButton>
            </div>
          </Form>
        </div>
      )
    }

    return <CompleteFormExample />
  },
}
