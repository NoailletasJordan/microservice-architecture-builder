import CustomModal from '@/components/CustomModal'
import { CSSVAR, showNotificationSuccess } from '@/contants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { Button, Group, Stack, Text } from '@mantine/core'
import { useContext } from 'react'
import { useIsDeleting_ } from './hooks/useIsDeleting_'

interface Props {
  opened: boolean
  close: () => void
}

export default function DeleteCurrentBoardModal({ opened, close }: Props) {
  const { remove, currentUserBoardId } = useContext(userBoardsContext)
  const isDeleting = useIsDeleting_()

  const handleDelete = async () => {
    if (!currentUserBoardId) return
    try {
      await remove(currentUserBoardId)
      showNotificationSuccess({
        title: 'Successfully deleted',
        message: 'I forwarded you to another one of your boards',
      })
    } catch (error) {
      console.error(error)
    }
    close()
  }

  return (
    <CustomModal opened={opened} onClose={close} title="Warning">
      <Stack>
        <Text>
          This operation will{' '}
          <Text component="span" c={CSSVAR['--text-strong']}>
            delete your current board
          </Text>
          . Would you still like to proceed ?
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button variant="outline" color="gray.11" onClick={close}>
            Cancel
          </Button>
          <Button loading={isDeleting} color="red.9" onClick={handleDelete}>
            Yes, delete the board
          </Button>
        </Group>
      </Stack>
    </CustomModal>
  )
}
