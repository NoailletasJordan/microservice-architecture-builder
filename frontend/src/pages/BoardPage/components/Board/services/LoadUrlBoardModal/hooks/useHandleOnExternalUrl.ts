import {
  showNotificationError,
  useEffectEventP,
  USER_MAX_BOARD_AMOUNT,
} from '@/contants'
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
  const { boards } = useContext(userBoardsContext)
  const nonReactiveState = useEffectEventP(() => ({
    modalAction,
    nodes,
    overwriteBoardData,
    boards,
  }))

  const isReady = useIsReadyToAcceptHandle()

  useEffect(() => {
    if (!isReady) return

    const { boards, nodes, overwriteBoardData, modalAction } =
      nonReactiveState()
    const isLoadExternalURL = hash.includes(shareHashTocken)
    if (!isLoadExternalURL) return modalAction.close()

    if (nodes.length) return modalAction.open()

    // If no nodes in the board, check user is under maximum boards amount, if so load automatically
    /** Temp */
    console.log('isReady:', isReady, boards.length)
    const maxBoardsReached = boards.length >= USER_MAX_BOARD_AMOUNT
    if (maxBoardsReached) {
      showNotificationError({
        title: `You reached the maximum boards amount : ${USER_MAX_BOARD_AMOUNT}`,
        message: 'Delete one of your current boards and try again',
      })
      return
    }

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
