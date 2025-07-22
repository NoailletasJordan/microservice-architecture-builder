export default function AreaCreationSecondNode({
  posX,
  posY,
}: {
  posX: number
  posY: number
}) {
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
        border: '1px solid #ccc',
      }}
    >
      temp
    </div>
  )
}
