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
import productpng from '../assets/Product.png'
import categorypng from '../assets/Category.png'
import movementpng from '../assets/Movement.jpeg'

const Home = () => {
  const navigate = useNavigate()

  return (
    <>
      <header className='mb-8'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          Dashboard
        </h1>
      </header>
      <section className='container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        <Card className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
          <CardHeader className='relative'>
            <img
              src={productpng}
              alt='Elegant Watch'
              className='w-full h-48 object-scale-down'
            />
          </CardHeader>
          <CardContent className='p-4 flex-grow'>
            <CardTitle className='text-xl font-semibold mb-2'>
              Productos
            </CardTitle>
            <CardDescription className='text-gray-700 mb-4'>
              Gestionar los productos del inventario
            </CardDescription>
          </CardContent>
          <CardFooter className='p-4 bg-gray-100'>
            <Button onClick={() => navigate('/products')} className='w-full'>
              Ir
            </Button>
          </CardFooter>
        </Card>

        <Card className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
          <CardHeader className='relative'>
            <img
              src={movementpng}
              alt='Elegant Watch'
              className='w-full h-48 object-scale-down'
            />
          </CardHeader>
          <CardContent className='p-4 flex-grow'>
            <CardTitle className='text-xl font-semibold mb-2'>
              Movimientos
            </CardTitle>
            <CardDescription className='text-gray-700 mb-4'>
              Gestionar los movimientos del inventario
            </CardDescription>
          </CardContent>
          <CardFooter className='p-4 bg-gray-100'>
            <Button onClick={() => navigate('/movements')} className='w-full'>
              Ir
            </Button>
          </CardFooter>
        </Card>

        <Card className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
          <CardHeader className='relative'>
            <img
              src={categorypng}
              alt='Elegant Watch'
              className='w-full h-48 object-scale-down'
            />
          </CardHeader>
          <CardContent className='p-4 flex-grow'>
            <CardTitle className='text-xl font-semibold mb-2'>
              Categorías
            </CardTitle>
            <CardDescription className='text-gray-700 mb-4'>
              Gestionar las categorías de los productos
            </CardDescription>
          </CardContent>
          <CardFooter className='p-4 bg-gray-100'>
            <Button onClick={() => navigate('/categories')} className='w-full'>
              Ir
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}

export default Home
