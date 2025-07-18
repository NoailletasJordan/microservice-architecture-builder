import CustomModal from '@/components/CustomModal'
import { CSSVAR } from '@/contants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { Button, Group, Stack, Text } from '@mantine/core'
import { useReactFlow } from '@xyflow/react'
import { TCustomEdge } from '../connexionContants'

interface Props {
  opened: boolean
  close: () => void
}

export const primaryActionText = 'Yes, clear the board'

export default function ClearCurrentBoard({ opened, close }: Props) {
  const flowInstance = useReactFlow<TCustomNode, TCustomEdge>()
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
            clear your current work
          </Text>
          . Would you still like to proceed ?
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button variant="outline" color="gray.11" onClick={close}>
            Cancel
          </Button>
          <Button color="red.9" onClick={handleReset}>
            {primaryActionText}
          </Button>
        </Group>
      </Stack>
    </CustomModal>
  )
}
