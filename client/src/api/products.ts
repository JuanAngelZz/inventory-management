import { Product } from '@/interfaces/models'
import axios from './axios'
import { GetProductResponse, GetProductsResponse } from '@/interfaces/api'

export const getAllProducts = async (): Promise<GetProductsResponse> =>
  axios.get('/products')

export const getProduct = async (id: number): Promise<GetProductResponse> =>
  axios.get(`/products/${id}`)

export const createProduct = async (product: Product): Promise<void> =>
  axios.post('/products', product)

export const updateProduct = async (
  id: number,
  product: Product
): Promise<void> => axios.put(`/products/${id}`, product)

export const deleteProduct = async (id: number): Promise<void> =>
  axios.delete(`/products/${id}`)
