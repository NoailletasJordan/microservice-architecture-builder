import { Group, Paper, ThemeIcon } from '@mantine/core'
import { EdgeLabelRenderer } from 'reactflow'
import { IConnexion, connexionConfig } from '../../../../connexionContants'

interface Props {
  labelX: number
  labelY: number
  connexionType: IConnexion['connexionType']
  opacity?: number
  handleDeleteEdge?: () => void
}

export default function EdgeActions({
  labelX,
  labelY,
  connexionType,
  opacity,
}: Props) {
  const Icon = connexionConfig[connexionType].Icon

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
            opacity,
            transition: 'opacity 300ms ease-out',
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
