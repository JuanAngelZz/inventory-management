import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  Legend
} from 'recharts'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import Header from '@/components/Header'
import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '@/api/stats'
import StatCard from '@/components/StatCard'
import { DollarSign, Package, TrendingUp, AlertTriangle } from 'lucide-react'

export default function Charts() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  })

  const COLORS = [
    'hsl(var(--primary))',
    '#10b981',
    '#ef4444',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899'
  ]

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Cargando gráficos...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-destructive">Error al cargar los datos de la sección de gráficos.</p>
      </div>
    )
  }

  const { monthlyStats, categoryStats, kpis, topProducts } = stats

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <div className="space-y-6 pb-8">
      <Header page="Análisis de Gráficos" />
      
      {/* KPI Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ingresos Totales" 
          value={formatCurrency(kpis.totalRevenue)} 
          icon={DollarSign}
          description="Ingresos históricos estimados"
          trend="up"
        />
        <StatCard 
          title="Ganancia Estimada" 
          value={formatCurrency(kpis.totalProfit)} 
          icon={TrendingUp}
          description="Margen de ganancia total"
          trend="up"
        />
        <StatCard 
          title="Productos Activos" 
          value={kpis.totalProducts} 
          icon={Package}
          description="Total en inventario"
        />
        <StatCard 
          title="Stock Bajo" 
          value={kpis.lowStock} 
          icon={AlertTriangle}
          description="Productos con < 10 unidades"
          trend="down"
          trendValue={kpis.lowStock > 0 ? "Atención requerida" : "Todo en orden"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Main Chart: Revenue Trend (Area Chart) */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tendencia de Ingresos</CardTitle>
            <CardDescription>Evolución de ventas y compras en los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`} 
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  name="Ventas"
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorVentas)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="compras" 
                  name="Compras"
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorCompras)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Secondary Chart: Top Products (Bar Chart) */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
            <CardDescription>Top 5 productos por volumen de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 12 }} 
                  interval={0}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="sales" name="Unidades Vendidas" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Third Chart: Inventory Distribution (Donut Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Inventario</CardTitle>
            <CardDescription>Valor del stock por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryStats.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fourth Chart: Cumulative Sales (Line Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Crecimiento Acumulado</CardTitle>
            <CardDescription>Progresión de ventas en el periodo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventasAcumuladas" 
                  name="Ventas Acumuladas"
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorAcumulado)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
