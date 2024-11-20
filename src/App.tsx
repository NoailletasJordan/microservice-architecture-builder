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
  Text,
  ThemeIcon,
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

const theme = createTheme({
  colors: {
    prim: [
      '#e9fbf6',
      '#d3f8ec',
      '#a8f0d9',
      '#7ce9c6',
      '#51e1b4',
      '#25daa1',
      '#1eae81',
      '#168360',
      '#0f5740',
      '#072c20',
      '#041610',
    ],
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
    background: [
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
    ],
    secondary: [
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
    accent: [
      '#ebe9fb',
      '#d8d3f8',
      '#b0a8f0',
      '#897ce9',
      '#6151e1',
      '#3a25da',
      '#2e1eae',
      '#231683',
      '#170f57',
      '#0c072c',
      '#060416',
    ],
  },
  primaryColor: 'secondary',
  components: {
    Text: Text.extend({
      defaultProps: {
        size: 'xs',
      },
    }),
    Button: Button.extend(preventActiveTranslate),
    ActionIcon: ActionIcon.extend(preventActiveTranslate),
    CloseButton: CloseButton.extend(preventActiveTranslate),
    MenuDropdown: MenuDropdown.extend({
      defaultProps: {
        bg: 'background.8',
        style: { '--menu-item-hover': 'var(--mantine-color-background-7)' },
      },
    }),
    Divider: Divider.extend({ defaultProps: { color: 'background.7' } }),
    ModalHeader: ModalHeader.extend({
      defaultProps: { bg: 'background' },
    }),
    ModalBody: ModalBody.extend({
      defaultProps: { bg: 'background' },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: { color: 'background.8' },
    }),
    Card: Card.extend({
      defaultProps: { bg: 'background.9' },
    }),
    ThemeIcon: ThemeIcon.extend({
      defaultProps: { bg: 'background.6' },
    }),
    AppShell: AppShell.extend({
      defaultProps: { bg: 'background.10', c: 'text.1' },
    }),
  },
})
