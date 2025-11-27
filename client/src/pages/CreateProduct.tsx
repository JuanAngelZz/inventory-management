import Header from '@/components/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
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
import { cn } from '@/lib/utils'
import { productSchema } from '@/schemas/productForm'
import useCategoryStore from '@/stores/categoryStore'
import useProductStore from '@/stores/productStore'
import useSupplierStore from '@/stores/supplierStore'
import { format } from '@formkit/tempo'
import { zodResolver } from '@hookform/resolvers/zod'
import { subDays } from 'date-fns'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

const CreateProduct = () => {
  const categories = useCategoryStore((state) => state.categories)
  const getCategories = useCategoryStore((state) => state.getCategories)

  const suppliers = useSupplierStore((state) => state.suppliers)
  const getSuppliers = useSupplierStore((state) => state.getSuppliers)

  const createProduct = useProductStore((state) => state.createProduct)

  const { toast } = useToast()

  useEffect(() => {
    getCategories()
    getSuppliers()
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

  const queryClient = useQueryClient()

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    const product: Product = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      stock: data.stock,
      precio_compra: data.precio_compra,
      precio_venta: data.precio_venta,
      fecha_adquisicion: data.fecha_adquisicion.toISOString().split('T')[0],
      fecha_vencimiento: data.fecha_vencimiento.toISOString().split('T')[0],
      categoria_nombre: data.categoria_nombre,
      proveedor_nombre: data.proveedor_nombre
    }

    try {
      await createProduct(product)
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })

      toast({
        title: 'Producto creado:',
        description: (
          <p>
            El producto <strong>{data.nombre}</strong> ha sido creado con
            exito.{' '}
            <br />
            <strong>
              <Link to='/products'>Ir a productos</Link>
            </strong>
          </p>
        )
      })
    } catch (error) {
      toast({
        title: 'Error al crear el producto:',
        description: (
          <p>
            Hubo un error al crear el producto <strong>{data.nombre}</strong>.
            Es posible que ya exista un producto con ese nombre.
          </p>
        ),
        variant: 'destructive'
      })
    }
  }

  return (
    <>
      <Header 
        page="Añadir Nuevo Producto" 
        breadcrumbs={[
          { label: 'Productos', href: '/products' },
          { label: 'Crear' }
        ]}
      />
      <main>
        <Card>
          <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-2 grid-rows-6 gap-4'
          >
            <div className='row-span-6 flex flex-col justify-between'>
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
                name='proveedor_nombre'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between w-full',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? suppliers.find(
                                  (supplier) => supplier.nombre === field.value
                                )?.nombre
                              : 'Selecciona proveedor'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='p-0'>
                        <Command>
                          <CommandInput placeholder='Search language...' />
                          <CommandList>
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                              {suppliers.map((supplier) => (
                                <CommandItem
                                  value={supplier.nombre}
                                  key={supplier.proveedor_id}
                                  onSelect={() => {
                                    form.setValue(
                                      'proveedor_nombre',
                                      supplier.nombre
                                    )
                                  }}
                                >
                                  {supplier.nombre}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      supplier.nombre === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
            <div className='row-span-6 flex flex-col justify-between'>
              <FormField
                control={form.control}
                name='categoria_nombre'
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
                                value={category.nombre}
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
              <Button type='submit' className='w-full'>
                Enviar
              </Button>
            </div>
          </form>
        </Form>
        </CardContent>
        </Card>
      </main>
    </>
  )
}

export default CreateProduct
