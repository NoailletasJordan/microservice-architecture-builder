import RichEditor from '@/components/RichEditor'
import {
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
} from '@/pages/BoardPage/configs/constants'
import { Box } from '@mantine/core'
import { Editor } from '@tiptap/react'
import { NodeToolbar, Position, useOnViewportChange } from '@xyflow/react'
import { useState } from 'react'

interface Props {
  editor: Editor | null
}

export default function NoteSection({ editor }: Props) {
  const shouldOpen = editor && (editor.isFocused || !editor.isEmpty)
  const [zoom, setZoom] = useState(1)
  useOnViewportChange({
    onChange: (viewport) => {
      setZoom(viewport.zoom)
    },
  })

  return (
    <NodeToolbar isVisible position={Position.Bottom}>
      <Box
        className={`${NO_DRAG_REACTFLOW_CLASS} ${NO_WhEEL_REACTFLOW_CLASS} ${NO_PAN_REACTFLOW_CLASS}`}
        style={{ transformOrigin: 'top', scale: zoom }}
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
    </NodeToolbar>
  )
}
