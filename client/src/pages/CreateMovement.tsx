import { createMovement } from '@/api/movements'
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
import { useToast } from '@/hooks/use-toast'
import { Movement } from '@/interfaces/models'
import { cn } from '@/lib/utils'
import { movementSchema } from '@/schemas/movementForm'
import useMovementStore from '@/stores/movementStore'
import useProductStore from '@/stores/productStore'
import { format } from '@formkit/tempo'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

const CreateMovement = () => {
  const { toast } = useToast()

  const getMovements = useMovementStore((state) => state.getMovements)

  const products = useProductStore((state) => state.products)
  const getProducts = useProductStore((state) => state.getProducts)

  useEffect(() => {
    getProducts()
  }, [])

  const form = useForm<z.infer<typeof movementSchema>>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      cantidad: 0
    }
  })

  const queryClient = useQueryClient()

  const onSubmit = async (data: z.infer<typeof movementSchema>) => {
    const movement: Movement = {
      tipo: data.tipo,
      cantidad: data.cantidad,
      fecha: data.fecha.toISOString(),
      producto_nombre: data.producto_nombre
    }

    console.log(movement)

    try {
      await createMovement(movement)
      getMovements()
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
  
      toast({
        title: 'Movimiento registrado:',
        description: (
          <p>
            El movimiento ha sido registrado con exito. <br />
            <strong>
              <Link to='/movements'>Ir a movimientos</Link>
            </strong>
          </p>
        ),
      })
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast({
          title: 'Error al registrar movimiento',
          description: error.response.data.error,
          variant: 'destructive',
        })
      } else {
        console.error(error);
      }
    }
  }

  return (
    <>
      <Header 
        page="Registrar Movimiento de Inventario" 
        breadcrumbs={[
          { label: 'Movimientos', href: '/movements' },
          { label: 'Registrar' }
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
            <div className='row-span-6 flex flex-col justify-evenly'>
              <FormField
                control={form.control}
                name='producto_nombre'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto</FormLabel>
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
                              ? products.find(
                                  (product) => product.nombre === field.value
                                )?.nombre
                              : 'Selecciona un producto...'}
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
                              {products.map((product) => (
                                <CommandItem
                                  value={product.nombre}
                                  key={product.producto_id}
                                  onSelect={() => {
                                    form.setValue(
                                      'producto_nombre',
                                      product.nombre
                                    )
                                  }}
                                >
                                  {product.nombre}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      product.nombre === field.value
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
                name='tipo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Tipo</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Seleccione una opción' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categorías</SelectLabel>
                            <SelectItem value='entrada'>Entrada</SelectItem>
                            <SelectItem value='salida'>Salida</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='row-span-6 gap-4 flex flex-col justify-evenly'>
              <FormField
                control={form.control}
                name='cantidad'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        className='col-span-3'
                        type='number'
                        min={0}
                        placeholder='Telefono'
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
                name='fecha'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Fecha de movimiento (por defecto la fecha actual)
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
            </div>
            <Button type='submit' className='w-full'>
              Enviar
            </Button>
          </form>
        </Form>
        </CardContent>
        </Card>
      </main>
    </>
  )
}

export default CreateMovement
