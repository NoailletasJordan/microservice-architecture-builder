import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useEdges, useNodes } from '@xyflow/react'
import { TCustomEdge } from '../../connexionContants'

export function useGenerateNodeDuets_() {
  const nodes = useNodes<TCustomNode>()
  const edges = useEdges<TCustomEdge>()

  const duets = generateNodeDuets(nodes)

  // filter out already present present edges
  const presentEdges = duets.filter(
    ([sourceId, targetId]) =>
      !edges.some(
        (edge) =>
          (edge.source === sourceId && edge.target === targetId) ||
          (edge.source === targetId && edge.target === sourceId),
      ),
  )
  return presentEdges
}

function generateNodeDuets(nodes: TCustomNode[]): [string, string][] {
  const duets: [string, string][] = []

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      duets.push([nodes[i].id, nodes[j].id])
    }
  }

  return duets
}
