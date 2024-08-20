import { User } from '@/interfaces/models'
import axios from './axios'
import { LoginResponse, VerifyResponse } from '@/interfaces/api'

export const resgister = async (user: User) => axios.post('/resgister', user)

export const login = async (user: User): Promise<LoginResponse> =>
  axios.post('/login', user)

export const verify = async (): Promise<VerifyResponse> => axios.post('/verify')
