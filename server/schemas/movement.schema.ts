import { z } from 'zod'

export const movementSchema = z.object({
  tipo: z
    .string({
      required_error: 'El atributo "tipo" es requerido'
    })
    .refine((value: string) => value === 'entrada' || value === 'salida', {
      message: 'El atributo "tipo" debe ser "entrada" o "salida"'
    }),
  cantidad: z
    .number({
      required_error: 'El atributo "cantidad" es requerido'
    })
    .min(0),
  fecha: z.date().optional().default(new Date()),
  producto_id: z
    .number({
      required_error: 'El atributo "producto_id" es requerido'
    })
    .min(0)
})
