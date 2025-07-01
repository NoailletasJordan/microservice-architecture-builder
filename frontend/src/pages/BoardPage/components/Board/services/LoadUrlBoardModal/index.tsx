import CustomModal from '@/components/CustomModal'
import { Button, Grid, Group, Space, Text, ThemeIcon } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useCurrentHash } from './hooks/useCurrentHash'
import { useHandleOnExternalUrl } from './hooks/useHandleOnExternalUrl'
import { useHandleCloseModal } from './hooks/useOnHandleCloseModal'
import { useOverwriteBoardData } from './hooks/useOverwriteBoardData'

export default function LoadLinkBoardModal() {
  const [opened, modalAction] = useDisclosure(false)
  const hash = useCurrentHash()
  const maxSM = useMediaQuery('(max-width: 768px)')
  const handleCloseModal = useHandleCloseModal(modalAction.close)
  const overwriteBoardData = useOverwriteBoardData({ hash, handleCloseModal })
  useHandleOnExternalUrl({ overwriteBoardData, hash, modalAction })

  return (
    <CustomModal
      fullScreen={maxSM}
      opened={opened}
      onClose={handleCloseModal}
      title="Warning: Load board from URL"
    >
      <Grid align="center" justify="center">
        <Grid.Col span="content">
          <ThemeIcon size="lg" variant="outline" color="pink">
            <IconAlertTriangle />
          </ThemeIcon>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text size="md" miw="8rem">
            Loading external board{' '}
            <Text component="span" fw="bold">
              {' '}
              will overwrite your current work
            </Text>
            . Do you still you want to proceed?
          </Text>
        </Grid.Col>
      </Grid>
      <Space h="md" />
      <Group justify="end">
        <Button variant="outline" color="gray.11" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button color="red.9" onClick={overwriteBoardData}>
          Load external board
        </Button>
      </Group>
    </CustomModal>
  )
}
