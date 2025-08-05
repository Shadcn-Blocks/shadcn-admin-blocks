import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { FormDatePicker } from './FormDatePicker'

const meta: Meta<typeof FormDatePicker> = {
  component: FormDatePicker,
  title: 'Form/FormDatePicker',
  parameters: {
    docs: {
      description: {
        component:
          'Simple date picker wrapper component with calendar. Use with shadcn/ui FormField pattern for form integration.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FormDatePicker>

// Standalone component usage
export const Default: Story = {
  args: {
    placeholder: 'Pick a date',
  },
}

export const Variations: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <FormDatePicker placeholder="Select any date" />

      <FormDatePicker placeholder="Birth date" max={new Date()} />

      <FormDatePicker placeholder="Future appointment" min={new Date()} />

      <FormDatePicker placeholder="Disabled picker" disabled />
    </div>
  ),
}

// Example with shadcn/ui Form integration
const formSchema = z.object({
  birthDate: z.date({
    message: 'Please select your birth date',
  }),
  appointmentDate: z
    .date({
      message: 'Please select an appointment date',
    })
    .refine((date) => date > new Date(), {
      message: 'Appointment must be in the future',
    }),
  eventDate: z.date().optional(),
})

type FormData = z.infer<typeof formSchema>

function FormExample() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: undefined,
      appointmentDate: undefined,
      eventDate: undefined,
    },
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Date</FormLabel>
              <FormControl>
                <FormDatePicker
                  placeholder="Select your birth date"
                  value={field.value}
                  onValueChange={field.onChange}
                  max={new Date()} // Can't be in the future
                />
              </FormControl>
              <FormDescription>Your date of birth for verification purposes.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="appointmentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appointment Date</FormLabel>
              <FormControl>
                <FormDatePicker
                  placeholder="Select appointment date"
                  value={field.value}
                  onValueChange={field.onChange}
                  min={new Date()} // Must be in the future
                />
              </FormControl>
              <FormDescription>Choose a future date for your appointment.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date (Optional)</FormLabel>
              <FormControl>
                <FormDatePicker
                  placeholder="Select event date"
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Optional - any relevant event date.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export const WithFormField: Story = {
  render: () => <FormExample />,
}
