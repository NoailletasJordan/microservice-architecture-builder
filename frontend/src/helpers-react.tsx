import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { ICON_STYLE } from './pages/BoardPage/configs/constants'

export function showNotificationError({
  title,
  message,
  autoClose = 8000,
}: {
  title?: string
  message?: string
  autoClose?: number
}) {
  notifications.show({
    icon: <IconX color="white" style={ICON_STYLE} />,
    message,
    color: 'red',
    title,
    autoClose,
  })
}

export function showNotificationSuccess({
  title,
  message,
  autoClose = 8000,
}: {
  title?: string
  message?: string
  autoClose?: number
}) {
  notifications.show({
    icon: <IconCheck color="white" style={ICON_STYLE} />,
    message,
    color: 'green',
    title,
    autoClose,
  })
}
