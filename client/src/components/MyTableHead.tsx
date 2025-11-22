import { Input } from './ui/input'
import { Search } from 'lucide-react'

interface MyTableHeadProps {
  filterValue: string
  onFilterChange: (value: string) => void
  placeholder?: string
}

const MyTableHead = ({
  filterValue,
  onFilterChange,
  placeholder = 'Buscar'
}: MyTableHeadProps) => {
  return (
    <div className='flex items-center py-4'>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={filterValue}
          onChange={(event) => onFilterChange(event.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  )
}

export default MyTableHead
