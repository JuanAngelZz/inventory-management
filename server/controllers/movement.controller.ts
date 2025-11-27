import { Request, Response } from 'express'
import conn from '../db'
import { RowDataPacket } from 'mysql2'
import { format } from '@formkit/tempo'


export const getMovements = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const query = `
    SELECT movimientos.*, productos.nombre AS producto_nombre 
    FROM movimientos
    JOIN productos ON movimientos.producto_id = productos.id
    ORDER BY movimientos.id DESC
  `

  try {
    const [rows] = await conn.query<RowDataPacket[]>(query)

    const movements = rows.map((movement) => {
      return {
        ...movement
      }
    })

    return res.json(movements)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const getMovement = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params
  const query = 'SELECT * FROM movimientos WHERE id = ?'

  try {
    const [row] = await conn.query<RowDataPacket[]>(query, [id])

    if (row.length === 0) {
      return res.status(404).json({ error: 'Movement not found' })
    }

    const movement = row[0]

    return res.json(movement)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const createMovement = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req
  const { producto_nombre, tipo, cantidad, fecha } = body

  // 1. Obtener una conexión del pool
  const connection = await conn.getConnection()

  try {
    // 2. Iniciar la transacción
    await connection.beginTransaction()

    // 3. Obtener el ID y stock del producto
    const [productRows] = await connection.query<RowDataPacket[]>(
      'SELECT id, stock FROM productos WHERE nombre = ? FOR UPDATE',
      [producto_nombre]
    )

    if (productRows.length === 0) {
      await connection.rollback() // Revertir si el producto no existe
      return res.status(404).json({ error: 'Product not found' })
    }

    const productData = productRows[0]
    const { id: producto_id, stock } = productData

    // 4. Validar stock para salidas
    if (tipo === 'salida' && cantidad > stock) {
      await connection.rollback() // Revertir si no hay stock
      return res
        .status(400)
        .json({ error: 'No hay suficiente stock disponible' })
    }

    // 5. Insertar el movimiento
    const movement = {
      tipo,
      cantidad,
      fecha: format(fecha, 'YYYY-MM-DD HH:mm') || new Date(),
      producto_id
    }
    await connection.query('INSERT INTO movimientos SET ?', movement)

    // 6. Actualizar el stock del producto
    const newStock = tipo === 'salida' ? stock - cantidad : stock + cantidad
    await connection.query('UPDATE productos SET stock = ? WHERE id = ?', [
      newStock,
      producto_id
    ])

    // 7. Confirmar la transacción
    await connection.commit()

    return res.sendStatus(201)
  } catch (error) {
    // 8. Si algo falla, revertir todo
    await connection.rollback()
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    // 9. Liberar la conexión para que otros la usen
    connection.release()
  }
}
