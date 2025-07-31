import { cn } from '@/lib/utils'
import { useMatches } from '@tanstack/react-router'
import { PropsWithChildren } from 'react'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    noLayoutContentPadding?: boolean
  }
}

export const LayoutContent = ({ children }: PropsWithChildren) => {
  const matches = useMatches()
  const currentMatch = matches.length > 0 ? matches[matches.length - 1] : undefined
  const staticData = currentMatch?.staticData
  return (
    <div className={cn('flex flex-1 flex-col gap-4', !staticData?.noLayoutContentPadding && 'p-4')}>
      {children}
    </div>
  )
}
