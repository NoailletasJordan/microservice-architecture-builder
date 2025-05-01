import { CSSVAR } from '@/contants'
import { Text, TextProps } from '@mantine/core'
import { ReactNode } from 'react'

interface Props extends TextProps {
  children: ReactNode
}

export default function Title({ children, ...props }: Props) {
  return (
    <Text fw="600" size="md" c={CSSVAR['--text-strong']} {...props}>
      {children}
    </Text>
  )
}
