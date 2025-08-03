import { Sidebar } from '@/components/ui/sidebar'
import { ComponentProps } from 'react'

export const LayoutSidebar = (props: ComponentProps<typeof Sidebar>) => {
  return <Sidebar {...props} />
}
