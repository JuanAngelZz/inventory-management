import LoginForm from '@/components/LoginForm'
import { useAuth } from '@/contexts/authContext'
import { Navigate } from 'react-router-dom'

const Login = () => {
  const { isLogin } = useAuth()

  return isLogin ? (
    <Navigate to='/' />
  ) : (
    <main className='w-full h-screen flex flex-col gap-8 items-center justify-center'>
      <h1 className='scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl'>
        Inversiones Inferfreitas C.A.
      </h1>
      <LoginForm />
    </main>
  )
}

export default Login
