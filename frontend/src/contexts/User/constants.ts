import { createContext } from 'react'
import { useUser } from './hooks'

export type BackendQueryResponse<T> =
  | (T & { error?: undefined })
  | {
      error: string
    }

export interface IUser {
  id: string
  username: string
  provider: string
  created_at: string
}

export interface IUserContext {
  isLogged: boolean
  userQuery?: ReturnType<typeof useUser>
  authToken?: string
  handleLogout: () => void
  handlePushToGoogleOauth: () => void
}

export const TOKEN_PREFIX = '#auth-token='
export const AUTH_TOKEN_KEY = 'auth-token'

export const userContext = createContext<IUserContext>({
  isLogged: false,
  userQuery: undefined,
  authToken: undefined,
  handleLogout: () => {},
  handlePushToGoogleOauth: () => {},
})

export const handlePushToGoogleOauth = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`
}
