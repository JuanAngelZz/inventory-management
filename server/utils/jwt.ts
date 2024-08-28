import jwt, { JwtPayload } from 'jsonwebtoken'
import { SECRET } from '../config'

type Payload = {
  nombre: string
}

export const createToken = (payload: Payload): string => {
  const token = jwt.sign(payload, SECRET, { expiresIn: '24h' })
  return token
}

export const verifyToken = (token: string): string | false | JwtPayload => {
  try {
    const decoded = jwt.verify(token, SECRET)
    return decoded
  } catch (error) {
    return false
  }
}
