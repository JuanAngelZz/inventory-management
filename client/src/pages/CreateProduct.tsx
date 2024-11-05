import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Product } from '@/interfaces/models'
import { productSchema } from '@/schemas/productForm'
import useCategoryStore from '@/stores/categoryStore'
import useProductStore from '@/stores/productStore'
import { format } from '@formkit/tempo'
import { zodResolver } from '@hookform/resolvers/zod'
import { subDays } from 'date-fns'
import { CalendarIcon, Slash } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

const CreateProduct = () => {
  const categories = useCategoryStore((state) => state.categories)
  const getCategories = useCategoryStore((state) => state.getCategories)

  const createProduct = useProductStore((state) => state.createProduct)

  const { toast } = useToast()

  useEffect(() => {
    getCategories()
  }, [])

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: '',
      stock: 0,
      precio_compra: 0,
      precio_venta: 0,
      // fecha_adquisicion: new Date(),
      // fecha_vencimiento: new Date(),
      descripcion: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    const product: Product = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      stock: data.stock,
      precio_compra: data.precio_compra,
      precio_venta: data.precio_venta,
      fecha_adquisicion: data.fecha_adquisicion.toISOString().split('T')[0],
      fecha_vencimiento: data.fecha_vencimiento.toISOString().split('T')[0],
      categoria_id: parseInt(data.categoria_id)
    }

    await createProduct(product)

    toast({
      title: 'Producto creado:',
      description: (
        <p>
          El producto <strong>{data.nombre}</strong> ha sido creado con exito.{' '}
          <strong>
            <Link to='/products'>Ir a productos</Link>
          </strong>
        </p>
      )
    })
  }

  return (
    <>
      <header className='mb-4'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Añadir nuevo producto
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
                <Link to='/products'>Productos</Link>
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
            className='grid grid-cols-2 grid-rows-5 gap-4'
          >
            <div className='row-span-5 space-y-4'>
              <FormField
                control={form.control}
                name='nombre'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Nombre del producto
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        className='col-span-3'
                        placeholder='Nombre'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='precio_compra'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Precio de compra ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        className='col-span-3'
                        placeholder='Precio'
                        type='number'
                        min={0}
                        step={0.01}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='precio_venta'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Precio de venta ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        className='col-span-3'
                        placeholder='Precio'
                        type='number'
                        min={0}
                        step={0.01}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='descripcion'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Descripción del producto (opcional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id={field.name}
                        className='col-span-3'
                        placeholder='Descripción'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='row-span-5 space-y-4'>
              <FormField
                control={form.control}
                name='categoria_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Categoría</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Seleccione una categoría' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categorías</SelectLabel>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.categoria_id}
                                value={category.categoria_id.toString()}
                              >
                                {category.nombre}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Stock</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        className='col-span-3'
                        placeholder='Stock'
                        type='number'
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fecha_adquisicion'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Fecha de adquisición (por defecto la fecha actual)
                    </FormLabel>
                    <div className='col-span-3'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant='outline' className='w-full'>
                              {field.value ? (
                                format(field.value, 'YYYY/MM/DD')
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fecha_vencimiento'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Fecha de vencimiento
                    </FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant='outline' className='w-full'>
                            {field.value ? (
                              format(field.value, 'YYYY/MM/DD')
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(date) => field.onChange(date)}
                          disabled={(date) =>
                            date < new Date() || date < subDays(new Date(), 30)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            <Button type='submit' className='w-full'>Submit</Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  )
}

export default CreateProduct
