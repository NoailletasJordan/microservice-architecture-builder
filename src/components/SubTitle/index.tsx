import { Text, TextProps } from '@mantine/core'
import { ReactNode } from 'react'

interface Props extends TextProps {
  children: ReactNode
}

export default function Title({ children, ...props }: Props) {
  return (
    <Text fw="700" size="md" c="primary" {...props}>
      {children}
    </Text>
  )
}
