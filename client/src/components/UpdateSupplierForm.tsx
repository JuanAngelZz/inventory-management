import { useToast } from '@/hooks/use-toast'
import { Supplier } from '@/interfaces/models'
import { UpdateFormProps } from '@/interfaces/props'
import { supplierSchema } from '@/schemas/supplierForm'
import useCarrierCodeStore from '@/stores/carrierCodeStore'
import useSupplierStore from '@/stores/supplierStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
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
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'

const UpdateSupplierForm = ({ id, onClose }: UpdateFormProps) => {
  const selectedSupplier = useSupplierStore((state) => state.selectedSupplier)
  const getSupplier = useSupplierStore((state) => state.getSupplier)
  const updateSupplier = useSupplierStore((state) => state.updateSupplier)

  const ccs = useCarrierCodeStore((state) => state.ccs)
  const getCcs = useCarrierCodeStore((state) => state.getCcs)

  const { toast } = useToast()

  useEffect(() => {
    getSupplier(id)
    getCcs()
  }, [])

  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      // Inicializa los valores predeterminados con valores vacíos
      nombre: '',
      tipo: '',
      telefono: '',
      direccion: '',
      codigo_telefono_id: '1'
    }
  })

  const [placeholder, setPlaceholder] = useState('')

  // Utiliza useEffect para monitorear cambios en selectedProduct
  useEffect(() => {
    if (selectedSupplier) {
      // Establece los valores predeterminados con los datos del producto seleccionado
      form.reset({
        nombre: selectedSupplier.nombre,
        tipo: selectedSupplier.tipo,
        telefono: selectedSupplier.telefono,
        direccion: selectedSupplier.direccion,
        codigo_telefono_id: selectedSupplier.codigo_telefono_id.toString()
      })
    }

    const selectedCc = ccs.find(
      (cc) => cc.codigo_telefono_id === selectedSupplier?.codigo_telefono_id
    )?.codigo_operadora

    if (selectedCc) {
      setPlaceholder(selectedCc)
    }
  }, [selectedSupplier])

  async function onSubmit(data: z.infer<typeof supplierSchema>) {
    const supplier: Supplier = {
      nombre: data.nombre,
      tipo: data.tipo,
      telefono: data.telefono,
      direccion: data.direccion,
      codigo_telefono_id: +data.codigo_telefono_id
    }

    await updateSupplier(id, supplier)

    toast({
      title: 'Proveedor actualizado:',
      description: (
        <p>
          El proveedor <strong>{data.nombre}</strong> ha sido actualizado con
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
          <DialogTitle>Detalles del proveedor</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del proveedor.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 mt-4'>
          <FormField
            control={form.control}
            name='nombre'
            render={({ field }) => (
              <>
                <FormLabel htmlFor={field.name}>Nombre del producto</FormLabel>
                <FormControl>
                  <Input id={field.name} placeholder='Nombre' {...field} />
                </FormControl>
                <FormMessage />
              </>
            )}
          />
          <FormField
            control={form.control}
            name='tipo'
            render={({ field }) => (
              <>
                <FormLabel>Tipo de proveedor</FormLabel>
                <FormControl>
                  <Textarea
                    id={field.name}
                    placeholder='Comida, bebida, etc.'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </>
            )}
          />
          <FormField
            control={form.control}
            name='direccion'
            render={({ field }) => (
              <>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Textarea
                    id={field.name}
                    placeholder='Comida, bebida, etc.'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </>
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
                        <SelectValue placeholder={placeholder} />
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
        <DialogFooter>
          <Button className='mt-5' type='submit'>
            Guardar producto
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default UpdateSupplierForm
