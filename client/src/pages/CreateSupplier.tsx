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
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import { Supplier } from '@/interfaces/models'
import { supplierSchema } from '@/schemas/supplierForm'
import useCarrierCodeStore from '@/stores/carrierCodeStore'
import useSupplierStore from '@/stores/supplierStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Slash } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

const CreateSupplier = () => {
  const { toast } = useToast()

  const createSupplier = useSupplierStore((state) => state.createSupplier)

  const ccs = useCarrierCodeStore((state) => state.ccs)
  const getCcs = useCarrierCodeStore((state) => state.getCcs)

  useEffect(() => {
    getCcs()
    console.log(ccs)
  }, [])

  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      nombre: '',
      tipo: '',
      telefono: '',
      direccion: '',
      codigo_telefono_id: '1'
    }
  })

  const onSubmit = async (data: z.infer<typeof supplierSchema>) => {
    const supplier: Supplier = {
      nombre: data.nombre,
      tipo: data.tipo,
      telefono: data.telefono,
      direccion: data.direccion,
      codigo_telefono_id: +data.codigo_telefono_id
    }

    await createSupplier(supplier)

    toast({
      title: 'Proveedor registrado:',
      description: (
        <p>
          El proveedor <strong>{data.nombre}</strong> ha sido registrado con
          exito. <br />
          <strong>
            <Link to='/suppliers'>Ir a proveedores</Link>
          </strong>
        </p>
      )
    })
  }

  return (
    <>
      <header className='mb-4'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Agregar un nuevo proveedor
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
                <Link to='/suppliers'>Proveedores</Link>
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
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Nombre del proveedor
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
                name='tipo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Tipo de proveedor
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id={field.name}
                        className='col-span-3'
                        placeholder='Comidas, bebidas, etc.'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='row-span-6 gap-4 flex flex-col justify-evenly'>
              <FormField
                control={form.control}
                name='direccion'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Dirección</FormLabel>
                    <FormControl>
                      <Textarea
                        id={field.name}
                        className='col-span-3'
                        placeholder='Calle 123, Ciudad'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormLabel>Telefono</FormLabel>
              <div className='grid grid-cols-4'>
                <FormField
                  control={form.control}
                  name='codigo_telefono_id'
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder={'0424'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Operadoras</SelectLabel>
                              {ccs.map((cc) => (
                                <SelectItem
                                  key={cc.codigo_telefono_id}
                                  value={cc.codigo_telefono_id?.toString()}
                                >
                                  {cc.codigo_operadora}
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
                  name='telefono'
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <Input
                          id={field.name}
                          className='col-span-3'
                          placeholder='Numero de teléfono'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </>
                  )}
                />
              </div>
            </div>
            <Button type='submit' className='w-full'>
              Enviar
            </Button>
          </form>
        </Form>
      </main>
    </>
  )
}

export default CreateSupplier
