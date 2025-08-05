import * as React from 'react'
import { FieldPath, FieldValues, useFormContext, ControllerRenderProps } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { BaseFormFieldProps, FieldRenderFunction, LayoutRenderFunction } from '@/lib/form/types'

interface FormFieldWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  children: FieldRenderFunction<TFieldValues, TName>
  renderLayout?: LayoutRenderFunction<TFieldValues, TName>
}

export const FormFieldWrapper = React.memo(
  <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    label,
    description,
    className,
    children,
    renderLayout,
  }: FormFieldWrapperProps<TFieldValues, TName>) => {
    const form = useFormContext<TFieldValues>()

    // Memoize field control to prevent unnecessary context reads
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fieldControl = React.useMemo(() => control || form.control, [control])

    // Memoize the render function to prevent child re-renders
    const renderField = React.useCallback(
      ({ field }: { field: ControllerRenderProps<TFieldValues, TName> }) => {
        const childElement = children(field)

        if (renderLayout) {
          return (
            <FormItem className={className}>
              {renderLayout({ field, label, description, children: childElement })}
              <FormMessage />
            </FormItem>
          )
        }

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>{childElement}</FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      },
      [children, renderLayout, className, label, description]
    )

    return (
      <FormField
        control={fieldControl}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={renderField}
      />
    )
  }
) as <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: FormFieldWrapperProps<TFieldValues, TName>
) => React.ReactElement

FormFieldWrapper.displayName = 'FormFieldWrapper'
