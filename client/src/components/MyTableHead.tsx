import { Input } from './ui/input'
import { Button } from './ui/button'
import { PackagePlus } from 'lucide-react'
import { MyTableHeadProps } from '@/interfaces/props'
import { Link } from 'react-router-dom'

const MyTableHead = ({
  filterValue,
  onFilterChange,
  placeholder = 'Buscar',
  customButtonLabel = 'Crear nueva instancia',
  url
}: MyTableHeadProps) => {
  return (
    <div className='w-full flex items-center justify-between py-4'>
      <Input
        placeholder={placeholder}
        value={filterValue}
        onChange={(event) => onFilterChange(event.target.value)}
        className='max-w-sm'
      />
      <Link to={url}>
        <Button variant='outline'>
          <PackagePlus className='mr-2 h-4 w-4' /> {customButtonLabel}
        </Button>
      </Link>
    </div>
  )
}

export default MyTableHead
