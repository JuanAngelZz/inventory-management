import { AxiosError, AxiosResponse } from 'axios'
import { Category, Movement, Product, User } from './models'

export type LoginResponse = AxiosResponse<{
  token: string
  user: User
}>

export type RegisterResponse = AxiosResponse<{
  token: string
  user: User
}>

export type VerifyResponse = AxiosResponse<{
  user: User
}>

export interface ErrorState extends AxiosError {
  error?: string
}

// Respuesta Productos

export type GetProductResponse = AxiosResponse<Product>
export type GetProductsResponse = AxiosResponse<Product[]>

// Respuesta Movimientos

export type GetMovementsResponse = AxiosResponse<Movement[]>

// Respuesta Categorías

export type GetCategoriesResponse = AxiosResponse<Category[]>
