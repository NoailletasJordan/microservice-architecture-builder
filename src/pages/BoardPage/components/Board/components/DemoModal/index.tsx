import CustomModal from '@/components/CustomModal'
import { CSSVAR, themeDarkColorVariables } from '@/contants'
import { Box, Button, Group, Space, Stack } from '@mantine/core'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import Canva from './components/Canva'
import NavigationItem from './components/NavigationItem'
import Timeline from './components/Timeline'
import { SECTIONS } from './constants'

interface Props {
  opened: boolean
  close: () => void
}

export default function DemoModal({ opened, close }: Props) {
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

  const closeRef = useRef(handleClose)
  closeRef.current = handleClose

  const buttonSecondary = useMemo(
    () => (
      <Button onClick={setPreviousIndex} variant="outline" color="gray.11">
        Back
      </Button>
    ),
    [],
  )

  const buttonPrimary = useMemo(
    () => (
      <Button
        onClick={setNextIndex}
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
        color={themeDarkColorVariables['--text']}
      >
        I will figure it out
      </Button>
    ),
    [],
  )

  const buttonOutroPrimary = useMemo(
    () => (
      <Button
        color={CSSVAR['--text-primary']}
        c={CSSVAR['--background']}
        onClick={closeRef.current}
      >
        Start Building
      </Button>
    ),
    [],
  )

  const buttonIntroPrimary = useMemo(
    () => (
      <Button
        onClick={setNextIndex}
        color={CSSVAR['--text-primary']}
        c={CSSVAR['--background']}
      >
        Quick Introduction
      </Button>
    ),
    [],
  )

  return (
    <CustomModal onClose={close} opened={opened} title="Onboarding">
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
          <Box
            style={{
              aspectRatio: '2/1',
              borderRadius: 12,
              overflow: 'hidden',
            }}
            bg={CSSVAR['--surface-strong']}
          >
            <Canva artboard={SECTIONS[selectedIndex].artboard} />
          </Box>
          <Space h="md" />
          <AnimatePresence mode="wait">
            <motion.div
              key={`selected-${selectedIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ display: 'grid', gap: 10 }}
            >
              {SECTIONS[selectedIndex].content}
            </motion.div>
          </AnimatePresence>
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
