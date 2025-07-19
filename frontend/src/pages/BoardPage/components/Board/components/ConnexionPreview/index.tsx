import Line from '@/components/Line'
import {
  ConnectionLineComponentProps,
  getStraightPath,
  useStore,
} from '@xyflow/react'

export default function ConnexionLine(_props: ConnectionLineComponentProps) {
  // Hijack connexion system
  const connexion = useStore((store) => store.connection)

  const [path] = getStraightPath({
    sourceX: connexion.from?.x as number,
    sourceY: connexion.from?.y as number,
    targetX: connexion.to?.x as number,
    targetY: connexion.to?.y as number,
  })

  return <Line d={path} strokeDasharray="3,8" />
}
