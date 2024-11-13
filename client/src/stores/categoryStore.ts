import { create } from 'zustand'
import { Category } from '@/interfaces/models'
import { getAllCategories, getCategory } from '@/api/categories'
import { CategoryStore } from '@/interfaces/stores'

const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  selectedCategory: null,

  setCategory: (category: Category[]) => set({ categories: category }),
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
