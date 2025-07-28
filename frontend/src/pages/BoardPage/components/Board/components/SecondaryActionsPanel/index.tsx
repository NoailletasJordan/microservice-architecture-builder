import TooltipWrapper from '@/components/TooltipWrapper'
import { CSSVAR } from '@/contants'
import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Space } from '@mantine/core'
import { IconInfoSquareRounded } from '@tabler/icons-react'
import { MiniMap, Panel } from '@xyflow/react'
import { motion } from 'motion/react'
import { useContext } from 'react'

export default function SecondaryActionsPaner() {
  const {
    onboardingIsActive,
    updateShowInfosModal,
    showGuidanceTexts,
    showInfosModal,
  } = useContext(onBoardingContext)

  return (
    <>
      {!showGuidanceTexts && !showInfosModal && !onboardingIsActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
        >
          <MiniMap
            style={{ backgroundColor: CSSVAR['--surface-strong'] }}
            nodeBorderRadius={10}
            nodeStrokeWidth={5}
            nodeStrokeColor={CSSVAR['--text']}
            nodeColor={CSSVAR['--surface-strong']}
            maskColor="#00000066"
          />
        </motion.div>
      )}
      <Panel position="bottom-right">
        <Space h="xs" />
        {!onboardingIsActive && (
          <motion.div
            transition={{
              layout: { type: 'spring', stiffness: 45, damping: 11, mass: 1 },
            }}
            layoutId="info-icon"
            layout="position"
            style={{ marginRight: 215 }}
          >
            <TooltipWrapper label="Watch demo">
              <ActionIcon
                size="lg"
                color="white"
                variant="light"
                aria-label="Watch demo"
                onClick={() => updateShowInfosModal(true)}
              >
                <IconInfoSquareRounded style={ICON_STYLE} />
              </ActionIcon>
            </TooltipWrapper>
          </motion.div>
        )}
      </Panel>
    </>
  )
}
