import { connexionContext } from '@/contexts/Connexion/constants'
import { useContext } from 'react'
import { ConnectionLineComponentProps, getStraightPath } from 'reactflow'
import { PreviewLine } from '../CustomEdge/components/Line'
import EdgeActions from '../CustomEdge/components/Line/EdgeActions'

const MIN_DISTANCE_LABEL = 150

export default function ConnexionLine(props: ConnectionLineComponentProps) {
  const { fromX, fromY, toX, toY } = props
  const { connexionType } = useContext(connexionContext)

  const [path, labelX, labelY] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  })

  const distanceX = Math.abs(fromX - toX)
  const distanceY = Math.abs(fromY - toY)
  const showLabel = distanceX + distanceY >= MIN_DISTANCE_LABEL

  return (
    <g>
      <PreviewLine path={path} />
      <EdgeActions
        connexionType={connexionType}
        labelX={labelX}
        labelY={labelY}
        opacity={showLabel ? 1 : 0}
      />
    </g>
  )
}
