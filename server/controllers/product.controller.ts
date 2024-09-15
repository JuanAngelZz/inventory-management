import { Request, Response } from 'express'
import conn from '../db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { Product } from '../interfaces/product.interface'
import { format, parse } from '@formkit/tempo'

export const getProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const query = `
    SELECT productos.*, categorias.nombre AS categoria_nombre
    FROM productos
    JOIN categorias ON productos.categoria_id = categorias.id
  `

  try {
    const [rows] = await conn.query<RowDataPacket[]>(query)

    const products = rows.map((product) => {
      return {
        ...product,
        fecha_adquisicion: format(
          new Date(product.fecha_adquisicion),
          'YYYY-MM-DD'
        ),
        fecha_vencimiento: format(
          new Date(product.fecha_vencimiento),
          'YYYY-MM-DD'
        )
      }
    })

    return res.json(products)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const getProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const query = 'SELECT * FROM productos WHERE id = ?'

  try {
    const [row] = await conn.query<RowDataPacket[]>(query, [id])

    if (row.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.json(row[0])
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const createProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const product: Product = req.body

  const dateAd: string = new Date(product.fecha_adquisicion).toISOString()

  product.fecha_adquisicion = new Date(product.fecha_adquisicion)
    ? parse(dateAd)
    : new Date()

  const dateVe: string = new Date(product.fecha_vencimiento).toISOString()

  product.fecha_vencimiento = new Date(product.fecha_vencimiento)
    ? parse(dateVe)
    : new Date()

  const query = 'INSERT INTO productos SET ?'

  try {
    await conn.query<RowDataPacket[]>(query, product)

    return res.sendStatus(201)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const product: Product = req.body

  // Filtrar solo los campos proporcionados
  const fields = Object.entries(product).filter(
    ([_, value]) => value !== undefined
  )

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' })
  }

  // Construir la consulta SQL dinámicamente
  const query = `UPDATE productos SET ${fields
    .map(([key]) => `${key} = ?`)
    .join(', ')} WHERE id = ?`
  const values = fields.map(([_, value]) => value)

  try {
    const [result] = await conn.query<ResultSetHeader>(query, [...values, id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const query = 'DELETE FROM productos WHERE id = ?'

  try {
    const [row] = await conn.query<ResultSetHeader>(query, [id])

    if (row.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
