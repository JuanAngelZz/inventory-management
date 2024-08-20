import { z } from 'zod'

export const productSchema = z.object({
  nombre: z
    .string({
      required_error: 'El atributo "nombre" es requerido'
    })
    .min(3, 'El nombre del producto debe tener al menos 3 caracteres'),
  descripcion: z.string({
    required_error: 'El atributo "descripcion" es requerido'
  }),
  stock: z
    .number({
      required_error: 'El atributo "stock" es requerido'
    })
    .min(0),
  precio: z
    .number({
      required_error: 'El atributo "precio" es requerido'
    })
    .min(0),
  fecha_adquisicion: z.string().default(new Date().toISOString()),
  fecha_vencimiento: z.string({
    required_error: 'El atributo "fecha_vencimiento" es requerido'
  }),
  categoria_id: z
    .number({
      required_error: 'El atributo "categoria_id" es requerido'
    })
    .min(0)
})
