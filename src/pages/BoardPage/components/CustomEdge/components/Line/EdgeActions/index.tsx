import { ActionIcon, Center, Paper } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { EdgeLabelRenderer, useViewport } from 'reactflow'
import { iconStyle } from '../../../../../../../utils'

interface Props {
  labelX: number
  labelY: number
  handleDeleteEdge: () => void
}

const itemStyle = {
  paddingRight: '.3rem',
  display: 'grid',
  gridTemplateColumns: 'max-content auto',
  padding: '.1rem',
  gap: '0.1rem',
}

export default function EdgeActions({
  labelX,
  labelY,
  handleDeleteEdge,
}: Props) {
  const { zoom } = useViewport()

  return (
    <EdgeLabelRenderer>
      <div className="nodrag nopan" onClick={(e) => e.stopPropagation()}>
        <Paper
          withBorder
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px) scale( ${
              1.5 - zoom / 2.5
            })`,
            borderRadius: 5,
            pointerEvents: 'all',
            fontSize: '10px',
          }}
        >
          <div style={itemStyle}>
            <ActionIcon
              onClick={handleDeleteEdge}
              variant="filled"
              color="pink"
              aria-label="Settings"
              size="sm"
            >
              <IconTrash size="md" style={iconStyle} stroke={1.5} />
            </ActionIcon>
            <Center>Remove connection</Center>
          </div>
        </Paper>
      </div>
    </EdgeLabelRenderer>
  )
}
