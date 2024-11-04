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
    .min(1, 'El stock debe ser mayor a 0'),
  precio_compra: z
    .number({
      required_error: 'El atributo "precio_compra" es requerido'
    })
    .min(0.01, 'El precio de compra debe ser mayor a 0'),
  precio_venta: z
    .number({
      required_error: 'El atributo "precio_venta" es requerido'
    })
    .min(0.01, 'El precio de venta debe ser mayor a 0'),
  fecha_adquisicion: z.date().default(new Date()),
  fecha_vencimiento: z.date({
    required_error: 'El atributo "fecha_vencimiento" es requerido'
  }),
  categoria_id: z.string({
    required_error: 'El atributo "categoria" es requerido'
  })
})
