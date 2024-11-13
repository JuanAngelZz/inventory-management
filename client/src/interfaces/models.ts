export type User = {
  usuario_id?: number
  nombre: string
  rol?: string
  contrasena?: string
}

export interface Product {
  producto_id?: number
  nombre: string
  descripcion: string
  stock: number
  precio_compra: number
  precio_venta: number
  fecha_adquisicion: string
  fecha_vencimiento: string
  categoria_id?: number
  categoria_nombre?: string
  proveedor_id?: number
  proveedor_nombre?: string
}

export interface Supplier {
  proveedor_id?: number
  nombre: string
  tipo: string
  telefono: string
  direccion: string
  codigo_telefono_id: number
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

export interface CarrierCode {
  codigo_telefono_id?: number
  operadora: string
  codigo_operadora: string
}
