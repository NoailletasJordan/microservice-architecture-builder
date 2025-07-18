import { CSSVAR } from '@/contants'
import { NO_DRAG_REACTFLOW_CLASS } from '@/pages/BoardPage/configs/constants'
import { Handle, HandleProps, Position } from '@xyflow/react'

type Props = Pick<HandleProps, 'position' | 'id'>

export default function CustomHandle({ position, id }: Props) {
  const transform = `translateY(-50%) ${
    position === Position.Left ? 'rotateY(0deg)' : 'rotate(180deg) '
  } translateX(-8px)`

  return (
    <Handle
      className={NO_DRAG_REACTFLOW_CLASS}
      data-testid={id}
      style={{
        msTransformOrigin: 'center',
        width: 8,
        height: 30,
        clipPath: 'polygon(0 25%, 100% 0, 100% 100%, 0 75%)',
        borderRadius: 0,
        transform,
        transformOrigin: 'center',
        backgroundColor: CSSVAR['--border'],
        border: 'none',
      }}
      type="source"
      position={position}
      id={id}
    />
  )
}
