import { createContext } from 'react'

export interface IUser {
  id: string
  username: string
  provider: string
  created_at: string
}

export interface IAuthContext {
  isLogged: boolean
  user?: IUser
  handleLogout: () => void
  handleLogin: () => void
}

export const AuthContext = createContext<IAuthContext>({
  isLogged: false,
  user: undefined,
  handleLogout: () => {},
  handleLogin: () => {},
})

export {}
