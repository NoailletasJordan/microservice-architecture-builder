import { ReactNode } from 'react'
import { boardDataContext } from './constants'
import useFitViewOnBoardLoad from './hooks/useFitViewOnBoardLoad'
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

  useFitViewOnBoardLoad({
    isFetched: boardDataQuery.isFetched,
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
