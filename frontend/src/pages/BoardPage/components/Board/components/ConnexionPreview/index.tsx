import Line from '@/components/Line'
import { ConnectionLineComponentProps, getStraightPath } from '@xyflow/react'

export default function ConnexionLine(props: ConnectionLineComponentProps) {
  const { fromX, fromY, toX, toY } = props

  const [path] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  })

  return <Line d={path} strokeDasharray="3,8" />
}
