// registry/my-component/MyComponent.stories.ts

import { StaticDataSource } from '@/lib/data-sources'
import { Q } from '@jakub.knejzlik/ts-query'
import type { Meta, StoryObj } from '@storybook/react'
import { PencilIcon, Trash } from 'lucide-react'
import { DataTable } from './DataTable'
import { Button } from './ui/button'
import { DataTableColumn } from './data-table/DataTableColumn'

const meta: Meta<typeof DataTable> = {
  component: DataTable,
  title: 'Example/DataTable',
}
export default meta

type Story = StoryObj<typeof DataTable<Payment>>

const statuses: Payment['status'][] = ['pending', 'processing', 'success', 'failed']
const emails = [
  'ken99@example.com',
  'Abe45@example.com',
  'Monserrat44@example.com',
  'Silas22@example.com',
  'carmella@example.com',
  'user1@example.com',
  'user2@example.com',
  'user3@example.com',
  'user4@example.com',
  'user5@example.com',
]

const data: Payment[] = Array.from({ length: 123 }, (_, i) => ({
  id: `id${i + 1}`,
  amount: Math.floor(Math.random() * 1000) + 100,
  status: statuses[i % statuses.length],
  email: emails[i % emails.length],
}))

type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

const columns: DataTableColumn<Payment, any>[] = [
  {
    id: 'status',
    accessorKey: 'status',
    type: 'string',
  },
  {
    accessorKey: 'email',
  },
  {
    accessorKey: 'amount',
    type: 'number',
  },
  {
    id: 'actions',
    type: 'actions',
    enableHiding: false,
    header: () => (
      <div className="text-center">
        <Button variant="ghost">Actions</Button>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center space-x-2">
          <Button variant={'outline'} size={'icon'}>
            <PencilIcon />
          </Button>
          <Button variant="destructive" className=" bg-red-500" size={'sm'}>
            <Trash />
          </Button>
        </div>
      )
    },
  },
]

const datasource = new StaticDataSource({ table: data })
const query = Q.select().from('table')

export const StaticDataExample: Story = {
  args: {
    datasource,
    query,
    columns,
  },
}

export const WithToolbar: Story = {
  args: {
    datasource,
    query,
    columns,
    showToolbar: true,
  },
}
