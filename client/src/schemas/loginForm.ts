import { z } from 'zod'

export const loginSchema = z.object({
  nombre: z
    .string({
      required_error: 'El atributo "usuario" es requerido'
    })
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario debe tener como maximo 50 caracteres'),
  contrasena: z
    .string({
      required_error: 'El atributo "contrasena" es requerido'
    })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña debe tener como maximo 50 caracteres')
})
