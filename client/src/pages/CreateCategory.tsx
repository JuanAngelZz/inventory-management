import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Category } from '@/interfaces/models'
import { categorySchema } from '@/schemas/categorySchema'
import useCategoryStore from '@/stores/categoryStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Slash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

const CreateCategory = () => {
  const { toast } = useToast()

  const createCategory = useCategoryStore((state) => state.createCategory)

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nombre: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    const category: Category = {
      nombre: data.nombre
    }

    await createCategory(category)

    toast({
      title: 'Categoría creada:',
      description: (
        <p>
          La categoría ha sido creada con exito. <br />
          <strong>
            <Link to='/categories'>Ir a categorías</Link>
          </strong>
        </p>
      )
    })
  }

  return (
    <>
      <header className='mb-4'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Crear una nueva categoría
        </h1>
        <section>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to='/'>Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink asChild>
                <Link to='/categories'>Categorías</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Crear</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
      </header>
      <main>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-2 grid-rows-6 gap-4'
          >
            <div className='row-span-6 flex flex-col justify-evenly'>
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
            <div className='row-span-6 gap-4 flex flex-col justify-evenly'>
              <Button type='submit' className='w-full'>
                Enviar
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  )
}

export default CreateCategory
