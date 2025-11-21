import { create } from 'zustand'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct
} from '../api/products'
import { Product } from '@/interfaces/models'
import { ProductStore } from '@/interfaces/stores'

const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProduct: null,

  setProducts: (products: Product[]) => set({ products }),
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

  createProduct: async (product: Product) => {
    try {
      await createProduct(product)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  updateProduct: async (id, product: Product) => {
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
