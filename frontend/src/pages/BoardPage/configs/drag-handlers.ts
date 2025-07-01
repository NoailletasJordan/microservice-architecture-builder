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
  getNodesAfterDeleteSubservice,
  getNodesAfterUpdateNode,
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
        flowInstance.setNodes((oldNodes) => [...oldNodes, newNode])
        break
      }
      case 'subService': {
        const draggedSubService = draggedContent
        const nodesFilteredSubservice = getNodesAfterDeleteSubservice({
          deleteId: draggedSubService.id,
          oldNodes: flowInstance.getNodes(),
        })

        const newNode = getNewNode({
          position,
          ...draggedSubService,
        })
        const newNodes = [...nodesFilteredSubservice, newNode]
        flowInstance.setNodes(newNodes)
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

        const newNodes = getNodesAfterUpdateNode({
          currentNodes: flowInstance.getNodes(),
          newNode: targetNode,
        })
        flowInstance.setNodes(newNodes)
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

        // delete subservice in old node, then create in target
        const nodesFilteredSubservice = getNodesAfterDeleteSubservice({
          deleteId: draggedSubService.id,
          oldNodes: flowInstance.getNodes(),
        })

        const newNodes = getNodesAfterUpdateNode({
          currentNodes: nodesFilteredSubservice,
          newNode: targetNode,
        })
        flowInstance.setNodes(newNodes)
        break
      }
    }
  },
  delete: (event, flowInstance) => {
    const { draggableType, draggedContent } = event.active.data
      .current as DraggableData
    switch (draggableType) {
      case 'subService': {
        const currentNodes = flowInstance.getNodes()
        const newNodes = getNodesAfterDeleteSubservice({
          deleteId: draggedContent.id,
          oldNodes: currentNodes,
        })
        flowInstance.setNodes(newNodes)
        break
      }
    }
  },
  toolbox: () => null,
}
