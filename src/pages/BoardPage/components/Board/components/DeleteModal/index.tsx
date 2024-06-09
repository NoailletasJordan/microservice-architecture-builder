import CustomModal from '@/components/CustomModal'
import { Box, Button, Group, Text } from '@mantine/core'
import { useReactFlow } from 'reactflow'

interface Props {
  opened: boolean
  close: () => void
}

export default function DeleteModal({ opened, close }: Props) {
  const flowInstance = useReactFlow()
  const handleReset = () => {
    flowInstance.setNodes([])
    flowInstance.setEdges([])
    close()
  }

  return (
    <CustomModal opened={opened} onClose={close} title="Shareable link">
      <Box>
        <Text size="md">This will clear the whole board. Are you sure?</Text>
        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button color="pink" onClick={handleReset}>
            Confirm
          </Button>
        </Group>
      </Box>
    </CustomModal>
  )
}
