// Type definitions for strongly typed form fields
export type {
  BaseFormFieldProps,
  FieldRenderFunction,
  LayoutRenderFunction,
  FieldValueType,
  TypedFormFieldProps,
  InputPropsExclude,
} from '../../lib/form/types'

// Form wrapper to eliminate boilerplate
export { Form, useFormSubmissionState } from './Form'

// Smart submit button with automatic loading state
export { FormSubmitButton } from './FormSubmitButton'

// FormField wrapper for custom implementations
export { FormFieldWrapper } from './FormFieldWrapper'

// Complete FormField components that wrap the entire FormField structure
export { FormFieldInput } from './FormFieldInput'
export { FormFieldTextarea } from './FormFieldTextarea'
export { FormFieldSelect } from './FormFieldSelect'
export { FormFieldCheckbox } from './FormFieldCheckbox'
export { FormFieldDatePicker } from './FormFieldDatePicker'

// Standalone date picker component (has substantial logic worth keeping)
export { FormDatePicker } from './FormDatePicker'

// Re-export Select components for FormFieldSelect usage
export { SelectItem, SelectSeparator, SelectGroup, SelectLabel } from '@/components/ui/select'
