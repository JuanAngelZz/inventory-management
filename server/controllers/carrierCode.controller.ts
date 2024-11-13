import { Request, Response } from 'express'
import conn from '../db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { CarrierCode } from '../interfaces/models.interface'

export const getCarrierCodes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const query = 'SELECT * FROM codigos_telefono'

  try {
    const [rows] = await conn.query<RowDataPacket[]>(query)

    return res.json(rows)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const createCarrierCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const carrierCode: CarrierCode = req.body
  const query = 'INSERT INTO codigos_telefono SET ?'

  try {
    await conn.query(query, carrierCode)

    return res.sendStatus(201)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const deleteCarrierCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const query = 'DELETE FROM codigos_telefono WHERE id = ?'

  try {
    const [row] = await conn.query<ResultSetHeader>(query, id)

    if (row.affectedRows === 0) {
      return res.status(404).json({ error: 'Carrier code not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
