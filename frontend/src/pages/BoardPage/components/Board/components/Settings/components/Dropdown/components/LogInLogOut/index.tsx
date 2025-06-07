import { userContext } from '@/contexts/User/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu } from '@mantine/core'
import { IconLogin, IconLogout } from '@tabler/icons-react'
import { useContext, useMemo } from 'react'

export default function LogInLogOut() {
  const { isLogged, handleLogout, handlePushToGoogleOauth, userQuery } =
    useContext(userContext)

  const isLoading = !userQuery?.isFetched && userQuery?.isFetching
  const Icon = useMemo(() => (isLogged ? IconLogout : IconLogin), [isLogged])

  return (
    <Menu.Item
      color={!isLogged ? 'primary' : ''}
      disabled={isLoading}
      leftSection={<Icon stroke={1} style={ICON_STYLE} />}
      onClick={isLogged ? handleLogout : handlePushToGoogleOauth}
    >
      {isLogged ? 'Log out' : 'Log in with Google'}
    </Menu.Item>
  )
}
