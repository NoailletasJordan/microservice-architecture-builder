import SubTitle from '@/components/SubTitle'
import { CSSVAR } from '@/contants'
import {
  ICON_STYLE,
  NO_DRAG_REACTFLOW_CLASS,
} from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Box } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { useState } from 'react'

interface Props {
  onClickEdit: () => void
  value: string
}

export default function NonInput({ value, onClickEdit }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'grid', gridTemplateColumns: '1fr max-content' }}
      mih="1.75rem"
    >
      <SubTitle truncate="end">{value}</SubTitle>
      {isHovered && (
        <ActionIcon
          className={NO_DRAG_REACTFLOW_CLASS}
          variant="light"
          size="md"
          aria-label="Settings"
          color={CSSVAR['--text']}
          onClick={onClickEdit}
        >
          <IconEdit style={ICON_STYLE} stroke={1.5} />
        </ActionIcon>
      )}
    </Box>
  )
}
