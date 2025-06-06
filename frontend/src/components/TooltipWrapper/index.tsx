import { CSSVAR } from '@/contants'
import { Box, FloatingPosition, Tooltip } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  label: ReactNode
  position?: FloatingPosition
  disabled?: boolean
}

const TooltipWrapper = ({
  children,
  label,
  position = 'top',
  disabled,
}: Props) => (
  <Tooltip
    label={label}
    bg={CSSVAR['--surface-strong']}
    position={position}
    openDelay={150}
    disabled={disabled}
  >
    <Box>{children}</Box>
  </Tooltip>
)

export default TooltipWrapper
