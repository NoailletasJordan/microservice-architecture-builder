import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import './global.css'

import {
  ActionIcon,
  Autocomplete,
  Button,
  CloseButton,
  Divider,
  Kbd,
  MantineProvider,
  Menu,
  Select,
  Text,
  ThemeIcon,
  createTheme,
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { RichTextEditor } from '@mantine/tiptap'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import { CSSVAR, customColors, themeDarkColorVariables } from './contants'
import UserProvider from './contexts/User/UserProvider'
import UserBoardsProvider from './contexts/UserBoards/UserBoardsProvider'
import BoardPage from './pages/BoardPage'

const accessEnvVariable = (
  key:
    | 'VITE_POSTHOG_REVERSE_PROXY_URL'
    | 'VITE_POSTHOG_HOST'
    | 'VITE_POSTHOG_KEY',
) => {
  const fullEnvVar = import.meta.env[key]
  if (!fullEnvVar) throw new Error(`Environnement variable not set : ${key}`)

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

const queryClient = new QueryClient()

export default function App() {
  useEffect(() => {
    // Inject css colors in root
    Object.entries(themeDarkColorVariables).map(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }, [])

  return (
    <>
      <PostHogProvider
        apiKey={
          window.location.hostname.startsWith('localhost')
            ? ''
            : accessEnvVariable('VITE_POSTHOG_KEY')
        }
        options={options}
      >
        <div
          style={{
            background: CSSVAR['--background'],
            color: CSSVAR['--text'],
          }}
        >
          <ReactFlowProvider>
            <QueryClientProvider client={queryClient}>
              <UserProvider>
                <UserBoardsProvider>
                  <MantineProvider theme={theme}>
                    <RouterProvider router={router} />
                    <Notifications />
                  </MantineProvider>
                </UserBoardsProvider>
              </UserProvider>
            </QueryClientProvider>
          </ReactFlowProvider>
        </div>
      </PostHogProvider>
    </>
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
  primaryShade: 9,
  primaryColor: 'primary',
  colors: customColors as any,
  components: {
    RichTextEditor: RichTextEditor.extend({
      styles: (_theme) => ({
        controlsGroup: {
          backgroundColor: CSSVAR['--surface'],
        },
        control: {
          border: `1px solid ${CSSVAR['--border']}`,
        },
        content: {
          color: CSSVAR['--text'],
          backgroundColor: CSSVAR['--surface'],
          border: `1px solid ${CSSVAR['--border']}`,
          fontSize: 'var(--mantine-font-size-sm)',
        },
      }),
      vars: (theme) => ({
        content: {
          '--mantine-color-placeholder': theme.colors.gray[9],
        },
      }),
      classNames: {
        control: 'richtext-control-button_overwrite',
      },
    }),
    Button: Button.extend(preventActiveTranslate),
    CloseButton: CloseButton.extend(preventActiveTranslate),
    Text: Text.extend({ defaultProps: { c: CSSVAR['--text'] } }),
    ThemeIcon: ThemeIcon.extend({
      ...preventActiveTranslate,
      defaultProps: {
        color: CSSVAR['--surface-strong'],
        size: 'lg',
      },
    }),
    ActionIcon: ActionIcon.extend({
      ...preventActiveTranslate,
      defaultProps: {
        color: CSSVAR['--surface-strong'],
        size: 'lg',
      },
    }),
    Select: Select.extend({
      classNames: {
        input: 'select-input__overwrite',
        groupLabel: 'select-group-label__overwrite',
      },
      styles: (_theme) => ({
        groupLabel: {
          color: CSSVAR['--text'],
        },
        section: {
          color: CSSVAR['--text'],
        },
        dropdown: {
          backgroundColor: CSSVAR['--surface'],
          border: `1px solid ${CSSVAR['--border']}`,
          color: CSSVAR['--text-strong'],
        },
        input: {
          background: CSSVAR['--surface'],
          border: `1px solid ${CSSVAR['--border']}`,
          color: CSSVAR['--text'],
        },
      }),
    }),
    Autocomplete: Autocomplete.extend({
      styles: {
        input: {
          backgroundColor: CSSVAR['--surface-strong'],
          color: CSSVAR['--text'],
          borderColor: CSSVAR['--border'],
        },
      },
    }),
    Kbd: Kbd.extend({
      styles: {
        root: {
          backgroundColor: CSSVAR['--surface-strong'],
          color: CSSVAR['--text'],
        },
      },
    }),
    Divider: Divider.extend({
      defaultProps: {
        color: CSSVAR['--border'],
      },
    }),
    Notifications: Notifications.extend({
      styles: {
        notification: {
          backgroundColor: CSSVAR['--surface'],
          border: `1px solid ${CSSVAR['--border-strong']}`,
          text: CSSVAR['--text-strong'],
        },
      },
      classNames: {
        notification: 'notification_overwrite',
      },
    }),
    Menu: Menu.extend({
      styles: (_theme) => ({
        dropdown: {
          background: CSSVAR['--surface'],
          color: CSSVAR['--text'],
        },
        item: {
          color: CSSVAR['--text'],
        },
      }),
      classNames: {
        item: 'menu-item__overwrite',
      },
    }),
  },
  other: {
    customColors: CSSVAR,
  },
})
