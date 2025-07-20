import { useEffectEventP } from '@/contants'
import { connexionPreviewContext } from '@/contexts/ConnexionPreview/context'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { getTargetHandlePosition } from '@/pages/BoardPage/configs/helpers'
import { useHover } from '@mantine/hooks'
import {
  ConnectionState,
  InternalNode,
  Node,
  useInternalNode,
  useStore,
  useStoreApi,
} from '@xyflow/react'
import { useCallback, useContext, useEffect } from 'react'

interface Props {
  duet: [string, string]
}

export function useHandleConnexionPreview_({ duet }: Props) {
  const { hovered, ref } = useHover()
  const { addDuet, removeDuet } = useContext(connexionPreviewContext)

  const cancelConnexion = useStore((store) => store.cancelConnection)

  const store = useStoreApi()
  const updateConnexionInternalStore = useCallback(
    (connection: ConnectionState<InternalNode<Node>>) =>
      store.setState({ connection }),
    [store],
  )
  const getConnectionParams = useGetConnextionParams({ duet })
  const nonReactiveState = useEffectEventP(() => ({
    addDuet,
    removeDuet,
    duet,
    cancelConnexion,
    getConnectionParams,
    updateConnexionInternalStore,
  }))

  useEffect(() => {
    const {
      updateConnexionInternalStore,
      duet,
      getConnectionParams,
      addDuet,
      removeDuet,
      cancelConnexion,
    } = nonReactiveState()
    if (hovered) {
      addDuet(duet)
      const connexionParams = getConnectionParams()
      updateConnexionInternalStore(connexionParams)
    } else {
      removeDuet(duet)
      cancelConnexion()
    }
  }, [hovered, nonReactiveState])

  useEffect(() => {
    const { cancelConnexion, removeDuet, duet } = nonReactiveState()
    return () => {
      removeDuet(duet)
      cancelConnexion()
    }
  }, [nonReactiveState])

  return { ref }
}

const useGetConnextionParams = ({ duet }: { duet: [string, string] }) => {
  const [sourceId, targetId] = duet
  const node1 = useInternalNode<TCustomNode>(sourceId)!
  const node2 = useInternalNode<TCustomNode>(targetId)!

  const getConnexionParams = useCallback((): ConnectionState<
    InternalNode<Node>
  > => {
    const [sourceHandlePosition, targetHandlePosition] =
      getTargetHandlePosition([node1, node2])

    const handleRightSource = node1.internals.handleBounds!.source!.find(
      (handle) => handle.position === sourceHandlePosition,
    )!

    const fromX =
      node1.position.x + handleRightSource.x + handleRightSource.width / 2

    const fromY =
      node1.position.y + handleRightSource.y + handleRightSource.height / 2

    const handleLeftTarget = node2.internals.handleBounds!.source!.find(
      (handle) => handle.position === targetHandlePosition,
    )!
    const toX =
      node2.position.x + handleLeftTarget.x + handleLeftTarget.width / 2

    const toY =
      node2.position.y + handleLeftTarget.y + handleLeftTarget.height / 2

    return {
      inProgress: true,
      isValid: true,
      from: {
        x: fromX,
        y: fromY,
      },
      fromHandle: handleRightSource,
      fromPosition: sourceHandlePosition,
      fromNode: node1,
      to: {
        x: toX,
        y: toY,
      },
      toHandle: handleLeftTarget,
      toPosition: targetHandlePosition,
      toNode: node2,
    }
  }, [node1, node2])
  return getConnexionParams
}
