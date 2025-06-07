import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconWashDryOff } from '@tabler/icons-react'

interface Props {
  openClearCurrentBoardModal: () => void
}

export const itemLabel = 'Clear data'

export default function ClearBoard({ openClearCurrentBoardModal }: Props) {
  return (
    <Menu.Item
      leftSection={<IconWashDryOff stroke={1} style={ICON_STYLE} />}
      onClick={openClearCurrentBoardModal}
    >
      <Text component="span" size="sm">
        {itemLabel}
      </Text>
    </Menu.Item>
  )
}
