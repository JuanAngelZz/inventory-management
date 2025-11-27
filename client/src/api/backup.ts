import axios from './axios'

export const createBackup = async () => axios.post('/backup', {}, { responseType: 'blob' })

export const getBackups = async () => axios.get('/backups')

export const downloadBackup = async (filename: string) => axios.get(`/backup/${filename}`, { responseType: 'blob' })
