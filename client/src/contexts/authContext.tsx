import { User } from '@/interfaces/models'
import { AuthContextProps } from '@/interfaces/props'
import {
  createContext,
  ProviderProps,
  useContext,
  useEffect,
  useState
} from 'react'
import { login, verify } from '@/api/auth'
import { ErrorState } from '@/interfaces/api'

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export const AuthContextProvider = ({
  children
}: ProviderProps<JSX.Element>) => {
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<User>({} as User)
  const [errors, setErrors] = useState<ErrorState>({} as ErrorState)

  useEffect(() => {
    verifyUser()
  }, [])

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (errors?.error) {
      const timer = setTimeout(() => {
        setErrors({} as ErrorState)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [errors])

  const loginUser = async (user: User): Promise<boolean> => {
    try {
      const { data } = await login(user)

      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      setIsLogin(true)
      return true
    } catch (error) {
      const axiosError = error as ErrorState

      setErrors(axiosError.response?.data as ErrorState)
      return false
    }
  }

  const verifyUser = async () => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const { data } = await verify()
        setIsLogin(true)
        setUser(data.user)
      } catch (error) {
        console.log(error)
        setIsLogin(false)
      }
    }
    setLoading(false)
  }

  const logoutUser = () => {
    localStorage.removeItem('token')
    setIsLogin(false)
    setToken('')
    setUser({} as User)
  }

  const value: AuthContextProps = {
    isLogin,
    loading,
    token,
    user,
    errors,
    loginUser,
    verifyUser,
    logoutUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
