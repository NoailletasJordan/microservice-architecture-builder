import { connexionPreviewContext } from '@/contexts/ConnexionPreview/context'
import { useMantineTheme } from '@mantine/core'
import {
  ConnectionLineComponentProps,
  getSmoothStepPath,
  useStore,
} from '@xyflow/react'
import { motion } from 'motion/react'
import { useContext } from 'react'

export default function ConnexionLine(props: ConnectionLineComponentProps) {
  // Hijack connexion system
  const connexion = useStore((store) => store.connection)
  const { activeDuet: isUsingButton } = useContext(connexionPreviewContext)

  const buttonPreviewObject = {
    sourceX: connexion.from?.x as number,
    sourceY: connexion.from?.y as number,
    targetX: connexion.to?.x as number,
    targetY: connexion.to?.y as number,
    sourcePosition: connexion.fromHandle?.position,
    targetPosition: connexion.toHandle?.position,
  }

  const dragPreviewObject = {
    sourceX: props.fromX,
    sourceY: props.fromY,
    targetX: props.toX,
    targetY: props.toY,
    sourcePosition: props.fromPosition,
    targetPosition: props.toPosition,
  }

  const [path] = getSmoothStepPath(
    isUsingButton ? buttonPreviewObject : dragPreviewObject,
  )

  const theme = useMantineTheme()

  const commonPathProps: React.ComponentProps<typeof motion.path> = {
    ['aria-label']: 'preview-edge',
    fill: 'none',
    stroke: theme.colors.blue[6],
    d: path,
    transition: {
      delay: 0.05,
      duration: isUsingButton ? 0.35 : 0.0,
      ease: 'easeOut',
    },
    strokeWidth: 2,
    opacity: 0.7,
  }

  return (
    <>
      <motion.path
        {...commonPathProps}
        initial={{ pathLength: 0, pathOffset: 0.5 }}
        animate={{
          pathLength: 0.5,
          pathOffset: 0.5,
        }}
      ></motion.path>
      <motion.path
        {...commonPathProps}
        initial={{ pathLength: 0, pathOffset: 0.5 }}
        animate={{
          pathLength: 0.5,
          pathOffset: 0,
        }}
      ></motion.path>
    </>
  )
}

function ConnexionLineFromButton({ duet }: { duet: [string, string] }) {
  const { activeDuet: isUsingButton } = useContext(connexionPreviewContext)

  return (
    <>
      <motion.path
        {...commonPathProps}
        initial={{ pathLength: 0, pathOffset: 0.5 }}
        animate={{
          pathLength: 0.5,
          pathOffset: 0.5,
        }}
      ></motion.path>
      <motion.path
        {...commonPathProps}
        initial={{ pathLength: 0, pathOffset: 0.5 }}
        animate={{
          pathLength: 0.5,
          pathOffset: 0,
        }}
      ></motion.path>
    </>
  )
}
