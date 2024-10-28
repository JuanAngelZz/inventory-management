import { create } from 'zustand'
import { Category } from '@/interfaces/models'
import { getAllCategories, getCategory } from '@/api/categories'

interface CategoryStore {
  categories: Category[]
  selectedCategory: Category | null

  setCategory: (category: Category[]) => void
  setSelectedCategory: (category: Category) => void

  getCategories: () => Promise<void>
  getCategory: (id: number) => Promise<void>
  // updateCategory: (id: number, category: Category) => Promise<void>
  // deleteCategory: (id: number) => Promise<void>
}

const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  selectedCategory: null,

  setCategory: (category) => set({ categories: category }),
  setSelectedCategory: (category: Category) =>
    set({ selectedCategory: category }),

  getCategories: async () => {
    try {
      const response = await getAllCategories()
      get().setCategory(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  getCategory: async (id) => {
    try {
      const response = await getCategory(id)
      get().setSelectedCategory(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  // updateCategory: async (id, product) => {
  //   try {
  //     await updateProduct(id, product)
  //     get().getCategories()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // },

  // deleteCategory: async (id) => {
  //   try {
  //     await deleteProduct(id)
  //     get().getCategories()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}))

export default useCategoryStore
