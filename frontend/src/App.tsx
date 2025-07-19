import '@mantine/core/styles.css'
import '@mantine/core/styles/baseline.css'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/global.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import './global.css'

import {
  ActionIcon,
  Button,
  CloseButton,
  MantineProvider,
  createTheme,
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactFlowProvider } from '@xyflow/react'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import {
  CSSVAR,
  customColors,
  getIsRanByPlaywright,
  themeDarkColorVariables,
} from './contants'
import BoardDataProvider from './contexts/BoardData/Provider'
import ConnexionPreviewProvider from './contexts/ConnexionPreview/Provider'
import { ReactQueryProvider } from './contexts/ReactQuery/Provider'
import UserProvider from './contexts/User/UserProvider'
import UserBoardsProvider from './contexts/UserBoards/Provider'
import BoardPage from './pages/BoardPage'

const accessEnvVariable = (
  key:
    | 'VITE_POSTHOG_REVERSE_PROXY_URL'
    | 'VITE_POSTHOG_HOST'
    | 'VITE_POSTHOG_KEY',
) => {
  const fullEnvVar = import.meta.env[key]

  return fullEnvVar
}

const options = {
  api_host: accessEnvVariable('VITE_POSTHOG_REVERSE_PROXY_URL'),
  ui_host: accessEnvVariable('VITE_POSTHOG_HOST'),
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<BoardPage />} />
    </Route>,
  ),
)

export default function App() {
  useEffect(() => {
    // Inject css colors in root
    Object.entries(themeDarkColorVariables).map(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }, [])

  return (
    <div
      style={{
        background: CSSVAR['--background'],
        color: CSSVAR['--text'],
      }}
    >
      <PostHogProvider
        apiKey={
          window.location.hostname.startsWith('localhost')
            ? ''
            : accessEnvVariable('VITE_POSTHOG_KEY')
        }
        options={options}
      >
        <ReactFlowProvider>
          <ReactQueryProvider>
            <UserProvider>
              <UserBoardsProvider>
                <BoardDataProvider>
                  <ConnexionPreviewProvider>
                    <MantineProvider theme={theme} forceColorScheme="dark">
                      <RouterProvider router={router} />
                      <Notifications />
                    </MantineProvider>
                  </ConnexionPreviewProvider>
                </BoardDataProvider>
              </UserBoardsProvider>
            </UserProvider>
            {!getIsRanByPlaywright() &&
              process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools
                  buttonPosition="top-right"
                  initialIsOpen={false}
                />
              )}
          </ReactQueryProvider>
        </ReactFlowProvider>
      </PostHogProvider>
    </div>
  )
}

const preventActiveTranslate = {
  styles: {
    root: {
      transform: 'none',
    },
  },
}

const theme = createTheme({
  primaryShade: 7,
  primaryColor: 'primary',
  colors: customColors as any,
  components: {
    Button: Button.extend(preventActiveTranslate),
    CloseButton: CloseButton.extend(preventActiveTranslate),
    ActionIcon: ActionIcon.extend(preventActiveTranslate),
  },
  other: {
    customColors: CSSVAR,
  },
})
