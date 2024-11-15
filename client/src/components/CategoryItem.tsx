import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Category } from '@/interfaces/models'
import { Button } from './ui/button'
import useCategoryStore from '@/stores/categoryStore'
import { useToast } from '@/hooks/use-toast'
import DeleteDialog from './DeleteDialog'
import UpdateCategoryForm from './UpdateCategoryForm'
import { useAuth } from '@/contexts/authContext'

const CategoryItem = ({ category }: { category: Category }) => {
  const [open, setOpen] = useState(false)
  const toast = useToast()
  const { user } = useAuth()

  const deleteCategory = useCategoryStore((state) => state.deleteCategory)

  const onDeleteItem = async () => {
    try {
      const id = category.categoria_id
      await deleteCategory(id)
      toast({
        variant: 'destructive',
        title: 'Producto eliminado exitosamente del inventario'
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <Card className='col-span-1 row-span-1'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>{category.nombre}</CardTitle>
        {user.rol === 'administrador' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Abrir menu</span>
                <EllipsisVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className='mr-2 h-4 w-4' />
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger>
                    <span>Editar</span>
                  </DialogTrigger>
                  <DialogContent
                    onKeyDown={(e) => e.stopPropagation()}
                    className='sm:max-w-[425px]'
                  >
                    <UpdateCategoryForm
                      id={category.categoria_id}
                      onClose={onClose}
                    />
                  </DialogContent>
                </Dialog>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className='mr-2 h-4 w-4 text-red-800' />
                <DeleteDialog
                  onDeleteItem={onDeleteItem}
                  description='Esta acción no se puede deshacer. Eliminará permanentemente la categoría y TODOS los productos de la categoría seleccionada del inventario.'
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
    </Card>
  )
}

export default CategoryItem
