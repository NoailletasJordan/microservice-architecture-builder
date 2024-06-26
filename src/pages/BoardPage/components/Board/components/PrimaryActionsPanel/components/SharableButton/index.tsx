import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Box, Button } from '@mantine/core'
import { IconLink } from '@tabler/icons-react'

interface Props {
  onClick: () => void
  shrink: boolean
}

export default function SharableButton({ onClick, shrink }: Props) {
  return shrink ? (
    <Box>
      <ActionIcon size="lg" onClick={onClick}>
        <IconLink style={{ width: '50%', height: '50%' }} />
      </ActionIcon>
    </Box>
  ) : (
    <Button leftSection={<IconLink style={ICON_STYLE} />} onClick={onClick}>
      Share
    </Button>
  )
}
