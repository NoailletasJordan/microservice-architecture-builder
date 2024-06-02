import { EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow'
import { IConnexion } from '../connexionContants'
import EdgeActions from './components/Line/EdgeActions'
import { DashedLine, FullLine } from './components/Line/index'

const OFFSET_DOUBLE = 0
// svg gradient dont get rendered on straight lines
// https://stackoverflow.com/a/34687362
const NO_STRAIGHT_LINE_OFFSET = 0.001

export default function CustomEdge(props: EdgeProps<IConnexion>) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  } = props

  const { setEdges } = useReactFlow()

  const [bezierPathUpper, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY: sourceY - OFFSET_DOUBLE,
    sourcePosition,
    targetPosition,
    targetX,
    targetY: targetY - OFFSET_DOUBLE + NO_STRAIGHT_LINE_OFFSET,
  })
  // Todo
  const [_bezierPathLower] = getSmoothStepPath({
    sourceX: targetX,
    sourceY: targetY + OFFSET_DOUBLE,
    sourcePosition: targetPosition,
    targetPosition: sourcePosition,
    targetX: sourceX,
    targetY: sourceY + OFFSET_DOUBLE + NO_STRAIGHT_LINE_OFFSET,
  })
  const [bezierPathCenter] = getSmoothStepPath({
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
  // Todo
  const duplexCommunication = true
  return (
    <>
      {!duplexCommunication && (
        <>
          <DashedLine path={bezierPathUpper} />
          {/* <Line
              d={bezierPathLower}
              strokeWidth="1"
              stroke={strokeColor}
              animated
            /> */}
        </>
      )}
      {/* Thick Hidden Line to ease mouseover/select */}
      {duplexCommunication && <FullLine path={bezierPathCenter} />}
      <EdgeActions
        handleDeleteEdge={handleDeleteEdge}
        labelX={labelX}
        labelY={labelY}
        connexionType={props.data!.connexionType}
      />
    </>
  )
}
