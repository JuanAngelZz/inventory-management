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
import { cn } from '@/lib/utils'
import { format } from '@formkit/tempo'

const CreateProductForm = () => {
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
              name='precio'
              render={({ field }) => (
                <>
                  <FormLabel htmlFor={field.name}>Precio ($)</FormLabel>
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
                    <Select>
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder='Seleccione una categoría' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categorías</SelectLabel>
                          <SelectItem value='apple'>Apple</SelectItem>
                          <SelectItem value='banana'>Banana</SelectItem>
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
                              format(field.value, 'DD/MM/YYYY')
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
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
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
                              format(field.value, 'DD/MM/YYYY')
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
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
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

export default CreateProductForm
