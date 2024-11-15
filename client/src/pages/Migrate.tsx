import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Slash } from 'lucide-react'
import { Link } from 'react-router-dom'
import migratepng from '../assets/Migrate.png'

const Migrate = () => {
  return (
    <>
      <header className='mb-4'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Restaurar
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
                <BreadcrumbPage>Restaurar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
      </header>
      <main className='w-full h-screen flex flex-col items-center justify-center'>
        <Card className='w-[600px]'>
          <CardHeader>
            <h3 className='text-lg font-semibold text-center'>
              Restaurar la base de datos
            </h3>
            <img src={migratepng} className='w-full h-48 object-scale-down' />
          </CardHeader>
          <CardContent>
            <div className='flex justify-center'>
              <Button asChild>
                <Link to='http://localhost/phpmyadmin' target='_blank'>
                  Ir a phpmyadmin
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}

export default Migrate
