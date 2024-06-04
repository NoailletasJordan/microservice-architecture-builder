import { connexionContext } from '@/contexts/Connexion/constants'
import { selectedNodeContext } from '@/contexts/SelectedNode/constants'
import { Box, useMantineTheme } from '@mantine/core'
import { cloneDeep } from 'lodash'
import { useCallback, useContext, useEffect } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
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
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
  TCustomNode,
} from '../../configs/constants'
import {
  getInitialBoardData,
  handleDeleteNode,
  storeInLocal,
} from '../../configs/helpers'
import ConnexionPreview from './components/ConnexionPreview'
import CustomEdge from './components/CustomEdge'
import CustomNode from './components/CustomNode'
import DraggableGhost from './components/DraggableGhost/index'
import FitToView from './components/FitToView/index'
import ServiceOverviewButton from './components/ServiceOverviewButton/index'
import Toolbar from './components/Toolbar'
import { TCustomEdge } from './components/connexionContants'

interface Props {
  boardId: string
}

const DEBOUNCE_SAVE_MS = 600

const nodeTypes: NodeTypes = {
  service: CustomNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const preventScrollbarOnPan = { overflow: 'hidden' }

export default function Board({ boardId }: Props) {
  const { toggleAsideOpen } = useContext(selectedNodeContext)
  const { connexionType } = useContext(connexionContext)
  const { nodes: initialnodes, edges: initialEdges } =
    getInitialBoardData(boardId)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialnodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

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
        compNode.id === targetNode.id ? cloneDeep(targetNode) : compNode,
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

  const onConnect = useCallback(
    ({ source, sourceHandle, target, targetHandle }: Connection) => {
      const id = uuidv4()
      const newEdge: TCustomEdge = {
        id,
        source: source!,
        target: target!,
        sourceHandle,
        targetHandle,
        type: 'custom',
        data: {
          id,
          connexionType,
        },
      }

      const edgeAlleadyExist = !!edges.filter(
        (compEdge) =>
          (compEdge.source === source || compEdge.source === target) &&
          (compEdge.target === source || compEdge.target === target),
      ).length

      const connectToSelf = source === target
      if (edgeAlleadyExist || connectToSelf) return

      setEdges((oldEdges) => addEdge(newEdge, oldEdges))
    },
    [setEdges, edges, connexionType],
  )

  const theme = useMantineTheme()
  return (
    <DroppableArea id="board" data={{ droppableType: 'board' }}>
      <Box
        w="100%"
        h="100vh"
        style={preventScrollbarOnPan}
        bg={theme.colors.gray[0]}
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
          connectionLineComponent={ConnexionPreview}
          onNodeDragStop={onNodeDragEnd}
          noDragClassName={NO_DRAG_REACTFLOW_CLASS}
          noWheelClassName={NO_WhEEL_REACTFLOW_CLASS}
          noPanClassName={NO_PAN_REACTFLOW_CLASS}
        >
          <FitToView />
          <Background id={v4()} variant={BackgroundVariant.Dots} />
          <Toolbar />
        </ReactFlow>
        <ServiceOverviewButton onClick={toggleAsideOpen} />
        <DraggableGhost />
      </Box>
    </DroppableArea>
  )
}
