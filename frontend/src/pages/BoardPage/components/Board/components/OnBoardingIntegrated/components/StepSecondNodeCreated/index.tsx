import OnboardingMouseAreaIndicator from '@/components/OnboardingMouseAreaIndicator'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useConnection, ViewportPortal } from '@xyflow/react'
import { motion } from 'motion/react'

interface Props {
  firstNode: TCustomNode
  secondNode: TCustomNode
}
export default function StepSecondNodeCreated({
  firstNode,
  secondNode,
}: Props) {
  const connexion = useConnection()
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
          top: posY + 20,
          transition: 'border-color 0.2s ease-in-out',
          width: 190,
          height: 75,
          borderRadius: 4,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <OnboardingMouseAreaIndicator
            hideSquare={isHovering}
            text={isHovering ? 'Left click' : 'Mouse hover this area'}
          />
        </motion.div>
      </div>
    </ViewportPortal>
  )
}
