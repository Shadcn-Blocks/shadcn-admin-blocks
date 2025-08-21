// registry/my-component/MyComponent.stories.ts

import { StaticDataSource } from '@/lib/data-sources'
import { Q } from '@jakub.knejzlik/ts-query'
import type { Meta, StoryObj } from '@storybook/react'
import { PencilIcon, Trash, DollarSign, Mail, Calendar, Hash } from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import { StaticDataTable } from '@/components/data-table/StaticDataTable'
import { Button } from '@/components/ui/button'
import { DataTableColumn } from '@/components/data-table/DataTableColumn'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'
import { DataTableContent } from '@/components/data-table/DataTableContent'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { DataTableFooter } from '@/components/data-table/DataTableFooter'
import { DataTablePageSwitcher } from '@/components/data-table/DataTablePageSwitcher'
import { DataTableActiveFilters } from '@/components/data-table/DataTableActiveFilters'
import dayjs from 'dayjs'
import { MockDataSource } from '@/lib/data-sources/MockDataSource'

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
// Using StaticDataTable - the easiest way!
import { StaticDataTable } from '@/components/data-table/StaticDataTable'

const data = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
]

<StaticDataTable 
  data={data}
  columns={[
    { accessorKey: 'name' },
    { accessorKey: 'age' },
  ]}
/>
\`\`\`

Or using DataTable with StaticDataSource:

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
  createdat: dayjs()
    .add(-Math.floor(Math.random() * 60), 'day')
    .toISOString(), // Random date within last 60 days
}))

// Data with nullable date fields for testing
const ordersData: Order[] = Array.from({ length: 150 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(5, '0')}`,
  customer: emails[i % emails.length] ?? 'unknown@example.com',
  amount: Math.floor(Math.random() * 5000) + 100,
  status: statuses[i % statuses.length] ?? 'pending',
  orderDate: dayjs()
    .add(-30 + Math.floor(Math.random() * 30), 'day')
    .toISOString(),
  // 30% chance of NULL ship date (not shipped yet)
  shipDate:
    Math.random() > 0.3
      ? dayjs()
          .add(-20 + Math.floor(Math.random() * 20), 'day')
          .toISOString()
      : null,
  // 20% chance of NULL delivery date (not delivered yet)
  deliveryDate:
    Math.random() > 0.2
      ? dayjs()
          .add(-10 + Math.floor(Math.random() * 10), 'day')
          .toISOString()
      : null,
  // 50% chance of NULL cancel date (not cancelled)
  cancelDate:
    Math.random() > 0.5
      ? dayjs()
          .add(-5 + Math.floor(Math.random() * 5), 'day')
          .toISOString()
      : null,
}))

type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
  createdat: string
}

type Order = {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  orderDate: string
  shipDate: string | null
  deliveryDate: string | null
  cancelDate: string | null
}

