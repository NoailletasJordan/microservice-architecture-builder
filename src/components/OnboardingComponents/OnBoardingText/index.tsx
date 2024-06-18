import { Text, TextProps } from '@mantine/core'
import { ReactNode } from 'react'

interface Props extends TextProps {
  children: ReactNode
}

export default function OnboardingText({ children, ...props }: Props) {
  return (
    <Text ff="Merienda, cursive" lts="1px" c="gray.5" size="lg" {...props}>
      {children}
    </Text>
  )
}
