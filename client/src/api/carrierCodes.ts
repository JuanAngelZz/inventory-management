import {
  GetCarrierCodeResponse,
  GetCarrierCodesResponse
} from '@/interfaces/api'
import axios from './axios'

export const getAllCarrierCodes = async (): Promise<GetCarrierCodesResponse> =>
  axios.get('/carrierCode')

export const getCarrierCode = async (
  id: number
): Promise<GetCarrierCodeResponse> => axios.get(`/carrierCode/${id}`)
