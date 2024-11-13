export type User = {
  usuario_id?: number
  nombre: string
  contrasena: string
  rol?: 'administrador' | 'usuario'
}

export type Product = {
  producto_id?: number
  nombre: string
  descripcion: string
  stock: number
  precio_compra: number
  precio_venta: number
  fecha_adquisicion: Date
  fecha_vencimiento: Date
  categoria_id?: number
  proveedor_id?: number
  categoria_nombre?: string
  proveedor_nombre?: string
}

export type Movement = {
  movimiento_id?: number
  tipo: 'entrada' | 'salida'
  cantidad: number
  fecha: Date
  producto_id: number
}

export interface Supplier {
  proveedor_id?: number
  nombre: string
  tipo: string
  telefono: string
  direccion: string
  codigo_telefono_id: string
}

export type Category = {
  categoria_id?: number
  nombre: string
}

export interface CarrierCode {
  codigo_telefono_id?: number
  operadora: string
  codigo_operadora: string
}
