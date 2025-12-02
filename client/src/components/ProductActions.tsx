import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import useProductStore from '@/stores/productStore'
import { useAuth } from '@/contexts/authContext'
import UpdateProductForm from '@/components/UpdateProductForm'
import { Product } from '@/interfaces/models'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface ProductActionsProps {
  product: Product
}

const ProductActions = ({ product }: ProductActionsProps) => {
  const { toast } = useToast()
  const deleteProduct = useProductStore((state) => state.deleteProduct)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { user } = useAuth()

  const onClose = () => {
    setIsEditOpen(false)
  }

  useEffect(() => {
    if (!isEditOpen) {
      setTimeout(() => {
        document.body.style.pointerEvents = ''
        document.body.style.overflow = ''
      }, 500)
    }
  }, [isEditOpen])

  useEffect(() => {
    if (!isDeleteOpen) {
      setTimeout(() => {
        document.body.style.pointerEvents = ''
        document.body.style.overflow = ''
      }, 500)
    }
  }, [isDeleteOpen])

  const onDeleteItem = async () => {
    const id = product.producto_id || product.id
    if (!id) return
    
    // Close dialog first
    setIsDeleteOpen(false)
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      await deleteProduct(id)
      toast({
        variant: 'destructive',
        title: 'Producto eliminado exitosamente del inventario'
      })
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Error al eliminar el producto',
        description: 'Hubo un problema al intentar eliminar el producto.'
      })
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
            <span className='sr-only'>Abrir menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil className='mr-2 h-4 w-4' />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className='mr-2 h-4 w-4 text-red-800' />
            <span className="text-red-800">Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          className='sm:max-w-[800px]'
        >
          {(product.producto_id || product.id) ? (
            <UpdateProductForm
              id={(product.producto_id || product.id)!}
              onClose={onClose}
            />
          ) : (
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-red-600">Error</h3>
              <p className="text-muted-foreground">
                No se pudo cargar el formulario de edición porque el ID del producto no está definido.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Product Data: {JSON.stringify(product)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto de la lista activa, pero conservará su historial de movimientos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteItem} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ProductActions
