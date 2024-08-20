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
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<User>({} as User)
  const [errors, setErrors] = useState<ErrorState>({} as ErrorState)

  useEffect(() => {
    verifyUser()
  }, [])

  const loginUser = async (user: User) => {
    try {
      const { data } = await login(user)

      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      setIsLogin(true)
    } catch (error) {
      const axiosError = error as ErrorState

      setErrors(axiosError.response?.data as ErrorState)
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
  }

  const logoutUser = () => {
    localStorage.removeItem('token')
    setIsLogin(false)
    setToken('')
    setUser({} as User)
  }

  const value: AuthContextProps = {
    isLogin,
    token,
    user,
    errors,
    loginUser,
    verifyUser,
    logoutUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
