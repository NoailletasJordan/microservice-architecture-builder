import { showNotificationError } from '@/contants'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function onError(error: Error | string) {
  showNotificationError({
    message: `Something went wrong: ${
      error instanceof Error ? error.message : error
    }`,
  })
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError,
  }),
  mutationCache: new MutationCache({
    onError,
  }),
})

interface Props {
  children: React.ReactNode
}

export function ReactQueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
