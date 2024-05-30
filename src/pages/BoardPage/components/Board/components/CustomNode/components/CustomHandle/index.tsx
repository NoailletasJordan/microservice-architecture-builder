import { Handle, HandleProps, Position } from 'reactflow'

type Props = Pick<HandleProps, 'position' | 'id'>

export default function CustomHandle({ position, id }: Props) {
  return (
    <Handle
      style={{
        width: 13,
        height: 30,
        clipPath: 'polygon(0 25%, 100% 0, 100% 100%, 0 75%)',
        borderRadius: 0,
        transform:
          position === Position.Left ? 'rotateY(180deg)' : 'rotate(0deg)',

        transformOrigin: 'center',
        backgroundColor: 'var(--mantine-primary-color-3)',
      }}
      type="source"
      position={position}
      id={id}
    />
  )
}
