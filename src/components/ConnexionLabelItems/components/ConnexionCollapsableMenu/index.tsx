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
import { useDebouncedValue } from '@mantine/hooks'
import { RichTextEditor, getTaskListExtension } from '@mantine/tiptap'
import { IconArrowsExchange, IconCheck, IconTrash } from '@tabler/icons-react'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TipTapTaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cloneDeep, groupBy } from 'lodash'
import { useEffect, useState } from 'react'
import { Edge, useReactFlow } from 'reactflow'
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

  const [noteIsFocused, setNoteIsFocused] = useState(false)
  const defaultNote = '<p></p>'
  const noteContent = flowInstance.getEdge(connexion.id)?.data.note
  const noteisEmpty = !noteContent || noteContent === defaultNote
  const collapseAll = !configIsOpen && !noteIsFocused && noteisEmpty

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
            <TooltipWrapper label="Remove connexion" position="top">
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
        <CustomRichText
          onUpdate={(html) => {
            handleUpdateEdge(connexion.id, { note: html })
          }}
          initialContent={flowInstance.getEdge(connexion.id)!.data.note}
          onFocusChange={setNoteIsFocused}
          forceToolsOpen={configIsOpen}
        />
      </Paper>
    </Collapse>
  )
}

function CustomRichText({
  onUpdate,
  initialContent,
  onFocusChange,
  forceToolsOpen,
}: {
  onUpdate: (html: string, rawText: string) => void
  initialContent: string
  onFocusChange: (isFocused: boolean) => void
  forceToolsOpen: boolean
}) {
  const editor = useEditor({
    onUpdate({ editor }) {
      onUpdate(editor.getHTML(), editor.getText())
    },
    extensions: [
      StarterKit,
      getTaskListExtension(TipTapTaskList),
      Placeholder.configure({ placeholder: 'Add note ?' }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'test-item',
        },
      }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: initialContent,
  })

  useEffect(() => {
    onFocusChange?.(!!editor?.isFocused)
  }, [editor?.isFocused, onFocusChange])

  const [debouncedIsFocused] = useDebouncedValue(editor?.isFocused, 170)
  return (
    <RichTextEditor editor={editor} w={`calc(${CARD_WIDTH}px - 0.5rem)`}>
      {/* debounce hack - TaskList looses input focus on click for a bit  */}
      <Collapse
        in={forceToolsOpen || editor?.isFocused || !!debouncedIsFocused}
      >
        <RichTextEditor.Toolbar style={{ justifyContent: 'center' }}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.TaskList />
            <RichTextEditor.Hr />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      </Collapse>

      <RichTextEditor.Content fz="var(--mantine-font-size-sm)" />
    </RichTextEditor>
  )
}
