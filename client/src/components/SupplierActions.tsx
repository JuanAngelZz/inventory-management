import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import UpdateSupplierForm from '@/components/UpdateSupplierForm'
import DeleteDialog from '@/components/DeleteDialog'
import useSupplierStore from '@/stores/supplierStore'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/authContext'
import { Supplier } from '@/interfaces/models'

interface SupplierActionsProps {
  supplier: Supplier
}

const SupplierActions = ({ supplier }: SupplierActionsProps) => {
  const { toast } = useToast()
  const deleteSupplier = useSupplierStore((state) => state.deleteSupplier)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = ''
        document.body.style.overflow = ''
      }, 500)
    }
  }, [open])

  const onDeleteItem = async () => {
    try {
      await deleteSupplier(supplier.id!)
      toast({
        variant: 'destructive',
        title: 'Proveedor eliminado exitosamente'
      })
    } catch (error) {
      console.log(error)
    }
  }

  if (user.rol !== 'administrador') {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Pencil className='mr-2 h-4 w-4' />
            <span className="cursor-pointer">Editar</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Trash2 className='mr-2 h-4 w-4 text-red-800' />
            <DeleteDialog
              onDeleteItem={onDeleteItem}
              description='Esta acción eliminará al proveedor del listado principal.'
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onKeyDown={(e) => e.stopPropagation()}
          className='sm:max-w-[425px]'
        >
          <UpdateSupplierForm
            id={supplier.id!}
            onClose={onClose}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SupplierActions
