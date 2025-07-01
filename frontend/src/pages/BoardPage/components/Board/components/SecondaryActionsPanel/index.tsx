import GuidanceTextsOnboarding from '@/components/GuidanceTextsComponents/GuidanceTextsOnboarding'
import TooltipWrapper from '@/components/TooltipWrapper'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Space } from '@mantine/core'
import { IconInfoSquareRounded } from '@tabler/icons-react'
import { Panel } from 'reactflow'

interface Props {
  showGuidanceTexts: boolean
  openOnboarding: () => void
}

export default function SecondaryActionsPaner({
  openOnboarding,
  showGuidanceTexts,
}: Props) {
  return (
    <Panel position="bottom-right">
      {showGuidanceTexts && <GuidanceTextsOnboarding />}
      <Space h="xs" />
      <TooltipWrapper label="Watch demo">
        <ActionIcon
          size="lg"
          color="white"
          variant="light"
          aria-label="Watch demo"
          onClick={openOnboarding}
        >
          <IconInfoSquareRounded style={ICON_STYLE} />
        </ActionIcon>
      </TooltipWrapper>
    </Panel>
  )
}
