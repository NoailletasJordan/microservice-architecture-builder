import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { ViewportPortal } from '@xyflow/react'
import AreaCreationSecondNode from './components/AreaCreationSecondNode'
import AreaIndicator from './components/AreaIndicator'

interface Props {
  firstNode: TCustomNode
}

export default function StepFirstNodeCreated({ firstNode }: Props) {
  const paddingLeft = 700

  const areaSecondNodePosX =
    firstNode.position.x + (firstNode.measured?.width || 0) * 0.5 + paddingLeft
  const areaSecondNodePosY =
    firstNode.position.y + (firstNode.measured?.height || 0) * 0.5

  return (
    <ViewportPortal>
      <AreaIndicator
        posX={areaSecondNodePosX - paddingLeft * 0.5}
        posY={areaSecondNodePosY}
      />
      <AreaCreationSecondNode
        posX={areaSecondNodePosX}
        posY={areaSecondNodePosY}
      />
    </ViewportPortal>
  )
}
