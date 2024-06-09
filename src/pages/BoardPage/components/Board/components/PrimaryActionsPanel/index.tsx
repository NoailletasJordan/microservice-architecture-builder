import { selectedNodeContext } from '@/contexts/SelectedNode/constants'
import { ActionIcon, Box, Button, Group } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconBook } from '@tabler/icons-react'
import { useContext } from 'react'
import { Panel } from 'reactflow'
import SharableButton from './components/SharableButton'

interface Props {
  openShareModal: () => void
}

export default function PrimaryActionsPanel({ openShareModal }: Props) {
  const maxSM = useMediaQuery('(max-width: 768px)')
  const { toggleAsideOpen } = useContext(selectedNodeContext)

  const serviceOverviewButton = maxSM ? (
    <Box>
      <ActionIcon size="lg" variant="light" onClick={toggleAsideOpen}>
        <IconBook style={{ width: '50%', height: '50%' }} />
      </ActionIcon>
    </Box>
  ) : (
    <Button
      onClick={toggleAsideOpen}
      variant="light"
      leftSection={<IconBook />}
    >
      Service Overview
    </Button>
  )

  return (
    <Panel position="top-right">
      <Group gap="xs">
        <SharableButton onClick={openShareModal} />
        {serviceOverviewButton}
      </Group>
    </Panel>
  )
}
