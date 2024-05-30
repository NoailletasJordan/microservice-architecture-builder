import { ICON_STYLE } from '@/pages/BoardPage/components/Board/constants'
import { ActionIcon, Box, Flex, Group } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

interface Props {
  onClickEdit: () => void
  value: string
}

export default function NonInput({ value, onClickEdit }: Props) {
  return (
    <Group gap="xs" justify="space-between">
      <Flex align="center" component="span" gap=".2rem">
        {value}
      </Flex>

      <Box>
        <ActionIcon
          variant="transparent"
          color="grey" // todo color
          aria-label="Settings"
          onClick={onClickEdit}
        >
          <IconEdit style={ICON_STYLE} stroke={1.5} />
        </ActionIcon>
      </Box>
    </Group>
  )
}
