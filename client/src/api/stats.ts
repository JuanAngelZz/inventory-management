import axios from './axios'

export const getDashboardStats = async () => {
  const res = await axios.get('/stats/dashboard')
  return res.data
}

export interface DashboardStats {
  monthlyStats: {
    month: string
    ventas: number
    compras: number
    ventasAcumuladas: number
  }[]
  categoryStats: {
    name: string
    value: number
  }[]
  kpis: {
    totalRevenue: number
    totalProfit: number
    totalProducts: number
    lowStock: number
    todaysSales: number
  }
  topProducts: {
    name: string
    sales: number
  }[]
  recentActivity: {
    id: number
    tipo: 'entrada' | 'salida'
    cantidad: number
    fecha: string
    producto: string
  }[]
  lowStockItems: {
    id: number
    nombre: string
    stock: number
  }[]
}
