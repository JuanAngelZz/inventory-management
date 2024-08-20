import axios from './axios'
import { GetMovementsResponse } from '@/interfaces/api'

export const getAllMovements = async (): Promise<GetMovementsResponse> =>
  axios.get('/movements')
