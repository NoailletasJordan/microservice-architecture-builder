import { TBoardModel } from '@/contexts/User/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Group, Title } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'

export default function BoardItem({ board }: { board: Partial<TBoardModel> }) {
  return (
    <Group bg="gray.8" p="xs">
      <Title order={5}>{board.title}</Title>
      <Group gap="xs">
        <ActionIcon>
          <IconEdit style={ICON_STYLE} />
        </ActionIcon>
        <ActionIcon>
          <IconTrash style={ICON_STYLE} />
        </ActionIcon>
      </Group>
    </Group>
  )
}
