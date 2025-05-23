import { createContext } from 'react'

export interface TUserBoard {
  id: string
  title: string
}

export interface IUser {
  id: string
  username: string
  provider: string
  created_at: string
  boards?: TUserBoard[]
}

export interface TBoardModel {
  id: string
  title: string
  owner: string
  data: string
  created_at?: string
  share_fragment?: string
}

export interface IUserContext {
  isLogged: boolean
  user?: IUser
  authToken?: string
  handleLogout: () => void
  handlePushToGoogleOauth: () => void
}

export const userContext = createContext<IUserContext>({
  isLogged: false,
  user: undefined,
  authToken: undefined,
  handleLogout: () => {},
  handlePushToGoogleOauth: () => {},
})
