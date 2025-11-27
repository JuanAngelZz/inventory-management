import axios from './axios'

export const sendMessage = async (messages: any[]) => {
  const response = await axios.post('/chat', { messages })
  return response.data
}
