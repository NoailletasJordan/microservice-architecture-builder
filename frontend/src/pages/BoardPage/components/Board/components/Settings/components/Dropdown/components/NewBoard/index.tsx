import TooltipWrapper from '@/components/TooltipWrapper/index.tsx'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useCreateNewBoard } from './hooks/useCreateNewBoard.tsx'
import { useDuplicateCurrentBoard } from './hooks/useDuplicateCurrentBoard.ts'
import { IsEnabled } from './hooks/useIsEnabled.tsx'

interface Props {
  disabledTooltip?: string
}

export default function NewBoard({ disabledTooltip }: Props) {
  const duplicateCurrentBoard = useDuplicateCurrentBoard()
  const createNewBoard = useCreateNewBoard()
  const isEnabled = IsEnabled()
  return (
    <Menu.Sub>
      <Menu.Sub.Target>
        <Menu.Sub.Item
          disabled={!isEnabled}
          leftSection={<IconPlus stroke={1} style={ICON_STYLE} />}
        >
          <TooltipWrapper
            disabled={isEnabled}
            position="right"
            label={disabledTooltip}
          >
            Create new
          </TooltipWrapper>
        </Menu.Sub.Item>
      </Menu.Sub.Target>

      <Menu.Sub.Dropdown>
        <Menu.Item onClick={createNewBoard}>Emtpy board</Menu.Item>
        <Menu.Item onClick={duplicateCurrentBoard}>
          Duplicate current board
        </Menu.Item>
      </Menu.Sub.Dropdown>
    </Menu.Sub>
  )
}
