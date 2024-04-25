import { FloatingPosition, Group, Text, Tooltip } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  label: ReactNode
  position?: FloatingPosition
}

const TooltipWrapper = ({
  children,
  label,
  position = 'bottom-end',
}: Props) => (
  <Tooltip label={label} position={position}>
    <Group gap="xs" style={{ cursor: 'help' }}>
      <Text fs="italic">{children}</Text>
    </Group>
  </Tooltip>
)

export default TooltipWrapper
