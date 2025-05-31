import { ReactNode } from 'react'
import { boardDataContext } from './constants'
import { useNodesAndEdges } from './hooks/useNodesAndEdges'
import { useOnEdgesChange } from './hooks/useOnEdgesChange'
import { useOnNodesChange } from './hooks/useOnNodesChange'
import { useSaveBoardLocallyOrRemotely } from './hooks/useSaveBoardLocallyOrRemotely'
import { useSetEdges } from './hooks/useSetEdges'
import { useSetNodes } from './hooks/useSetNodes'

export default function BoardDataProvider({
  children,
}: {
  children: ReactNode
}) {
  const { edges, nodes, fetchStatus, requestStatus } = useNodesAndEdges()

  const setNodes = useSetNodes()
  const setEdges = useSetEdges()
  const onNodesChange = useOnNodesChange()
  const onEdgesChange = useOnEdgesChange()

  useSaveBoardLocallyOrRemotely({ nodes, edges, requestStatus })

  return (
    <boardDataContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        fetchStatus,
      }}
    >
      {children}
    </boardDataContext.Provider>
  )
}
