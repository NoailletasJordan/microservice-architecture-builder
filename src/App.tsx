import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import './global.css'

import {
  ActionIcon,
  Button,
  CloseButton,
  MantineProvider,
  Menu,
  Select,
  Text,
  createTheme,
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { RichTextEditor } from '@mantine/tiptap'
import { CSSProperties, StrictMode } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import { CSSVAR, customColors, themeDarkColorVariables } from './contants'
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
      <div
        style={{
          ...(themeDarkColorVariables as CSSProperties),
          background: CSSVAR['--background'],
        }}
      >
        <MantineProvider theme={theme}>
          <RouterProvider router={router} />
          <Notifications />
        </MantineProvider>
      </div>
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
  primaryShade: 9,
  primaryColor: 'primary',
  colors: customColors as any,
  components: {
    RichTextEditor: RichTextEditor.extend({
      styles: (theme) => ({
        controlsGroup: {
          backgroundColor: theme.other.customColors['--surface'],
        },
        control: {
          border: `1px solid ${theme.other.customColors['--border']}`,
        },
        content: {
          color: theme.other.customColors['--text'],
          backgroundColor: theme.other.customColors['--surface'],
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
    ActionIcon: ActionIcon.extend(preventActiveTranslate),
    CloseButton: CloseButton.extend(preventActiveTranslate),
    Text: Text.extend({ defaultProps: { c: CSSVAR['--text'] } }),
    Select: Select.extend({
      classNames: {
        input: 'select-input__overwrite',
        groupLabel: 'select-group-label__overwrite',
      },
      styles: (theme) => ({
        groupLabel: {
          color: theme.other.customColors['--text'],
        },
        dropdown: {
          backgroundColor: theme.other.customColors['--surface'],
          border: `1px solid ${theme.other.customColors['--border']}`,
          color: theme.other.customColors['--text-strong'],
        },
        input: {
          background: CSSVAR['--surface'],
          border: `1px solid ${CSSVAR['--border']}`,
          color: CSSVAR['--text'],
        },
      }),
    }),
    Menu: Menu.extend({
      styles: (theme) => ({
        dropdown: {
          background: theme.other.customColors['--surface'],
          color: theme.other.customColors['--text'],
        },
        item: {
          color: theme.other.customColors['--text'],
        },
      }),
      classNames: {
        item: 'menu-item__overwrite',
      },
    }),
  },
  other: {
    customColors: themeDarkColorVariables,
  },
})
