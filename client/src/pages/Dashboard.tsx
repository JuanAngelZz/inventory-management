import ChatSupport from '@/components/ChatSupport'
import Navbar from '@/components/Navbar'
import { StockAlert } from '@/components/StockAlert'
import { useAuth } from '@/contexts/authContext'
import { Navigate, Outlet } from 'react-router-dom'

const Dashboard = () => {
  const { isLogin } = useAuth()

  return isLogin ? (
    <div
      className='w-full h-screen'
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'
      }}
    >
      <Navbar />
      <div style={{ gridArea: '1 / 3 / 9 / 11' }} className='bg-gray-100'>
      <StockAlert />
        <main className='p-10 h-screen flex flex-col'>
          <Outlet />
        </main>
      </div>
      <ChatSupport />
    </div>
  ) : (
    <Navigate to='/login' />
  )
}

export default Dashboard
