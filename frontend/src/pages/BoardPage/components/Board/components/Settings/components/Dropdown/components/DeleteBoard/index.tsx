import TooltipWrapper from '@/components/TooltipWrapper'
import { userContext } from '@/contexts/User/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useContext } from 'react'

interface Props {
  openDeleteCurrentBoardModal: () => void
  disabledTooltip?: string
}

export default function DeleteBoard({
  openDeleteCurrentBoardModal,
  disabledTooltip,
}: Props) {
  const { isLogged } = useContext(userContext)

  return (
    <Menu.Item
      leftSection={<IconTrash stroke={1} style={ICON_STYLE} />}
      onClick={openDeleteCurrentBoardModal}
      disabled={!isLogged}
    >
      <TooltipWrapper
        position="right"
        label={disabledTooltip}
        disabled={isLogged}
      >
        <Text component="span" size="sm">
          Delete
        </Text>
      </TooltipWrapper>
    </Menu.Item>
  )
}
