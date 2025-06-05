import GuidanceTextsOnboarding from '@/components/GuidanceTextsComponents/GuidanceTextsOnboarding'
import TooltipWrapper from '@/components/TooltipWrapper'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Group, Space } from '@mantine/core'
import { IconFocusCentered, IconInfoSquareRounded } from '@tabler/icons-react'
import { Panel, useReactFlow } from 'reactflow'

interface Props {
  showGuidanceTexts: boolean
  openOnboarding: () => void
}

export default function DemoPanel({
  openOnboarding,
  showGuidanceTexts,
}: Props) {
  const { fitView } = useReactFlow()

  const onClick = () => fitView({ duration: 700, maxZoom: 1, minZoom: 0.65 })

  return (
    <Panel position="bottom-right">
      {showGuidanceTexts && <GuidanceTextsOnboarding />}
      <Space h="xs" />
      <Group justify="flex-end">
        <TooltipWrapper label="Fit into view">
          <ActionIcon onClick={onClick} aria-label="Fit to view">
            <IconFocusCentered style={ICON_STYLE} />
          </ActionIcon>
        </TooltipWrapper>
        <TooltipWrapper label="Watch demo">
          <ActionIcon aria-label="Watch demo" onClick={openOnboarding}>
            <IconInfoSquareRounded style={ICON_STYLE} />
          </ActionIcon>
        </TooltipWrapper>
      </Group>
    </Panel>
  )
}
