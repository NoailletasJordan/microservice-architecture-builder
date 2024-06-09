import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconLink } from '@tabler/icons-react'

interface Props {
  openShareModal: () => void
}

export default function ShareLink({ openShareModal }: Props) {
  return (
    <Menu.Item
      leftSection={<IconLink stroke={1} style={ICON_STYLE} />}
      onClick={openShareModal}
    >
      <Text component="span" size="sm">
        Share
      </Text>
    </Menu.Item>
  )
}
