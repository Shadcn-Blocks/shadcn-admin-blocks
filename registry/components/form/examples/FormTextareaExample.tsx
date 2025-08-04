import * as React from 'react'
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
import { FormTextarea } from '../FormTextarea'

const schema = z.object({
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),
  comments: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function FormTextareaExample() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: '',
      comments: '',
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <FormTextarea placeholder="Tell us about yourself..." rows={4} {...field} />
              </FormControl>
              <FormDescription>
                A brief description about yourself (10-500 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Comments</FormLabel>
              <FormControl>
                <FormTextarea
                  placeholder="Any additional comments or feedback..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional - any additional information you'd like to share.
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
