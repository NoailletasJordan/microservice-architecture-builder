import CustomModal from '@/components/CustomModal'
import { CSSVAR, useEffectEventP } from '@/contants'
import { Box, Center, Group, Space, Stack } from '@mantine/core'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import Canva from './components/Canva'
import NavigationItem from './components/NavigationItem'
import { ButtonPrimary } from './components/PrimaryButton'
import { SecondaryButton } from './components/SecondaryButton/index'
import Timeline from './components/Timeline'
import { SECTIONS } from './constants'
import { useContentHeight_ } from './hooks/useContentHeight_'

interface Props {
  opened: boolean
  close: () => void
}

export default function OnboardingModal({ opened, close }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleClose = () => {
    close()
    setTimeout(() => setSelectedIndex(0), 200)
  }

  const { contentHeight, setElementStateRef } = useContentHeight_({
    opened,
    selectedIndex,
  })

  const nonReactiveState = useEffectEventP(() => ({
    handleClose,
    setNextIndex: () =>
      setSelectedIndex((prev) => Math.min(prev + 1, SECTIONS.length - 1)),
    setPreviousIndex: () => setSelectedIndex((prev) => Math.max(prev - 1, 0)),
  }))

  const buttonsConfig = useMemo(() => {
    const { handleClose, setNextIndex, setPreviousIndex } = nonReactiveState()
    return [
      {
        primary: { onClick: setNextIndex, label: 'Learn about Services' },
        secondary: { onClick: handleClose, label: 'Close' },
      },
      {
        primary: { onClick: setNextIndex, label: 'Learn about Connections' },
        secondary: {
          onClick: setPreviousIndex,
          label: 'Previous',
        },
      },
      {
        primary: { onClick: setNextIndex, label: 'Learn about Sharing' },
        secondary: { onClick: setPreviousIndex, label: 'Previous' },
      },
      {
        primary: { onClick: handleClose, label: 'Close and Start Building' },
        secondary: { onClick: setPreviousIndex, label: 'Previous' },
      },
    ]
  }, [nonReactiveState])

  return (
    <CustomModal
      aria-label="infos-modal"
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
            <Canva artboard={SECTIONS[selectedIndex].artboard} />
          </Center>
          <Space h="md" />
          <motion.div
            transition={{ duration: 0.3, ease: 'easeOut' }}
            animate={{ height: contentHeight }}
          >
            <motion.p
              ref={setElementStateRef}
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ display: 'grid', gap: 10, fontSize: '115%' }}
            >
              {SECTIONS[selectedIndex].content}
            </motion.p>
          </motion.div>
        </Box>
      </Box>
      <Space h="lg" />
      <Group justify="end">
        <SecondaryButton
          onClick={buttonsConfig[selectedIndex].secondary.onClick}
          label={buttonsConfig[selectedIndex].secondary.label}
        />
        <ButtonPrimary
          onClick={buttonsConfig[selectedIndex].primary.onClick}
          label={buttonsConfig[selectedIndex].primary.label}
        />
      </Group>
    </CustomModal>
  )
}
