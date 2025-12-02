import { useState, useEffect } from 'react'
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
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Category } from '@/interfaces/models'
import { Button } from './ui/button'
import useCategoryStore from '@/stores/categoryStore'
import { useToast } from '@/hooks/use-toast'
import DeleteDialog from './DeleteDialog'
import UpdateCategoryForm from './UpdateCategoryForm'
import { useAuth } from '@/contexts/authContext'

const CategoryItem = ({ category }: { category: Category }) => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = ''
        document.body.style.overflow = ''
      }, 500)
    }
  }, [open])

  const deleteCategory = useCategoryStore((state) => state.deleteCategory)

  const onDeleteItem = async () => {
    if (!category.id) return
    try {
      const id = category.id
      await deleteCategory(id)
      toast({
        variant: 'destructive',
        title: 'Categoría eliminada exitosamente'
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
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Abrir menu</span>
                  <EllipsisVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Pencil className='mr-2 h-4 w-4' />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className='mr-2 h-4 w-4 text-red-800' />
                  <DeleteDialog
                    onDeleteItem={onDeleteItem}
                    description='Esta acción eliminará la categoría del listado principal.'
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent
                onKeyDown={(e) => e.stopPropagation()}
                className='sm:max-w-[425px]'
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {category.id && (
                  <UpdateCategoryForm
                    id={category.id}
                    onClose={onClose}
                  />
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardHeader>
    </Card>
  )
}

export default CategoryItem
