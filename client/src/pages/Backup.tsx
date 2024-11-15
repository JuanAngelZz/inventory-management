import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Slash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import drivepng from '../assets/Drive.png'
import { createBackup } from '@/api/backup'

const Backup = () => {
  const { toast } = useToast()

  const [progress, setProgress] = useState(0)

  // useEffect(() => {
  //   const timer = setTimeout(() => setProgress(66), 500)
  //   return () => clearTimeout(timer)
  // }, [])

  const handleBackup = async () => {
    try {
      setProgress(1)
      await createBackup()
      toast({
        title: 'Respaldo realizado',
        description: 'Se ha realizado el respaldo de la base de datos'
      })
    } catch (error) {
      console.error('Error al realizar el respaldo:', error)
    } finally {
      setTimeout(() => setProgress(100), 500)
    }
  }

  return (
    <>
      <header className='mb-4'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Respaldo
        </h1>
        <section>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to='/'>Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink asChild>
                <Link to='/administrate'>Administrar</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Respaldo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
      </header>
      <main className='w-full h-screen flex flex-col items-center justify-center'>
        <Card className='w-[600px]'>
          <CardHeader>
            <h3 className='text-lg font-semibold text-center'>
              Realizar respaldo
            </h3>
            <img src={drivepng} className='w-full h-48 object-scale-down' />
          </CardHeader>
          <CardContent>
            <div className='flex justify-center'>
              <Button
                onClick={handleBackup}
                className='bg-green-600 hover:bg-green-700'
              >
                Iniciar
              </Button>
            </div>
            <div className='flex justify-center mt-4'>
              <Progress value={progress} className='w-[80%]' />
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}

export default Backup
