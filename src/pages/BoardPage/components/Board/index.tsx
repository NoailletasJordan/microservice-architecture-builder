import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useWindowEvent } from '@mantine/hooks'
import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Connection,
  ConnectionMode,
  Edge,
  EdgeTypes,
  NodeDragHandler,
  NodeTypes,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { v4 as uuidv4 } from 'uuid'
import ConnexionLine from './components/ConnectionLine'
import CustomEdgeWrapper from './components/CustomEdge'
import CustomNode from './components/CustomNode/index'
import DraggableGhost from './components/DraggableGhost/index'
import DroppableArea from './components/DroppableArea/index'
import FitToView from './components/FitToView/index'
import { DroppableType, TCustomNode } from './constants'
import {
  deepCopy,
  getInitialBoardData,
  handleDeleteNode,
  onDragEndConfig,
  storeInLocal,
} from './helpers'

interface Props {
  boardId: string
}

const DEBOUNCE_SAVE_MS = 2000

const nodeTypes: NodeTypes = {
  service: CustomNode,
}

export default function Board({ boardId }: Props) {
  const { nodes: initialnodes, edges: initialEdges } =
    getInitialBoardData(boardId)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialnodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [targetedEdge, setTargetedEdge] = useState<string | null>(null)
  const edgeTypes: EdgeTypes = {
    custom: CustomEdgeWrapper({ targetedEdge }),
  }
  const flowInstance = useReactFlow()

  const onNodeDragEnd: NodeDragHandler = (_event, node: TCustomNode) => {
    const centerX = node.position.x + Number(node.width) * 0.5
    const centerY = node.position.y + Number(node.height) * 0.5

    const targetNode = nodes
      .filter((compNode) => compNode.id !== node.id)
      .find(
        (n) =>
          centerX > n.position.x &&
          centerX < n.position.x + Number(n.width) &&
          centerY > n.position.y &&
          centerY < n.position.y + Number(n.height),
      )

    if (!targetNode) return

    // Delete node and add it as a sub
    handleDeleteNode(node.id, flowInstance)
    const newSubService = { ...node.data, parentId: targetNode.data.id }
    targetNode.data.subServices = [
      ...targetNode.data.subServices,
      newSubService,
    ]

    setNodes((oldNodes) =>
      oldNodes.map((compNode) =>
        compNode.id === targetNode.id ? deepCopy(targetNode) : compNode,
      ),
    )
  }

  // Save board to localstorage, debounced
  useEffect(() => {
    const handle = setTimeout(() => {
      const dataToStore = { nodes, edges, timestamp: new Date() }
      storeInLocal(boardId, dataToStore)
    }, DEBOUNCE_SAVE_MS)

    return () => {
      clearTimeout(handle)
    }
  }, [nodes, edges, boardId])

  useWindowEvent('click', () => setTargetedEdge(null))
  const onEdgeClick = useCallback(
    (event: any, { id }: Edge) => {
      event.stopPropagation()
      if (targetedEdge === id) {
        setTargetedEdge(null)
        return
      }
      setTargetedEdge(id)
    },
    [setTargetedEdge, targetedEdge],
  )

  const onConnect = useCallback(
    ({ source, sourceHandle, target, targetHandle }: Connection) => {
      const newEdge = {
        id: uuidv4(),
        source,
        target,
        sourceHandle,
        targetHandle,
        type: 'custom',
      }

      const edgeAlleadyExist = !!edges.filter(
        (compEdge) =>
          (compEdge.source === source || compEdge.source === target) &&
          (compEdge.target === source || compEdge.target === target),
      ).length
      if (edgeAlleadyExist) return

      setEdges((oldEdges) => addEdge(newEdge, oldEdges))
    },
    [setEdges, edges],
  )

  return (
    <DndContext
      onDragEnd={(e: DragEndEvent) => {
        if (!e.over) return

        const type = e.over.data.current?.type as DroppableType | undefined
        if (type) {
          onDragEndConfig[type](e, flowInstance)
          return
        }
      }}
    >
      <DroppableArea id="board" data={{ type: 'board' }}>
        <div
          style={{
            width: '100%',
            height: 'calc(100vh - 100px)',
            border: 'red solid 1px',
          }}
        >
          <ReactFlow
            // TODO - allow wider zooms
            minZoom={1}
            maxZoom={1}
            fitView
            onConnect={onConnect}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            edgeTypes={edgeTypes}
            connectionLineComponent={ConnexionLine}
            onEdgeClick={onEdgeClick}
            onNodeDragStop={onNodeDragEnd}
            noDragClassName="noDragReactflow"
          >
            <FitToView />
          </ReactFlow>

          <DraggableGhost />
        </div>
      </DroppableArea>
    </DndContext>
  )
}
