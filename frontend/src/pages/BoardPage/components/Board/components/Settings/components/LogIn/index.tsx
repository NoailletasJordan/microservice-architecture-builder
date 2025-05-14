import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconUser } from '@tabler/icons-react'

export default function LogIn() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`
  }

  return (
    <Menu.Item
      leftSection={<IconUser stroke={1} style={ICON_STYLE} />}
      onClick={handleLogin}
    >
      <Text component="span" size="sm">
        Log in
      </Text>
    </Menu.Item>
  )
}
