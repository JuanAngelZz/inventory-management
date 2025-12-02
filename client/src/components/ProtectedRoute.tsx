import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'

interface ProtectedRouteProps {
  isAllowed: boolean
  redirectTo?: string
  children?: React.ReactNode
}

export const ProtectedRoute = ({
  isAllowed,
  redirectTo = '/',
  children
}: ProtectedRouteProps) => {
  const { loading, isLogin } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!isLogin) {
    return <Navigate to='/login' replace />
  }

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
