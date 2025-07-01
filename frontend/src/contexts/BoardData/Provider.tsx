import { ReactNode } from 'react'
import { boardDataContext } from './constants'
import { useNodesAndEdges } from './hooks/useNodesAndEdges'
import { useSaveBoardLocallyOrRemotely } from './hooks/useSaveBoardLocallyOrRemotely'

export default function BoardDataProvider({
  children,
}: {
  children: ReactNode
}) {
  const { title, edges, nodes, boardDataQuery } = useNodesAndEdges()

  useSaveBoardLocallyOrRemotely({
    nodes,
    edges,
    requestStatus: boardDataQuery.status,
  })

  return (
    <boardDataContext.Provider
      value={{
        title,
        nodes,
        edges,
        boardDataQuery,
      }}
    >
      {children}
    </boardDataContext.Provider>
  )
}
