import { ReactNode } from 'react'
import { boardDataContext } from './constants'
import { useNodesAndEdges } from './hooks/useNodesAndEdges'
import { useSaveBoardLocallyOrRemotely } from './hooks/useSaveBoardLocallyOrRemotely'

export default function BoardDataProvider({
  children,
}: {
  children: ReactNode
}) {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    boardStatus,
  } = useNodesAndEdges()

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
        boardStatus,
      }}
    >
      {children}
    </boardDataContext.Provider>
  )
}
