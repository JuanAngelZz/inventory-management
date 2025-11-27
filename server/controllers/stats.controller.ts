import { Request, Response } from 'express'
import pool from '../db'

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Monthly Sales vs Purchases (Last 6 Months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    sixMonthsAgo.setDate(1) // Start of the month

    const [movements]: any = await pool.query(`
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m') as month_key,
        DATE_FORMAT(fecha, '%b') as month_label,
        SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE 0 END) as compras,
        SUM(CASE WHEN tipo = 'salida' THEN cantidad ELSE 0 END) as ventas
      FROM movimientos
      WHERE fecha >= ?
      GROUP BY month_key, month_label
      ORDER BY month_key ASC
    `, [sixMonthsAgo])

    // Calculate cumulative sales
    let runningTotal = 0
    const monthlyStats = movements.map((m: any) => {
      runningTotal += Number(m.ventas)
      return {
        month: m.month_label,
        ventas: Number(m.ventas),
        compras: Number(m.compras),
        ventasAcumuladas: runningTotal
      }
    })

    // 2. Inventory Distribution by Category
    const [categoryStats]: any = await pool.query(`
      SELECT 
        c.nombre as name,
        SUM(p.stock) as value
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      GROUP BY c.id, c.nombre
      HAVING value > 0
      ORDER BY value DESC
      LIMIT 5
    `)

    // 3. KPIs
    // Total Revenue
    const [revenueResult]: any = await pool.query(`
      SELECT SUM(m.cantidad * p.precio_venta) as totalRevenue
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
      WHERE m.tipo = 'salida'
    `)
    const totalRevenue = Number(revenueResult[0].totalRevenue) || 0

    // Total Profit
    const [costResult]: any = await pool.query(`
      SELECT SUM(m.cantidad * p.precio_compra) as totalCost
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
      WHERE m.tipo = 'salida'
    `)
    const totalCost = Number(costResult[0].totalCost) || 0
    const totalProfit = totalRevenue - totalCost

    // Total Products
    const [productsCount]: any = await pool.query('SELECT COUNT(*) as count FROM productos')
    const totalProducts = productsCount[0].count

    // Low Stock Count
    const [lowStockCount]: any = await pool.query('SELECT COUNT(*) as count FROM productos WHERE stock < 10')
    const lowStock = lowStockCount[0].count

    // 4. Top Selling Products
    const [topProducts]: any = await pool.query(`
      SELECT 
        p.nombre as name,
        SUM(m.cantidad) as sales
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
      WHERE m.tipo = 'salida'
      GROUP BY p.id, p.nombre
      ORDER BY sales DESC
      LIMIT 5
    `)

    // 5. Recent Activity (New)
    const [recentActivity]: any = await pool.query(`
      SELECT 
        m.id,
        m.tipo,
        m.cantidad,
        m.fecha,
        p.nombre as producto
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
      ORDER BY m.id DESC
      LIMIT 5
    `)

    // 6. Low Stock Items List (New)
    const [lowStockItems]: any = await pool.query(`
      SELECT id, nombre, stock 
      FROM productos 
      WHERE stock < 10 
      ORDER BY stock ASC 
      LIMIT 5
    `)

    // 7. Today's Sales (New)
    const [todaysSalesResult]: any = await pool.query(`
      SELECT SUM(m.cantidad * p.precio_venta) as total
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
      WHERE m.tipo = 'salida' AND DATE(m.fecha) = CURDATE()
    `)
    const todaysSales = Number(todaysSalesResult[0].total) || 0

    res.json({
      monthlyStats,
      categoryStats: categoryStats.map((c: any) => ({ ...c, value: Number(c.value) })),
      kpis: {
        totalRevenue,
        totalProfit,
        totalProducts,
        lowStock,
        todaysSales
      },
      topProducts: topProducts.map((p: any) => ({ ...p, sales: Number(p.sales) })),
      recentActivity,
      lowStockItems
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching dashboard stats' })
  }
}
