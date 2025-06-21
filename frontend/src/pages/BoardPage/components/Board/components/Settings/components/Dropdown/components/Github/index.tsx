import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react'

interface Props {
  closeMenu: () => void
}

export default function ResetBoard({ closeMenu }: Props) {
  return (
    <Menu.Item
      leftSection={<IconBrandGithub stroke={1} style={ICON_STYLE} />}
      onClick={(e) => {
        e.stopPropagation()
        closeMenu()
      }}
      rightSection={<IconExternalLink stroke={1} style={ICON_STYLE} />}
      component="a"
      href="https://github.com/NoailletasJordan/microservice-architecture-builder"
      target="_blank"
    >
      <Text component="span" size="sm">
        Star on Github
      </Text>
    </Menu.Item>
  )
}
