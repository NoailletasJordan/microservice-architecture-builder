import { DragOverlay, useDndContext } from '@dnd-kit/core'
import { ItemNode } from '../../../DashBoard/components/Item'
import { DraggableData, serviceConfig } from '../../constants'
import { SubServiceIcon } from '../CustomNode/components/InnerService'

export default function DraggableGhost() {
  const { active } = useDndContext()

  const current = active?.data.current as DraggableData | undefined
  if (!current) return null

  const imageLink = current
    ? serviceConfig[current.node.serviceIdType].imageUrl
    : ''

  let component = null
  if (current.draggableType === 'subService')
    component = <SubServiceIcon imageLink={imageLink} />

  if (current.draggableType === 'dashboard-item')
    component = (
      <ItemNode
        isActive={true}
        imageUrl={imageLink}
        label={serviceConfig[current.node.serviceIdType].label}
      />
    )

  return <DragOverlay>{component}</DragOverlay>
}
