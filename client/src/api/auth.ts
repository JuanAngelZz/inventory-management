import { User } from '@/interfaces/models'
import axios from './axios'
import { LoginResponse, VerifyResponse } from '@/interfaces/api'

export const register = async (user: User) => axios.post('/register', user)

export const login = async (user: User): Promise<LoginResponse> =>
  axios.post('/login', user)

export const verify = async (): Promise<VerifyResponse> => axios.post('/verify')
