import OnBoardingHelp from '@/components/OnboardingComponents/OnBoardingHelp'
import TooltipWrapper from '@/components/TooltipWrapper'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon } from '@mantine/core'
import { IconInfoSquareRounded } from '@tabler/icons-react'
import { Panel } from 'reactflow'

interface Props {
  showOnBoarding: boolean
  openDemo: () => void
}

export default function DemoPanel({ openDemo, showOnBoarding }: Props) {
  return (
    <Panel position="bottom-right">
      {showOnBoarding && <OnBoardingHelp />}
      <TooltipWrapper label="Watch demo">
        <ActionIcon onClick={openDemo} variant="light" color="gray" size="lg">
          <IconInfoSquareRounded style={ICON_STYLE} />
        </ActionIcon>
      </TooltipWrapper>
    </Panel>
  )
}
