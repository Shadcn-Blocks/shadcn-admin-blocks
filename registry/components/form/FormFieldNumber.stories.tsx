import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormFieldNumber } from './FormFieldNumber'

const meta: Meta<typeof FormFieldNumber> = {
  title: 'Form/FormFieldNumber',
  component: FormFieldNumber,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormFieldNumber>

const formSchema = z.object({
  age: z.number().min(0, 'Age must be a positive number').max(120, 'Age must be realistic'),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().int('Quantity must be a whole number').min(1, 'Quantity must be at least 1'),
  percentage: z.number().min(0, 'Percentage cannot be negative').max(100, 'Percentage cannot exceed 100'),
  weight: z.number().positive('Weight must be positive'),
})

type FormData = z.infer<typeof formSchema>

const FormDemo = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined,
      price: undefined,
      quantity: undefined,
      percentage: undefined,
      weight: undefined,
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
      <FormFieldNumber
        name="age"
        label="Age"
        placeholder="Enter your age"
        description="Please enter your age in years."
        min={0}
        max={120}
      />
    </FormDemo>
  ),
}

export const WithoutLabel: Story = {
  render: () => (
    <FormDemo>
      <FormFieldNumber
        name="age"
        placeholder="Enter your age"
        description="Age field without a label"
        min={0}
        max={120}
      />
    </FormDemo>
  ),
}

export const WithoutDescription: Story = {
  render: () => (
    <FormDemo>
      <FormFieldNumber
        name="age"
        label="Age"
        placeholder="Enter your age"
        min={0}
        max={120}
      />
    </FormDemo>
  ),
}

export const PriceInput: Story = {
  render: () => (
    <FormDemo>
      <FormFieldNumber
        name="price"
        label="Price"
        placeholder="0.00"
        description="Enter the price in USD."
        min={0}
        step={0.01}
      />
    </FormDemo>
  ),
}

export const IntegerOnly: Story = {
  render: () => (
    <FormDemo>
      <FormFieldNumber
        name="quantity"
        label="Quantity"
        placeholder="Enter quantity"
        description="Number of items (whole numbers only)."
        min={1}
        step={1}
      />
    </FormDemo>
  ),
}

export const Percentage: Story = {
  render: () => (
    <FormDemo>
      <FormFieldNumber
        name="percentage"
        label="Percentage"
        placeholder="Enter percentage"
        description="Value between 0 and 100."
        min={0}
        max={100}
        step={0.1}
      />
    </FormDemo>
  ),
}

const WithDefaultValueDemo = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 70.5,
    },
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-96">
        <FormFieldNumber
          name="weight"
          control={form.control}
          label="Weight"
          placeholder="Enter weight"
          description="Weight in kilograms."
          min={0}
          step={0.1}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export const WithDefaultValue: Story = {
  render: () => <WithDefaultValueDemo />,
}

export const Disabled: Story = {
  render: () => (
    <FormDemo>
      <FormFieldNumber
        name="age"
        label="Age"
        placeholder="This field is disabled"
        disabled
        description="This field cannot be edited."
        min={0}
        max={120}
      />
    </FormDemo>
  ),
}

export const MultipleFields: Story = {
  render: () => (
    <FormDemo>
      <FormFieldNumber
        name="age"
        label="Age"
        placeholder="Enter your age"
        description="Age in years."
        min={0}
        max={120}
      />
      <FormFieldNumber
        name="price"
        label="Price"
        placeholder="0.00"
        description="Price in USD."
        min={0}
        step={0.01}
      />
      <FormFieldNumber
        name="quantity"
        label="Quantity"
        placeholder="Enter quantity"
        description="Number of items."
        min={1}
        step={1}
      />
      <FormFieldNumber
        name="percentage"
        label="Completion Percentage"
        placeholder="Enter percentage"
        description="Completion percentage (0-100)."
        min={0}
        max={100}
        step={0.1}
      />
    </FormDemo>
  ),
}