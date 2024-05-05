import { useWindowEvent } from '@mantine/hooks'
import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Connection,
  ConnectionMode,
  Edge,
  EdgeTypes,
  NodeTypes,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { v4 as uuidv4 } from 'uuid'
import ConnexionLine from './components/ConnectionLine'
import CustomEdgeWrapper from './components/CustomEdge'
import CustomNode from './components/CustomNode/index'
import FitToView from './components/FitToView/index'
import { getInitialBoardData, storeInLocal } from './helpers'

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
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialnodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [targetedEdge, setTargetedEdge] = useState<string | null>(null)
  const edgeTypes: EdgeTypes = {
    custom: CustomEdgeWrapper({ targetedEdge }),
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
      >
        <FitToView />
      </ReactFlow>
    </div>
  )
}
