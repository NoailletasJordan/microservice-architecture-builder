import { DragEndEvent } from '@dnd-kit/core'
import { ReactFlowInstance } from 'reactflow'
import { v4 } from 'uuid'
import {
  CARD_WIDTH,
  Datatype,
  DraggableData,
  DroppableType,
  TCustomNode,
} from './components/Board/constants'
import {
  addNewNode,
  deepCopy,
  handleDeleteModule,
  handleDeleteSubservice,
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
      case 'dashboard-item':
        setTimeout(() => {
          addNewNode(draggedNode.serviceIdType, flowInstance, position)
        }, 0)
        break
      case 'subService':
        handleDeleteSubservice(draggedNode.id, flowInstance)
        // shameful timeout to chain with previous setNode
        setTimeout(() => {
          addNewNode(draggedNode.serviceIdType, flowInstance, position)
        }, 0)
        break
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
        }
        targetNode.data.subServices = [
          ...targetNode.data.subServices,
          newSubService,
        ]

        flowInstance.setNodes((oldNodes) =>
          oldNodes.map((compNode) =>
            compNode.id === targetNode.id ? deepCopy(targetNode) : compNode,
          ),
        )
        break
      }
      case 'subService': {
        const droppedInOriginalNode = draggedData.parentId === targetId
        if (droppedInOriginalNode) break

        targetNode.data.subServices = [
          ...targetNode.data.subServices,
          { ...draggedData, parentId: targetNode.id },
        ]

        handleDeleteSubservice(draggedData.id, flowInstance)
        setTimeout(() => {
          flowInstance.setNodes((oldNodes) =>
            oldNodes.map((compNode) => {
              return compNode.id === targetNode.id ? targetNode : compNode
            }),
          )
        }, 0)
        break
      }
      case 'module': {
        const draggedModule = draggedData
        const droppedInOriginalNode = draggedModule.parentId === targetId
        if (droppedInOriginalNode) break

        targetNode.data.modules = [
          ...targetNode.data.modules,
          { ...draggedModule, parentId: targetNode.id },
        ]

        handleDeleteModule(draggedModule.id, flowInstance)
        setTimeout(() => {
          flowInstance.setNodes((oldNodes) =>
            oldNodes.map((compNode) => {
              return compNode.id === targetNode.id ? targetNode : compNode
            }),
          )
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
