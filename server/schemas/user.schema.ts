import { z } from 'zod'

export const userSchema = z.object({
  nombre: z
    .string({
      required_error: "El atributo 'nombre' es requerido"
    })
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  contrasena: z
    .string({
      required_error: "El atributo 'contrasena' es requerido"
    })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z
    .enum(['administrador', 'usuario'], {
      required_error: "El atributo 'rol' es requerido",
      message: "El atributo 'rol' debe ser 'administrador' o 'usuario'"
    })
    .default('usuario')
})
