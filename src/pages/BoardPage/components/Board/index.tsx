import { Box } from '@mantine/core'
import { useWindowEvent } from '@mantine/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
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
import { v4 as uuidv4, v4 } from 'uuid'
import DroppableArea from '../../../../components/DroppableArea/index'
import {
  deepCopy,
  getInitialBoardData,
  handleDeleteNode,
  storeInLocal,
} from '../../helpers'
import BuilderOptions from './components/BuilderOptions'
import ConnexionLine from './components/ConnectionLine'
import CustomEdgeWrapper from './components/CustomEdge'
import CustomNode from './components/CustomNode'
import DraggableGhost from './components/DraggableGhost/index'
import FitToView from './components/FitToView/index'
import ServiceOverviewButton from './components/ServiceOverviewButton/index'
import {
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
  TCustomNode,
} from './constants'

interface Props {
  boardId: string
  toggleAsideIsOpened: () => void
}

const DEBOUNCE_SAVE_MS = 600

const nodeTypes: NodeTypes = {
  service: CustomNode,
}

const preventScrollbarOnPan = { overflow: 'hidden' }

export default function Board({ boardId, toggleAsideIsOpened }: Props) {
  const { nodes: initialnodes, edges: initialEdges } =
    getInitialBoardData(boardId)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialnodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [targetedEdge, setTargetedEdge] = useState<string | null>(null)
  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      custom: CustomEdgeWrapper({ targetedEdge }),
    }),
    [targetedEdge],
  )

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
    <DroppableArea id="board" data={{ droppableType: 'board' }}>
      <Box w="100%" h="100vh" style={preventScrollbarOnPan}>
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
          noDragClassName={NO_DRAG_REACTFLOW_CLASS}
          noWheelClassName={NO_WhEEL_REACTFLOW_CLASS}
          noPanClassName={NO_PAN_REACTFLOW_CLASS}
        >
          <FitToView />
          <Background id={v4()} variant={BackgroundVariant.Dots} />
          <BuilderOptions />
        </ReactFlow>
        <ServiceOverviewButton onClick={toggleAsideIsOpened} />
        <DraggableGhost />
      </Box>
    </DroppableArea>
  )
}
