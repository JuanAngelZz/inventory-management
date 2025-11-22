import { useAuth } from '@/contexts/authContext'
import { Button } from './ui/button'
import {
  ChartColumnStacked,
  ChevronsLeftRightEllipsis,
  House,
  PackageSearch,
  Factory,
  MonitorCog,
  ChartArea,
  Sun,
  Moon,
  LogOut,
  User
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from './theme-provider'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Navbar = () => {
  const { user, logoutUser } = useAuth()
  const { setTheme } = useTheme()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link to={to}>
      <Button
        variant={isActive(to) ? 'secondary' : 'ghost'}
        className={`w-full justify-start text-lg font-medium ${
          isActive(to) 
            ? 'bg-primary/10 text-primary hover:bg-primary/20' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
        }`}
      >
        <Icon className='mr-3 h-5 w-5' /> {label}
      </Button>
    </Link>
  )

  return (
    <nav className='flex flex-col h-full w-full bg-slate-950 border-r border-slate-800'>
      {/* Logo Area */}
      <div className='p-6 border-b border-slate-800'>
        <div className='flex items-center gap-2'>
          <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
            <PackageSearch className='h-5 w-5 text-primary-foreground' />
          </div>
          <h1 className='text-xl font-bold text-slate-100 tracking-tight'>
            Inventario <span className='text-primary'>Inferfreitas C.A.</span>
          </h1>
        </div>
      </div>

      {/* Navigation Links */}
      <div className='flex-1 overflow-y-auto py-6 px-3 space-y-6'>
        
        {/* Section: Main */}
        <div className='space-y-1'>
          <h2 className='px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2'>
            Principal
          </h2>
          <NavItem to='/' icon={House} label='Panel de Control' />
          <NavItem to='/movements' icon={ChevronsLeftRightEllipsis} label='Movimientos' />
        </div>

        {/* Section: Management */}
        <div className='space-y-1'>
          <h2 className='px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2'>
            Gestión
          </h2>
          <NavItem to='/products' icon={PackageSearch} label='Productos' />
          <NavItem to='/suppliers' icon={Factory} label='Proveedores' />
          <NavItem to='/categories' icon={ChartColumnStacked} label='Categorías' />
        </div>

        {/* Section: Admin */}
        {user.rol === 'administrador' && (
          <div className='space-y-1'>
            <h2 className='px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2'>
              Administración
            </h2>
            <NavItem to='/administrate' icon={MonitorCog} label='Configuración' />
            <NavItem to='/charts' icon={ChartArea} label='Analíticas' />
          </div>
        )}
      </div>

      {/* User Profile & Footer */}
      <div className='p-4 border-t border-slate-800 bg-slate-900/50'>
        <div className='flex items-center gap-3 mb-4 px-2'>
          <Avatar className='h-10 w-10 border-2 border-slate-700'>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.nombre}`} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-slate-200 truncate'>{user.nombre}</p>
            <p className='text-xs text-slate-500 truncate capitalize'>{user.rol}</p>
          </div>
        </div>

        <div className='flex gap-2'>
          <div className='flex bg-slate-800 rounded-md p-1'>
            <Button 
              variant='ghost' 
              size='icon' 
              className='h-8 w-8 text-slate-400 hover:text-slate-100'
              onClick={() => setTheme('light')}
            >
              <Sun className='h-4 w-4' />
            </Button>
            <Button 
              variant='ghost' 
              size='icon' 
              className='h-8 w-8 text-slate-400 hover:text-slate-100'
              onClick={() => setTheme('dark')}
            >
              <Moon className='h-4 w-4' />
            </Button>
          </div>
          <Button 
            variant='destructive' 
            size='icon' 
            className='h-10 w-10 ml-auto'
            onClick={() => logoutUser()}
          >
            <LogOut className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
