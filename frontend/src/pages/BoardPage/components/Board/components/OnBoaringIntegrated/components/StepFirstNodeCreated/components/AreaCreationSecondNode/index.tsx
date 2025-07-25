import OnboardingMouseAreaIndicator from '@/components/OnboardingMouseAreaIndicator'
import { motion } from 'motion/react'

export default function AreaCreationSecondNode({
  posX,
  posY,
}: {
  posX: number
  posY: number
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
        width: 330,
        aspectRatio: '2/1',
        borderRadius: 4,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <OnboardingMouseAreaIndicator text="Create a second node" />
      </motion.div>
    </div>
  )
}
