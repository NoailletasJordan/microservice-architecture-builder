import { FloatingPosition, Group, Text, Tooltip } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  label: ReactNode
  position?: FloatingPosition
}

const TooltipWrapper = ({ children, label, position = 'top' }: Props) => (
  <Tooltip label={label} bg="gray.5" position={position} openDelay={150}>
    <Group gap="xs">
      <Text component="div">{children}</Text>
    </Group>
  </Tooltip>
)

export default TooltipWrapper
