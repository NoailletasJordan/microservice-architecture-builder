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
          <Button
            variant="outline"
            color="background"
            onClick={close}
            c="text.0"
          >
            Cancel
          </Button>
          <Button color="red.6" c="text.0" onClick={handleReset}>
            Confirm
          </Button>
        </Group>
      </Box>
    </CustomModal>
  )
}
