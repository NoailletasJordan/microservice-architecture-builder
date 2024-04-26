import { EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow'
import EdgeActions from './components/Line/EdgeActions'
import Line from './components/Line/index'

const OFFSET_DOUBLE = 2
// svg gradient dont get rendered on straight lines
// https://stackoverflow.com/a/34687362
const NO_STRAIGHT_LINE_OFFSET = 0.001

export default function CustomEdgeWrapper({
  targetedEdge,
}: {
  targetedEdge: string | null
}) {
  return function CustomEdge(props: EdgeProps) {
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
    const [bezierPathLower] = getSmoothStepPath({
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

    const handleDeleteNode = () => {
      setEdges((edges) => edges.filter((edge) => edge.id !== id))
    }
    const showToolTip = targetedEdge === id
    return (
      <>
        <defs>
          <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="red" />
            <stop offset="100%" stopColor="blue" />
          </linearGradient>
        </defs>

        <Line d={bezierPathUpper} stroke="url(#myGradient)" animated />
        <Line d={bezierPathLower} stroke="url(#myGradient)" animated />
        {/* Thick Hidden Line to ease mouseover/select */}
        <Line
          d={bezierPathCenter}
          strokeWidth="7"
          stroke=""
          strokeDasharray=""
          strokeDashoffset=""
        />
        {showToolTip && (
          <EdgeActions
            handleDeleteNode={handleDeleteNode}
            labelX={labelX}
            labelY={labelY}
          />
        )}
      </>
    )
  }
}
