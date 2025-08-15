import type { Meta, StoryObj } from '@storybook/react'
import { StaticDataTable } from '@/components/data-table/StaticDataTable'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'
import { DataTableContent } from '@/components/data-table/DataTableContent'
import { DataTableFooter } from '@/components/data-table/DataTableFooter'
import { Button } from '@/components/ui/button'
import { PencilIcon, TrashIcon, Users, Building2, DollarSign, CheckCircle } from 'lucide-react'

const meta: Meta<typeof StaticDataTable> = {
  component: StaticDataTable,
  title: 'DataTable/StaticDataTable',
  parameters: {
    docs: {
      description: {
        component: `
# StaticDataTable

The easiest way to create a data table. Just pass an array of data!

## Quick Start

\`\`\`tsx
const data = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
]

<StaticDataTable 
  data={data}
  columns={[
    { accessorKey: 'name' },
    { accessorKey: 'age' }
  ]}
/>
\`\`\`
        `,
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof StaticDataTable>

// Story 1: Simplest Possible Table
export const SimpleTable: Story = {
  name: '1. Simple Table',
  args: {
    data: [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ],
    columns: [{ accessorKey: 'name' }, { accessorKey: 'age' }],
  },
}

// Story 2: With Headers
export const WithHeaders: Story = {
  name: '2. With Custom Headers',
  args: {
    data: [
      { firstName: 'Alice', userAge: 30 },
      { firstName: 'Bob', userAge: 25 },
      { firstName: 'Charlie', userAge: 35 },
    ],
    columns: [
      { accessorKey: 'firstName', title: 'Full Name' },
      { accessorKey: 'userAge', title: 'Age (Years)' },
    ],
  },
}

// Story 3: With Custom Cell Rendering
export const CustomCells: Story = {
  name: '3. Custom Cell Rendering',
  args: {
    data: [
      { product: 'Laptop', price: 999 },
      { product: 'Mouse', price: 29 },
      { product: 'Keyboard', price: 79 },
    ],
    columns: [
      { accessorKey: 'product' },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => `$${row.getValue('price')}`,
      },
    ],
  },
}

// Story 4: With Actions
export const WithActions: Story = {
  name: '4. With Action Buttons',
  args: {
    data: [
      { id: 1, name: 'Task 1', status: 'pending' },
      { id: 2, name: 'Task 2', status: 'done' },
      { id: 3, name: 'Task 3', status: 'pending' },
    ],
    columns: [
      { accessorKey: 'name' },
      { accessorKey: 'status' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => console.log('Edit', row.original)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => console.log('Delete', row.original)}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
  },
}

// Story 5: With Status Colors
export const WithColors: Story = {
  name: '5. With Status Colors',
  args: {
    data: [
      { task: 'Fix bug', priority: 'high' },
      { task: 'Add feature', priority: 'medium' },
      { task: 'Update docs', priority: 'low' },
    ],
    columns: [
      { accessorKey: 'task' },
      {
        accessorKey: 'priority',
        cell: ({ row }) => {
          const priority = row.getValue('priority') as string
          const colors = {
            high: 'text-red-600 font-bold',
            medium: 'text-yellow-600',
            low: 'text-gray-600',
          }
          return <span className={colors[priority as keyof typeof colors]}>{priority}</span>
        },
      },
    ],
  },
}

// Story 6: With Tool Bar
export const WithSearch: Story = {
  name: '6. With Tool Bar',
  args: {
    data: [
      { name: 'Alice Johnson', role: 'Developer' },
      { name: 'Bob Smith', role: 'Designer' },
      { name: 'Charlie Brown', role: 'Manager' },
      { name: 'Diana Prince', role: 'Developer' },
      { name: 'Eve Adams', role: 'Designer' },
    ],
    columns: [{ accessorKey: 'name' }, { accessorKey: 'role' }],
    children: (
      <>
        <DataTableToolbar />
        <DataTableContent />
        <DataTableFooter />
      </>
    ),
  },
}

// Story 7: Employee List
export const EmployeeList: Story = {
  name: '7. Employee List Example',
  args: {
    data: [
      { id: 1, name: 'Alice', department: 'Engineering', salary: 85000 },
      { id: 2, name: 'Bob', department: 'Sales', salary: 65000 },
      { id: 3, name: 'Charlie', department: 'Marketing', salary: 70000 },
      { id: 4, name: 'Diana', department: 'Engineering', salary: 90000 },
      { id: 5, name: 'Eve', department: 'HR', salary: 60000 },
    ],
    columns: [
      { accessorKey: 'id', title: 'ID' },
      {
        accessorKey: 'name',
        title: (
          <>
            <Users className="w-4 h-4 inline mr-1" />
            Employee Name
          </>
        ),
      },
      {
        accessorKey: 'department',
        title: (
          <>
            <Building2 className="w-4 h-4 inline mr-1" />
            Department
          </>
        ),
      },
      {
        accessorKey: 'salary',
        title: (
          <>
            <DollarSign className="w-4 h-4 inline mr-1" />
            Annual Salary
          </>
        ),
        cell: ({ row }) => {
          const salary = row.getValue('salary') as number
          return `$${salary?.toLocaleString() || 0}`
        },
      },
    ],
  },
}

// Story 8: Todo List
export const TodoList: Story = {
  name: '8. Todo List Example',
  args: {
    data: [
      { task: 'Buy groceries', done: false, due: 'Today' },
      { task: 'Call mom', done: true, due: 'Yesterday' },
      { task: 'Finish project', done: false, due: 'Tomorrow' },
      { task: 'Team meeting', done: false, due: 'Today' },
    ],
    columns: [
      {
        accessorKey: 'done',
        title: <CheckCircle className="w-4 h-4" />,
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getValue('done')}
            onChange={() => console.log('Toggle', row.original)}
          />
        ),
      },
      {
        accessorKey: 'task',
        title: 'Task Description',
        cell: ({ row }) => (
          <span className={row.original['done'] ? 'line-through opacity-50' : ''}>
            {row.getValue('task')}
          </span>
        ),
      },
      { accessorKey: 'due', title: 'Due Date' },
    ],
  },
}

// Story 9: Product Inventory
export const ProductInventory: Story = {
  name: '9. Product Inventory',
  args: {
    data: [
      { product: 'Laptop', stock: 15, price: 999 },
      { product: 'Mouse', stock: 0, price: 29 },
      { product: 'Keyboard', stock: 8, price: 79 },
      { product: 'Monitor', stock: 3, price: 399 },
      { product: 'Webcam', stock: 0, price: 89 },
    ],
    columns: [
      { accessorKey: 'product' },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
          const stock = row.getValue('stock') as number
          return (
            <span className={stock === 0 ? 'text-red-600 font-bold' : ''}>
              {stock === 0 ? 'Out of stock' : stock}
            </span>
          )
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => `$${row.getValue('price')}`,
      },
    ],
  },
}

// Story 10: Empty Table
export const EmptyTable: Story = {
  name: '10. Empty State',
  args: {
    data: [],
    columns: [{ accessorKey: 'name' }, { accessorKey: 'email' }],
  },
}
