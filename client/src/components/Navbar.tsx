import { useAuth } from '@/contexts/authContext'
import { Button } from './ui/button'
import {
  ChartColumnStacked,
  ChevronsLeftRightEllipsis,
  House,
  PackageSearch
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { user, logoutUser } = useAuth()

  return (
    <nav
      style={{ gridArea: '1 / 1 / 9 / 3' }}
      className='flex flex-col bg-slate-800 p-6'
    >
      <section>
        <h1 className='text-white text-center text-balance mb-4 scroll-m-20 border-b pb-2 text-3xl font-light tracking-tight first:mt-0'>
          Sistema de Gestión de Inventario
        </h1>
      </section>
      <div className='flex grow flex-col justify-between'>
        <ul className='flex flex-col gap-4'>
          <Link to='/'>
            <Button
              variant='ghost'
              className='w-full text-white text-lg font-bold'
            >
              <House className='mr-2 h-6 w-6' /> Inicio
            </Button>
          </Link>
          <Link to='/movements'>
            <Button
              variant='ghost'
              className='w-full text-white text-lg font-bold'
            >
              <ChevronsLeftRightEllipsis className='mr-2 h-6 w-6' /> Movimientos
            </Button>
          </Link>
          <Link to='/products'>
            <Button
              variant='ghost'
              className='w-full text-white text-lg font-bold'
            >
              <PackageSearch className='mr-2 h-6 w-6' /> Productos
            </Button>
          </Link>
          <Link to='/categories'>
            <Button
              variant='ghost'
              className='w-full text-white text-lg font-bold'
            >
              <ChartColumnStacked className='mr-2 h-6 w-6' /> Categorías
            </Button>
          </Link>
        </ul>
        <section>
          <p className='text-white leading-7 '>
            Usuario:{' '}
            <span className='text-sky-500 font-bold'>{user.nombre}</span>
          </p>
          <p className='text-white leading-7 '>
            Rol: <span className='text-sky-500 font-bold'>{user.rol}</span>
          </p>
          <Button
            onClick={() => logoutUser()}
            variant='outline'
            className='w-full mt-4 text-lg font-bold'
          >
            Cerrar Sesion
          </Button>
        </section>
      </div>
    </nav>
  )
}

export default Navbar
