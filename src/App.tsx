import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import './global.css'

import {
  ActionIcon,
  AppShell,
  Button,
  Card,
  CloseButton,
  Divider,
  MantineProvider,
  MenuDropdown,
  ModalBody,
  ModalHeader,
  Notification,
  PopoverDropdown,
  Select,
  Text,
  Tooltip,
  createTheme,
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { StrictMode } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import BoardPage from './pages/BoardPage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        index
        element={
          <ReactFlowProvider>
            <BoardPage />
          </ReactFlowProvider>
        }
      />
    </Route>,
  ),
)

export default function App() {
  return (
    <StrictMode>
      <MantineProvider theme={theme} forceColorScheme="dark">
        <RouterProvider router={router} />
        <Notifications />
      </MantineProvider>
    </StrictMode>
  )
}

const preventActiveTranslate = {
  styles: {
    root: {
      transform: 'none',
    },
  },
}

const darkBackground = [
  '#ffffff',
  '#e7e7e8',
  '#cfcfd2',
  '#b6b8bb',
  '#9ea0a5',
  '#86888e',
  '#6e7077',
  '#565861',
  '#3d414a',
  '#252934',
  '#0d111d',
] as const

const theme = createTheme({
  colors: {
    text: [
      '#e9fbf7',
      '#d4f7ee',
      '#a8f0de',
      '#7de8cd',
      '#52e0bd',
      '#26d9ac',
      '#1fad8a',
      '#178267',
      '#0f5745',
      '#082b22',
      '#041611',
    ],
    primary: [
      '#e9eefb',
      '#d3def8',
      '#a8bcf0',
      '#7c9be9',
      '#517ae1',
      '#2558da',
      '#1e47ae',
      '#163583',
      '#0f2357',
      '#07122c',
      '#040916',
    ],
    background: darkBackground,
    dark: darkBackground,
  },
  primaryColor: 'primary',
  components: {
    AppShell: AppShell.extend({
      defaultProps: {
        bg: 'background.10',
        style: { '--text-color': 'var(--mantine-color-text-0)' },
      },
    }),
    Text: Text.extend({
      defaultProps: {
        size: 'xs',
        c: 'inherit',
      },
    }),
    Button: Button.extend(preventActiveTranslate),
    ActionIcon: ActionIcon.extend(preventActiveTranslate),
    CloseButton: CloseButton.extend(preventActiveTranslate),
    MenuDropdown: MenuDropdown.extend({
      defaultProps: {
        bg: 'background.9',
        fs: '600',
        style: {
          border: 'none',
          '--menu-item-hover': 'var(--mantine-color-background-8)',
        },
      },
    }),
    Divider: Divider.extend({ defaultProps: { color: 'background.7' } }),
    ModalHeader: ModalHeader.extend({
      defaultProps: { bg: 'background.9' },
    }),
    ModalBody: ModalBody.extend({
      defaultProps: { bg: 'background.9' },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: { color: 'background.8' },
    }),
    Card: Card.extend({
      defaultProps: { bg: 'background.9' },
    }),
    Select: Select.extend({
      styles: {
        input: {
          background: 'var(--mantine-color-background-8)',
          border: 'none',
        },
        dropdown: {
          border: 'none',
        },
      },
    }),
    PopoverDropdown: PopoverDropdown.extend({
      defaultProps: { bg: 'background.8' },
    }),
    Notification: Notification.extend({
      defaultProps: { bg: 'background.9' },
    }),
  },
})
