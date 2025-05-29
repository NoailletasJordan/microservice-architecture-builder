import { useEdgesState, useNodesState } from 'reactflow'
import { useHandleSwitchBoardData } from './useHandleSwitchBoardData'

export function useNodesAndEdges() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const { boardStatus } = useHandleSwitchBoardData({
    setNodes,
    setEdges,
  })

  return {
    boardStatus,
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
  }
}
