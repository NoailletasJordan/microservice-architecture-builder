import { Text, TextProps } from '@mantine/core'
import { ReactNode } from 'react'

interface Props extends TextProps {
  children: ReactNode
}

export default function GuidanceText({ children, ...props }: Props) {
  return (
    <Text ff="Merienda, cursive" lts="1px" size="lg" {...props}>
      {children}
    </Text>
  )
}
