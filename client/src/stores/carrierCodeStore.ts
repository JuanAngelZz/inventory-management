import { create } from 'zustand'
import { CarrierCodeStore } from '@/interfaces/stores'
import { getAllCarrierCodes, getCarrierCode } from '@/api/carrierCodes'

const useCarrierCodeStore = create<CarrierCodeStore>((set, get) => ({
  ccs: [],
  selectedCc: null,

  setCcs: (ccs) => set({ ccs }),
  setSelectedCc: (cc) => set({ selectedCc: cc }),

  getCcs: async () => {
    try {
      const response = await getAllCarrierCodes()
      get().setCcs(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  getCc: async (id) => {
    try {
      const response = await getCarrierCode(id)
      get().setSelectedCc(response.data)
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

export default useCarrierCodeStore
