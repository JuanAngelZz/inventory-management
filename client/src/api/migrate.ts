import axios from './axios'

export const restoreDatabase = async (file: File) => {
  const formData = new FormData()
  formData.append('backup', file)

  return axios.post('/restore', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
