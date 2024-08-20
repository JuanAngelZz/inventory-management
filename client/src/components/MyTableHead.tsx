// MyTableHead.tsx
import { Input } from './ui/input'
import { Button } from './ui/button'
import { PackagePlus } from 'lucide-react'
import { MyTableHeadProps } from '@/interfaces/props'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

const MyTableHead = ({
  filterValue,
  onFilterChange,
  placeholder = 'Buscar',
  customButtonLabel = 'Crear nueva instancia',
  CustomDialogContent // New prop for custom dialog content
}: MyTableHeadProps) => {
  return (
    <div className='w-full flex items-center justify-between py-4'>
      <Input
        placeholder={placeholder}
        value={filterValue}
        onChange={(event) => onFilterChange(event.target.value)}
        className='max-w-sm'
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>
            <PackagePlus className='mr-2 h-4 w-4' /> {customButtonLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <CustomDialogContent />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MyTableHead
