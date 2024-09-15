import { Request, Response } from 'express'
import conn from '../db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { Supplier } from '../interfaces/supplier.interface'

export const getSuppliers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const query = 'SELECT * FROM proveedores'

  try {
    const [rows] = await conn.query<RowDataPacket[]>(query)

    return res.json(rows)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const getSupplier = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const query = 'SELECT * FROM proveedores WHERE id = ?'

  try {
    const [row] = await conn.query<RowDataPacket[]>(query, [id])

    if (row.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' })
    }

    return res.json(row[0])
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const createSupplier = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const supplier: Supplier = req.body
  const query = 'INSERT INTO proveedores SET ?'

  try {
    await conn.query<RowDataPacket[]>(query, supplier)

    return res.sendStatus(201)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const updateSupplier = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const supplier: Supplier = req.body
  const query = 'UPDATE proveedores SET ? WHERE id = ?'

  try {
    const [row] = await conn.query<ResultSetHeader>(query, [supplier, id])

    if (row.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const deleteSupplier = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const query = 'DELETE FROM proveedores WHERE id = ?'

  try {
    const [row] = await conn.query<ResultSetHeader>(query, [id])

    if (row.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
