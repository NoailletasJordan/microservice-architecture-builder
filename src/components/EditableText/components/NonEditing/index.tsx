import SubTitle from '@/components/SubTitle'
import { CSSVAR } from '@/contants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Box } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

interface Props {
  onClickEdit: () => void
  value: string
}

export default function NonInput({ value, onClickEdit }: Props) {
  return (
    <Box style={{ display: 'grid', gridTemplateColumns: '1fr max-content' }}>
      <SubTitle truncate="end">{value}</SubTitle>
      <Box>
        <ActionIcon
          variant="light"
          aria-label="Settings"
          color={CSSVAR['--text']}
          onClick={onClickEdit}
        >
          <IconEdit style={ICON_STYLE} stroke={1.5} />
        </ActionIcon>
      </Box>
    </Box>
  )
}
