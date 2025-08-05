import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useFormSubmissionState } from '@/components/form/Form'

interface FormSubmitButtonProps extends Omit<React.ComponentProps<typeof Button>, 'type'> {
  /**
   * Custom loading text to show when submitting
   * @default "Submitting..."
   */
  loadingText?: string
  /**
   * Custom loading icon
   * @default Loader2 (spinning)
   */
  loadingIcon?: React.ReactNode
  /**
   * Whether to show loading icon
   * @default true
   */
  showLoadingIcon?: boolean
  /**
   * Button content
   */
  children: React.ReactNode
}

export const FormSubmitButton = React.forwardRef<HTMLButtonElement, FormSubmitButtonProps>(
  ({ children, loadingText = "Submitting...", loadingIcon, showLoadingIcon = true, disabled, ...props }, ref) => {
    const { isSubmitting } = useFormSubmissionState()

    const defaultLoadingIcon = showLoadingIcon ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null
    const finalLoadingIcon = loadingIcon ?? defaultLoadingIcon

    return (
      <Button
        ref={ref}
        type="submit"
        disabled={disabled || isSubmitting}
        {...props}
      >
        {isSubmitting ? (
          <>
            {finalLoadingIcon}
            {loadingText}
          </>
        ) : (
          children
        )}
      </Button>
    )
  }
)

FormSubmitButton.displayName = 'FormSubmitButton'