import { cn } from '@/lib/utils'
import { LoadingSpinner } from './LoadingSpinner'

interface LoadingOverlayProps {
  visible?: boolean
  fullScreen?: boolean
}

export const LoadingOverlay = ({ visible, fullScreen }: LoadingOverlayProps) => {
  if (!visible && visible !== undefined) return null

  return (
    <div
      className={cn(
        'top-0 left-0 w-full h-full flex items-center justify-center bg-white/50 z-50 rounded-[inherit]',
        fullScreen && 'absolute'
      )}
    >
      <LoadingSpinner />
    </div>
  )
}
