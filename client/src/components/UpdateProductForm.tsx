import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { Form, FormControl, FormField, FormLabel, FormMessage } from './ui/form'
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
import { format, parse } from '@formkit/tempo'
import useProductStore from '@/stores/productStore'
import { useEffect } from 'react'
import useCategoryStore from '@/stores/categoryStore'
import { subDays } from 'date-fns'

const UpdateProductForm = ({ id }: { id: number }) => {
  const selectedProduct = useProductStore((state) => state.selectedProduct)
  const getProduct = useProductStore((state) => state.getProduct)
  const updateProduct = useProductStore((state) => state.updateProduct)

  const categories = useCategoryStore((state) => state.categories)
  const getCategories = useCategoryStore((state) => state.getCategories)

  useEffect(() => {
    getProduct(id)
    getCategories()
  }, [])

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema)
  })

  function onSubmit(data: z.infer<typeof productSchema>) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
    console.log('submitted', data)
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
              defaultValue={selectedProduct?.nombre}
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
              defaultValue={selectedProduct?.precio_compra}
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
              name='precio_venta'
              defaultValue={selectedProduct?.precio_venta}
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
              name='descripcion'
              defaultValue={selectedProduct?.descripcion}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
              defaultValue={selectedProduct?.stock}
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>Stock</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      className='col-span-3'
                      placeholder='Stock'
                      type='number'
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant='outline' className='w-full'>
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
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
                <>
                  <FormLabel htmlFor={field.name}>
                    Fecha de vencimiento
                  </FormLabel>
                  <div className='col-span-3'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant='outline' className='w-full'>
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
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
                  </div>
                </>
              )}
            />
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
