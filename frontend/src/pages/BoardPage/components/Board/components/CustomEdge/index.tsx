import Line from '@/components/Line'
import { clickCanvaContext } from '@/contexts/ClickCanvaCapture/constants'
import ConnexionLabelItems from '@/pages/BoardPage/components/Board/components/CustomEdge/components/ConnexionLabelItems'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useDisclosure } from '@mantine/hooks'
import { EdgeProps, getSmoothStepPath, useReactFlow } from '@xyflow/react'
import { useContext, useState } from 'react'
import { TCustomEdge } from '../connexionContants'

const STROKE_WIDTH_FOCUSED = 3

export default function CustomEdge(props: EdgeProps<TCustomEdge>) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  } = props
  const [mouveIsOver, setMouveIsOver] = useState(false)
  const [configIsOpen, { toggle: toggleMenu, close: closeMenu }] =
    useDisclosure(false)
  const { triggerClickCanva } = useContext(clickCanvaContext)

  const { setEdges } = useReactFlow<TCustomNode, TCustomEdge>()
  const { connexionType, direction } = data!

  const [bezierPathReverse] = getSmoothStepPath({
    sourceX: targetX,
    sourceY: targetY,
    sourcePosition: targetPosition,
    targetPosition: sourcePosition,
    targetX: sourceX,
    targetY: sourceY,
  })
  const [bezierPathForward, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  })

  const handleDeleteEdge = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id))
  }

  // Large invisible line helping catching mouseover and clicks
  const invisibleInteractionLine = (
    <Line
      d={bezierPathForward}
      stroke="transparent"
      strokeDasharray=""
      strokeWidth={14}
      onClick={() => {
        triggerClickCanva()
        setTimeout(() => {
          toggleMenu()
        }, 0)
      }}
      onMouseMove={() => setMouveIsOver(true)}
      onMouseLeave={() => setMouveIsOver(false)}
    />
  )

  const largeLine = configIsOpen || mouveIsOver
  let lineComponent
  switch (direction) {
    case 'forward': {
      const dashedLineProps = {
        strokeWidth: largeLine ? STROKE_WIDTH_FOCUSED : 1,
        d: bezierPathForward,
        animated: true,
      }
      lineComponent = <Line {...dashedLineProps} />
      break
    }

    case 'reverse': {
      const dashedLineProps = {
        strokeWidth: largeLine ? STROKE_WIDTH_FOCUSED : 1,
        d: bezierPathReverse,
        animated: true,
      }
      lineComponent = <Line {...dashedLineProps} />
      break
    }

    default: {
      const fullLineProps = {
        strokeWidth: largeLine ? STROKE_WIDTH_FOCUSED : 1,
        d: bezierPathForward,
        strokeDasharray: '',
      }
      lineComponent = <Line {...fullLineProps} />
      break
    }
  }

  return (
    <>
      {lineComponent}
      {invisibleInteractionLine}
      <ConnexionLabelItems
        handleDeleteEdge={handleDeleteEdge}
        labelX={labelX}
        labelY={labelY}
        connexionType={connexionType}
        connexion={props.data!}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
        configIsOpen={configIsOpen}
      />
    </>
  )
}
