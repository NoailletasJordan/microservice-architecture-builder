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
      c="primary.2"
      color="primary.10"
      fw="normal"
      {...props}
      style={style}
    >
      {children}
    </Button>
  )
}
