import CustomButtonPrimary from '@/components/CustomButtonPrimary'
import CustomModal from '@/components/CustomModal'
import { themeDarkColorVariables } from '@/contants'
import {
  ICON_STYLE,
  TCustomNode,
  shareHashTocken,
} from '@/pages/BoardPage/configs/constants'
import {
  Card,
  Grid,
  Group,
  Text,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core'
import { useClipboard, useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  IconAlertTriangle,
  IconClipboardCheck,
  IconCopy,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { ReactFlowInstance, useReactFlow } from 'reactflow'

interface Props {
  opened: boolean
  close: () => void
  nodes: TCustomNode[]
}
const getLink = (flowInstance: ReactFlowInstance) => {
  const baseUrl = `${window.location.origin}`
  const stringifiedData = JSON.stringify({
    nodes: flowInstance.getNodes(),
    edges: flowInstance.getEdges(),
  })
  return `${baseUrl}/${shareHashTocken}${encodeURIComponent(stringifiedData)}`
}

export default function SharableModal({ close, opened, nodes }: Props) {
  const theme = useMantineTheme()
  const maxXS = useMediaQuery('(max-width: 576px)')
  const clipboard = useClipboard({ timeout: 3000 })

  const [link, setLink] = useState('')
  const flowInstance = useReactFlow()

  useEffect(() => {
    const fullUrl = getLink(flowInstance)
    setLink(fullUrl)

    return () => {}
  }, [opened, flowInstance])

  const handleClose = () => {
    clipboard.reset()
    close()
  }

  const emptyNodes = !nodes.length

  return (
    <CustomModal
      fullScreen={maxXS}
      opened={opened}
      onClose={handleClose}
      title={emptyNodes ? 'Empty Board' : 'Shareable link'}
    >
      {emptyNodes ? (
        <Empty />
      ) : (
        <Grid py="xs" align="center">
          <Grid.Col span={{ xs: 8 }}>
            <TextInput
              variant="unstyled"
              px="xs"
              py={3}
              styles={{
                input: {
                  color: themeDarkColorVariables['--text'],
                },
              }}
              style={{
                borderRadius: 4,
                fontSize: theme.fontSizes.xs,
                border: `1px solid ${themeDarkColorVariables['--border']}`,
              }}
              bg={themeDarkColorVariables['--surface-strong']}
              readOnly
              value={link}
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ xs: 4 }}>
            <CustomButtonPrimary
              onClick={() => {
                !clipboard.copied && clipboard.copy(link)
                notifications.show({
                  icon: (
                    <ThemeIcon radius="xl" color="primary.10" variant="outline">
                      <IconClipboardCheck style={ICON_STYLE} />
                    </ThemeIcon>
                  ),
                  title: 'Copied to clipboard',
                  message: '',
                  autoClose: 3000,
                })
                handleClose()
              }}
              fullWidth
              size="lg"
              leftSection={<IconCopy style={ICON_STYLE} />}
            >
              Copy link
            </CustomButtonPrimary>
          </Grid.Col>
        </Grid>
      )}
    </CustomModal>
  )
}

function Empty() {
  return (
    <Card
      bg="background.8"
      withBorder
      style={{ border: '1px solid var(--mantine-color-orange-5)' }}
    >
      <Group>
        <ThemeIcon variant="transparent" color="orange" radius="xl" size="lg">
          <IconAlertTriangle style={ICON_STYLE} />
        </ThemeIcon>

        <Text size="md">Please add services to your board before sharing.</Text>
      </Group>
    </Card>
  )
}
