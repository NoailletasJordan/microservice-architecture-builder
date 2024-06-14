import {
  CARD_WIDTH,
  IModuleRichText,
} from '@/pages/BoardPage/configs/constants'
import { handleUpdateModule } from '@/pages/BoardPage/configs/helpers'
import { Collapse } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { RichTextEditor, getTaskListExtension } from '@mantine/tiptap'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TipTapTaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cloneDeep } from 'lodash'
import { useReactFlow } from 'reactflow'

interface Props {
  module: IModuleRichText
}

export default function RichText({ module }: Props) {
  const flowInstance = useReactFlow()

  const editor = useEditor({
    onUpdate({ editor }) {
      const newModule = cloneDeep(module)
      newModule.data.text = editor.getHTML()
      handleUpdateModule(module.id, newModule, flowInstance)
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
    content: module.data.text,
  })

  const [debouncedIsFocused] = useDebouncedValue(editor?.isFocused, 170)

  return (
    <RichTextEditor editor={editor} miw={CARD_WIDTH} ml={12}>
      {/* hack - TaskList looses input focus on click for a bit  */}
      <Collapse in={editor?.isFocused || !!debouncedIsFocused}>
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
