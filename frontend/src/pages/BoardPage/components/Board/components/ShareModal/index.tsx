import CustomModal from '@/components/CustomModal'
import { themeDarkColorVariables } from '@/contants'
import { ICON_STYLE, TCustomNode } from '@/pages/BoardPage/configs/constants'
import { Card, Group, Text, ThemeIcon } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconAlertTriangle } from '@tabler/icons-react'
import SaveAsImage from './components/SaveAsImage'
import ShareableLink from './components/ShareableLink'
import ShareModalSeparator from './components/ShareModalSeparator'

interface Props {
  opened: boolean
  close: () => void
  nodes: TCustomNode[]
}

export default function SharableModal({ close, opened, nodes }: Props) {
  const maxXS = useMediaQuery('(max-width: 576px)')
  const emptyNodes = !nodes.length

  return (
    <CustomModal
      fullScreen={maxXS}
      opened={opened}
      onClose={close}
      title={emptyNodes ? 'Empty Board' : 'Sharing method'}
    >
      {emptyNodes ? (
        <Empty />
      ) : (
        <div>
          <ShareableLink opened={opened} close={close} />

          <ShareModalSeparator />
          <SaveAsImage isOpened={opened} close={close} />
        </div>
      )}
    </CustomModal>
  )
}

function Empty() {
  return (
    <Card
      bg={themeDarkColorVariables['--surface']}
      withBorder
      style={{ border: '1px solid orange' }}
    >
      <Group>
        <ThemeIcon variant="transparent" color="orange.7" radius="xl" size="lg">
          <IconAlertTriangle style={ICON_STYLE} />
        </ThemeIcon>

        <Text size="md">Please add services to your board before sharing.</Text>
      </Group>
    </Card>
  )
}
