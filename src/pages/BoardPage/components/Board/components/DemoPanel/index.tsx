import OnBoardingHelp from '@/components/OnboardingComponents/OnBoardingHelp'
import TooltipWrapper from '@/components/TooltipWrapper'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Group, Space } from '@mantine/core'
import { IconFocusCentered, IconInfoSquareRounded } from '@tabler/icons-react'
import { Panel, useReactFlow } from 'reactflow'

interface Props {
  showOnBoarding: boolean
  openDemo: () => void
}

export default function DemoPanel({ openDemo, showOnBoarding }: Props) {
  const { fitView } = useReactFlow()

  const onClick = () => fitView({ duration: 700 })

  return (
    <Panel position="bottom-right">
      {showOnBoarding && <OnBoardingHelp />}
      <Space h="xs" />
      <Group justify="flex-end">
        <TooltipWrapper label="Fit into view">
          <ActionIcon onClick={onClick} aria-label="Fit to view">
            <IconFocusCentered style={ICON_STYLE} />
          </ActionIcon>
        </TooltipWrapper>
        <TooltipWrapper label="Watch demo">
          <ActionIcon aria-label="Watch demo" onClick={openDemo}>
            <IconInfoSquareRounded style={ICON_STYLE} />
          </ActionIcon>
        </TooltipWrapper>
      </Group>
    </Panel>
  )
}
