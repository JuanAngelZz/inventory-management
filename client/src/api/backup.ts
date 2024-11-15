import axios from './axios'

export const createBackup = async () => axios.post('/backup')
