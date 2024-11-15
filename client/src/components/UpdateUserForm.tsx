import { useToast } from '@/hooks/use-toast'
import { User } from '@/interfaces/models'
import { UpdateFormProps } from '@/interfaces/props'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
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
import { Button } from './ui/button'
import useUserStore from '@/stores/userStore'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { userPartialSchema } from '@/schemas/userPartialForm'

const UpdateUserForm = ({ id, onClose }: UpdateFormProps) => {
  const selectedUser = useUserStore((state) => state.selectedUser)
  const getUser = useUserStore((state) => state.getUser)
  const updateUser = useUserStore((state) => state.updateUser)

  const { toast } = useToast()

  useEffect(() => {
    getUser(id)
  }, [])

  const form = useForm<z.infer<typeof userPartialSchema>>({
    resolver: zodResolver(userPartialSchema),
    defaultValues: {
      nombre: '',
      rol: 'usuario'
    }
  })

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        nombre: selectedUser.nombre,
        rol: selectedUser.rol
      })
    }
  }, [selectedUser])

  async function onSubmit(data: z.infer<typeof userPartialSchema>) {
    const user: User = {
      nombre: data.nombre,
      contrasena: data.contrasena,
      rol: data.rol
    }

    await updateUser(id, user)

    toast({
      title: 'Usuario actualizado:',
      description: (
        <p>
          El usuario <strong>{data.nombre}</strong> ha sido actualizado con
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
          <DialogTitle>Detalles del usuario</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del usuario.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col mt-4 space-y-4'>
          <FormField
            control={form.control}
            name='nombre'
            render={({ field }) => (
              <>
                <FormLabel htmlFor={field.name}>Nombre del usuario</FormLabel>
                <FormControl>
                  <Input id={field.name} placeholder='Nombre' {...field} />
                </FormControl>
                <FormMessage />
              </>
            )}
          />
          <FormField
            control={form.control}
            name='contrasena'
            render={({ field }) => (
              <>
                <FormLabel htmlFor={field.name}>
                  Contraseña del usuario
                </FormLabel>
                <FormControl>
                  <Input
                    id={field.name}
                    placeholder='**********'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </>
            )}
          />
          <FormField
            control={form.control}
            name='rol'
            render={({ field }) => (
              <>
                <FormLabel htmlFor={field.name}>Rol</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value='usuario'>Usuario</SelectItem>
                        <SelectItem value='administrador'>
                          Administrador
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </>
            )}
          />
        </div>
        <DialogFooter>
          <Button className='mt-5' type='submit'>
            Guardar categoría
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default UpdateUserForm
