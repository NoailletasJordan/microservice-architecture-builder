import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useConnection, ViewportPortal } from '@xyflow/react'

interface Props {
  firstNode: TCustomNode
  secondNode: TCustomNode
}
export default function StepSecondNodeCreated({
  firstNode,
  secondNode,
}: Props) {
  const connexion = useConnection()
  /** Temp */
  console.log('connex:', connexion)
  const posX =
    (firstNode.position?.x +
      (firstNode.measured?.width || 0) / 2 +
      secondNode.position?.x +
      (secondNode.measured?.width || 0) / 2) /
    2
  const posY =
    (firstNode.position?.y +
      (firstNode.measured?.height || 0) / 2 +
      secondNode.position?.y +
      (secondNode.measured?.height || 0) / 2) /
    2

  return (
    <AreaIndicator posX={posX} posY={posY} isHovering={connexion.inProgress} />
  )
}

function AreaIndicator({
  posX,
  posY,
  isHovering,
}: {
  posX: number
  posY: number
  isHovering: boolean
}) {
  return (
    <ViewportPortal>
      <div
        style={{
          position: 'absolute',
          left: posX,
          top: posY,
          transition: 'border-color 0.2s ease-in-out',
          width: 230,
          height: 75,
          borderRadius: 4,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isHovering ? '1px solid #ccc0' : '1px solid #ccc9',
        }}
      ></div>

      <div
        style={{
          position: 'absolute',
          left: posX,
          top: posY + 80,

          width: 230,
          borderRadius: 4,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>{isHovering ? '' : 'Mouse hover this area'}</p>
      </div>
    </ViewportPortal>
  )
}
