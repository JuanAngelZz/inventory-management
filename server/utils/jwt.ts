import jwt from 'jsonwebtoken'
import { SECRET } from '../config'

type Payload = {
  nombre: string
}

export const createToken = (payload: Payload) => {
  const token = jwt.sign(payload, SECRET, { expiresIn: '24h' })
  return token
}

export const verifyToken = (token: string) => {
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return false
    }
    return decoded
  })
}
