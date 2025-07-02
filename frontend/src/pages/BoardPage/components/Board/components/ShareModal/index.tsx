import CustomButtonPrimary from '@/components/CustomButtonPrimary'
import CustomModal from '@/components/CustomModal'
import { themeDarkColorVariables } from '@/contants'
import { showNotificationSuccess } from '@/helpers-react'
import {
  ICON_STYLE,
  TCustomNode,
  shareHashTocken,
} from '@/pages/BoardPage/configs/constants'
import {
  Card,
  Grid,
  Group,
  Space,
  Text,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core'
import { useClipboard, useMediaQuery } from '@mantine/hooks'
import { IconAlertTriangle, IconCopy } from '@tabler/icons-react'
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
        <div>
          <Grid py="xs" align="center">
            <Grid.Col span={{ xs: 8 }}>
              <TextInput
                variant="unstyled"
                px="xs"
                py={3}
                data-testid="share-link-input"
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
                  showNotificationSuccess({
                    message: 'Copied to clipboard',
                    autoClose: 3000,
                  })
                  handleClose()
                }}
                fullWidth
                size="lg"
                leftSection={<IconCopy />}
              >
                Copy link
              </CustomButtonPrimary>
            </Grid.Col>
          </Grid>
          <Space h="xs" />
          <Text size="sm">
            *This link captures a snapshot of your work at this point in time.
          </Text>
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
