import axios from './axios'
import { GetProductsResponse } from '@/interfaces/api'

export const getAllProducts = async (): Promise<GetProductsResponse> =>
  axios.get('/products')

export const deleteProduct = async (id: number) =>
  axios.delete(`/products/${id}`)
