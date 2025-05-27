import { ReactNode } from 'react'
import { boardDataContext } from './constants'
import { useNodesAndEdges, useSaveBoardLocallyOrRemotely } from './hooks'

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
