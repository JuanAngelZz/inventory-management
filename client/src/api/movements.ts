import { Movement } from '@/interfaces/models'
import axios from './axios'
import { GetMovementResponse, GetMovementsResponse } from '@/interfaces/api'

export const getAllMovements = async (): Promise<GetMovementsResponse> =>
  axios.get('/movements')

export const getMovement = async (id: number): Promise<GetMovementResponse> =>
  axios.get(`/movements/${id}`)

export const createMovement = async (movement: Movement): Promise<void> =>
  axios.post('/movements', movement)

export const createBulkMovements = async (movements: Movement[]): Promise<void> =>
  axios.post('/movements/bulk', movements)

export const updateMovement = async (
  id: number,
  movement: Movement
): Promise<void> => axios.put(`/movements/${id}`, movement)

export const deleteMovement = async (id: number): Promise<void> =>
  axios.delete(`/movements/${id}`)
