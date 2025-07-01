import { useCallback, useMemo, useState } from 'react'

export interface UseStateHistoryHandlers<T> {
  set: (value: T) => void
  back: (steps?: number) => void
  forward: (steps?: number) => void
  reset: (value: T) => void
  updateIndex: ({ value, index }: { value: T; index: number }) => void
}

export interface UseStateHistoryValue<T> {
  history: T[]
  current: number
}

export type UseStateHistoryReturnValue<T> = [
  T,
  UseStateHistoryHandlers<T>,
  UseStateHistoryValue<T>,
]

// custom implementation of mantine's useStateHistory
// https://mantine.dev/hooks/use-state-history/
export function useStateHistoryCustom<T>(
  initialValue: T,
): UseStateHistoryReturnValue<T> {
  const [state, setState] = useState<UseStateHistoryValue<T>>({
    history: [initialValue],
    current: 0,
  })

  const set = useCallback(
    (val: T) =>
      setState((currentState) => {
        const nextState = [
          ...currentState.history.slice(0, currentState.current + 1),
          val,
        ]
        return {
          history: nextState,
          current: nextState.length - 1,
        }
      }),
    [],
  )

  const updateIndex = useCallback(
    ({ value, index }: { value: T; index: number }) =>
      setState((currentState) => {
        const nextState = [
          ...currentState.history.slice(0, index),
          value,
          ...currentState.history.slice(index + 1),
        ]
        return {
          history: nextState,
          current: currentState.current,
        }
      }),
    [],
  )

  const back = useCallback(
    (steps = 1) =>
      setState((currentState) => ({
        history: currentState.history,
        current: Math.max(0, currentState.current - steps),
      })),
    [],
  )

  const forward = useCallback(
    (steps = 1) =>
      setState((currentState) => ({
        history: currentState.history,
        current: Math.min(
          currentState.history.length - 1,
          currentState.current + steps,
        ),
      })),
    [],
  )

  const reset = useCallback((value: T) => {
    setState({ history: [value], current: 0 })
  }, [])

  const handlers = useMemo(
    () => ({ back, forward, reset, set, updateIndex }),
    [back, forward, reset, set, updateIndex],
  )

  return [state.history[state.current], handlers, state]
}
