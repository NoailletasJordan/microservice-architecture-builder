import RichEditor from '@/components/RichEditor/index'
import StrongText from '@/components/StrongText'
import TooltipWrapper from '@/components/TooltipWrapper'
import { CSSVAR } from '@/contants'
import {
  IConnexion,
  IConnexionType,
  connexionConfig,
} from '@/pages/BoardPage/components/Board/components/connexionContants'
import { CARD_WIDTH, ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { handleUpdateEdge } from '@/pages/BoardPage/configs/helpers'
import {
  ActionIcon,
  Box,
  Center,
  Collapse,
  Group,
  Paper,
  Select,
  Space,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { Editor } from '@tiptap/react'
import { groupBy } from 'lodash'
import { useReactFlow } from 'reactflow'

interface Props {
  handleDeleteEdge: () => void
  configIsOpen: boolean
  connexion: IConnexion
  editor: Editor | null
  collapseAll: boolean
}

const connexionsByGroup = groupBy(connexionConfig, 'group')
const selectData = Object.entries(connexionsByGroup).map(
  ([group, listItem]) => {
    return {
      group,
      items: listItem.map(({ value, label }) => ({
        value,
        label,
      })),
    }
  },
)

export default function ConnexionCollapsableMenu({
  connexion,
  handleDeleteEdge,
  configIsOpen,
  collapseAll,
  editor,
}: Props) {
  const flowInstance = useReactFlow()

  return (
    <Collapse in={!collapseAll}>
      <Paper
        withBorder
        w={CARD_WIDTH + 12}
        style={{
          backgroundColor: !configIsOpen ? 'transparent' : CSSVAR['--surface'],
          border: `1px solid ${
            !configIsOpen ? 'transparent' : CSSVAR['--border']
          }`,
        }}
      >
        <Collapse in={configIsOpen}>
          <Box p="xs" pt={0}>
            <Group pt="xs" justify="space-between">
              <StrongText>Parameters</StrongText>
              <TooltipWrapper label="Delete the connexion">
                <ActionIcon
                  onClick={handleDeleteEdge}
                  data-testid={`delete-edge-${connexion.id}`}
                  size="md"
                  color="red"
                  variant="outline"
                >
                  <IconTrash style={ICON_STYLE} />
                </ActionIcon>
              </TooltipWrapper>
            </Group>

            <Space h="lg" />

            <Select
              data={[
                { value: 'duplex', label: 'Bi-directionnal / Not specified' },
                { value: 'forward', label: 'Direction 1' },
                { value: 'reverse', label: 'Direction 2' },
              ]}
              renderOption={({ option: { label } }) => {
                return <Text size="xs">{label}</Text>
              }}
              label={
                <Text fw="600" pb="xs" c={CSSVAR['--text-strong']} size="sm">
                  Communication direction
                </Text>
              }
              value={connexion.direction}
              onChange={(nextDirection) => {
                handleUpdateEdge(
                  connexion.id,
                  {
                    direction: nextDirection as IConnexion['direction'],
                  },
                  flowInstance,
                )
              }}
            />
            <Space h="sm" />
            <Select
              data={selectData}
              label={
                <Text fw="600" pb="xs" c={CSSVAR['--text-strong']} size="sm">
                  Communication protocol
                </Text>
              }
              value={connexion.connexionType}
              placeholder="Not specified"
              allowDeselect
              onChange={(newConnexionType) => {
                handleUpdateEdge(
                  connexion.id,
                  {
                    connexionType: newConnexionType,
                  } as { connexionType: IConnexionType },
                  flowInstance,
                )
              }}
              renderOption={({ option: { label, value } }) => {
                const { Icon } = connexionConfig[value as IConnexionType]
                return (
                  <Group gap="xs">
                    <ThemeIcon size="lg" color="gray.5">
                      <Icon stroke={1} />
                    </ThemeIcon>
                    <Text size="xs">{label}</Text>
                  </Group>
                )
              }}
            />
          </Box>
          <Space h="sm" />
          <Text c={CSSVAR['--text-strong']} pb="xs" pl="xs" fw="600" size="sm">
            Note
          </Text>
        </Collapse>
        <Center mb="xs">
          <RichEditor editor={editor} forceToolsOpen={configIsOpen} />
        </Center>
      </Paper>
    </Collapse>
  )
}
