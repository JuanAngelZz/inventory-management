import { Category } from '@/interfaces/models'
import axios from './axios'
import { GetCategoriesResponse, GetCategoryResponse } from '@/interfaces/api'

export const getAllCategories = async (): Promise<GetCategoriesResponse> =>
  axios.get('/categories')

export const getCategory = async (id: number): Promise<GetCategoryResponse> =>
  axios.get(`/categories/${id}`)

export const createCategory = async (category: Category): Promise<void> =>
  axios.post('/categories', category)

export const updateCategory = async (
  id: number,
  category: Category
): Promise<void> => axios.put(`/categories/${id}`, category)

export const deleteCategory = async (id: number): Promise<void> =>
  axios.delete(`/categories/${id}`)
