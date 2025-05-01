import { CSSVAR } from '@/contants'
import { CARD_WIDTH } from '@/pages/BoardPage/configs/constants'
import { Collapse } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { RichTextEditor, getTaskListExtension } from '@mantine/tiptap'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TipTapTaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import { Editor, EditorOptions } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export const getEditorParams = ({
  onUpdate,
  initialContent,
}: {
  onUpdate: (html: string) => void
  initialContent: string
}) =>
  ({
    onUpdate({ editor }) {
      onUpdate(editor.getHTML())
    },
    extensions: [
      StarterKit,
      getTaskListExtension(TipTapTaskList),
      Placeholder.configure({ placeholder: 'Add note here' }),
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
  } as EditorOptions)

interface Props {
  forceToolsOpen?: boolean
  editor: Editor | null
}

const background = 'background.8'
export default function RichEditor({ editor, forceToolsOpen }: Props) {
  const [debouncedIsFocused] = useDebouncedValue(editor?.isFocused, 170)

  if (!editor) return null

  return (
    <RichTextEditor editor={editor} w={`calc(${CARD_WIDTH}px - 0.5rem)`}>
      {/* debounce hack - TaskList looses input focus on click for a bit  */}
      <Collapse
        in={forceToolsOpen || editor?.isFocused || !!debouncedIsFocused}
      >
        <RichTextEditor.Toolbar
          bg={CSSVAR['--surface']}
          style={{
            justifyContent: 'center',
            border: `1px solid ${CSSVAR['--border']}`,
          }}
        >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold bg={background} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft bg={background} />
            <RichTextEditor.AlignCenter bg={background} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.TaskList bg={background} />
            <RichTextEditor.Hr bg={background} />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      </Collapse>

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
