import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

interface Props {
  openResetModal: () => void
}

export default function ResetBoard({ openResetModal }: Props) {
  return (
    <Menu.Item
      leftSection={<IconTrash stroke={1} style={ICON_STYLE} />}
      onClick={openResetModal}
    >
      <Text component="span" size="sm">
        Reset the board
      </Text>
    </Menu.Item>
  )
}
