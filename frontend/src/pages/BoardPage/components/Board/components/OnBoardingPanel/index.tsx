import {
  ActionIcon,
  Button,
  Card,
  Group,
  Space,
  Text,
  ThemeIcon,
} from '@mantine/core'
import {
  IconChevronLeft,
  IconChevronRight,
  IconInfoSquareRounded,
} from '@tabler/icons-react'
import { Panel } from '@xyflow/react'
import { AnimatePresence, motion, Variants } from 'motion/react'
import { useRef, useState } from 'react'

interface Props {
  isTempOpen: boolean
  toggleTempOpen: () => void
}

export default function OnBoardingPanel({ isTempOpen, toggleTempOpen }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const oldIndexRef = useRef(selectedIndex)
  const isNextIndexRef = useRef(true)

  if (selectedIndex !== oldIndexRef.current) {
    isNextIndexRef.current = selectedIndex > oldIndexRef.current
    oldIndexRef.current = selectedIndex
  }

  function nextIndex() {
    setSelectedIndex((prev) => Math.min(prev + 1, content.length - 1))
  }

  function prevIndex() {
    setSelectedIndex((prev) => Math.max(prev - 1, 0))
  }

  const ContentComponent = content[selectedIndex]

  const getVariants = (isNextIndex: boolean): Variants => {
    /** Temp */
    console.log('isNextIndex:', isNextIndex)
    return {
      shown: {
        transition: { duration: 0.35, delay: 0.25, ease: 'easeOut' },
        opacity: 1,
        x: 0,
      },
      hidden: {
        transition: { duration: 0.35, ease: 'easeOut' },
        opacity: 0,
        x: isNextIndex ? 30 : -30,
      },
    }
  }

  return (
    <Panel position="bottom-right">
      <Button variant="default" onClick={toggleTempOpen}>
        toggle
      </Button>
      <Space h={30} />
      {isTempOpen && (
        <Card withBorder>
          <Group justify="space-between">
            <motion.div layoutId="info-icon">
              <ThemeIcon
                size="sm"
                color="white"
                variant="light"
                onClick={prevIndex}
              >
                <IconInfoSquareRounded />
              </ThemeIcon>
            </motion.div>
            <div>
              <Group gap={0}>
                <ActionIcon
                  disabled={selectedIndex === 0}
                  color="white"
                  onClick={prevIndex}
                  variant="transparent"
                  opacity={selectedIndex === 0 ? 0.5 : 1}
                  size="xs"
                >
                  <IconChevronLeft />
                </ActionIcon>
                <ActionIcon
                  disabled={selectedIndex === content.length - 1}
                  color="white"
                  onClick={nextIndex}
                  variant="transparent"
                  opacity={selectedIndex === content.length - 1 ? 0.5 : 1}
                  size="xs"
                >
                  <IconChevronRight />
                </ActionIcon>
                <Card p={4} radius="md" bg="gray.1">
                  <Text>
                    {selectedIndex + 1}/{content.length}
                  </Text>
                </Card>
              </Group>
            </div>
          </Group>
          <Space h="md" />
          <AnimatePresence mode="popLayout" custom={isNextIndexRef.current}>
            <motion.div
              variants={getVariants(isNextIndexRef.current)}
              initial="hidden"
              animate="shown"
              exit="hidden"
              key={selectedIndex}
            >
              <ContentComponent />
            </motion.div>
          </AnimatePresence>

          {/* <Group justify="flex-end">
          <Button>Got it !</Button>
        </Group> */}
        </Card>
      )}
    </Panel>
  )
}

function Step0() {
  return (
    <>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
    </>
  )
}

function Step1() {
  return (
    <>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
    </>
  )
}

const content = [Step0, Step1]
