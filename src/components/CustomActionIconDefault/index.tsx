import { ActionIcon, ActionIconProps } from '@mantine/core'
import { ReactNode } from 'react'

interface Props extends ActionIconProps {
  onClick: () => void
  children: ReactNode
}

export default function CustomActionIconDefault({ children, ...props }: Props) {
  return (
    <ActionIcon variant="filled" color="background" size="lg" {...props}>
      {children}
    </ActionIcon>
  )
}
