import * as React from 'react'
import { FieldValues, UseFormReturn, useForm, UseFormProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form as ShadcnForm } from '@/components/ui/form'

// Context for sharing form submission state with submit buttons
interface FormSubmissionContextValue {
  isSubmitting: boolean
}

const FormSubmissionContext = React.createContext<FormSubmissionContextValue | null>(null)

export const useFormSubmissionState = () => {
  const context = React.useContext(FormSubmissionContext)
  if (!context) {
    throw new Error('useFormSubmissionState must be used within a Form')
  }
  return context
}

// Props when providing an existing form instance
interface FormPropsWithForm<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>
  onSubmit: (data: TFieldValues) => void | Promise<void>
  children: React.ReactNode
  className?: string
  /**
   * Whether to prevent default form submission behavior.
   * Set to false if you want to handle form submission manually.
   * @default true
   */
  preventDefault?: boolean
}

// Props when providing a Zod schema (Form creates the form internally)
interface FormPropsWithSchema<TSchema extends z.ZodType<any, any, any>> {
  schema: TSchema
  defaultValues?: Partial<z.infer<TSchema>>
  onSubmit: (data: z.infer<TSchema>) => void | Promise<void>
  children: React.ReactNode
  className?: string
  /**
   * Whether to prevent default form submission behavior.
   * Set to false if you want to handle form submission manually.
   * @default true
   */
  preventDefault?: boolean
  /**
   * Additional useForm options (mode, reValidateMode, etc.)
   */
  formOptions?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver' | 'defaultValues'>
}

// Form component with schema support
function FormWithSchema<TSchema extends z.ZodType<any, any, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className = "space-y-6",
  preventDefault = true,
  formOptions = {},
}: FormPropsWithSchema<TSchema>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Create the form instance internally
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as z.infer<TSchema>,
    ...formOptions,
  })

  const handleSubmit = React.useCallback(async (data: z.infer<TSchema>) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmit])

  const submitHandler = form.handleSubmit(handleSubmit)

  return (
    <FormSubmissionContext.Provider value={{ isSubmitting }}>
      <ShadcnForm {...form}>
        <form 
          onSubmit={preventDefault ? submitHandler : undefined}
          className={className}
          noValidate
        >
          {children}
        </form>
      </ShadcnForm>
    </FormSubmissionContext.Provider>
  )
}

// Form component with existing form instance
function FormWithForm<TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  className = "space-y-6",
  preventDefault = true,
}: FormPropsWithForm<TFieldValues>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = React.useCallback(async (data: TFieldValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmit])

  const submitHandler = form.handleSubmit(handleSubmit)

  return (
    <FormSubmissionContext.Provider value={{ isSubmitting }}>
      <ShadcnForm {...form}>
        <form 
          onSubmit={preventDefault ? submitHandler : undefined}
          className={className}
          noValidate
        >
          {children}
        </form>
      </ShadcnForm>
    </FormSubmissionContext.Provider>
  )
}

// Union type for all possible Form props
export type FormProps<
  TFieldValues extends FieldValues = FieldValues,
  TSchema extends z.ZodType<any, any, any> = z.ZodType<any, any, any>
> = FormPropsWithForm<TFieldValues> | FormPropsWithSchema<TSchema>

// Main Form component with proper typing using function overloads
interface FormComponentInterface {
  <TSchema extends z.ZodType<any, any, any>>(
    props: FormPropsWithSchema<TSchema>
  ): React.ReactElement
  <TFieldValues extends FieldValues = FieldValues>(
    props: FormPropsWithForm<TFieldValues>
  ): React.ReactElement
  displayName?: string
}

const FormComponent: FormComponentInterface = <
  TFieldValues extends FieldValues = FieldValues,
  TSchema extends z.ZodType<any, any, any> = z.ZodType<any, any, any>
>(props: FormProps<TFieldValues, TSchema>): React.ReactElement => {
  // Check if props has 'schema' property to determine which variant to use
  if ('schema' in props) {
    return <FormWithSchema {...props} />
  } else {
    return <FormWithForm {...props} />
  }
}

export const Form = FormComponent

Form.displayName = 'Form'