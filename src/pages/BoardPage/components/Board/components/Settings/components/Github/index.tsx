import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react'

export default function ResetBoard() {
  return (
    <Menu.Item
      leftSection={<IconBrandGithub stroke={1} style={ICON_STYLE} />}
      onClick={() => null}
      rightSection={<IconExternalLink stroke={1} style={ICON_STYLE} />}
      component="a"
      href="https://github.com/NoailletasJordan/project-a"
      target="_blank"
    >
      <Text component="span" size="sm">
        Github
      </Text>
    </Menu.Item>
  )
}
