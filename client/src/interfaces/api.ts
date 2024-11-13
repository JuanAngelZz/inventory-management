import { AxiosError, AxiosResponse } from 'axios'
import {
  CarrierCode,
  Category,
  Movement,
  Product,
  Supplier,
  User
} from './models'

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

// Respuesta Proveedores

export type GetSuppliersResponse = AxiosResponse<Supplier[]>
export type GetSupplierResponse = AxiosResponse<Supplier>

// Respuesta Movimientos

export type GetMovementsResponse = AxiosResponse<Movement[]>
export type GetMovementResponse = AxiosResponse<Movement>

// Respuesta Categorías

export type GetCategoriesResponse = AxiosResponse<Category[]>
export type GetCategoryResponse = AxiosResponse<Category>

// Respuesta Codigos de areas

export type GetCarrierCodesResponse = AxiosResponse<CarrierCode[]>
export type GetCarrierCodeResponse = AxiosResponse<CarrierCode>