const columns: DataTableColumn<Payment, any>[] = [
  {
    id: 'status',
    accessorKey: 'status',
    title: 'Payment Status',
    type: 'string',
    filterable: true,
    filterType: 'multi-select', // Enable multi-select for status
  },
  {
    id: 'email',
    accessorKey: 'email',
    title: 'Customer Email',
    type: 'string',
    filterable: true,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    title: 'Amount',
    type: 'number',
    filterable: true,
  },
  {
    id: 'createdat',
    accessorKey: 'createdat',
    title: 'Created Date',
    type: 'date',
    filterable: true,
  },
  {
    id: 'actions',
    type: 'actions',
    header: () => null, // No header text to keep column compact
    cell: () => {
      return (
        <div className="flex items-center justify-center gap-2">
          <Button variant={'outline'} size={'icon'} className="h-7 w-7">
            <PencilIcon className="h-3.5 w-3.5" />
          </Button>
          <Button variant="destructive" size={'icon'} className="h-7 w-7">
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
      // For single button, the column will auto-size to be narrower:
      // return (
      //   <div className="flex items-center justify-center">
      //     <Button variant={'outline'} size={'icon'} className="h-7 w-7">
      //       <PencilIcon className="h-3.5 w-3.5" />
      //     </Button>
      //   </div>
      // )
    },
  },
]

const datasource = new StaticDataSource({ table: data })
const query = Q.select().from('table')

export const SimplestTable: Story = {
  name: '0. Simplest Table (StaticDataTable)',
  parameters: {
    docs: {
      description: {
        story:
          'The absolute simplest way to create a table using StaticDataTable. Just pass data and columns - no datasource or query needed!',
      },
    },
  },
  render: () => (
    <StaticDataTable
      data={[
        { name: 'Alice', age: 30, role: 'Developer' },
        { name: 'Bob', age: 25, role: 'Designer' },
        { name: 'Charlie', age: 35, role: 'Manager' },
      ]}
      columns={[
        { accessorKey: 'name', title: 'Name' },
        { accessorKey: 'age', title: 'Age' },
        { accessorKey: 'role', title: 'Role' },
      ]}
    />
  ),
}

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

export const WithFilters: Story = {
  name: '6. With Smart Filters',
  parameters: {
    docs: {
      description: {
        story: `
Advanced filtering system with enhanced features:
- **Single-input date range picker** with dual calendar view (desktop) and single month (mobile)
- **Multi-select filters** for choosing multiple values at once
- **Clear buttons** on all filter dropdowns for easy reset
- **Range filters** for numbers (shows actual min/max from data)
- **Smart text filters** that switch between select and search based on unique values
- **Boolean toggles** for true/false columns
- **Server-side filtering** via SQL queries for performance

Try clicking the filter icons next to column headers!
        `,
      },
    },
  },
  args: {
    datasource,
    query,
    columns,
    enableFilters: true,
    children: (
      <>
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Click the filter icons next to column headers to see the improved filters with clear
            buttons
          </div>
          <DataTableToolbar />
        </div>
        <div className="rounded-md border">
          <DataTableContent />
        </div>
        <DataTableFooter />
      </>
    ),
  },
}

// Order columns with nullable date fields
const orderColumns: DataTableColumn<Order, any>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    title: 'Order ID',
    type: 'string',
  },
  {
    id: 'customer',
    accessorKey: 'customer',
    title: 'Customer Name',
    type: 'string',
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    title: 'Total Amount',
    type: 'number',
    format: '0,0.00',
  },
  {
    id: 'status',
    accessorKey: 'status',
    title: 'Order Status',
    type: 'string',
  },
  {
    id: 'orderDate',
    accessorKey: 'orderDate',
    title: 'Order Date',
    type: 'date',
  },
  {
    id: 'shipDate',
    accessorKey: 'shipDate',
    title: 'Ship Date',
    type: 'date',
  },
  {
    id: 'deliveryDate',
    accessorKey: 'deliveryDate',
    title: 'Delivery Date',
    type: 'date',
  },
  {
    id: 'cancelDate',
    accessorKey: 'cancelDate',
    title: 'Cancel Date',
    type: 'date',
  },
]

const ordersDatasource = new StaticDataSource({ orders: ordersData })
const ordersQuery = Q.select().from('orders')

