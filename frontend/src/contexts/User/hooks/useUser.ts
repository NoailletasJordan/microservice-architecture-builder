import { useLocalStorage } from '@mantine/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AUTH_TOKEN_KEY, BackendQueryResponse, IUser } from '../constants'

export function useUser({ removeAuthToken }: { removeAuthToken: () => void }) {
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })
  const queryClient = useQueryClient()

  const userQuery = useQuery<BackendQueryResponse<IUser>>({
    enabled: !!authToken,
    queryKey: ['user', authToken],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (!res.ok) throw new Error('Failed to fetch user')
      const result = await res.json()
      return result
    },
    staleTime: Infinity,
  })

  if (userQuery.isError) {
    queryClient.setQueryData(['user', authToken], undefined)
    removeAuthToken()
  }

  const isLogged = Boolean(
    userQuery.data && !('error' in userQuery.data) && !!userQuery.data?.id,
  )

  return {
    userQuery,
    isLogged,
  }
}
