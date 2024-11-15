import { Input } from './ui/input'
import { Button } from './ui/button'
import { PackagePlus } from 'lucide-react'
import { MyTableHeadProps } from '@/interfaces/props'
import { Link, useLocation } from 'react-router-dom'

const MyTableHead = ({
  filterValue,
  onFilterChange,
  placeholder = 'Buscar',
  customButtonLabel = 'Crear nueva instancia',
  url,
  rol
}: MyTableHeadProps) => {
  const { pathname } = useLocation()

  const shouldRenderButton =
    !(pathname === '/suppliers' || pathname === '/products') ||
    rol !== 'usuario'

  return (
    <div className='w-full flex items-center justify-between py-4'>
      <Input
        placeholder={placeholder}
        value={filterValue}
        onChange={(event) => onFilterChange(event.target.value)}
        className='max-w-sm'
      />
      {shouldRenderButton && (
        <Link to={url}>
          <Button variant={'outline'} className='flex items-center gap-2'>
            <PackagePlus />
            {customButtonLabel}
          </Button>
        </Link>
      )}
    </div>
  )
}

export default MyTableHead
