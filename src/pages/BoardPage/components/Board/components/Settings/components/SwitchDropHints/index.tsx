import { droppableHintsContext } from '@/contexts/DroppableHints/constants'
import {
  Button,
  FloatingIndicator,
  Group,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { useContext, useState } from 'react'

const data = [
  { value: true, label: 'On' },
  { value: false, label: 'Off' },
]

export default function SwitchDropHints() {
  const { droppableHintsChecked, setDroppableHintsChecked } = useContext(
    droppableHintsContext,
  )
  const theme = useMantineTheme()
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({})
  const [active, setActive] = useState(droppableHintsChecked ? 0 : 1)

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node
    setControlsRefs(controlsRefs)
  }

  const controls = data.map(({ value, label }, index) => (
    <Button
      key={label}
      size="xs"
      ref={setControlRef(index)}
      onClick={() => {
        setActive(index)
        setDroppableHintsChecked(value)
      }}
      mod={{ active: active === index }}
      c={active === index ? 'white' : ''}
      style={{ zIndex: 1 }}
      variant="transparent"
      p="0.0rem .5rem"
    >
      {label}
    </Button>
  ))

  return (
    <Group px="xs" pos="relative" justify="space-between" ref={setRootRef}>
      <Text size="sm">Drop hints</Text>
      <Group gap={0}>{controls}</Group>
      <FloatingIndicator
        bg="var(--mantine-primary-color-filled)"
        target={controlsRefs[active]}
        parent={rootRef}
        style={{
          borderRadius: theme.radius.sm,
        }}
      />
    </Group>
  )
}
