import { ReactNode } from 'react'
import { boardDataContext } from './constants'
import {
  useNodesAndEdges,
  useOnEdgesChange,
  useOnNodesChange,
  useSetEdges,
  useSetNodes,
} from './hooks/useNodesAndEdges'
import { useSaveBoardLocallyOrRemotely } from './hooks/useSaveBoardLocallyOrRemotely'

export default function BoardDataProvider({
  children,
}: {
  children: ReactNode
}) {
  const { edges, nodes, boardStatus } = useNodesAndEdges()

  const setNodes = useSetNodes()
  const setEdges = useSetEdges()
  const onNodesChange = useOnNodesChange()
  const onEdgesChange = useOnEdgesChange()

  useSaveBoardLocallyOrRemotely({ nodes, edges, boardStatus })

  return (
    <boardDataContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
      }}
    >
      {children}
    </boardDataContext.Provider>
  )
}
