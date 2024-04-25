import { ActionIcon } from '@mantine/core'
import { IconFocusCentered } from '@tabler/icons-react'
import { Panel, useReactFlow } from 'reactflow'
import TooltipWrapper from '../../../../components/TooltipWrapper/index'
import { iconStyle } from '../../../../utils'

export default function FitToView() {
  const { fitView } = useReactFlow()

  const onClick = () => fitView({ duration: 700 })

  return (
    <Panel position="bottom-left">
      <TooltipWrapper label="Fit into view">
        <ActionIcon onClick={onClick} variant="default" aria-label="Settings">
          <IconFocusCentered style={iconStyle} />
        </ActionIcon>
      </TooltipWrapper>
    </Panel>
  )
}
