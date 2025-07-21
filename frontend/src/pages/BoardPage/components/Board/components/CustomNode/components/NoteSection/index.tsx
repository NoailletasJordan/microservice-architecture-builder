import RichEditor from '@/components/RichEditor'
import {
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { Box } from '@mantine/core'
import { Editor } from '@tiptap/react'
import { ViewportPortal } from '@xyflow/react'

interface Props {
  editor: Editor | null
  node?: TCustomNode
}

export default function NoteSection({ editor, node }: Props) {
  const shouldOpen = editor && (editor.isFocused || !editor.isEmpty)

  const paddingYPx = 8
  const nodeHeight = Number(node?.measured?.height)
  const nodeWidth = Number(node?.measured?.width)

  const nodePositionX = Number(node?.position?.x)
  const nodePositionY = Number(node?.position?.y)

  const nodeX = Number(nodePositionX) + nodeWidth / 2
  const nodeY = Number(nodePositionY) + nodeHeight + paddingYPx

  return (
    <ViewportPortal>
      <Box
        className={`${NO_DRAG_REACTFLOW_CLASS} ${NO_WhEEL_REACTFLOW_CLASS} ${NO_PAN_REACTFLOW_CLASS}`}
        style={{
          pointerEvents: 'auto',
          cursor: 'default',
          transformOrigin: 'top',
          position: 'absolute',
          transform: 'translateX(-50%)',
          top: nodeY,
          left: nodeX,
        }}
      >
        <Box
          style={{
            overflow: 'hidden',
            height: shouldOpen ? '100%' : 0,
          }}
        >
          <RichEditor editor={editor} />
        </Box>
      </Box>
    </ViewportPortal>
  )
}
