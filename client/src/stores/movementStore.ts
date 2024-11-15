import {
  createMovement,
  deleteMovement,
  getAllMovements,
  getMovement,
  updateMovement
} from '@/api/movements'
import { MovementStore } from '@/interfaces/stores'
import { create } from 'zustand'

const useMovementStore = create<MovementStore>((set, get) => ({
  movements: [],
  selectedMovement: null,

  setMovements: (movements) => set({ movements }),
  setSelectedMovement: (movement) => set({ selectedMovement: movement }),

  getMovements: async () => {
    try {
      const response = await getAllMovements()
      get().setMovements(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  getMovement: async (id) => {
    try {
      const response = await getMovement(id)
      get().setSelectedMovement(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  createMovement: async (movement) => {
    try {
      await createMovement(movement)
      get().getMovements()
    } catch (error) {
      console.log(error)
    }
  },

  updateMovement: async (id, movement) => {
    try {
      await updateMovement(id, movement)
      get().getMovements()
    } catch (error) {
      console.log(error)
    }
  },

  deleteMovement: async (id) => {
    try {
      await deleteMovement(id)
      get().getMovements()
    } catch (error) {
      console.log(error)
    }
  }
}))

export default useMovementStore
