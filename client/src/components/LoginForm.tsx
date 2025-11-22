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
import { useLogin } from '@/hooks/useLogin'

const LoginForm = () => {
  const { form, errors, onSubmit } = useLogin()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='nombre'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input 
                  placeholder='Ingresa tu usuario' 
                  className="h-11"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='contrasena'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Ingresa tu contraseña'
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errors?.error && (
          <p className='text-destructive text-sm text-center bg-destructive/10 p-3 rounded-md'>
            {errors.error}
          </p>
        )}
        <Button type='submit' className='w-full h-11 text-base'>
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
