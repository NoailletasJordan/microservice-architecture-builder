import { getInitialBoardData } from '@/pages/BoardPage/configs/helpers'
import { ReactNode, useContext, useMemo } from 'react'
import { useEdgesState, useNodesState } from 'reactflow'
import { userBoardsContext } from '../UserBoards/constants'
import { boardDataContext } from './constants'
import { useSaveBoardLocallyOrRemotely } from './hooks'

export default function BoardDataProvider({
  children,
}: {
  children: ReactNode
}) {
  const { nodes: initialnodes, edges: initialEdges } = useMemo(
    () => getInitialBoardData(),
    [],
  )
  const [nodes, setNodes, onNodesChange] = useNodesState(initialnodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const { currentUserBoard } = useContext(userBoardsContext)
  const { boardsQuery } = useContext(userBoardsContext)

  useSaveBoardLocallyOrRemotely({ nodes, edges })

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
