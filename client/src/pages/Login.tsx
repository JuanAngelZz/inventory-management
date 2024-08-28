import LoginForm from '@/components/LoginForm'
import { useAuth } from '@/contexts/authContext'
import { Navigate } from 'react-router-dom'
import logo from '../assets/Mockup_Logo_y_Tarjeta_Visita_mockupgratis.com.jpg'

const Login = () => {
  const { isLogin } = useAuth()

  return isLogin ? (
    <Navigate to='/' />
  ) : (
    <main className='w-full h-screen grid grid-cols-8 gap-8 items-center justify-center'>
      <section className='col-span-4 h-screen'>
        <img src={logo} alt='' className='h-full w-full object-cover' />
      </section>
      <section className='col-span-4 h-screen flex flex-col items-center justify-center'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-10'>
          Sistema de Gestión de Inventario
        </h1>
        <LoginForm />
      </section>
    </main>
  )
}

export default Login
