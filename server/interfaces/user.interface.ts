export type User = {
  id?: number
  nombre: string
  contrasena: string
  rol?: 'administrador' | 'usuario'
}
