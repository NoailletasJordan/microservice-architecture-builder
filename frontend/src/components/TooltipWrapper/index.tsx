import { CSSVAR } from '@/contants'
import { Center, FloatingPosition, Tooltip } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  label: ReactNode
  position?: FloatingPosition
}

const TooltipWrapper = ({ children, label, position = 'top' }: Props) => (
  <Tooltip
    label={label}
    bg={CSSVAR['--surface-strong']}
    position={position}
    openDelay={150}
  >
    <Center>{children}</Center>
  </Tooltip>
)

export default TooltipWrapper
