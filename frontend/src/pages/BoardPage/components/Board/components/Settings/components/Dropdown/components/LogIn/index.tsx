import { userContext } from '@/contexts/User/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconUser } from '@tabler/icons-react'
import { useContext } from 'react'

export default function LogIn() {
  const { isLogged, handleLogout, handlePushToGoogleOauth } =
    useContext(userContext)

  return (
    <Menu.Item
      leftSection={<IconUser stroke={1} style={ICON_STYLE} />}
      onClick={isLogged ? handleLogout : handlePushToGoogleOauth}
    >
      <Text component="span" size="sm">
        {isLogged ? 'Log out' : 'Log in'}
      </Text>
    </Menu.Item>
  )
}
