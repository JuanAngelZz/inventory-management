import { Request, Response } from 'express'
import pool from '../db'

export const getReportData = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type } = req.query

    let query = `
      SELECT 
        m.id as movimiento_id,
        m.fecha,
        m.tipo,
        m.cantidad,
        p.nombre as producto,
        p.precio_compra,
        p.precio_venta,
        CASE 
          WHEN m.tipo = 'entrada' THEN (m.cantidad * p.precio_compra)
          WHEN m.tipo = 'salida' THEN (m.cantidad * p.precio_venta)
        END as total_valor
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
      WHERE 1=1
    `

    const params: any[] = []

    if (startDate) {
      query += ' AND DATE(m.fecha) >= ?'
      params.push(startDate)
    }

    if (endDate) {
      query += ' AND DATE(m.fecha) <= ?'
      params.push(endDate)
    }

    if (type && type !== 'all') {
      query += ' AND m.tipo = ?'
      params.push(type)
    }

    query += ' ORDER BY m.fecha DESC'

    console.log('Executing Report Query:', query)
    console.log('Parameters:', params)

    const [rows]: any = await pool.query(query, params)

    console.log('Rows found:', rows.length)

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching report data' })
  }
}