export const WithMultiSelectFilters: Story = {
  name: '7. Multi-Select Filtering',
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates the enhanced filtering capabilities:
- **Multi-select dropdown** for Status column - select multiple statuses at once
- **Single-input date range picker** that shows both dates in one field
- **Responsive calendar** - dual month view on desktop, single on mobile  
- **Number range filters** with quick percentage presets
- **Clear buttons** on all filters for easy reset
- **Active filters bar** showing all applied filters

Click the filter icons and try selecting multiple values!
        `,
      },
    },
  },
  args: {
    datasource,
    query,
    columns,
    enableFilters: true,
    children: (
      <>
        <DataTableActiveFilters columns={columns} />
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Try the multi-select filter on Status column!
          </div>
          <DataTableToolbar />
        </div>
        <div className="rounded-md border">
          <DataTableContent />
        </div>
        <DataTableFooter />
      </>
    ),
  },
}

export const WithNullableDates: StoryObj<typeof DataTable<Order>> = {
  name: '8. With Nullable Date Columns',
  parameters: {
    docs: {
      description: {
        story: `
Table with nullable date columns showing proper handling of NULL values:
- **Order Date** - Always has a value
- **Ship Date** - NULL for unshipped orders (30% of records)
- **Delivery Date** - NULL for undelivered orders (20% of records)
- **Cancel Date** - NULL for non-cancelled orders (50% of records)

NULL dates are displayed as "-" instead of "Invalid Date".
Range filters properly handle NULL values in date columns.
        `,
      },
    },
  },
  args: {
    datasource: ordersDatasource,
    query: ordersQuery,
    columns: orderColumns,
    enableFilters: true,
    children: (
      <>
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Notice how NULL dates display as "-" instead of "Invalid Date"
          </div>
          <DataTableToolbar />
        </div>
        <div className="rounded-md border">
          <DataTableContent />
        </div>
        <DataTableFooter />
      </>
    ),
  },
}

// Example columns with React element titles
const columnsWithIcons: DataTableColumn<Payment, any>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    title: (
      <>
        <Hash className="w-4 h-4 inline mr-1" />
        ID
      </>
    ),
    type: 'string',
  },
  {
    id: 'status',
    accessorKey: 'status',
    title: 'Status',
    type: 'string',
    filterable: true,
    filterType: 'multi-select',
  },
  {
    id: 'email',
    accessorKey: 'email',
    title: (
      <>
        <Mail className="w-4 h-4 inline mr-1" />
        Email
      </>
    ),
    type: 'string',
    filterable: true,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    title: (
      <>
        <DollarSign className="w-4 h-4 inline mr-1" />
        Amount
      </>
    ),
    type: 'number',
    filterable: true,
  },
  {
    id: 'createdat',
    accessorKey: 'createdat',
    title: (
      <>
        <Calendar className="w-4 h-4 inline mr-1" />
        Date
      </>
    ),
    type: 'date',
    filterable: true,
  },
  {
    id: 'actions',
    type: 'actions',
    title: 'Actions',
    header: () => null,
    cell: () => {
      return (
        <div className="flex items-center justify-center gap-2">
          <Button variant={'outline'} size={'icon'} className="h-7 w-7">
            <PencilIcon className="h-3.5 w-3.5" />
          </Button>
          <Button variant="destructive" size={'icon'} className="h-7 w-7">
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    },
  },
]

export const WithCustomTitles: Story = {
  name: '9. Custom Column Titles',
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates custom column titles with React elements:
- **Simple text titles** - Override the default column ID display
- **Icons in headers** - Add icons or other React elements to column headers
- **Preserved functionality** - Sorting and filtering still work with custom titles

The \`title\` property accepts any React node, allowing full customization of the column header text.
        `,
      },
    },
  },
  args: {
    datasource,
    query,
    columns: columnsWithIcons,
    enableFilters: true,
    children: (
      <>
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Column headers now display custom titles with icons instead of raw field names
          </div>
        </div>
        <div className="rounded-md border">
          <DataTableContent />
        </div>
        <DataTableFooter />
      </>
    ),
  },
}

// Loading states story with MockDataSource
export const WithLoadingStates: Story = {
  args: {
    datasource: new MockDataSource({
      tables: { table: data },
      delay: 1000, // 1 second delay to simulate API loading
    }),
    query,
    columns,
    enableFilters: true,
    children: (
      <>
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            This table simulates API loading with a 1 second delay. Try sorting, filtering, and
            pagination to see loading states.
          </div>
          <DataTableToolbar />
        </div>
        <div className="rounded-md border">
          <DataTableContent />
        </div>
        <DataTableFooter />
      </>
    ),
  },
}
