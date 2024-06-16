import { Text } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function OnboardingText({ children }: Props) {
  return (
    <Text ff="Pacifico" lts="2px" c="gray.5" size="lg">
      {children}
    </Text>
  )
}
