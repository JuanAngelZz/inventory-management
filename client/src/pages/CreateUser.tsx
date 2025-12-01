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
import { useToast } from '@/hooks/use-toast'
import { userSchema } from '@/schemas/userForm'
import useUserStore from '@/stores/userStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Slash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { User } from '@/interfaces/models'

const CreateUser = () => {
  const { toast } = useToast()

  const createUser = useUserStore((state) => state.createUser)

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: '',
      contrasena: '',
      rol: undefined as any
    }
  })

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    const user: User = {
      nombre: data.nombre,
      contrasena: data.contrasena,
      rol: data.rol
    }

    await createUser(user)

    toast({
      title: 'Usuario creado:',
      description: (
        <p>
          El usuario <strong>{data.nombre}</strong> ha sido creado con exito{' '}
          <br />
          <strong>
            <Link to='/administrate/users'>Ir a usuarios</Link>
          </strong>
        </p>
      )
    })
  }

  return (
    <>
      <header className='mb-4'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Crear una nueva categoría
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
                <Link to='/administrate'>Administrar</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink asChild>
                <Link to='/administrate/users'>Usuarios</Link>
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
            <div className='row-span-6 flex flex-col justify-evenly space-y-4'>
              <FormField
                control={form.control}
                name='nombre'
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor={field.name}>
                      Nombre del usuario
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
            </div>
            <div className='row-span-6 gap-4 flex flex-col '>
              <FormField
                control={form.control}
                name='rol'
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor={field.name}>Rol</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un rol para el usuario' />
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
            <Button type='submit' className='w-full'>
              Enviar
            </Button>
          </form>
        </Form>
      </main>
    </>
  )
}

export default CreateUser
