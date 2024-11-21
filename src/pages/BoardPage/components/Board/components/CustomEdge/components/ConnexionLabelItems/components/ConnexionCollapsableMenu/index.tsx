import DividerWrapper from '@/components/DividerWrapper'
import RichEditor from '@/components/RichEditor/index'
import StrongText from '@/components/StrongText'
import {
  IConnexion,
  IConnexionType,
  connexionConfig,
  connexionDirections,
} from '@/pages/BoardPage/components/Board/components/connexionContants'
import { CARD_WIDTH } from '@/pages/BoardPage/configs/constants'
import { handleUpdateEdge } from '@/pages/BoardPage/configs/helpers'
import {
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Group,
  Paper,
  Select,
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
          backgroundColor: !configIsOpen
            ? 'transparent'
            : 'var(--mantine-color-background-9)',
          borderColor: !configIsOpen
            ? 'transparent'
            : 'var(--mantine-color-background-9)',
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

            <Divider my="xs" />
            <Select
              data={selectData}
              value={connexion.connexionType}
              placeholder="Add connexion type"
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
                    <ThemeIcon size="lg" color="background.7">
                      <Icon stroke={1} />
                    </ThemeIcon>
                    <Text fs="initial">{label}</Text>
                  </Group>
                )
              }}
            />
          </Box>
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
        <ThemeIcon variant="transparent" size="xs" color="text.0">
          <Icon />
        </ThemeIcon>
      }
      variant="subtle"
      fullWidth
      justify="start"
      c="text.0"
    >
      <Text size="sm">{label}</Text>
    </Button>
  )
}
