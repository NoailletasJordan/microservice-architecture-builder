import Line from '@/components/Line'
import {
  ConnectionLineComponentProps,
  getSmoothStepPath,
  useStore,
} from '@xyflow/react'

export default function ConnexionLine(_props: ConnectionLineComponentProps) {
  // Hijack connexion system
  const connexion = useStore((store) => store.connection)

  const [path] = getSmoothStepPath({
    sourceX: connexion.from?.x as number,
    sourceY: connexion.from?.y as number,
    targetX: connexion.to?.x as number,
    targetY: connexion.to?.y as number,
    sourcePosition: connexion.fromHandle?.position,
    targetPosition: connexion.toHandle?.position,
  })

  return <Line d={path} strokeDasharray="3,8" />
}
