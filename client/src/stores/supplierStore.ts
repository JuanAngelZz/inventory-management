import { create } from 'zustand'
import { SupplierStore } from '@/interfaces/stores'
import { Supplier } from '@/interfaces/models'
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplier,
  updateSupplier
} from '@/api/suppliers'

const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: [],
  selectedSupplier: null,

  setSupplier: (supplier: Supplier[]) => set({ suppliers: supplier }),
  setSelectedSupplier: (supplier: Supplier) =>
    set({ selectedSupplier: supplier }),

  getSuppliers: async () => {
    try {
      const response = await getAllSuppliers()
      get().setSupplier(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  getSupplier: async (id) => {
    try {
      const response = await getSupplier(id)
      get().setSelectedSupplier(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  createSupplier: async (supplier: Supplier) => {
    try {
      await createSupplier(supplier)
      get().getSuppliers()
    } catch (error) {
      console.log(error)
    }
  },

  updateSupplier: async (id, product) => {
    try {
      await updateSupplier(id, product)
      get().getSuppliers()
    } catch (error) {
      console.log(error)
    }
  },

  deleteSupplier: async (id) => {
    try {
      await deleteSupplier(id)
      get().getSuppliers()
    } catch (error) {
      console.log(error)
    }
  }
}))

export default useSupplierStore
