import { getEditorParams } from '@/components/RichEditor'
import {
  IConnexion,
  IConnexionType,
  connexionConfig,
  connexionDirections,
} from '@/pages/BoardPage/components/Board/components/connexionContants'
import { CARD_WIDTH, ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Group,
  Paper,
  Select,
  Space,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconArrowsExchange, IconCheck, IconTrash } from '@tabler/icons-react'
import { useEditor } from '@tiptap/react'
import { cloneDeep, groupBy } from 'lodash'
import { Edge, useReactFlow } from 'reactflow'
import RichEditor from '../../../RichEditor/index'
import TooltipWrapper from '../../../TooltipWrapper/index'

interface Props {
  handleDeleteEdge?: () => void
  configIsOpen: boolean
  connexion: IConnexion
}

function getNextDirection(
  currentColor: IConnexion['direction'],
): IConnexion['direction'] {
  const currentIndex = connexionDirections.indexOf(currentColor)
  const nextIndex = (currentIndex + 1) % connexionDirections.length
  return connexionDirections[nextIndex]
}

export default function ConnexionCollapsableMenu({
  connexion,
  handleDeleteEdge,
  configIsOpen,
}: Props) {
  const flowInstance = useReactFlow()
  const connexionsByGroup = groupBy(connexionConfig, 'group')
  const handleUpdateEdge = (
    connexionId: IConnexion['id'],
    partialEdge: Partial<IConnexion>,
  ) => {
    flowInstance.setEdges((edges) =>
      edges.map((compEdge) => {
        if (compEdge.id !== connexionId) return compEdge

        const edgeCopy = cloneDeep(compEdge)
        edgeCopy.data = { ...edgeCopy.data, ...partialEdge }
        return edgeCopy
      }),
    )
  }

  const data = Object.entries(connexionsByGroup).map(([group, listItem]) => {
    return {
      group,
      items: listItem.map(({ value, label }) => ({
        value,
        label,
      })),
    }
  })

  const editor = useEditor(
    getEditorParams({
      initialContent: flowInstance.getEdge(connexion.id)!.data.note,
      onUpdate: (note: string) => handleUpdateEdge(connexion.id, { note }),
    }),
  )

  const noteContent = editor?.getText()
  const noteisEmpty = !noteContent
  const collapseAll = !configIsOpen && !editor?.isFocused && noteisEmpty

  return (
    <Collapse in={!collapseAll}>
      <Paper withBorder p=".2rem" w={CARD_WIDTH}>
        <Collapse in={configIsOpen}>
          <Group justify="space-between">
            <Button
              size="xs"
              variant="light"
              leftSection={<IconArrowsExchange />}
              onClick={() => {
                const edge = flowInstance.getEdge(
                  connexion.id,
                ) as Edge<IConnexion>
                const nextDirection = getNextDirection(edge.data!.direction)
                handleUpdateEdge(connexion.id, {
                  direction: nextDirection,
                })
              }}
            >
              Switch direction
            </Button>
            <TooltipWrapper label="Remove connexion">
              <ActionIcon
                variant="light"
                color="gray"
                onClick={handleDeleteEdge}
              >
                <IconTrash style={ICON_STYLE} />
              </ActionIcon>
            </TooltipWrapper>
          </Group>
          <Space h="xs" />
          <Select
            variant="default"
            data={data}
            value={connexion.connexionType}
            allowDeselect={false}
            onChange={(newConnexionType) => {
              handleUpdateEdge(connexion.id, {
                connexionType: newConnexionType,
              } as { connexionType: IConnexionType })
            }}
            renderOption={({ option: { label } }) => (
              <Group gap="xs">
                <Box h={30}>
                  <ThemeIcon size="lg" variant="light">
                    <IconCheck />
                  </ThemeIcon>
                </Box>
                <Text fs="initial">{label}</Text>
              </Group>
            )}
          />
          <Space h="xs" />
        </Collapse>
        <RichEditor editor={editor} forceToolsOpen={configIsOpen} />
      </Paper>
    </Collapse>
  )
}
