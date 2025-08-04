import * as React from 'react'
import {
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'

/**
 * Base generic constraints for all form field components
 */
export type FormFieldConstraints<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  TFieldValues: TFieldValues
  TName: TName
}

/**
 * Base props shared by all form field components
 */
export interface BaseFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  label?: string
  description?: string
  className?: string
}

/**
 * Strongly typed field render function
 */
export type FieldRenderFunction<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = (field: ControllerRenderProps<TFieldValues, TName>) => React.ReactElement

/**
 * Layout render function with proper field typing
 */
export type LayoutRenderFunction<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = (props: {
  field: ControllerRenderProps<TFieldValues, TName>
  label?: string
  description?: string
  children: React.ReactElement
}) => React.ReactElement

/**
 * Utility type to extract the field value type from a field path
 */
export type FieldValueType<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = PathValue<TFieldValues, TName>

/**
 * Enhanced input props that properly exclude conflicting properties
 */
export type InputPropsExclude<T> = Omit<T, 'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur'>

/**
 * Type-safe form field component props that extend HTML input props
 * 
 * This utility type combines BaseFormFieldProps with HTML input properties while excluding
 * conflicting form control properties (name, value, onChange, etc.) that are managed by React Hook Form.
 * 
 * @template TFieldValues - The shape of the entire form data object
 * @template TName - The specific field path within the form data
 * @template TInputProps - The base HTML input props to extend (e.g., HTMLInputElement, HTMLTextAreaElement)
 * 
 * @example
 * ```typescript
 * type MyInputProps = TypedFormFieldProps<FormData, 'username', React.InputHTMLAttributes<HTMLInputElement>>
 * ```
 */
export type TypedFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TInputProps = {},
> = BaseFormFieldProps<TFieldValues, TName> & InputPropsExclude<TInputProps>