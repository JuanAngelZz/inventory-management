import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Plus,
  Clock,
  DollarSign,
  Activity,
  FileText
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getDashboardStats, DashboardStats } from '@/api/stats'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const Home = () => {
  const navigate = useNavigate()
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  })

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const StatCard = ({ title, value, description, icon: Icon, color }: any) => (
    <Card className="border-l-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: color }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-muted-foreground`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <header>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
          Panel de Control
        </h1>
        <p className="text-muted-foreground mt-2">
          Resumen de actividad en tiempo real
        </p>
      </header>

      {/* Key Metrics Grid */}
      <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard 
          title="Ventas de Hoy" 
          value={`$${stats?.kpis.todaysSales.toLocaleString()}`} 
          description="Ingresos generados hoy" 
          icon={DollarSign}
          color="#3b82f6" // blue-500
        />
        <StatCard 
          title="Valor del Inventario" 
          value={`$${stats?.kpis.totalRevenue.toLocaleString()}`} // Using totalRevenue as proxy for value for now, or we could calculate value if available
          description="Valor estimado total" 
          icon={TrendingUp}
          color="#10b981" // emerald-500
        />
        <StatCard 
          title="Alertas de Stock" 
          value={stats?.kpis.lowStock} 
          description="Productos por agotarse" 
          icon={AlertTriangle}
          color="#ef4444" // red-500
        />
        <StatCard 
          title="Productos Activos" 
          value={stats?.kpis.totalProducts} 
          description="Total en catálogo" 
          icon={Package}
          color="#8b5cf6" // violet-500
        />
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity Feed */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Actividad Reciente
            </CardTitle>
            <CardDescription>Últimos movimientos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats?.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    activity.tipo === 'entrada' 
                      ? 'bg-green-100 border-green-200 text-green-600' 
                      : 'bg-red-100 border-red-200 text-red-600'
                  }`}>
                    {activity.tipo === 'entrada' ? <Plus className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.tipo === 'entrada' ? 'Entrada de' : 'Venta de'} {activity.producto}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.cantidad} unidades
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(activity.fecha), "d MMM, HH:mm", { locale: es })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts / Low Stock List */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Stock Crítico
            </CardTitle>
            <CardDescription>Productos que requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.nombre}</p>
                    <p className="text-xs text-muted-foreground">ID: #{item.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-destructive">{item.stock} un.</span>
                    <span className="inline-flex items-center rounded-full border border-destructive px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-destructive">
                      Bajo
                    </span>
                  </div>
                </div>
              ))}
              {stats?.lowStockItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Todo en orden. No hay alertas de stock.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => navigate('/movements/create')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nueva Venta / Entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <ArrowRight className="h-5 w-5" /> Registrar Movimiento
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => navigate('/products/create')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Catálogo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <Plus className="h-5 w-5" /> Agregar Producto
              </div>
            </CardContent>
          </Card>

          <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => navigate('/administrate/report')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <FileText className="h-5 w-5" /> Generar Reporte
              </div>
            </CardContent>
          </Card>

          <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => navigate('/suppliers/create')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Proveedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <Users className="h-5 w-5" /> Nuevo Proveedor
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Home
