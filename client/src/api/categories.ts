import axios from './axios'
import { GetCategoriesResponse } from '@/interfaces/api'

export const getAllCategories = async (): Promise<GetCategoriesResponse> =>
  axios.get('/categories')
