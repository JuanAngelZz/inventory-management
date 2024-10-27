import { GetSuppliersResponse } from '@/interfaces/api'
import axios from './axios'

export const getAllSuppliers = async (): Promise<GetSuppliersResponse> =>
  axios.get('/suppliers')
