import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Database, 
  FileText, 
  HardDriveDownload, 

  ArrowRight
} from 'lucide-react'

const Administrate = () => {
  const navigate = useNavigate()

  const AdminCard = ({ title, description, icon: Icon, path, iconColor, bgColor }: any) => (
    <Card 
      className="group hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-md"
      onClick={() => navigate(path)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <CardTitle className="mt-4 text-xl">{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
    </Card>
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
          Panel de Administración
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestión de usuarios, mantenimiento del sistema y reportes.
        </p>
      </header>

      <section className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <AdminCard 
          title="Gestión de Usuarios" 
          description="Administrar cuentas, roles y permisos de acceso al sistema." 
          icon={Users} 
          path="users"
          iconColor="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        
        <AdminCard 
          title="Reportes y Analíticas" 
          description="Generar reportes detallados de inventario y movimientos." 
          icon={FileText} 
          path="report"
          iconColor="text-purple-500"
          bgColor="bg-purple-500/10"
        />

        <AdminCard 
          title="Respaldo de Datos" 
          description="Crear copias de seguridad de la base de datos." 
          icon={HardDriveDownload} 
          path="backup"
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />

        <AdminCard 
          title="Restauración" 
          description="Restaurar el sistema desde un punto anterior." 
          icon={Database} 
          path="migrate"
          iconColor="text-orange-500"
          bgColor="bg-orange-500/10"
        />
      </section>
    </div>
  )
}

export default Administrate
