import { Request, Response } from 'express'
import conn from '../db'
import { RowDataPacket } from 'mysql2'
import { format } from '@formkit/tempo'
import { Movement } from '../interfaces/models.interface'

export const getMovements = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const query = `
    SELECT movimientos.*, productos.nombre AS producto_nombre 
    FROM movimientos
    JOIN productos ON movimientos.producto_id = productos.producto_id
    ORDER BY movimientos.movimiento_id DESC
  `

  try {
    const [rows] = await conn.query<RowDataPacket[]>(query)

    const movements = rows.map((movement) => {
      return {
        ...movement,
        fecha: format(
          new Date(movement.fecha),
          {
            date: 'medium',
            time: 'short'
          },
          'es'
        )
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
  const query = 'SELECT * FROM movimientos WHERE movimiento_id = ?'

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
  let movement: Movement = {} as Movement

  const product = body.producto_nombre

  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM productos WHERE nombre = ?',
      [product]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    movement = {
      tipo: body.tipo,
      cantidad: body.cantidad,
      fecha:
        format(body.fecha, 'YYYY-MM-DD HH:mm') || new Date().toDateString(),
      producto_id: rows[0].producto_id
    }
  } catch (error) {
    return res.status(500).json({ error })
  }

  const query = 'INSERT INTO movimientos SET ?'

  try {
    await conn.query<RowDataPacket[]>(query, movement)

    if (movement.tipo === 'salida') {
      const queryStock =
        'UPDATE productos SET stock = stock - ? WHERE producto_id = ?'
      await conn.query<RowDataPacket[]>(queryStock, [
        movement.cantidad,
        movement.producto_id
      ])
    }

    if (movement.tipo === 'entrada') {
      const queryStock =
        'UPDATE productos SET stock = stock + ? WHERE producto_id = ?'
      await conn.query<RowDataPacket[]>(queryStock, [
        movement.cantidad,
        movement.producto_id
      ])
    }

    return res.sendStatus(201)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

// export const updateMovement = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { id } = req.params
//   const movement: Movement = req.body
//   const query = 'UPDATE movimientos SET ? WHERE id = ?'

//   try {
//     const [row] = await conn.query<ResultSetHeader>(query, [movement, id])

//     if (row.affectedRows === 0) {
//       return res.status(404).json({ error: 'Movement not found' })
//     }

//     return res.sendStatus(204)
//   } catch (error) {
//     return res.status(500).json({ error })
//   }
// }

// export const deleteMovement = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { id } = req.params
//   const query = 'DELETE FROM movimientos WHERE id = ?'

//   try {
//     const [row] = await conn.query<ResultSetHeader>(query, [id])

//     if (row.affectedRows === 0) {
//       return res.status(404).json({ error: 'Movement not found' })
//     }

//     return res.sendStatus(204)
//   } catch (error) {
//     return res.status(500).json({ error })
//   }
// }
