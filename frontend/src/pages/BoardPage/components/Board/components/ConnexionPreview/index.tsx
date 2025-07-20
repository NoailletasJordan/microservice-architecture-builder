import { connexionPreviewContext } from '@/contexts/ConnexionPreview/context'
import { MantineTheme, useMantineTheme } from '@mantine/core'
import {
  ConnectionLineComponentProps,
  getSmoothStepPath,
  useStore,
} from '@xyflow/react'
import { motion, Transition } from 'motion/react'
import { useContext } from 'react'

export default function ConnexionLine(props: ConnectionLineComponentProps) {
  const { activeDuet: isUsingButton } = useContext(connexionPreviewContext)

  return isUsingButton ? (
    <ConnexionLineFromButton />
  ) : (
    <ConnexionLineFromDragging {...props} />
  )
}

function ConnexionLineFromDragging(props: ConnectionLineComponentProps) {
  const [path] = getSmoothStepPath({
    sourceX: props.fromX,
    sourceY: props.fromY,
    targetX: props.toX,
    targetY: props.toY,
    sourcePosition: props.fromPosition,
    targetPosition: props.toPosition,
  })

  const theme = useMantineTheme()

  const commonPathProps = getCommonPathProps({
    theme,
    path,
  })

  return (
    <motion.path
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05, duration: 0 }}
      {...commonPathProps}
    />
  )
}

function ConnexionLineFromButton() {
  // Hijack connexion system
  const connexion = useStore((store) => store.connection)
  const theme = useMantineTheme()

  const [path] = getSmoothStepPath({
    sourceX: connexion.from?.x as number,
    sourceY: connexion.from?.y as number,
    targetX: connexion.to?.x as number,
    targetY: connexion.to?.y as number,
    sourcePosition: connexion.fromHandle?.position,
    targetPosition: connexion.toHandle?.position,
  })

  const commonPathProps: React.ComponentProps<typeof motion.path> =
    getCommonPathProps({
      theme,
      path,
    })

  const transition: Transition = {
    delay: 0.05,
    duration: 0.35,
    ease: 'easeOut',
  }

  return (
    <>
      <motion.path
        {...commonPathProps}
        transition={transition}
        initial={{ pathLength: 0, pathOffset: 0.5 }}
        animate={{
          pathLength: 0.5,
          pathOffset: 0.5,
        }}
      ></motion.path>
      <motion.path
        {...commonPathProps}
        transition={transition}
        initial={{ pathLength: 0, pathOffset: 0.5 }}
        animate={{
          pathLength: 0.5,
          pathOffset: 0,
        }}
      ></motion.path>
    </>
  )
}

const getCommonPathProps = ({
  theme,
  path,
}: {
  theme: MantineTheme
  path: string
}) =>
  ({
    ['aria-label']: 'preview-edge',
    fill: 'none',
    stroke: theme.colors.blue[6],
    d: path,
    strokeWidth: 2,
    opacity: 0.7,
  } as const)
