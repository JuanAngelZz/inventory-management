import { useState } from 'react'
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
import { Slash, Database, AlertTriangle, Upload, CheckCircle2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { restoreDatabase } from '@/api/migrate'

const Migrate = () => {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleRestore = async () => {
    if (!file) return

    setIsRestoring(true)
    try {
      await restoreDatabase(file)
      toast({
        title: 'Restauración exitosa',
        description: 'La base de datos ha sido restaurada correctamente.'
      })
      setFile(null)
    } catch (error) {
      console.error('Error al restaurar:', error)
      toast({
        variant: 'destructive',
        title: 'Error en la restauración',
        description: 'No se pudo completar la operación. Verifique el archivo.'
      })
    } finally {
      setIsRestoring(false)
    }
  }

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

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" /> Cargar Archivo de Respaldo
            </CardTitle>
            <CardDescription>Seleccione un archivo .sql para restaurar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors relative">
              <input 
                type="file" 
                accept=".sql"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex flex-col items-center text-green-600">
                  <CheckCircle2 className="h-10 w-10 mb-2" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <>
                  <Database className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Arrastre su archivo aquí o haga clic para buscar</p>
                  <p className="text-xs text-muted-foreground mt-1">Soporta archivos .sql (Max 50MB)</p>
                </>
              )}
            </div>
            
            <Button 
              className="w-full" 
              disabled={!file || isRestoring}
              onClick={handleRestore}
            >
              {isRestoring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Restaurando...
                </>
              ) : (
                'Restaurar Base de Datos'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Migrate
