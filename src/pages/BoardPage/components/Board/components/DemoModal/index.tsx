import CustomModal from '@/components/CustomModal'
import { CSSVAR } from '@/contants'
import { Avatar, Box, Button, Grid, Group, Space, Stack } from '@mantine/core'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import Timeline from './components/Timeline'
import { SECTIONS } from './constants'

interface Props {
  opened: boolean
  close: () => void
}

export default function DemoModal({ opened, close }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const setNextIndex = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, SECTIONS.length - 1))
  }
  const setPreviousIndex = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0))
  }

  const closeRef = useRef(close)
  closeRef.current = close

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
        color="primary.10"
        c={CSSVAR['--background']}
      >
        Next Step
      </Button>
    ),
    [],
  )

  const buttonIntroSecondary = useMemo(
    () => (
      <Button onClick={closeRef.current} variant="outline" color="gray.11">
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
    <CustomModal onClose={close} opened={opened} opened title="Onboarding">
      <Grid gutter="xl">
        <Grid.Col span="content">
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
        </Grid.Col>
        <Grid.Col span="auto">
          <Box>
            <Box
              style={{
                aspectRatio: '2/1',
                borderRadius: 12,
              }}
              bg={CSSVAR['--surface-strong']}
            ></Box>
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
        </Grid.Col>
      </Grid>
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

function NavigationItem({
  onClick,
  title,
  active,
  Icon,
}: {
  title: string
  onClick: () => void
  active?: boolean
  Icon: ({
    currentColor,
    ...svgProps
  }: {
    currentColor: string
  } & React.SVGProps<SVGSVGElement>) => JSX.Element
}) {
  return (
    <Group
      onClick={onClick}
      px="sm"
      py="xs"
      style={{
        cursor: 'pointer',
      }}
      gap="xs"
      align="center"
    >
      <Box
        c={active ? CSSVAR['--text-strong'] : CSSVAR['--text']}
        style={{ transition: 'color 0.4s' }}
      >
        {title}
      </Box>
      <Avatar
        style={{ transition: 'background-color 0.4s' }}
        bg={active ? CSSVAR['--text-primary'] : CSSVAR['--surface-strong']}
        p={3}
      >
        <Icon
          strokeWidth={2}
          currentColor={active ? CSSVAR['--background'] : CSSVAR['--text']}
        />
      </Avatar>
    </Group>
  )
}
