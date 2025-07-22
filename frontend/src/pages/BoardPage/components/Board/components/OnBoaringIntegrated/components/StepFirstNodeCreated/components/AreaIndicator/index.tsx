import { IconCaretRightFilled } from '@tabler/icons-react'

interface Props {
  posX: number
  posY: number
}

export default function AreaIndicator({ posX, posY }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
        width: 80,
        aspectRatio: 1,
        borderRadius: 4,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconCaretRightFilled size="100%" />
    </div>
  )
}
