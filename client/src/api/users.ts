import { GetUserResponse, GetUsersResponse } from '@/interfaces/api'
import axios from './axios'
import { User } from '@/interfaces/models'

export const getAllUsers = async (): Promise<GetUsersResponse> =>
  axios.get('/users')

export const getUser = async (id: number): Promise<GetUserResponse> =>
  axios.get(`/users/${id}`)

export const updateUser = async (id: number, user: User): Promise<void> =>
  axios.put(`/users/${id}`, user)

export const deleteUser = async (id: number): Promise<void> =>
  axios.delete(`/users/${id}`)
