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
  handlePushToGoogleOauth: () => void
}

export const AuthContext = createContext<IAuthContext>({
  isLogged: false,
  user: undefined,
  handleLogout: () => {},
  handlePushToGoogleOauth: () => {},
})

export {}
