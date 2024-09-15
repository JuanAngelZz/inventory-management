import { z } from 'zod'

export const supplierSchema = z.object({
  nombre: z
    .string({
      required_error: 'El atributo "nombre" es requerido'
    })
    .min(3, 'El nombre del proveedor debe tener al menos 3 caracteres'),
  telefono: z
    .string({
      required_error: 'El atributo "telefono" es requerido'
    })
    .length(7, 'El número deteléfono debe tener 7 dígitos'),
  direccion: z
    .string({
      required_error: 'El atributo "direccion" es requerido'
    })
    .min(3, 'La dirección debe tener al menos 3 caracteres'),
  codigo_tlf_id: z.number({
    required_error: 'El atributo "codigo_tlf_id" es requerido'
  })
})
