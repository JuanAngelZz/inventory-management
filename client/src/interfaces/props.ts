import { ErrorState } from './api'
import { User } from './models'

export interface AuthContextProps {
  isLogin: boolean
  token: string
  user: User
  errors: ErrorState

  loginUser: (user: User) => Promise<void>
  // registerUser: (user: User) => Promise<void>
  verifyUser: () => Promise<void>
  logoutUser: () => void
}

export interface HeaderProps {
  page: string
}

export interface MyTableHeadProps {
  filterValue: string
  onFilterChange: (value: string) => void
  placeholder?: string
  customButtonLabel?: string // Add custom button label
  url: string
}

export interface DeleteDialogProps {
  onDeleteItem: () => void
  description: string
}

export interface UpdateFormProps {
  id: number
  onClose: () => void
}
