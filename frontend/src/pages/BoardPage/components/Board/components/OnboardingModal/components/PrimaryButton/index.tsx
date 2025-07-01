import { themeDarkColorVariables } from '@/contants'
import { Button } from '@mantine/core'

interface Props {
  onClick: () => void
  label: string
}

export function ButtonPrimary({ onClick, label }: Props) {
  return (
    <Button
      onClick={onClick}
      aria-label="primary-action"
      color={themeDarkColorVariables['--text-primary']}
      variant="outline"
    >
      {label}
    </Button>
  )
}
