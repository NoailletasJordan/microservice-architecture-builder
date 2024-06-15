import { FloatingPosition, Group, Text, Tooltip } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  label: ReactNode
  position?: FloatingPosition
}

const TooltipWrapper = ({ children, label, position = 'top' }: Props) => (
  <Tooltip
    label={label}
    position={position}
    opacity={0.9}
    openDelay={150}
    color="gray"
  >
    <Group gap="xs">
      <Text fs="italic" component="div">
        {children}
      </Text>
    </Group>
  </Tooltip>
)

export default TooltipWrapper
