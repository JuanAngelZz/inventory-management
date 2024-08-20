import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { loginSchema } from '@/schemas/loginForm'
import { useAuth } from '@/contexts/authContext'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
  const { loginUser, errors } = useAuth()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nombre: '',
      contrasena: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await loginUser(values)
    navigate('/')
  }

  return { form, errors, onSubmit }
}
