export type Movement = {
  id?: number
  tipo: 'entrada' | 'salida'
  cantidad: number
  fecha: Date
  producto_id: number
}
