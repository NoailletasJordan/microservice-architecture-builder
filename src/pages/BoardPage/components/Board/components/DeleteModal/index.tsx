import CustomModal from '@/components/CustomModal'
import { CSSVAR } from '@/contants'
import { Button, Group, Stack, Text } from '@mantine/core'
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
    <CustomModal opened={opened} onClose={close} title="Warning">
      <Stack>
        <Text>
          This operation will{' '}
          <Text component="span" c={CSSVAR['--text-strong']}>
            erase your current work
          </Text>
          . Would you still like to proceed ?
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button variant="outline" color="gray.11" onClick={close}>
            Cancel
          </Button>
          <Button color="red.9" onClick={handleReset}>
            Yes, reset the board
          </Button>
        </Group>
      </Stack>
    </CustomModal>
  )
}
