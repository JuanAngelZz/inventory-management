import { z } from 'zod'

export const userPartialSchema = z.object({
  nombre: z
    .string({
      required_error: 'El atributo "usuario" es requerido'
    })
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario debe tener como maximo 50 caracteres'),
  contrasena: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña debe tener como maximo 50 caracteres')
    .optional(),
  rol: z
    .string({
      required_error: 'El atributo "rol" es requerido'
    })
    .refine(
      (value: string) => value === 'administrador' || value === 'usuario',
      {
        message: 'El atributo "rol" debe ser "administrador" o "usuario"'
      }
    )
})
