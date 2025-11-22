import LoginForm from '@/components/LoginForm'
import { useAuth } from '@/contexts/authContext'
import { Navigate } from 'react-router-dom'
import { Package, Shield, TrendingUp, Users } from 'lucide-react'

const Login = () => {
  const { isLogin } = useAuth()

  return isLogin ? (
    <Navigate to='/' />
  ) : (
    <div className='min-h-screen w-full flex'>
      {/* Left Side - Branding & Visual */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900'>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className='relative z-10 flex flex-col justify-center px-12 text-white'>
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className='text-5xl font-bold mb-4 leading-tight'>
              Inferfreitas C.A.
            </h1>
            <p className="text-xl text-blue-100 mb-12">
              Sistema de Gestión de Inventario
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Control en Tiempo Real</h3>
                <p className="text-blue-100 text-sm">Monitorea tu inventario con datos actualizados al instante</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Seguridad Garantizada</h3>
                <p className="text-blue-100 text-sm">Tus datos protegidos con encriptación de nivel empresarial</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Gestión Colaborativa</h3>
                <p className="text-blue-100 text-sm">Trabaja en equipo con roles y permisos personalizados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className='text-3xl font-bold tracking-tight mb-2'>
              Inferfreitas C.A.
            </h1>
            <p className="text-muted-foreground">
              Sistema de Gestión de Inventario
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="mb-8">
              <h2 className='text-2xl font-bold tracking-tight mb-2'>
                Bienvenido de nuevo
              </h2>
              <p className="text-muted-foreground">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <LoginForm />

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-center text-sm text-muted-foreground">
                © 2025 Inferfreitas C.A. Todos los derechos reservados.
              </p>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Problemas para acceder? Contacta al administrador del sistema
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Login
