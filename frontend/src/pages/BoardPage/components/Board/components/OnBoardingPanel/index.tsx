import { CSSVAR } from '@/contants'
import { ActionIcon, Card, Group, Space, Text, ThemeIcon } from '@mantine/core'
import {
  IconChevronLeft,
  IconChevronRight,
  IconInfoSquareRounded,
} from '@tabler/icons-react'
import { Panel } from '@xyflow/react'
import { AnimatePresence, motion } from 'motion/react'

import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { useContext } from 'react'
import ConfettiCanvas from './components/ConfettiCanvas'
import WelcomeStep from './components/Step0'
import IntroductionStep from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import { useAnimationVariants_ } from './hooks/useAnimationVariants_'
import { useStepNavigation_ } from './hooks/useStepNavigation_'

export default function OnBoardingPanel() {
  const {
    currentStepIndex,
    isMovingForward,
    isPreviousDisabled,
    isNextDisabled,
    goToNextStep,
    goToPreviousStep,
  } = useStepNavigation_({ totalSteps: steps.length })
  const { onboardingIsActive } = useContext(onBoardingContext)
  const animationVariants = useAnimationVariants_()

  const CurrentStepComponent = steps[currentStepIndex]

  return (
    <AnimatePresence>
      {onboardingIsActive && (
        <Panel position="bottom-right">
          <ConfettiCanvas />
          <motion.div
            style={panelStyle}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Group justify="space-between">
              <motion.div layout="position" layoutId="info-icon">
                <ThemeIcon size="sm" color="white" variant="light">
                  <IconInfoSquareRounded />
                </ThemeIcon>
              </motion.div>
              <Group gap={0}>
                <ActionIcon
                  disabled={isPreviousDisabled}
                  color="white"
                  onClick={goToPreviousStep}
                  variant="transparent"
                  opacity={isPreviousDisabled ? 0.5 : 1}
                  size="xs"
                >
                  <IconChevronLeft />
                </ActionIcon>
                <ActionIcon
                  disabled={isNextDisabled}
                  color="white"
                  onClick={goToNextStep}
                  variant="transparent"
                  opacity={isNextDisabled ? 0.5 : 1}
                  size="xs"
                >
                  <IconChevronRight />
                </ActionIcon>
                <Card p={4} radius="md" bg="gray.1">
                  <Text>
                    {currentStepIndex + 1}/{steps.length}
                  </Text>
                </Card>
              </Group>
            </Group>
            <Space h="md" />
            <AnimatePresence mode="wait" custom={isMovingForward}>
              <motion.div
                variants={animationVariants(isMovingForward)}
                initial="hidden"
                animate="visible"
                exit="hidden"
                key={currentStepIndex}
              >
                <CurrentStepComponent />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Panel>
      )}
    </AnimatePresence>
  )
}

const panelStyle = {
  border: `1px solid ${CSSVAR['--border']}`,
  background: CSSVAR['--surface'],
  borderRadius: 8,
  padding: 16,
}

const steps = [WelcomeStep, IntroductionStep, Step2, Step3]
