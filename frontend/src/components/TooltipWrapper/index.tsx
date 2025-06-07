import { CSSVAR } from '@/contants'
import { Box, FloatingPosition, Tooltip } from '@mantine/core'
import { ReactNode, useMemo } from 'react'

interface Props {
  children: ReactNode
  label: ReactNode
  position?: FloatingPosition
  disabled?: boolean
  floating?: boolean
}

const TooltipWrapper = ({
  children,
  label,
  position = 'top',
  disabled,
  floating,
}: Props) => {
  const Component = useMemo(
    () => (floating ? Tooltip.Floating : Tooltip),
    [floating],
  )

  return (
    <Component
      label={label}
      bg={CSSVAR['--text']}
      position={position}
      openDelay={150}
      disabled={disabled}
    >
      <Box style={{ cursor: disabled ? 'default' : 'help' }}>{children}</Box>
    </Component>
  )
}

export default TooltipWrapper
