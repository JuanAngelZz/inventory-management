import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import {
  DialogClose,
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
import { Label } from './ui/label'
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
import { CalendarIcon } from 'lucide-react'
import { format } from '@formkit/tempo'
import useProductStore from '@/stores/productStore'
import { useEffect } from 'react'
import useCategoryStore from '@/stores/categoryStore'
import { subDays } from 'date-fns'
import { Product } from '@/interfaces/models'
import { useToast } from '@/hooks/use-toast'

const UpdateProductForm = ({ id }: { id: number }) => {
  const selectedProduct = useProductStore((state) => state.selectedProduct)
  const getProduct = useProductStore((state) => state.getProduct)
  const updateProduct = useProductStore((state) => state.updateProduct)

  const categories = useCategoryStore((state) => state.categories)
  const getCategories = useCategoryStore((state) => state.getCategories)

  const { toast } = useToast()

  useEffect(() => {
    getProduct(id)
    getCategories()
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
      categoria_id: ''
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
        precio_compra: selectedProduct.precio_compra,
        precio_venta: selectedProduct.precio_venta,
        fecha_adquisicion: new Date(selectedProduct.fecha_adquisicion),
        fecha_vencimiento: new Date(selectedProduct.fecha_vencimiento),
        categoria_id: selectedProduct.categoria_id.toString()
      })
    }
  }, [selectedProduct])

  async function onSubmit(data: z.infer<typeof productSchema>) {
    const product: Product = {
      producto_id: id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      stock: data.stock,
      precio_compra: data.precio_compra,
      precio_venta: data.precio_venta,
      fecha_adquisicion: data.fecha_adquisicion.toISOString().split('T')[0],
      fecha_vencimiento: data.fecha_vencimiento.toISOString().split('T')[0],
      categoria_id: parseInt(data.categoria_id)
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
        <div className='grid gap-4 py-4 mt-2'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <FormField
              control={form.control}
              name='nombre'
              render={({ field }) => (
                <>
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
                </>
              )}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
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
                      className='col-span-3'
                      placeholder='Precio'
                      type='number'
                      min={0}
                      {...field}
                      step={0.01}
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
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
                      className='col-span-3'
                      placeholder='Precio'
                      type='number'
                      min={0}
                      {...field}
                      step={0.01}
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
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
                      className='col-span-3'
                      placeholder='Descripción'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
            <Label htmlFor='productPrice' className='text-right'></Label>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <FormField
              control={form.control}
              name='categoria_id'
              render={({ field }) => (
                <>
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
                </>
              )}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <FormField
              control={form.control}
              name='stock'
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>Stock</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      className='col-span-3'
                      placeholder='Stock'
                      type='number'
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <FormField
              control={form.control}
              name='fecha_adquisicion'
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>
                    Fecha de adquisición
                  </FormLabel>
                  <div className='col-span-3'>
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <FormField
              control={form.control}
              name='fecha_vencimiento'
              render={({ field }) => (
                <FormItem className='col-span-4 grid grid-cols-4 items-center gap-4'>
                  <FormLabel htmlFor={field.name}>
                    Fecha de vencimiento
                  </FormLabel>
                  <Popover modal>
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
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className='mt-5' type='submit'>
              Guardar producto
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default UpdateProductForm
