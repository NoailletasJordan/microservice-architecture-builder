import { ConnectionLineComponentProps } from 'reactflow'

export default function ConnexionLine({
  fromX,
  fromY,
  toX,
  toY,
}: ConnectionLineComponentProps) {
  return (
    <g>
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="orange"
        strokeWidth={1.5}
      />
      <path
        fill="none"
        stroke="orange"
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
    </g>
  )
}
