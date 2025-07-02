import TooltipWrapper from '@/components/TooltipWrapper/index.tsx'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import React from 'react'
import { useCreateNewBoard } from './hooks/useCreateNewBoard.tsx'
import { useDuplicateCurrentBoard } from './hooks/useDuplicateCurrentBoard.ts'
import { useIsEnabledConfig } from './hooks/useIsEnabledConfig.tsx'

interface Props {
  closeMenu: () => void
}

export default function NewBoard({ closeMenu }: Props) {
  const duplicateCurrentBoard = useDuplicateCurrentBoard()
  const createNewBoard = useCreateNewBoard()
  const { isEnabled, disableMessage } = useIsEnabledConfig()

  return (
    <Menu.Sub>
      <Menu.Sub.Target>
        {isEnabled ? (
          <SubItem />
        ) : (
          <TooltipWrapper label={disableMessage} position="right">
            <SubItem disabled={!isEnabled} />
          </TooltipWrapper>
        )}
      </Menu.Sub.Target>

      <Menu.Sub.Dropdown>
        <Menu.Item
          onClick={() => {
            closeMenu()
            createNewBoard()
          }}
        >
          Empty board
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            closeMenu()
            duplicateCurrentBoard()
          }}
        >
          Duplicate current board
        </Menu.Item>
      </Menu.Sub.Dropdown>
    </Menu.Sub>
  )
}

const SubItem = React.forwardRef<HTMLButtonElement, { disabled?: boolean }>(
  ({ disabled }, ref) => {
    return (
      <Menu.Sub.Item
        ref={ref}
        leftSection={<IconPlus stroke={1} style={ICON_STYLE} />}
        disabled={disabled}
      >
        Create new
      </Menu.Sub.Item>
    )
  },
)
