import { COLOR_ONBOARDING } from '@/contants'
import { Text } from '@mantine/core'
import { IconArrowBigRight } from '@tabler/icons-react'
import { motion } from 'motion/react'

interface Props {
  posX: number
  posY: number
}

export default function AreaIndicator({ posX, posY }: Props) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: posX,
          top: posY,
          width: 80,
          aspectRatio: 1,
          borderRadius: 4,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <IconArrowBigRight
            style={{ strokeWidth: 1 }}
            color={COLOR_ONBOARDING}
            size="100%"
          />
        </motion.div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: posX,
          top: posY + 60,
          width: 160,
          aspectRatio: 1,
          borderRadius: 4,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Text fs="italic" c={COLOR_ONBOARDING}>
            Pane the board using left click + drag
          </Text>
        </motion.div>
      </div>
    </>
  )
}
