import { Connection, addEdge } from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'
import { TCustomEdge } from '../components/connexionContants'
import { useSetEdges } from './useSetEdges'

export function useOnConnect({ edges }: { edges: TCustomEdge[] }) {
  const setEdges = useSetEdges()
  const onConnect = ({
    source,
    sourceHandle,
    target,
    targetHandle,
  }: Connection) => {
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
        direction: 'duplex',
        note: '',
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
  }

  return onConnect
}
