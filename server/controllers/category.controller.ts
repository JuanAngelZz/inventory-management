import { Request, Response } from 'express'
import conn from '../db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { Category } from '../interfaces/models.interface'

export const getCategories = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const query = 'SELECT * FROM categorias'

  try {
    const [categories] = await conn.query<RowDataPacket[]>(query)
    return res.json(categories)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const getCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const query = 'SELECT * FROM categorias WHERE id = ?'

  try {
    const [row] = await conn.query<RowDataPacket[]>(query, [id])

    if (row.length === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    const category = row[0]
    return res.json(category)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const createCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const category: Category = req.body
  const query = 'INSERT INTO categorias SET ?'

  try {
    await conn.query<RowDataPacket[]>(query, category)

    return res.sendStatus(201)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const category: Category = req.body
  const query = 'UPDATE categorias SET ? WHERE id = ?'

  try {
    const [row] = await conn.query<ResultSetHeader>(query, [category, id])

    if (row.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const query = 'DELETE FROM categorias WHERE id = ?'

  try {
    const [row] = await conn.query<ResultSetHeader>(query, [id])

    if (row.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
