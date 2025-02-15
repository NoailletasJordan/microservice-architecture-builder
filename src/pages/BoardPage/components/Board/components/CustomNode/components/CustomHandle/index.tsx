import { CSSVAR } from '@/contants'
import { Handle, HandleProps, Position } from 'reactflow'

type Props = Pick<HandleProps, 'position' | 'id'>

export default function CustomHandle({ position, id }: Props) {
  const transform = `${
    position === Position.Left ? 'rotateY(180deg)' : 'rotate(0deg) '
  } translateX(-1px)`
  return (
    <Handle
      style={{
        width: 10,
        height: 30,
        clipPath: 'polygon(0 25%, 100% 0, 100% 100%, 0 75%)',
        borderRadius: 0,
        transform,
        transformOrigin: 'center',
        backgroundColor: CSSVAR['--text'],
      }}
      type="source"
      position={position}
      id={id}
    />
  )
}
