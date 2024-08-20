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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card'
import { useLogin } from '@/hooks/useLogin'

const LoginForm = () => {
  const { form, errors, onSubmit } = useLogin()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Por favor ingrese sus credenciales.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <FormField
              control={form.control}
              name='nombre'
              render={({ field }) => (
                <FormItem className='flex flex-col items-start'>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder='Usuario' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='contrasena'
              render={({ field }) => (
                <FormItem className='flex flex-col items-start'>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder='Contraseña' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className='text-red-500 text-center'>{errors?.error}</p>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button variant='outline'>Cancel</Button>
            <Button type='submit'>Submit</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default LoginForm
