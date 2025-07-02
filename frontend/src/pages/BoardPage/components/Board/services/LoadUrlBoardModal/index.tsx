import CustomModal from '@/components/CustomModal'
import { USER_MAX_BOARD_AMOUNT } from '@/contants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { Button, Grid, Group, Space, Text, ThemeIcon } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useContext } from 'react'
import { useCurrentHash } from './hooks/useCurrentHash'
import { useHandleCloseModal } from './hooks/useHandleCloseModal'
import { useHandleOnExternalUrl } from './hooks/useHandleOnExternalUrl'
import { useOverwriteBoardData } from './hooks/useOverwriteBoardData'

export default function LoadLinkBoardModal() {
  const [opened, modalAction] = useDisclosure(false)
  const hash = useCurrentHash()
  const maxSM = useMediaQuery('(max-width: 768px)')
  const handleCloseModal = useHandleCloseModal(modalAction.close)
  const overwriteBoardData = useOverwriteBoardData({ hash, handleCloseModal })
  useHandleOnExternalUrl({ overwriteBoardData, hash, modalAction })

  const { boards } = useContext(userBoardsContext)
  const maxBoardsReached = boards.length >= USER_MAX_BOARD_AMOUNT
  const copy =
    copywrigtht[maxBoardsReached ? 'maximumBoardsAmount' : 'boardConflict']

  return (
    <CustomModal
      fullScreen={maxSM}
      opened={opened}
      onClose={handleCloseModal}
      title={copy.title}
    >
      <Grid align="center" justify="center">
        <Grid.Col span="content">
          <ThemeIcon size="lg" variant="outline" color="pink">
            <IconAlertTriangle />
          </ThemeIcon>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text size="md" miw="8rem">
            {copy.content}
          </Text>
        </Grid.Col>
      </Grid>
      <Space h="md" />
      <Group justify="end">
        <Button variant="outline" color="gray.11" onClick={handleCloseModal}>
          {copy.actionSecondary}
        </Button>
        {'actionPrimary' in copy && (
          <Button color="red.9" onClick={overwriteBoardData}>
            {copy.actionPrimary}
          </Button>
        )}
      </Group>
    </CustomModal>
  )
}

const copywrigtht = {
  maximumBoardsAmount: {
    title: 'Load board from URL',
    content: (
      <>
        Maximum board amount reached.
        <br />
        Please{' '}
        <Text component="span" fw="bold">
          delete one of your current boards
        </Text>{' '}
        and try again.
      </>
    ),
    actionSecondary: 'close',
  },
  boardConflict: {
    title: 'Warning: Load board from URL',
    content: (
      <>
        Loading external board{' '}
        <Text component="span" fw="bold">
          {' '}
          will overwrite your current work
        </Text>
        . Do you still you want to proceed?
      </>
    ),
    actionPrimary: 'Load external board',
    actionSecondary: 'Cancel',
  },
}
