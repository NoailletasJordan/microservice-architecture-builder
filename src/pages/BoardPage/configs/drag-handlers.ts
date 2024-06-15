import { DragEndEvent } from '@dnd-kit/core'
import { ReactFlowInstance } from 'reactflow'
import { v4 } from 'uuid'
import {
  CARD_WIDTH,
  DraggableData,
  DroppableType,
  IService,
  TCustomNode,
  serviceConfig,
} from './constants'
import {
  getNewNode,
  handleAddNode,
  handleDeleteSubservice,
  handleUpdateNode,
} from './helpers'

type DragEventHandler = (
  e: DragEndEvent,
  flowInstance: ReactFlowInstance<IService>,
) => void

export const onDragEndConfig: Record<DroppableType, DragEventHandler> = {
  board: (event, flowInstance) => {
    const centerX =
      event.active.rect.current.translated!.left - CARD_WIDTH * 0.5
    const centerY = event.active.rect.current.translated!.top

    const position = flowInstance.screenToFlowPosition({
      x: centerX,
      y: centerY,
    })

    const { draggableType, draggedContent } = event.active.data
      .current as DraggableData

    switch (draggableType) {
      case 'dashboard-item': {
        const draggedService = draggedContent
        const newNode = getNewNode({
          position,
          serviceIdType: draggedService.serviceIdType,
        })
        handleAddNode(newNode, flowInstance)
        break
      }
      case 'subService': {
        const draggedSubService = draggedContent
        handleDeleteSubservice(draggedSubService.id, flowInstance)
        // shameful timeout to chain with previous setNode
        setTimeout(() => {
          const newNode = getNewNode({
            position,
            ...draggedSubService,
          })
          handleAddNode(newNode, flowInstance)
        }, 0)
        break
      }
    }
  },
  node: (event, flowInstance) => {
    const targetId = event.over!.id as string
    const { draggableType, draggedContent } = event.active.data
      .current as DraggableData
    const targetNode: TCustomNode = flowInstance.getNode(targetId)!

    switch (draggableType) {
      case 'dashboard-item': {
        const newSubService = {
          id: v4(),
          parentId: targetId,
          serviceIdType: draggedContent.serviceIdType,
          note: '',
          title: serviceConfig[draggedContent.serviceIdType].defaultLabel,
        }
        targetNode.data.subServices = [
          ...targetNode.data.subServices,
          newSubService,
        ]

        handleUpdateNode(targetNode.id, targetNode, flowInstance)
        break
      }
      case 'subService': {
        const draggedSubService = draggedContent
        const droppedInOriginalNode = draggedSubService.parentId === targetId
        if (droppedInOriginalNode) break

        targetNode.data.subServices = [
          ...targetNode.data.subServices,
          { ...draggedSubService, parentId: targetNode.id },
        ]

        handleDeleteSubservice(draggedSubService.id, flowInstance)

        setTimeout(() => {
          handleUpdateNode(targetNode.id, targetNode, flowInstance)
        }, 0)
        break
      }
    }
  },
  delete: (event, flowInstance) => {
    const { draggableType, draggedContent } = event.active.data
      .current as DraggableData
    switch (draggableType) {
      case 'subService':
        handleDeleteSubservice(draggedContent.id, flowInstance)
        break
    }
  },
  toolbox: () => null,
}
