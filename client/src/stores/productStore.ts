import { create } from 'zustand'
import {
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct
} from '../api/products'
import { Product } from '@/interfaces/models'

interface ProductStore {
  products: Product[]
  selectedProduct: Product | null

  setProducts: (products: Product[]) => void
  setSelectedProduct: (product: Product) => void

  getProducts: () => Promise<void>
  getProduct: (id: number) => Promise<void>
  updateProduct: (id: number, product: Product) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
}

const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProduct: null,

  setProducts: (products) => set({ products }),
  setSelectedProduct: (product: Product) => set({ selectedProduct: product }),

  getProducts: async () => {
    try {
      const response = await getAllProducts()
      get().setProducts(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  getProduct: async (id) => {
    try {
      const response = await getProduct(id)
      get().setSelectedProduct(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  updateProduct: async (id, product) => {
    try {
      await updateProduct(id, product)
      get().getProducts()
    } catch (error) {
      console.log(error)
    }
  },

  deleteProduct: async (id) => {
    try {
      await deleteProduct(id)
      get().getProducts()
    } catch (error) {
      console.log(error)
    }
  }
}))

export default useProductStore
