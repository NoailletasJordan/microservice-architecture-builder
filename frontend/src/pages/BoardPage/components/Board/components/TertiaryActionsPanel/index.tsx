import TooltipWrapper from '@/components/TooltipWrapper'
import { ICON_STYLE, TCustomNode } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Box, Group, Kbd } from '@mantine/core'
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconFocusCentered,
} from '@tabler/icons-react'
import { Panel, useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'
import { isMacOs } from 'react-device-detect'
import { TCustomEdge } from '../connexionContants'
import { useHistoryControls } from './hooks/useHistoryControls'

export default function TertiaryActionsPanel() {
  const { undo, redo } = useHistoryControls()

  const { fitView } = useReactFlow<TCustomNode, TCustomEdge>()
  const onClick = useCallback(
    () => fitView({ duration: 700, maxZoom: 1, minZoom: 0.65 }),
    [fitView],
  )

  return (
    <Panel position="bottom-left">
      <Group gap="sm">
        <Group gap={0}>
          <TooltipWrapper
            label={
              <Group gap="xs">
                <Box>Undo</Box>
                <Kbd size="xs">{isMacOs ? 'cmd + z' : 'ctrl + z'}</Kbd>
              </Group>
            }
          >
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
          </TooltipWrapper>
          <TooltipWrapper
            label={
              <Group gap="xs">
                <div>Redo</div>
                <Kbd size="xs">{isMacOs ? 'cmd + shift + z' : 'ctrl + y'}</Kbd>
              </Group>
            }
          >
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
          </TooltipWrapper>
        </Group>
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
