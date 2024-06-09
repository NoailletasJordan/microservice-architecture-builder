import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Box, Button } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconLink } from '@tabler/icons-react'

interface Props {
  onClick: () => void
}

export default function SharableButton({ onClick }: Props) {
  const maxMD = useMediaQuery('(max-width: 992px)')

  return maxMD ? (
    <Box>
      <ActionIcon size="lg" onClick={onClick}>
        <IconLink style={{ width: '50%', height: '50%' }} />
      </ActionIcon>
    </Box>
  ) : (
    <Button leftSection={<IconLink style={ICON_STYLE} />} onClick={onClick}>
      {!maxMD && 'Share'}
    </Button>
  )
}
