import { Text, TextProps } from '@mantine/core'
import { ReactNode } from 'react'

interface Props extends TextProps {
  children: ReactNode
}

export default function Strong({ children, ...props }: Props) {
  return (
    <Text fw="700" {...props}>
      {children}
    </Text>
  )
}
