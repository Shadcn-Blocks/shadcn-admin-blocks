// registry/my-component/MyComponent.stories.ts

import { StaticDataSource } from '@/lib/data-sources'
import { Q } from '@jakub.knejzlik/ts-query'
import type { Meta, StoryObj } from '@storybook/react'
import { PencilIcon, Trash } from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import { Button } from '@/components/ui/button'
import { DataTableColumn } from '@/components/data-table/DataTableColumn'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'
import { DataTableContent } from '@/components/data-table/DataTableContent'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { DataTableFooter } from '@/components/data-table/DataTableFooter'
import { DataTablePageSwitcher } from '@/components/data-table/DataTablePageSwitcher'
import dayjs from 'dayjs'

const meta: Meta<typeof DataTable> = {
  component: DataTable,
  title: 'DataTable/DataTable',
  parameters: {
    docs: {
      description: {
        component: `
# DataTable

<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <h3 className="font-semibold text-blue-900 mb-2">What makes this DataTable special?</h3>
  <ul className="text-sm text-blue-800 space-y-1">
    <li>• <strong>Server-side everything:</strong> Pagination, sorting, and filtering happen on your backend</li>
    <li>• <strong>SQL query building:</strong> Automatically generates database queries from user interactions</li>
    <li>• <strong>Modular design:</strong> Use pre-built layouts or compose your own</li>
    <li>• <strong>Type-safe:</strong> Full TypeScript support with column definitions</li>
  </ul>
</div>

## When to Use This DataTable

<div className="grid md:grid-cols-2 gap-4 my-6">
  <div className="p-4 border border-green-200 rounded-lg">
    <h4 className="font-semibold text-green-700">✅ Perfect for:</h4>
    <ul className="mt-2 text-sm space-y-1">
      <li>• Large datasets (1000+ records)</li>
      <li>• Server-side filtering/sorting</li>
      <li>• Database-driven applications</li>
      <li>• Admin panels and dashboards</li>
    </ul>
  </div>
  
  <div className="p-4 border border-amber-200 rounded-lg">
    <h4 className="font-semibold text-amber-700">⚠️ Consider alternatives for:</h4>
    <ul className="mt-2 text-sm space-y-1">
      <li>• Small, static datasets (<100 records)</li>
      <li>• Client-side only applications</li>
      <li>• Simple display tables without interaction</li>
    </ul>
  </div>
</div>

## Installation

\`\`\`bash
npx shadcn add https://raw.githubusercontent.com/Shadcn-Blocks/shadcn-admin-blocks/refs/heads/main/public/r/DataTable.json
\`\`\`

## Quick Examples

### 1. Simplest Possible Table
Start with the most basic setup - perfect for prototyping:

\`\`\`tsx
const users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
]

const dataSource = new StaticDataSource({ users })
const query = Q.select().from('users')

<DataTable
  datasource={dataSource}
  query={query}
  columns={[
    { accessorKey: 'name' },
    { accessorKey: 'email' },
  ]}
/>
\`\`\`

**What happened:** The table automatically added sorting, pagination, and responsive design.

### 2. With Custom Actions
Now let's add edit and delete buttons:

\`\`\`tsx
const columns = [
  { accessorKey: 'name' },
  { accessorKey: 'email' },
  {
    id: 'actions',
    type: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => edit(row.original.id)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => delete(row.original.id)}>
          Delete  
        </Button>
      </div>
    )
  }
]
\`\`\`

### 3. Production-Ready with Toolbar
Add search, filters, and column visibility:

\`\`\`tsx
<DataTable datasource={dataSource} query={query} columns={columns}>
  <DataTableToolbar />  {/* Adds search and filters */}
  <DataTableContent />   {/* The actual table */}
  <DataTableFooter />    {/* Pagination and row count */}
</DataTable>
\`\`\`
        `,
      },
    },
  },
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
  status: statuses[i % statuses.length] ?? 'pending',
  email: emails[i % emails.length] ?? 'unknown@example.com',
  createdat: dayjs().add(-14, 'day').toISOString(),
}))

type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
  createdat: string
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
    accessorKey: 'createdat',
    type: 'date',
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
    cell: () => {
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

export const BasicTable: Story = {
  name: '1. Basic Table',
  parameters: {
    docs: {
      description: {
        story:
          'The simplest possible setup. Just pass data and column definitions - sorting, pagination, and responsive design are automatically included.',
      },
    },
  },
  args: {
    datasource,
    query,
    columns,
  },
}

export const WithActions: Story = {
  name: '2. With Custom Actions',
  parameters: {
    docs: {
      description: {
        story: 'Add custom action buttons (edit, delete) to each row. Perfect for CRUD operations.',
      },
    },
  },
  args: {
    datasource,
    query,
    columns,
  },
}

export const WithToolbar: Story = {
  name: '3. Production Ready',
  parameters: {
    docs: {
      description: {
        story:
          "Complete table with search toolbar and pagination footer. This is what you'd use in a real application.",
      },
    },
  },
  args: {
    datasource,
    query,
    columns,
    children: (
      <>
        <DataTableToolbar />
        <DataTableContent />
        <DataTableFooter />
      </>
    ),
  },
}

export const ContentOnly: Story = {
  name: '4. Table Only',
  parameters: {
    docs: {
      description: {
        story:
          'Just the table without toolbar or footer. Useful when you want to build custom layouts.',
      },
    },
  },
  args: {
    datasource,
    query,
    columns,
    children: (
      <>
        <DataTableContent />
      </>
    ),
  },
}

export const CustomLayout: Story = {
  name: '5. Custom Layout',
  parameters: {
    docs: {
      description: {
        story:
          'Build your own layout by composing individual parts. Mix and match components as needed.',
      },
    },
  },
  args: {
    datasource,
    query,
    columns,
    children: (
      <>
        <hr />
        Page Switcher:
        <DataTablePageSwitcher />
        <hr />
        Content:
        <br />
        <DataTableContent />
        <hr />
        Pagination:
        <DataTablePagination />
        <hr />
      </>
    ),
  },
}
