import { IModuleRichText } from '@/pages/BoardPage/components/Board/constants'
import { deepCopy } from '@/pages/BoardPage/helpers'
import { Link, RichTextEditor, getTaskListExtension } from '@mantine/tiptap'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TipTapTaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  updateModule: (newModule: IModuleRichText) => void
  module: IModuleRichText
}

const DEFAULT_TEXT =
  '<h3 style="text-align: center">Note</h3><p><strong>Here some description...</strong></p><ul class="m_8b44009a mantine-RichTextEditor-taskList" data-type="taskList"><li class="test-item" data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p><strong>Routing</strong></p><ul class="m_8b44009a mantine-RichTextEditor-taskList" data-type="taskList"><li class="test-item" data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Homepage</p></div></li><li class="test-item" data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Dashboard</p></div></li></ul></div></li></ul><p>To continue...</p>'

export default function RichText({ module, updateModule }: Props) {
  const editor = useEditor({
    onUpdate({ editor }) {
      const newModule = deepCopy(module)
      newModule.data.text = editor.getHTML()
      updateModule(newModule)
    },

    extensions: [
      StarterKit,
      Underline,
      Link,
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
    content: module.data.text || DEFAULT_TEXT,
  })

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.BulletList />
          <RichTextEditor.TaskList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Hr />
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
