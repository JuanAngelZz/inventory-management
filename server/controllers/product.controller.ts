import { Request, Response } from 'express'
import conn from '../db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { format, parse } from '@formkit/tempo'
import { Product } from '../interfaces/models.interface'

export const getProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const query = `
    SELECT productos.*, 
           categorias.nombre AS categoria_nombre,
           proveedores.nombre AS proveedor_nombre
    FROM productos
    JOIN categorias ON productos.categoria_id = categorias.id
    JOIN proveedores ON productos.proveedor_id = proveedores.id
    ORDER BY productos.id DESC
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
  const query = `
    SELECT productos.*, 
           categorias.nombre AS categoria_nombre,
           proveedores.nombre AS proveedor_nombre
    FROM productos
    JOIN categorias ON productos.categoria_id = categorias.id
    JOIN proveedores ON productos.proveedor_id = proveedores.id
    WHERE productos.id = ?
  `

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
  const { body } = req
  let product: Product = {} as Product

  const category = body.categoria_nombre
  const supplier = body.proveedor_nombre

  try {
    // 1. Verificar si el producto ya existe
    const [existingProduct] = await conn.query<RowDataPacket[]>(
      'SELECT id FROM productos WHERE nombre = ?',
      [body.nombre]
    )

    if (existingProduct.length > 0) {
      return res.status(409).json({ error: 'El producto ya existe' })
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM categorias WHERE nombre = ?',
      [category]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    const [rows2] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM proveedores WHERE nombre = ?',
      [supplier]
    )

    if (rows2.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' })
    }

    product = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio_compra: body.precio_compra,
      precio_venta: body.precio_venta,
      stock: body.stock,
      fecha_adquisicion: body.fecha_adquisicion,
      fecha_vencimiento: body.fecha_vencimiento,
      categoria_id: rows[0].id,
      proveedor_id: rows2[0].id
    }

    const query = 'INSERT INTO productos SET ?'
    await conn.query<RowDataPacket[]>(query, product)

    return res.sendStatus(201)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const { body } = req
  let product: Product = {} as Product

  const category = body.categoria_nombre
  const supplier = body.proveedor_nombre

  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM categorias WHERE nombre = ?',
      [category]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    const [rows2] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM proveedores WHERE nombre = ?',
      [supplier]
    )

    if (rows2.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' })
    }

    product = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio_compra: body.precio_compra,
      precio_venta: body.precio_venta,
      stock: body.stock,
      fecha_adquisicion: body.fecha_adquisicion,
      fecha_vencimiento: body.fecha_vencimiento,
      categoria_id: rows[0].id,
      proveedor_id: rows2[0].id
    }
  } catch (error) {
    return res.status(500).json({ error })
  }

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
  
  try {
    // First delete related movements
    await conn.query('DELETE FROM movimientos WHERE producto_id = ?', [id])

    // Then delete the product
    const [row] = await conn.query<ResultSetHeader>('DELETE FROM productos WHERE id = ?', [id])

    if (row.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}
