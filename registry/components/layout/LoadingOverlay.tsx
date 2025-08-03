import { LoadingSpinner } from './LoadingSpinner'

interface LoadingOverlayProps {
  visible?: boolean
}

export const LoadingOverlay = ({ visible }: LoadingOverlayProps) => {
  if (!visible) return null

  return (
    <div className="top-0 left-0 w-full h-full flex items-center justify-center bg-white/80 z-50 rounded-[inherit]">
      <LoadingSpinner />
    </div>
  )
}
