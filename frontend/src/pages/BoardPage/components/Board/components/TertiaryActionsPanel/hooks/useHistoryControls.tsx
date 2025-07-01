import { useEffectEventP } from '@/contants'
import { boardDataContext } from '@/contexts/BoardData/constants'
import { useQueryKey } from '@/contexts/BoardData/hooks/useQueryKey'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TBoardDataStore } from '@/pages/BoardPage/components/Board/hooks/useSetNodes'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useHotkeys } from '@mantine/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import { isMacOs } from 'react-device-detect'
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

  const nonReactiveState = useEffectEventP(() => ({
    handlers,
    history,
    queryKey,
  }))

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

      if (
        !getIsEqual([currentData, dataInHistory]) &&
        !isDraggingNode &&
        isFetched
      ) {
        handlers.set(currentData)
      }
    }, timeoutDelay)

    return () => {
      clearTimeout?.(timeout)
    }
  }, [nodes, edges, isFetched, nonReactiveState])

  const undoIsDisabled = !isFetched || history.current === 0
  const redoIsDisabled =
    !isFetched || history.current === history.history.length - 1

  function actionUndo() {
    if (undoIsDisabled) return
    const newIndex = history.current - 1
    const currentData: TBoardDataStore | undefined =
      queryClient.getQueryData(queryKey)
    queryClient.setQueryData(queryKey, {
      ...currentData,
      nodes: history.history[newIndex].nodes,
      edges: history.history[newIndex].edges,
    })
    handlers.back()
  }

  function actionRedo() {
    if (redoIsDisabled) return
    const newIndex = history.current + 1
    const currentData: TBoardDataStore | undefined =
      queryClient.getQueryData(queryKey)
    queryClient.setQueryData(queryKey, {
      ...currentData,
      nodes: history.history[newIndex].nodes,
      edges: history.history[newIndex].edges,
    })
    handlers.forward()
  }

  useHotkeys([
    [isMacOs ? 'meta+z' : 'ctrl+z', actionUndo],
    [isMacOs ? 'meta+shift+z' : 'ctrl+y', actionRedo],
  ])

  return {
    undo: {
      isDisabled: undoIsDisabled,
      action: actionUndo,
    },
    redo: {
      isDisabled: redoIsDisabled,
      action: actionRedo,
    },
  }
}

function getIsEqual([data1, data2]: [
  { nodes: TCustomNode[]; edges: TCustomEdge[] },
  { nodes: TCustomNode[]; edges: TCustomEdge[] },
]) {
  function removeSelectedKey(state: { nodes: any[]; edges: any[] }) {
    return {
      ...state,
      nodes: state.nodes.map(({ selected: _selected, ...rest }) => rest),
    }
  }
  const isEqual =
    JSON.stringify(removeSelectedKey(data1)) ===
    JSON.stringify(removeSelectedKey(data2))
  return isEqual
}
