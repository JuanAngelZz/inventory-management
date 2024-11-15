import { z } from 'zod'

export const categorySchema = z.object({
  nombre: z
    .string({
      required_error: 'El atributo "nombre" es requerido'
    })
    .min(3, 'El nombre de la categoria debe tener al menos 3 caracteres')
})
