import ChatSupport from '@/components/ChatSupport'
import Navbar from '@/components/Navbar'
import { StockAlert } from '@/components/StockAlert'
import { useAuth } from '@/contexts/authContext'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  const { isLogin, loading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isLogin) return <Navigate to='/login' />

  return (
    <div className='flex h-screen w-full overflow-hidden bg-background'>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className='fixed inset-0 z-40 bg-black/50 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Navbar) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 transition-transform duration-300 ease-in-out md:static md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex justify-end p-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Mobile Header */}
        <header className='flex items-center justify-between bg-primary p-4 text-primary-foreground md:hidden'>
          <h1 className='text-xl font-bold'>Inventario</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="text-primary-foreground hover:bg-primary/90">
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        <main className='flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-10 dark:bg-background'>
          <StockAlert />
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatSupport />
    </div>
  )
}

export default Dashboard


