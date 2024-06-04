import { IModuleRichText } from '@/pages/BoardPage/configs/constants'
import { handleUpdateModule } from '@/pages/BoardPage/configs/helpers'
import { Box } from '@mantine/core'
import { RichTextEditor, getTaskListExtension } from '@mantine/tiptap'
import Highlight from '@tiptap/extension-highlight'
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

  return (
    <Box fz="var(--mantine-font-size-sm)">
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.H3 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.TaskList />
            <RichTextEditor.Hr />
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </Box>
  )
}
