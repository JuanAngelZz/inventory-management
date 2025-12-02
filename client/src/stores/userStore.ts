import { create } from 'zustand'
import { UserStore } from '@/interfaces/stores'
import { deleteUser, getAllUsers, getUser, updateUser } from '@/api/users'
import { register } from '@/api/auth'

const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  selectedUser: null,

  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  getUsers: async () => {
    try {
      const response = await getAllUsers()
      get().setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  getUser: async (id) => {
    try {
      const response = await getUser(id)
      get().setSelectedUser(response.data)
    } catch (error) {
      console.log(error)
    }
  },

  createUser: async (user) => {
    try {
      await register(user)
      get().getUsers()
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  updateUser: async (id, user) => {
    try {
      await updateUser(id, user)
      get().getUsers()
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  deleteUser: async (id) => {
    try {
      await deleteUser(id)
      get().getUsers()
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}))

export default useUserStore
