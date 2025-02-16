import DividerWrapper from '@/components/DividerWrapper'
import RichEditor from '@/components/RichEditor/index'
import StrongText from '@/components/StrongText'
import { CSSVAR } from '@/contants'
import {
  IConnexion,
  IConnexionType,
  connexionConfig,
  connexionDirections,
} from '@/pages/BoardPage/components/Board/components/connexionContants'
import { CARD_WIDTH, ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { handleUpdateEdge } from '@/pages/BoardPage/configs/helpers'
import {
  Box,
  Button,
  Center,
  Collapse,
  Group,
  Paper,
  Select,
  Space,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconArrowsExchange, IconTrash } from '@tabler/icons-react'
import { Editor } from '@tiptap/react'
import { groupBy } from 'lodash'
import { ElementType } from 'react'
import { Edge, useReactFlow } from 'reactflow'

interface Props {
  handleDeleteEdge: () => void
  configIsOpen: boolean
  connexion: IConnexion
  editor: Editor | null
  collapseAll: boolean
}

function getNextDirection(
  currentColor: IConnexion['direction'],
): IConnexion['direction'] {
  const currentIndex = connexionDirections.indexOf(currentColor)
  const nextIndex = (currentIndex + 1) % connexionDirections.length
  return connexionDirections[nextIndex]
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
            <DividerWrapper>
              <StrongText>Connexion parameters</StrongText>
            </DividerWrapper>

            <LineItem
              label="Switch direction"
              Icon={IconArrowsExchange}
              onClick={() => {
                const edge = flowInstance.getEdge(
                  connexion.id,
                ) as Edge<IConnexion>
                const nextDirection = getNextDirection(edge.data!.direction)
                handleUpdateEdge(
                  connexion.id,
                  {
                    direction: nextDirection,
                  },
                  flowInstance,
                )
              }}
            />
            <LineItem
              Icon={IconTrash}
              onClick={handleDeleteEdge}
              label="Remove connexion"
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

function LineItem({
  Icon,
  label,
  onClick,
}: {
  onClick: () => void
  label: string
  Icon: ElementType
}) {
  return (
    <Button
      onClick={onClick}
      leftSection={
        <ThemeIcon
          variant="outline"
          style={{ border: 'none' }}
          color="gray.10"
          size="sm"
        >
          <Icon style={ICON_STYLE} />
        </ThemeIcon>
      }
      vars={() => ({
        root: {
          '--button-hover': CSSVAR['--surface-strong'],
        },
      })}
      variant="subtle"
      fullWidth
      justify="start"
    >
      <Text size="sm">{label}</Text>
    </Button>
  )
}
