import { useEffectEventP, useMaxBoardsReached } from '@/contants'
import { boardDataContext } from '@/contexts/BoardData/constants'
import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { shareHashTocken } from '@/pages/BoardPage/configs/constants'
import { useContext, useEffect, useState } from 'react'

interface Props {
  hash: string
  modalAction: {
    readonly open: () => void
    readonly close: () => void
    readonly toggle: () => void
  }
  overwriteBoardData: () => void
}

export function useHandleOnExternalUrl({
  overwriteBoardData,
  hash,
  modalAction,
}: Props) {
  const { nodes } = useContext(boardDataContext)
  const maxBoardsReached = useMaxBoardsReached()
  const nonReactiveState = useEffectEventP(() => ({
    modalAction,
    nodes,
    overwriteBoardData,
    maxBoardsReached,
  }))

  const isReady = useIsReadyToAcceptHandle()

  /** Temp */
  console.log('isReady:', isReady)

  useEffect(() => {
    if (!isReady) return

    const { maxBoardsReached, nodes, overwriteBoardData, modalAction } =
      nonReactiveState()
    const isLoadExternalURL = hash.includes(shareHashTocken)
    if (!isLoadExternalURL) return modalAction.close()

    if (nodes.length || maxBoardsReached) return modalAction.open()

    // If no nodes in the board, load automatically
    overwriteBoardData()
  }, [hash, isReady, nonReactiveState])
}

// Makes sure the boards are loaded correctly
function useIsReadyToAcceptHandle() {
  const { authToken } = useContext(userContext)
  const { boardsQuery, currentUserBoardId } = useContext(userBoardsContext)
  const { boardDataQuery } = useContext(boardDataContext)

  const nonReactiveState = useEffectEventP(() => ({
    boardDataQuery,
    boardsQuery,
    authToken,
    currentUserBoardId,
  }))
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const { boardsQuery, authToken, boardDataQuery, currentUserBoardId } =
      nonReactiveState()

    if (!boardsQuery || !boardDataQuery) return setIsReady(false)

    const boardsLoadedSuccess =
      boardsQuery.isFetched &&
      boardDataQuery.isFetched &&
      boardsQuery.isSuccess &&
      boardDataQuery.isSuccess

    if (!authToken) {
      setIsReady(boardsLoadedSuccess)
    } else {
      setIsReady(boardsLoadedSuccess && !!currentUserBoardId)
    }
  }, [boardsQuery?.isFetched, boardDataQuery?.isFetched, nonReactiveState])

  return isReady
}
