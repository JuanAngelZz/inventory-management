export type User = {
  usuario_id?: number
  nombre: string
  rol?: string
  contrasena?: string
}

export interface Product {
  producto_id: number
  nombre: string
  descripcion: string
  stock: number
  precio: number
  fecha_adquisicion: string
  fecha_vencimiento: string
  categoria_id: number
  categoria_nombre: string
}

export interface Movement {
  movimiento_id: number
  tipo: 'entrada' | 'salida'
  cantidad: number
  fecha: Date
  producto_id: number
  producto_nombre: string
}

export interface Category {
  categoria_id: number
  nombre: string
}
