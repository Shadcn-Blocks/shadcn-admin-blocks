import * as React from 'react'
import { DataTableColumn, FilterValue } from '@/components/data-table/DataTableColumn'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToggleFilterProps {
  column: DataTableColumn<any, any>
  value?: FilterValue
  onChange: (value: FilterValue | null) => void
}

export const ToggleFilter: React.FC<ToggleFilterProps> = ({
  column,
  value,
  onChange
}) => {
  const [selectedValue, setSelectedValue] = React.useState<boolean | null>(
    value?.value ?? null
  )

  // Update selected value when prop changes
  React.useEffect(() => {
    setSelectedValue(value?.value ?? null)
  }, [value])

  const handleSelect = (newValue: boolean | null) => {
    setSelectedValue(newValue)
    if (newValue === null) {
      onChange(null)
    } else {
      onChange({
        type: 'toggle',
        value: newValue
      })
    }
  }

  return (
    <div className="p-3 min-w-[200px] space-y-2">
      <div className="text-xs text-muted-foreground mb-2">
        Filter by {('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey)) || 'field'}
      </div>
      
      <div className="space-y-1">
        <Button
          variant={selectedValue === null ? 'default' : 'outline'}
          size="sm"
          className="w-full justify-start"
          onClick={() => handleSelect(null)}
        >
          <Check className={cn(
            "mr-2 h-4 w-4",
            selectedValue === null ? "opacity-100" : "opacity-0"
          )} />
          All
        </Button>
        
        <Button
          variant={selectedValue === true ? 'default' : 'outline'}
          size="sm"
          className="w-full justify-start"
          onClick={() => handleSelect(true)}
        >
          <Check className={cn(
            "mr-2 h-4 w-4",
            selectedValue === true ? "opacity-100" : "opacity-0"
          )} />
          True
        </Button>
        
        <Button
          variant={selectedValue === false ? 'default' : 'outline'}
          size="sm"
          className="w-full justify-start"
          onClick={() => handleSelect(false)}
        >
          <Check className={cn(
            "mr-2 h-4 w-4",
            selectedValue === false ? "opacity-100" : "opacity-0"
          )} />
          False
        </Button>
      </div>

      {selectedValue !== null && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => handleSelect(null)}
        >
          Clear filter
        </Button>
      )}
    </div>
  )
}