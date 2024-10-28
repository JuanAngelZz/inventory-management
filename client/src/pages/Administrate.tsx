import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import userpng from '../assets/User.png'
import drivepng from '../assets/Drive.png'
import migratepng from '../assets/Migrate.png'

const Administrate = () => {
  const navigate = useNavigate()

  return (
    <>
      <header className='mb-8'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          Administrar el sistema
        </h1>
      </header>
      <section className='container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        <Card className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
          <CardHeader className='relative'>
            <img
              src={userpng}
              alt='Elegant Watch'
              className='w-full h-48 object-scale-down'
            />
          </CardHeader>
          <CardContent className='p-4 flex-grow'>
            <CardTitle className='text-xl font-semibold mb-2'>
              Usuarios
            </CardTitle>
            <CardDescription className='text-gray-700 mb-4'>
              Gestionar los usuarios del sistema
            </CardDescription>
          </CardContent>
          <CardFooter className='p-4 bg-gray-100'>
            <Button onClick={() => navigate('users')} className='w-full'>
              Ir
            </Button>
          </CardFooter>
        </Card>

        <Card className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
          <CardHeader className='relative'>
            <img
              src={drivepng}
              alt='Elegant Watch'
              className='w-full h-48 object-scale-down'
            />
          </CardHeader>
          <CardContent className='p-4 flex-grow'>
            <CardTitle className='text-xl font-semibold mb-2'>
              Respaldo
            </CardTitle>
            <CardDescription className='text-gray-700 mb-4'>
              Realizar respaldo de la base de datos
            </CardDescription>
          </CardContent>
          <CardFooter className='p-4 bg-gray-100'>
            <Button onClick={() => navigate('backup')} className='w-full'>
              Ir
            </Button>
          </CardFooter>
        </Card>

        <Card className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
          <CardHeader className='relative'>
            <img
              src={migratepng}
              alt='Elegant Watch'
              className='w-full h-48 object-scale-down'
            />
          </CardHeader>
          <CardContent className='p-4 flex-grow'>
            <CardTitle className='text-xl font-semibold mb-2'>Migrar</CardTitle>
            <CardDescription className='text-gray-700 mb-4'>
              Migrar la base de datos
            </CardDescription>
          </CardContent>
          <CardFooter className='p-4 bg-gray-100'>
            <Button onClick={() => navigate('migrate')} className='w-full'>
              Ir
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}

export default Administrate
