import { CSSVAR } from '@/contants'
import { Box, FloatingPosition, Tooltip } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  label: ReactNode
  position?: FloatingPosition
}

const TooltipWrapper = ({ children, label, position = 'top' }: Props) => {
  if (!label) {
    return children
  }

  return (
    <Tooltip
      label={label}
      bg={CSSVAR['--text']}
      position={position}
      openDelay={150}
    >
      <Box>{children}</Box>
    </Tooltip>
  )
}

export default TooltipWrapper
