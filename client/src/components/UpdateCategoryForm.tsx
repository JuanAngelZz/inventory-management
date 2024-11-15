import { useToast } from '@/hooks/use-toast'
import { Category } from '@/interfaces/models'
import { UpdateFormProps } from '@/interfaces/props'
import { categorySchema } from '@/schemas/categorySchema'
import useCategoryStore from '@/stores/categoryStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'

const UpdateCategoryForm = ({ id, onClose }: UpdateFormProps) => {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory)
  const getCategory = useCategoryStore((state) => state.getCategory)
  const updateCategory = useCategoryStore((state) => state.updateCategory)

  const { toast } = useToast()

  useEffect(() => {
    getCategory(id)
  }, [])

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nombre: ''
    }
  })

  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        nombre: selectedCategory.nombre
      })
    }
  }, [selectedCategory])

  async function onSubmit(data: z.infer<typeof categorySchema>) {
    const category: Category = {
      nombre: data.nombre
    }

    await updateCategory(id, category)

    toast({
      title: 'Categoría actualizada:',
      description: (
        <p>
          La categoría <strong>{data.nombre}</strong> ha sido actualizada con
          exito
        </p>
      )
    })

    onClose()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Detalles de la categoría</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de la categoría.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col mt-4 space-y-4'>
          <FormField
            control={form.control}
            name='nombre'
            render={({ field }) => (
              <>
                <FormLabel htmlFor={field.name}>
                  Nombre de la categoría
                </FormLabel>
                <FormControl>
                  <Input id={field.name} placeholder='Nombre' {...field} />
                </FormControl>
                <FormMessage />
              </>
            )}
          />
        </div>
        <DialogFooter>
          <Button className='mt-5' type='submit'>
            Guardar categoría
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default UpdateCategoryForm
