import { themeDarkColorVariables } from '@/contants'
import { Button, ButtonProps } from '@mantine/core'
import { ReactNode } from 'react'

interface Props extends ButtonProps {
  children: ReactNode
  onClick: () => void
}

export default function CustomButtonPrimary({
  children,
  style,
  ...props
}: Props) {
  return (
    <Button
      c={themeDarkColorVariables['--background']}
      color={themeDarkColorVariables['--text-primary']}
      {...props}
      style={style}
    >
      {children}
    </Button>
  )
}
