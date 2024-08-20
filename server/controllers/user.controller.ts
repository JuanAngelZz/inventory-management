import { Request, Response } from 'express'
import conn from '../db'
import { RowDataPacket } from 'mysql2'
import { createToken, verifyToken } from '../utils/jwt'
import bcrypt from 'bcrypt'
import { User } from '../interfaces/user.interface'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { SECRET } from '../config'

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user: User = req.body
  const encryptedPassword = await bcrypt.hash(user.contrasena, 10)
  user.contrasena = encryptedPassword

  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM usuarios WHERE nombre = ?',
      [user.nombre]
    )

    if (rows.length > 0) {
      return res.status(409).json({ error: 'El usuario ya existe' })
    }

    const query = 'INSERT INTO usuarios SET ?'
    await conn.query(query, [user])

    const jwt = createToken({ nombre: user.nombre })

    res.setHeader('Authorization', `Bearer ${jwt}`)
    return res.status(201).json({ token: jwt })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { nombre, contrasena }: User = req.body
  const query = 'SELECT * FROM usuarios WHERE nombre = ?'

  try {
    const [rows] = await conn.query<RowDataPacket[]>(query, [nombre])

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const compare = await bcrypt.compare(contrasena, rows[0].contrasena)

    if (!compare) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const jwt = createToken({ nombre: rows[0].nombre })
    const user = { id: rows[0].id, nombre: rows[0].nombre, rol: rows[0].rol }

    res.setHeader('Authorization', `Bearer ${jwt}`)
    return res.status(200).json({ token: jwt, user })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const verifyUser = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'nombre' in decoded
    ) {
      const [rows] = await conn.query<RowDataPacket[]>(
        'SELECT * FROM usuarios WHERE nombre = ?',
        [decoded.nombre]
      )

      const user = {
        id: rows[0].id,
        nombre: rows[0].nombre,
        rol: rows[0].rol
      }

      return res.status(200).json({ user })
    } else {
      return res.status(401).json({ error: 'Token inválido' })
    }
  })
}
