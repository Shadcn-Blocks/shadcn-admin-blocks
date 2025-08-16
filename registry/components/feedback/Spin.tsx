import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SpinProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  spinning?: boolean
  overlayClassName?: string
  spinnerClassName?: string
  spinnerSize?: number
  noBlur?: boolean
  ref?: React.Ref<HTMLDivElement>
}

export function Spin({
  children,
  spinning = false,
  className,
  overlayClassName,
  spinnerClassName,
  spinnerSize = 24,
  noBlur = false,
  ref,
  ...props
}: SpinProps) {
  return (
    <div ref={ref} className={cn('relative', className)} {...props}>
      {children}
      {spinning && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-background/50',
            !noBlur && 'backdrop-blur-sm',
            overlayClassName
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={spinnerSize}
            height={spinnerSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('animate-spin text-primary', spinnerClassName)}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}
    </div>
  )
}

Spin.displayName = 'Spin'
