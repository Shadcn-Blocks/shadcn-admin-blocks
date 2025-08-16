import type { Meta, StoryObj } from '@storybook/react'
import { DateRangePicker } from './DateRangePicker'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Input/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no date is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the date range picker is disabled',
    },
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 3 },
      description: 'Number of months to display in the calendar',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const DateRangePickerWithState = (args: any) => {
  const [value, setValue] = useState<DateRange | undefined>(args.value)

  return (
    <div className="w-[400px]">
      <DateRangePicker
        {...args}
        value={value}
        onChange={setValue}
      />
      {value && (
        <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
          <div className="font-medium mb-2">Selected Range:</div>
          <div>From: {value.from ? value.from.toLocaleDateString() : 'Not selected'}</div>
          <div>To: {value.to ? value.to.toLocaleDateString() : 'Not selected'}</div>
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  render: DateRangePickerWithState,
  args: {
    placeholder: 'Select a date range',
  },
}

export const WithInitialValue: Story = {
  render: DateRangePickerWithState,
  args: {
    value: {
      from: new Date(new Date().setDate(new Date().getDate() - 7)),
      to: new Date(),
    },
  },
}

export const Disabled: Story = {
  render: DateRangePickerWithState,
  args: {
    disabled: true,
    placeholder: 'Date range selection disabled',
  },
}

export const WithMinMaxDates: Story = {
  render: DateRangePickerWithState,
  args: {
    minDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    maxDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    placeholder: 'Select within ±30 days',
  },
}

export const SingleMonth: Story = {
  render: DateRangePickerWithState,
  args: {
    numberOfMonths: 1,
    placeholder: 'Select a date range',
  },
}

export const ThreeMonths: Story = {
  render: DateRangePickerWithState,
  args: {
    numberOfMonths: 3,
    placeholder: 'Select a date range',
  },
}

export const CustomDisabledDates: Story = {
  render: DateRangePickerWithState,
  args: {
    disabledDates: (date: Date) => {
      // Disable weekends
      const day = date.getDay()
      return day === 0 || day === 6
    },
    placeholder: 'Select weekdays only',
  },
}