import { DragEndEvent } from '@dnd-kit/core'
import { ReactFlowInstance } from 'reactflow'
import { v4 } from 'uuid'
import {
  CARD_WIDTH,
  Datatype,
  DraggableData,
  DroppableType,
  TCustomNode,
  serviceConfig,
} from './components/Board/constants'
import {
  getNewNode,
  handleAddNode,
  handleDeleteModule,
  handleDeleteSubservice,
  handleUpdateNode,
} from './helpers'

type DragEventHandler = (
  e: DragEndEvent,
  flowInstance: ReactFlowInstance<Datatype>,
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

    const { draggableType, node: draggedNode } = event.active.data
      .current as DraggableData

    switch (draggableType) {
      case 'dashboard-item': {
        const draggedService = draggedNode
        const newNode = getNewNode({
          position,
          serviceIdType: draggedService.serviceIdType,
        })
        handleAddNode(newNode, flowInstance)
        break
      }
      case 'subService': {
        const draggedSubService = draggedNode
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
    const { draggableType, node: draggedData } = event.active.data
      .current as DraggableData
    const targetNode: TCustomNode = flowInstance.getNode(targetId)!

    switch (draggableType) {
      case 'dashboard-item': {
        const newSubService = {
          id: v4(),
          parentId: targetId,
          serviceIdType: draggedData.serviceIdType,
          technology:
            serviceConfig[draggedData.serviceIdType].defaultTechnology,
        }
        targetNode.data.subServices = [
          ...targetNode.data.subServices,
          newSubService,
        ]

        handleUpdateNode(targetNode.id, targetNode, flowInstance)
        break
      }
      case 'subService': {
        const draggedSubService = draggedData
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
      case 'module': {
        const draggedModule = draggedData
        const droppedInOriginalNode = draggedModule.parentId === targetId
        const moduleAlreadyPresentInTarget = !!targetNode.data.modules.find(
          (m) => m.moduleType === draggedModule.moduleType,
        )
        if (droppedInOriginalNode || moduleAlreadyPresentInTarget) break

        targetNode.data.modules = [
          ...targetNode.data.modules,
          { ...draggedModule, parentId: targetNode.id },
        ]

        handleDeleteModule(draggedModule.id, flowInstance)
        setTimeout(() => {
          handleUpdateNode(targetNode.id, targetNode, flowInstance)
        }, 0)
        break
      }
    }
  },
  delete: (event, flowInstance) => {
    const { draggableType, node } = event.active.data.current as DraggableData
    switch (draggableType) {
      case 'subService':
        handleDeleteSubservice(node.id, flowInstance)
        break

      case 'module':
        handleDeleteModule(node.id, flowInstance)
        break
    }
  },
}
