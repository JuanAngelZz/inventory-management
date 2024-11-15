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
    .min(1, 'La cantidad debe ser mayor a 0'),
  fecha: z.date().optional().default(new Date()),
  producto_nombre: z
    .string({
      required_error: 'El atributo "producto_nombre" es requerido'
    })
    .min(3, 'El nombre del producto debe tener al menos 3 caracteres')
})
