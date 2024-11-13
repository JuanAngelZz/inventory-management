import { GetSupplierResponse, GetSuppliersResponse } from '@/interfaces/api'
import axios from './axios'
import { Supplier } from '@/interfaces/models'

export const getAllSuppliers = async (): Promise<GetSuppliersResponse> =>
  axios.get('/suppliers')

export const getSupplier = async (id: number): Promise<GetSupplierResponse> =>
  axios.get(`/suppliers/${id}`)

export const createSupplier = async (supplier: Supplier): Promise<void> =>
  axios.post('/suppliers', supplier)

export const updateSupplier = async (id: number, supplier: Supplier) =>
  axios.put(`/suppliers/${id}`, supplier)

export const deleteSupplier = async (id: number): Promise<void> =>
  axios.delete(`/suppliers/${id}`)
