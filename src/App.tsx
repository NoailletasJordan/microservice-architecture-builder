import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import './global.css'

import {
  ActionIcon,
  Button,
  CloseButton,
  MantineProvider,
  Text,
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
      <MantineProvider theme={theme} forceColorScheme="light">
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
  primaryColor: 'indigo',
  components: {
    Text: Text.extend({
      defaultProps: {
        size: 'xs',
      },
    }),
    Button: Button.extend(preventActiveTranslate),
    ActionIcon: ActionIcon.extend(preventActiveTranslate),
    CloseButton: CloseButton.extend(preventActiveTranslate),
  },
})
