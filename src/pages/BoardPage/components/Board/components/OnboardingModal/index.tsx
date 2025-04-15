import CustomModal from '@/components/CustomModal'
import { CSSVAR, themeDarkColorVariables } from '@/contants'
import { Box, Button, Center, Group, Space, Stack } from '@mantine/core'
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Canva from './components/Canva'
import NavigationItem from './components/NavigationItem'
import Timeline from './components/Timeline'
import { SECTIONS } from './constants'

interface Props {
  opened: boolean
  close: () => void
  showInitialLoader: boolean
}

export default function OnboardingModal({
  showInitialLoader,
  opened,
  close,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleClose = () => {
    close()
    setTimeout(() => setSelectedIndex(0), 200)
  }

  const setNextIndex = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, SECTIONS.length - 1))
  }
  const setPreviousIndex = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0))
  }

  const { contentHeight, setElementStateRef } = useContentHeight({
    opened,
    selectedIndex,
  })

  const closeRef = useRef(handleClose)
  closeRef.current = handleClose
  const buttonSecondary = useMemo(
    () => (
      <Button
        onClick={setPreviousIndex}
        aria-label="secondary-action"
        variant="outline"
        color={themeDarkColorVariables['--text']}
      >
        Previous
      </Button>
    ),
    [],
  )

  const buttonPrimary = useMemo(
    () => (
      <Button
        onClick={setNextIndex}
        aria-label="primary-action"
        color={themeDarkColorVariables['--text-primary']}
        c={CSSVAR['--background']}
      >
        Next Step
      </Button>
    ),
    [],
  )

  const buttonIntroSecondary = useMemo(
    () => (
      <Button
        onClick={closeRef.current}
        variant="outline"
        aria-label="secondary-action"
        color={themeDarkColorVariables['--text']}
      >
        Close
      </Button>
    ),
    [],
  )

  const buttonOutroPrimary = useMemo(
    () => (
      <Button
        color={CSSVAR['--text-primary']}
        aria-label="primary-action"
        c={CSSVAR['--background']}
        onClick={closeRef.current}
      >
        Close and Start Building
      </Button>
    ),
    [],
  )

  const buttonIntroPrimary = useMemo(
    () => (
      <Button
        onClick={setNextIndex}
        aria-label="primary-action"
        color={CSSVAR['--text-primary']}
        c={CSSVAR['--background']}
      >
        See introduction
      </Button>
    ),
    [],
  )

  return (
    <CustomModal
      aria-label="onboarding-modal"
      size="xl"
      onClose={close}
      opened={opened}
      title="Onboarding"
    >
      <Box
        style={(theme) => ({
          display: 'grid',
          gridTemplateColumns: 'max-content 1fr',
          gap: theme.spacing.xl,
        })}
      >
        <Group gap={0}>
          <Stack p="xs" gap="xs" style={{ borderRadius: 8 }} align="end">
            {SECTIONS.map((section, index) => (
              <NavigationItem
                active={index === selectedIndex}
                key={index}
                title={section.title}
                Icon={section.Icon}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </Stack>
          <Timeline selectedIndex={selectedIndex} />
        </Group>
        <Box>
          <Center
            style={{
              aspectRatio: '2/1',
              borderRadius: 12,
              overflow: 'hidden',
            }}
            bg={CSSVAR['--surface-strong']}
          >
            <Canva
              showInitialLoader={showInitialLoader}
              artboard={SECTIONS[selectedIndex].artboard}
            />
          </Center>
          <Space h="md" />
          <motion.div
            transition={{ duration: 0.3, ease: 'easeOut' }}
            animate={{ height: contentHeight }}
          >
            <motion.div
              ref={setElementStateRef}
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ display: 'grid', gap: 10, fontSize: 20 }}
            >
              {SECTIONS[selectedIndex].content}
            </motion.div>
          </motion.div>
        </Box>
      </Box>
      <Space h="lg" />
      <Group justify="end">
        {selectedIndex === 0 ? buttonIntroSecondary : buttonSecondary}
        {selectedIndex === 0
          ? buttonIntroPrimary
          : selectedIndex === SECTIONS.length - 1
          ? buttonOutroPrimary
          : buttonPrimary}
      </Group>
    </CustomModal>
  )
}

function useContentHeight({
  opened,
  selectedIndex,
}: {
  opened: boolean
  selectedIndex: number
}) {
  const [elementStateRef, setElementStateRef] = useState<HTMLElement | null>(
    null,
  )
  const [height, setHeight] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (elementStateRef) {
      interval = setTimeout(() => {
        setHeight(elementStateRef.clientHeight)
      }, 50)
    }

    return () => {
      if (interval) clearTimeout(interval)
    }
  }, [elementStateRef, selectedIndex, opened])

  return { contentHeight: height, setElementStateRef }
}
