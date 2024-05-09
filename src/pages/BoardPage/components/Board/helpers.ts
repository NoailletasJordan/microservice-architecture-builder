import { DragEndEvent } from '@dnd-kit/core'
import { ReactFlowInstance, XYPosition } from 'reactflow'
import { v4 as uuidv4, v4 } from 'uuid'
import { Datatype, DraggableData, ServiceIdType } from './constants'

import {
  CARD_WIDTH,
  DroppableType,
  ILocalStorage,
  SubService,
  TCustomNode,
  defaultEdges,
  defaultNodes,
} from './constants'

export const getNewNode = ({
  serviceIdType,
  position,
}: {
  serviceIdType: ServiceIdType
  position: XYPosition
}): TCustomNode => {
  const nodeID = uuidv4()
  return {
    id: nodeID,
    type: 'service',
    position,
    data: {
      id: nodeID,
      serviceIdType,
      subServices: [],
    },
  }
}
export const addNewNode = (
  serviceIdType: ServiceIdType,
  flowInstance: ReactFlowInstance,
  position: XYPosition,
) => {
  flowInstance.setNodes((oldNodes: TCustomNode[]) => [
    ...oldNodes,
    getNewNode({ serviceIdType, position }),
  ])
}

export const getInitialBoardData = (boardId: string): ILocalStorage => {
  const storageReference: ILocalStorage | undefined =
    boardId &&
    !!localStorage.getItem(boardId) &&
    JSON.parse(localStorage.getItem(boardId) as string)

  if (!storageReference)
    return { timestamp: new Date(), nodes: defaultNodes, edges: defaultEdges }

  return {
    timestamp: new Date(storageReference.timestamp),
    nodes: storageReference.nodes,
    edges: storageReference.edges,
  }
}

export const storeInLocal = (boardId: string, data: ILocalStorage) => {
  localStorage.setItem(boardId as string, JSON.stringify(data))
}

export const handleDeleteNode = (
  nodeId: string,
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setNodes((oldNodes) =>
    oldNodes.filter((compNode) => compNode.id != nodeId),
  )
}

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

    if (draggableType === 'subService') {
      handleDeleteSubservice(draggedNode.id, flowInstance)
    }
    // shameful timeout to chain with previous setNode
    setTimeout(() => {
      addNewNode(draggedNode.serviceIdType, flowInstance, position)
    }, 0)
  },
  node: (event, flowInstance) => {
    const targetId = event.over!.id as string
    const { draggableType, node: draggedNode } = event.active.data
      .current as DraggableData
    const targetNode: TCustomNode = flowInstance.getNode(targetId)!

    if (draggableType === 'subService') {
      const droppedInOriginalNode =
        (draggedNode as SubService).parentId === targetId
      if (droppedInOriginalNode) return

      targetNode.data.subServices = [
        ...targetNode.data.subServices,
        { ...draggedNode, parentId: targetNode.id },
      ]

      handleDeleteSubservice(draggedNode.id, flowInstance)
      setTimeout(() => {
        flowInstance.setNodes((oldNodes) =>
          oldNodes.map((compNode) => {
            return compNode.id === targetNode.id ? targetNode : compNode
          }),
        )
      }, 0)
    }

    if (draggableType === 'dashboard-item') {
      const newSubService: SubService = {
        id: v4(),
        parentId: targetId,
        serviceIdType: draggedNode.serviceIdType,
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
    }
  },
  delete: (event, flowInstance) => {
    const { draggableType, node } = event.active.data.current as DraggableData
    if (draggableType === 'subService') {
      handleDeleteSubservice(node.id, flowInstance)
    }
  },
}

const handleDeleteSubservice = (
  deleteId: string,
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setNodes((oldNodes) =>
    oldNodes.map((compNode) => {
      const filteredSubServices = compNode.data.subServices.filter(
        (compSubService: SubService) => compSubService.id != deleteId,
      )

      const newCompNode = deepCopy(compNode)
      newCompNode.data.subServices = filteredSubServices

      return newCompNode
    }),
  )
}

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
