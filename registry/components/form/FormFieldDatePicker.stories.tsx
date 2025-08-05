import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormFieldDatePicker } from './FormFieldDatePicker'
import { addDays, subDays, addYears } from 'date-fns'

const meta: Meta<typeof FormFieldDatePicker> = {
  title: 'Form/FormFieldDatePicker',
  component: FormFieldDatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormFieldDatePicker>

const formSchema = z.object({
  birthDate: z.date({
    message: 'Please select your birth date',
  }),
  appointmentDate: z.date().optional(),
  eventDate: z.date().optional(),
  deadline: z.date({
    message: 'Please select a deadline',
  }),
})

type FormData = z.infer<typeof formSchema>

const FormDemo = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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
      <FormFieldDatePicker
        name="birthDate"
        label="Birth Date"
        placeholder="Select your birth date"
        description="Your date of birth."
      />
    </FormDemo>
  ),
}

export const WithMaxDate: Story = {
  render: () => (
    <FormDemo>
      <FormFieldDatePicker
        name="birthDate"
        label="Birth Date"
        placeholder="Select your birth date"
        description="Must be before today."
        max={new Date()}
      />
    </FormDemo>
  ),
}

export const WithMinDate: Story = {
  render: () => (
    <FormDemo>
      <FormFieldDatePicker
        name="appointmentDate"
        label="Appointment Date"
        placeholder="Select appointment date"
        description="Must be within the next 30 days."
        min={new Date()}
        max={addDays(new Date(), 30)}
      />
    </FormDemo>
  ),
}

export const WithDateRange: Story = {
  render: () => (
    <FormDemo>
      <FormFieldDatePicker
        name="eventDate"
        label="Event Date"
        placeholder="Select event date"
        description="Must be between 7 days ago and 7 days from now."
        min={subDays(new Date(), 7)}
        max={addDays(new Date(), 7)}
      />
    </FormDemo>
  ),
}

export const CustomFormat: Story = {
  render: () => (
    <FormDemo>
      <FormFieldDatePicker
        name="deadline"
        label="Project Deadline"
        placeholder="Pick a deadline"
        dateFormat="dd/MM/yyyy"
        description="Date format: DD/MM/YYYY"
      />
    </FormDemo>
  ),
}

export const WithoutLabel: Story = {
  render: () => (
    <FormDemo>
      <FormFieldDatePicker
        name="birthDate"
        placeholder="Select a date"
        description="Pick any date you like."
      />
    </FormDemo>
  ),
}

export const Disabled: Story = {
  render: () => (
    <FormDemo>
      <FormFieldDatePicker
        name="birthDate"
        label="Birth Date"
        placeholder="This field is disabled"
        disabled
        description="This field cannot be changed."
      />
    </FormDemo>
  ),
}

export const MultipleDatePickers: Story = {
  render: () => (
    <FormDemo>
      <FormFieldDatePicker
        name="birthDate"
        label="Birth Date"
        placeholder="Select your birth date"
        description="Cannot be in the future."
        max={new Date()}
      />

      <FormFieldDatePicker
        name="appointmentDate"
        label="Next Appointment"
        placeholder="Select appointment date"
        description="Must be in the future."
        min={addDays(new Date(), 1)}
        max={addDays(new Date(), 90)}
      />

      <FormFieldDatePicker
        name="deadline"
        label="Project Deadline"
        placeholder="Set project deadline"
        description="Within the next year."
        min={new Date()}
        max={addYears(new Date(), 1)}
        dateFormat="MMMM dd, yyyy"
      />
    </FormDemo>
  ),
}