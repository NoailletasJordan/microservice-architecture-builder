import Line from '@/components/Line'
import {
  ConnectionLineComponentProps,
  getStraightPath,
  useStore,
} from '@xyflow/react'

export default function ConnexionLine(props: ConnectionLineComponentProps) {
  const { fromX, fromY } = props

  // Hijack connexion system
  const connexion = useStore((store) => store.connection)
  /** Temp */
  console.log('props:', props.toX, connexion.to?.x)

  const [path] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: connexion.to?.x,
    targetY: connexion.to?.y,
  })

  return <Line d={path} strokeDasharray="3,8" />
}
