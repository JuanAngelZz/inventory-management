import axios from './axios'
import { GetCategoriesResponse, GetCategoryResponse } from '@/interfaces/api'

export const getAllCategories = async (): Promise<GetCategoriesResponse> =>
  axios.get('/categories')

export const getCategory = async (id: number): Promise<GetCategoryResponse> =>
  axios.get(`/categories/${id}`)
