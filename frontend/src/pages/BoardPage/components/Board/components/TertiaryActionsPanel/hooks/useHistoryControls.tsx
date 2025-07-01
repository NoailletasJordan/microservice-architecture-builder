import { boardDataContext } from '@/contexts/BoardData/constants'
import { useQueryKey } from '@/contexts/BoardData/hooks/useQueryKey'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TBoardDataStore } from '@/pages/BoardPage/components/Board/hooks/useSetNodes'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useContext, useEffect, useRef } from 'react'
import { useStateHistoryCustom } from './useStateHistoryCustom'

export function useHistoryControls() {
  const [_, handlers, history] = useStateHistoryCustom<{
    nodes: TCustomNode[]
    edges: TCustomEdge[]
  }>({
    nodes: [],
    edges: [],
  })

  const { nodes, edges, boardDataQuery } = useContext(boardDataContext)
  const isFetched = boardDataQuery.isFetched
  const queryClient = useQueryClient()
  const queryKey = useQueryKey()

  const nonReactiveState = useCallback(
    () => ({
      handlers,
      history,
      queryKey,
    }),
    [handlers, history, queryKey],
  )

  const isFetchedRefPrev = useRef(isFetched)
  const queryKeyRefPrev = useRef(queryKey)

  useEffect(() => {
    const { handlers, queryKey } = nonReactiveState()
    const justChangedBoard = queryKeyRefPrev.current[1] !== queryKey[1]

    // if the board has changed, reset the history with the new board
    if (justChangedBoard) {
      queryKeyRefPrev.current = queryKey
      handlers.reset({ nodes, edges })
      return
    }

    // if the board is not fetched, do nothing
    if (!isFetched) {
      isFetchedRefPrev.current = false
      return
    }

    // if the board has just been fetched, update first history element
    const justBeenFetched = !isFetchedRefPrev.current && isFetched
    if (justBeenFetched) {
      isFetchedRefPrev.current = true
      handlers.updateIndex({ value: { nodes, edges }, index: 0 })
      return
    }

    const { history } = nonReactiveState()
    const timeoutDelay =
      history.current === history.history.length - 1 ? 350 : 0

    // Copy state to history under certain conditions
    const timeout = setTimeout(() => {
      const isDraggingNode = nodes.some((node: TCustomNode) => node.dragging)

      const currentData = { nodes, edges }
      const dataInHistory = {
        nodes: history.history[history.current].nodes,
        edges: history.history[history.current].edges,
      }

      const isEqual =
        JSON.stringify(currentData) === JSON.stringify(dataInHistory)

      if (!isEqual && !isDraggingNode && isFetched) {
        handlers.set(currentData)
      }
    }, timeoutDelay)

    return () => {
      clearTimeout?.(timeout)
    }
  }, [nodes, edges, isFetched, nonReactiveState])

  return {
    undo: {
      isDisabled: !isFetched || history.current === 0,
      action: () => {
        const newIndex = history.current - 1
        const currentData: TBoardDataStore | undefined =
          queryClient.getQueryData(queryKey)
        queryClient.setQueryData(queryKey, {
          ...currentData,
          nodes: history.history[newIndex].nodes,
          edges: history.history[newIndex].edges,
        })
        handlers.back()
      },
    },
    redo: {
      isDisabled: !isFetched || history.current === history.history.length - 1,
      action: () => {
        const newIndex = history.current + 1
        const currentData: TBoardDataStore | undefined =
          queryClient.getQueryData(queryKey)
        queryClient.setQueryData(queryKey, {
          ...currentData,
          nodes: history.history[newIndex].nodes,
          edges: history.history[newIndex].edges,
        })
        handlers.forward()
      },
    },
  }
}
