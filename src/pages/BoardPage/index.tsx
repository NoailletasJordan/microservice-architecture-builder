import { useWindowEvent } from '@mantine/hooks'
import { useCallback, useState } from 'react'
import ReactFlow, {
  Connection,
  ConnectionMode,
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { v4 as uuidv4 } from 'uuid'
import { ServiceIdType, serviceConfig } from '../../utils'
import ConnexionLine from './components/ConnectionLine'
import CustomEdgeWrapper from './components/CustomEdge'
import CustomNode, { TCustomNode } from './components/CustomNode/index'
import Dashboard from './components/DashBoard'
import FitToView from './components/FitToView/index'
import Layout from './components/Layout'

const initialNodes: TCustomNode[] = [
  {
    id: '1',
    position: { x: 0, y: 50 },
    type: 'service',
    data: { imageUrl: '/board/a-auth.svg', serviceIdType: 'authentification' },
  },
  {
    id: '2',
    position: { x: 300, y: 50 },
    data: { imageUrl: '/board/a-auth.svg', serviceIdType: 'database' },
    type: 'service',
  },
]

const nodeTypes: NodeTypes = {
  service: CustomNode,
}

const initialEdges: Edge[] = [
  {
    id: 'test',
    source: '1',
    target: '2',
    sourceHandle: 'r',
    targetHandle: 'l',
    type: 'custom',
  },
]

const getNewNode = (serviceIdType: ServiceIdType): Node => {
  const newNode: TCustomNode = {
    id: uuidv4(),
    type: 'service',
    position: { x: 10, y: 10 },
    data: { imageUrl: serviceConfig[serviceIdType].imageUrl, serviceIdType },
  }

  return newNode
}
export default function BoardPage() {
  const nodesState = useNodesState(initialNodes)
  const edgesState = useEdgesState(initialEdges)
  const [nodes, setNodes, onNodesChange] = nodesState
  const [edges, setEdges, onEdgesChange] = edgesState
  const [targetedEdge, setTargetedEdge] = useState<string | null>(null)
  const edgeTypes: EdgeTypes = {
    custom: CustomEdgeWrapper({ targetedEdge }),
  }

  useWindowEvent('click', () => setTargetedEdge(null))
  const onEdgeClick = (event: any, { id }: Edge) => {
    event.stopPropagation()
    if (targetedEdge === id) {
      setTargetedEdge(null)
      return
    }
    setTargetedEdge(id)
  }

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

  const addNewNode = (serviceIdType: ServiceIdType) => () => {
    setNodes([...nodes, getNewNode(serviceIdType)])
  }

  return (
    <Layout dashboard={<Dashboard addNewNode={addNewNode} />}>
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
    </Layout>
  )
}
