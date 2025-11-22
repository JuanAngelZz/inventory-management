import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import useProductStore from '@/stores/productStore'
import { useAuth } from '@/contexts/authContext'
import UpdateProductForm from '@/components/UpdateProductForm'
import DeleteDialog from '@/components/DeleteDialog'
import { Product } from '@/interfaces/models'

interface ProductActionsProps {
  product: Product
}

const ProductActions = ({ product }: ProductActionsProps) => {
  const { toast } = useToast()
  const deleteProduct = useProductStore((state) => state.deleteProduct)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const onClose = () => {
    setOpen(false)
  }

  const onDeleteItem = async () => {
    if (!product.producto_id) return
    try {
      await deleteProduct(product.producto_id)
      toast({
        variant: 'destructive',
        title: 'Producto eliminado exitosamente del inventario'
      })
    } catch (error) {
      console.log(error)
    }
  }

  if (user.rol !== 'administrador') {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Abrir menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className='mr-2 h-4 w-4' />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <span className="cursor-pointer">Editar</span>
            </DialogTrigger>
            <DialogContent
              onKeyDown={(e) => e.stopPropagation()}
              className='sm:max-w-[425px]'
            >
              {product.producto_id && (
                <UpdateProductForm
                  id={product.producto_id}
                  onClose={onClose}
                />
              )}
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash2 className='mr-2 h-4 w-4 text-red-800' />
          <DeleteDialog
            onDeleteItem={onDeleteItem}
            description='Esta acción no se puede deshacer. Eliminará permanentemente el producto y los registros de movimientos asociados a él de nuestros servidores.'
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProductActions
