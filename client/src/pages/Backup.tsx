import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Slash, HardDrive, CheckCircle2, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createBackup } from '@/api/backup'

const Backup = () => {
  const { toast } = useToast()
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'backing_up' | 'completed' | 'error'>('idle')

  const handleBackup = async () => {
    try {
      setStatus('backing_up')
      setProgress(10)
      
      // Simulate progress steps
      setTimeout(() => setProgress(40), 800)
      setTimeout(() => setProgress(70), 1500)

      await createBackup()
      
      setProgress(100)
      setStatus('completed')
      toast({
        title: 'Respaldo exitoso',
        description: 'La base de datos ha sido respaldada correctamente.'
      })
    } catch (error) {
      setStatus('error')
      console.error('Error al realizar el respaldo:', error)
      toast({
        variant: 'destructive',
        title: 'Error en el respaldo',
        description: 'No se pudo completar la operación.'
      })
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Respaldo del Sistema</h1>
        <Breadcrumb className="mt-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to='/'>Inicio</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
            <BreadcrumbLink asChild><Link to='/administrate'>Administrar</Link></BreadcrumbLink>
            <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
            <BreadcrumbItem><BreadcrumbPage>Respaldo</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" /> Estado del Sistema
            </CardTitle>
            <CardDescription>Información sobre el almacenamiento y copias.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Último Respaldo</span>
              </div>
              <span className="text-sm text-muted-foreground">Hoy, 10:30 AM</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Estado de BD</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Saludable</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Realizar Copia de Seguridad</CardTitle>
            <CardDescription>Generar un nuevo archivo de respaldo SQL.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'backing_up' ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Procesando...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            ) : (
              <div className="text-center py-4">
                <Button 
                  size="lg" 
                  onClick={handleBackup} 
                  className="w-full md:w-auto"
                  disabled={status === 'backing_up'}
                >
                  <HardDrive className="mr-2 h-4 w-4" /> Iniciar Respaldo
                </Button>
              </div>
            )}
            
            {status === 'completed' && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Respaldo completado exitosamente.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Respaldos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <HardDrive className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">backup_2025_11_{20-i}.sql</p>
                    <p className="text-xs text-muted-foreground">Tamaño: 4.2 MB</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Nov {20-i}, 2025</p>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">Descargar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Backup
