import { PropsWithChildren } from 'react'

export const LayoutContent = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
}
