import { getApiUrl } from '@/contants'
import { readLocalStorageValue } from '@mantine/hooks'
import { createContext } from 'react'
import { useUser } from './hooks/useUser'

export type BackendQueryResponse<T> = T & {
  error?: string
}

export interface IUser {
  id: string
  username: string
  provider: string
  created_at: string
}

export interface IUserContext {
  isLogged: boolean
  userQuery?: ReturnType<typeof useUser>['userQuery']
  authToken?: string
  handleLogout: () => void
  handlePushToGoogleOauth: () => void
}

export const TOKEN_PREFIX = '#auth-token='
export const AUTH_TOKEN_KEY = 'auth-token'

export const userContext = createContext<IUserContext>({
  isLogged: false,
  userQuery: undefined,
  authToken: readLocalStorageValue({ key: AUTH_TOKEN_KEY }),
  handleLogout: () => {},
  handlePushToGoogleOauth: () => {},
})

export const handlePushToGoogleOauth = () => {
  window.location.href = `${getApiUrl()}/auth/google/login`
}
