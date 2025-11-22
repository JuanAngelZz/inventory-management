import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Slash, Database, AlertTriangle, Upload, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const Migrate = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Restauración del Sistema</h1>
        <Breadcrumb className="mt-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to='/'>Inicio</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
            <BreadcrumbLink asChild><Link to='/administrate'>Administrar</Link></BreadcrumbLink>
            <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
            <BreadcrumbItem><BreadcrumbPage>Restaurar</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Advertencia de Seguridad</AlertTitle>
        <AlertDescription>
          La restauración de la base de datos sobrescribirá todos los datos actuales. Asegúrese de tener un respaldo reciente antes de proceder.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" /> Cargar Archivo de Respaldo
            </CardTitle>
            <CardDescription>Seleccione un archivo .sql para restaurar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer">
              <Database className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Arrastre su archivo aquí o haga clic para buscar</p>
              <p className="text-xs text-muted-foreground mt-1">Soporta archivos .sql (Max 50MB)</p>
            </div>
            <Button className="w-full" disabled>
              Restaurar Base de Datos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" /> Herramientas Avanzadas
            </CardTitle>
            <CardDescription>Gestión directa a través de phpMyAdmin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para operaciones complejas o mantenimiento manual de la base de datos, puede acceder directamente a la interfaz de administración.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to='http://localhost/phpmyadmin' target='_blank'>
                Abrir phpMyAdmin <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Migrate
