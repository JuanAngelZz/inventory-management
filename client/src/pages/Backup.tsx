import { useState, useEffect } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Slash, HardDrive, CheckCircle2, Clock, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createBackup, getBackups, downloadBackup } from '@/api/backup'

interface BackupFile {
  name: string
  size: number
  date: string
}

const Backup = () => {
  const { toast } = useToast()
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'backing_up' | 'completed' | 'error'>('idle')
  const [backups, setBackups] = useState<BackupFile[]>([])

  const fetchBackups = async () => {
    try {
      const res = await getBackups()
      setBackups(res.data)
    } catch (error) {
      console.error('Error al obtener el historial:', error)
    }
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  const handleDownload = async (filename: string) => {
    try {
      const response = await downloadBackup(filename)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al descargar:', error)
      toast({
        variant: 'destructive',
        title: 'Error en la descarga',
        description: 'No se pudo descargar el archivo.'
      })
    }
  }

  const handleBackup = async () => {
    try {
      setStatus('backing_up')
      setProgress(10)
      
      // Simulate progress steps
      setTimeout(() => setProgress(40), 800)
      setTimeout(() => setProgress(70), 1500)

      const response = await createBackup()
      
      // Crear URL del blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Generar nombre del archivo con fecha
      const date = new Date()
      const fileName = `backup_${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}_${date.getDate().toString().padStart(2, '0')}.sql`
      
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      
      // Limpieza
      link.remove()
      window.URL.revokeObjectURL(url)
      
      setProgress(100)
      setStatus('completed')
      toast({
        title: 'Respaldo exitoso',
        description: 'La base de datos ha sido respaldada correctamente.'
      })
      fetchBackups() // Actualizar lista
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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
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
              <span className="text-sm text-muted-foreground">
                {backups.length > 0 ? formatDate(backups[0].date) : 'Nunca'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Estado de BD</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Saludable</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Respaldo Automático</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">Activo (00:00)</span>
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
            {backups.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No hay respaldos disponibles.</p>
            ) : (
              backups.map((backup) => (
                <div key={backup.name} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                      <HardDrive className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{backup.name}</p>
                      <p className="text-xs text-muted-foreground">Tamaño: {formatSize(backup.size)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{formatDate(backup.date)}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => handleDownload(backup.name)}
                    >
                      <Download className="h-3 w-3 mr-1" /> Descargar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Backup
