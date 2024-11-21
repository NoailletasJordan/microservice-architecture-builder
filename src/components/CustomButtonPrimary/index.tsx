import { Button, ButtonProps, Text } from '@mantine/core'
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
      {...props}
      c="text.10"
      color="primary.3"
      style={{
        '--button-hover': 'var(--mantine-color-primary-2)',
        ...style,
      }}
    >
      <Text c="inherit" component="span" size="sm">
        {children}
      </Text>
    </Button>
  )
}
