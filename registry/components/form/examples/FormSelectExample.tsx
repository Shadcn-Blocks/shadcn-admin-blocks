import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { FormSelect, SelectItem } from '../index'

const schema = z.object({
  country: z.string().min(1, 'Please select a country'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority level',
  }),
})

type FormData = z.infer<typeof schema>

export function FormSelectExample() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: '',
      priority: undefined,
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
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <FormSelect 
                  placeholder="Select your country..." 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </FormSelect>
              </FormControl>
              <FormDescription>
                Select the country where you currently reside.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority Level</FormLabel>
              <FormControl>
                <FormSelect 
                  placeholder="Choose priority level..." 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </FormSelect>
              </FormControl>
              <FormDescription>
                Select the priority level for this request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}