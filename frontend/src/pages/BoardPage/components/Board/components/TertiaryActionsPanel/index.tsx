import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { useHistoryControls } from './hooks/useHistoryControls'

import TooltipWrapper from '@/components/TooltipWrapper'
import { ActionIcon, Group } from '@mantine/core'
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconFocusCentered,
} from '@tabler/icons-react'
import { useCallback } from 'react'
import { Panel, useReactFlow } from 'reactflow'

export default function TertiaryActionsPanel() {
  const { undo, redo } = useHistoryControls()

  const { fitView } = useReactFlow()
  const onClick = useCallback(
    () => fitView({ duration: 700, maxZoom: 1, minZoom: 0.65 }),
    [fitView],
  )

  return (
    <Panel position="bottom-left">
      <Group gap="sm">
        <ActionIcon.Group>
          <ActionIcon
            disabled={undo.isDisabled}
            size="lg"
            variant="light"
            color="white"
            aria-label="Undo"
            onClick={undo.action}
          >
            <IconArrowBackUp style={ICON_STYLE} />
          </ActionIcon>
          <ActionIcon
            disabled={redo.isDisabled}
            aria-label="Redo"
            onClick={redo.action}
            size="lg"
            variant="light"
            color="white"
          >
            <IconArrowForwardUp style={ICON_STYLE} />
          </ActionIcon>
        </ActionIcon.Group>
        <TooltipWrapper label="Fit into view">
          <ActionIcon
            size="lg"
            variant="light"
            color="white"
            onClick={onClick}
            aria-label="Fit to view"
          >
            <IconFocusCentered style={ICON_STYLE} />
          </ActionIcon>
        </TooltipWrapper>
      </Group>
    </Panel>
  )
}
