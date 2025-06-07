import CustomButtonPrimary from '@/components/CustomButtonPrimary'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Box } from '@mantine/core'
import { IconLink } from '@tabler/icons-react'

interface Props {
  onClick: () => void
  shrink: boolean
}

export default function SharableButton({ onClick, shrink }: Props) {
  return shrink ? (
    <Box>
      <ActionIcon size="lg" onClick={onClick}>
        <IconLink style={ICON_STYLE} />
      </ActionIcon>
    </Box>
  ) : (
    <CustomButtonPrimary
      size="md"
      leftSection={<IconLink style={ICON_STYLE} />}
      onClick={onClick}
    >
      Share
    </CustomButtonPrimary>
  )
}
