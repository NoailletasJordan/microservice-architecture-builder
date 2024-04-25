import { EdgeProps, getSmoothStepPath } from 'reactflow'

const OFFSET_DOUBLE = 2
// svg gradient dont get rendered on straight lines
// https://stackoverflow.com/a/34687362
const NO_STRAIGHT_LINE_OFFSET = 0.001

export default function CustomEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    props

  const [calcBezierpath] = getSmoothStepPath({
    sourceX: sourceX,
    sourceY: sourceY - OFFSET_DOUBLE,
    sourcePosition,
    targetPosition,
    targetX,
    targetY: targetY - OFFSET_DOUBLE + NO_STRAIGHT_LINE_OFFSET,
  })
  const [calcBezierpath2] = getSmoothStepPath({
    sourceX: targetX,
    sourceY: targetY + OFFSET_DOUBLE,
    sourcePosition: targetPosition,
    targetPosition: sourcePosition,
    targetX: sourceX,
    targetY: sourceY + OFFSET_DOUBLE + NO_STRAIGHT_LINE_OFFSET,
  })

  return (
    <>
      <defs>
        <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="red" />
          <stop offset="100%" stopColor="blue" />
        </linearGradient>
      </defs>
      <path
        fill="none"
        stroke="url(#myGradient)"
        d={calcBezierpath}
        strokeWidth="1"
        strokeDasharray="10,10"
        strokeDashoffset="0"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="20"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
      <path
        fill="none"
        stroke="url(#myGradient)"
        d={calcBezierpath2}
        strokeWidth="1"
        strokeDasharray="10,10"
        strokeDashoffset="0"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="20"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </>
  )
}
