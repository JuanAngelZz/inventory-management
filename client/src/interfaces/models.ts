export type User = {
  id?: number
  nombre: string
  rol?: string
  contrasena?: string
}

export interface Product {
  id: number
  nombre: string
  descripcion: string
  stock: number
  precio: number
  fecha_adquisicion: string
  fecha_vencimiento: string
  categoria_id: number
}

export interface Movement {
  id: number
  tipo: 'entrada' | 'salida'
  cantidad: number
  fecha: Date
  producto_id: number
}

export interface Category {
  id: number
  nombre: string
}