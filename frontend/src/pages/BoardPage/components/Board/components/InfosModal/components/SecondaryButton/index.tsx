import { themeDarkColorVariables } from '@/contants'
import { Button } from '@mantine/core'

interface Props {
  onClick: () => void
  label: string
}

export function SecondaryButton({ onClick, label }: Props) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      aria-label="secondary-action"
      color={themeDarkColorVariables['--text']}
    >
      {label}
    </Button>
  )
}
