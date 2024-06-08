import { ActionIcon, Box, Button, Group } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconBook } from '@tabler/icons-react'
import { Panel } from 'reactflow'
import SharableModalAndButton from '../../../SharableModalAndButton'

interface Props {
  onClick: () => void
}

export default function PrimaryActionsPanel({ onClick }: Props) {
  const maxSM = useMediaQuery('(max-width: 768px)')

  const serviceOverviewButton = maxSM ? (
    <Box>
      <ActionIcon size="lg" variant="light" onClick={onClick}>
        <IconBook style={{ width: '50%', height: '50%' }} />
      </ActionIcon>
    </Box>
  ) : (
    <Button onClick={onClick} variant="light" leftSection={<IconBook />}>
      Service Overview
    </Button>
  )

  return (
    <Panel position="top-right">
      <Group gap="xs">
        <SharableModalAndButton />
        {serviceOverviewButton}
      </Group>
    </Panel>
  )
}
