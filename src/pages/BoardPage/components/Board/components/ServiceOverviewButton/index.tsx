import { Button } from '@mantine/core'
import { IconBook } from '@tabler/icons-react'
import { Panel } from 'reactflow'

interface Props {
  onClick: () => void
}

export default function ServiceOverviewButton({ onClick }: Props) {
  return (
    <Panel position="top-right">
      <Button onClick={onClick} variant="light" leftSection={<IconBook />}>
        Service Overview
      </Button>
    </Panel>
  )
}
