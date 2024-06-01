import { Group, Paper, ThemeIcon } from '@mantine/core'
import { EdgeLabelRenderer } from 'reactflow'
import { IConnexion, connexionConfig } from '../../../../connexionContants'

interface Props {
  labelX: number
  labelY: number
  handleDeleteEdge: () => void
  connection: IConnexion
}

export default function EdgeActions({
  labelX,
  labelY,
  // handleDeleteEdge,
  connection,
}: Props) {
  const Icon = connexionConfig[connection.connexionType].Icon

  return (
    <EdgeLabelRenderer>
      <div className="nodrag nopan" onClick={(e) => e.stopPropagation()}>
        <Paper
          withBorder
          radius="xl"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px) `,
            pointerEvents: 'all',
            overflow: 'hidden',
          }}
          p=".2rem"
        >
          <Group gap="xs">
            <ThemeIcon variant="subtle">
              <Icon />
            </ThemeIcon>
          </Group>
        </Paper>
      </div>
    </EdgeLabelRenderer>
  )
}
