import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const valid = verifyToken(token)

  if (!valid) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  next()
}
