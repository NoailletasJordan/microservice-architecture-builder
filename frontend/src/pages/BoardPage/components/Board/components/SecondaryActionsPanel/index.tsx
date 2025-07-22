import GuidanceTextsOnboarding from '@/components/GuidanceTextsComponents/GuidanceTextsInfos'
import TooltipWrapper from '@/components/TooltipWrapper'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Space } from '@mantine/core'
import { IconInfoSquareRounded } from '@tabler/icons-react'
import { Panel } from '@xyflow/react'
import { motion } from 'motion/react'

interface Props {
  showGuidanceTexts: boolean
  openShowInfosModal: () => void
  isTempOpen: boolean
}

export default function SecondaryActionsPaner({
  openShowInfosModal,
  showGuidanceTexts,
  isTempOpen,
}: Props) {
  return (
    <Panel position="bottom-right">
      {showGuidanceTexts && <GuidanceTextsOnboarding />}
      <Space h="xs" />
      {!isTempOpen && (
        <motion.div
          transition={{ layout: { duration: 0.6, ease: 'easeInOut' } }}
          layoutId="info-icon"
          layout="preserve-aspect"
          style={{ marginRight: 215 }}
        >
          <TooltipWrapper label="Watch demo">
            <ActionIcon
              size="lg"
              color="white"
              variant="light"
              aria-label="Watch demo"
              onClick={openShowInfosModal}
            >
              <IconInfoSquareRounded style={ICON_STYLE} />
            </ActionIcon>
          </TooltipWrapper>
        </motion.div>
      )}
    </Panel>
  )
}
