import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { Textarea } from './ui/textarea'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { productSchema } from '@/schemas/productForm'
import { Calendar } from './ui/calendar'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { format } from '@formkit/tempo'
import useProductStore from '@/stores/productStore'
import { useEffect } from 'react'
import useCategoryStore from '@/stores/categoryStore'
import { subDays } from 'date-fns'
import { Product } from '@/interfaces/models'
import { useToast } from '@/hooks/use-toast'
import useSupplierStore from '@/stores/supplierStore'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command'
import { UpdateFormProps } from '@/interfaces/props'

const UpdateProductForm = ({ id, onClose }: UpdateFormProps) => {
  const selectedProduct = useProductStore((state) => state.selectedProduct)
  const getProduct = useProductStore((state) => state.getProduct)
  const updateProduct = useProductStore((state) => state.updateProduct)

  const categories = useCategoryStore((state) => state.categories)
  const getCategories = useCategoryStore((state) => state.getCategories)

  const suppliers = useSupplierStore((state) => state.suppliers)
  const getSuppliers = useSupplierStore((state) => state.getSuppliers)

  const { toast } = useToast()

  useEffect(() => {
    getProduct(id)
    getCategories()
    getSuppliers()
  }, [])

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      // Inicializa los valores predeterminados con valores vacíos
      nombre: '',
      stock: 0,
      descripcion: '',
      precio_compra: 0,
      precio_venta: 0,
      fecha_adquisicion: new Date(),
      fecha_vencimiento: subDays(new Date(), 1),
      categoria_nombre: '',
      proveedor_nombre: ''
    }
  })

  // Utiliza useEffect para monitorear cambios en selectedProduct
  useEffect(() => {
    if (selectedProduct) {
      // Establece los valores predeterminados con los datos del producto seleccionado
      form.reset({
        nombre: selectedProduct.nombre,
        stock: selectedProduct.stock,
        descripcion: selectedProduct.descripcion,
        precio_compra: Number(selectedProduct.precio_compra),
        precio_venta: Number(selectedProduct.precio_venta),
        fecha_adquisicion: new Date(selectedProduct.fecha_adquisicion),
        fecha_vencimiento: new Date(selectedProduct.fecha_vencimiento),
        categoria_nombre: selectedProduct.categoria_nombre,
        proveedor_nombre: selectedProduct.proveedor_nombre
      })
    }
  }, [selectedProduct])

  async function onSubmit(data: z.infer<typeof productSchema>) {
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

    await updateProduct(id, product)

    toast({
      title: 'Producto actualizado:',
      description: (
        <p>
          El producto <strong>{data.nombre}</strong> ha sido actualizado con
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
          <DialogTitle>Detalles del producto</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del producto.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4 mt-2 grid-cols-2'>
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='nombre'
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>
                    Nombre del producto
                  </FormLabel>
                  <FormControl>
                    <Input id={field.name} placeholder='Nombre' {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name='proveedor_nombre'
              render={({ field }) => (
                <>
                  <FormLabel>Proveedor</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'justify-between',
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
                    <PopoverContent className='w-[200px] p-0'>
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
                </>
              )}
            />
            <FormField
              control={form.control}
              name='precio_compra'
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>
                    Precio de compra ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder='Precio'
                      type='number'
                      min={0}
                      {...field}
                      step={0.01}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name='precio_venta'
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>
                    Precio de venta ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder='Precio'
                      type='number'
                      min={0}
                      {...field}
                      step={0.01}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name='descripcion'
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>
                    Descripción del producto
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      placeholder='Descripción'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='categoria_nombre'
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>Categoría</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={field.value} />
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
                </>
              )}
            />
            <FormField
              control={form.control}
              name='stock'
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>Stock</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder='Stock'
                      type='number'
                      min={0}
                      {...field}
                      disabled
                      className="bg-muted text-muted-foreground opacity-100"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <p className="text-[0.8rem] text-muted-foreground">
                    El stock solo puede modificarse mediante movimientos de inventario.
                  </p>
                  <FormMessage />
                </>
              )}
            />
            <FormItem>
              <FormField
                control={form.control}
                name='fecha_adquisicion'
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor={field.name}>
                      Fecha de adquisición
                    </FormLabel>
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
                  </>
                )}
              />
            </FormItem>
            <FormItem>
              <FormField
                control={form.control}
                name='fecha_vencimiento'
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor={field.name}>
                      Fecha de vencimiento
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className='col-span-3'>
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
                  </>
                )}
              />
            </FormItem>
          </div>
        </div>
        <DialogFooter>
          <Button className='mt-5' type='submit'>
            Guardar producto
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default UpdateProductForm
