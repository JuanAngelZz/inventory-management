import { z } from 'zod'

export const carrierCodeSchema = z.object({
  operadora: z
    .string({
      required_error: 'El atributo "operadora" es requerido'
    })
    .min(3, 'El nombre de la operadora debe tener al menos 3 caracteres'),
  codigo_operadora: z
    .string({
      required_error: 'El atributo "codigo_operadora" es requerido'
    })
    .length(4, 'El código de la operadora debe tener 4 caracteres')
})
