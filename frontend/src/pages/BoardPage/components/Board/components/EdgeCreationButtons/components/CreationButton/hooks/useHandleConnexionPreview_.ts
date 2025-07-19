import { useEffectEventP } from '@/contants'
import { connexionPreviewContext } from '@/contexts/ConnexionPreview/context'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useHover } from '@mantine/hooks'
import { useInternalNode, useStore, useStoreApi } from '@xyflow/react'
import { useContext, useEffect } from 'react'

interface Props {
  duet: [string, string]
}

export function useHandleConnexionPreview_({ duet }: Props) {
  const { hovered, ref } = useHover()
  const { addDuet, removeDuet } = useContext(connexionPreviewContext)

  const [sourceId, targetId] = duet
  const node1 = useInternalNode<TCustomNode>(sourceId)
  const node2 = useInternalNode<TCustomNode>(targetId)

  const cancelConnexion = useStore((store) => store.cancelConnection)

  const store = useStoreApi()
  const s = useStore((s) => s)
  const getConnectionParams = useGetConnextionParams({ duet })
  const nonReactiveState = useEffectEventP(() => ({
    addDuet,
    removeDuet,
    duet,
    cancelConnexion,
    getConnectionParams,
    store,
  }))

  useEffect(() => {
    const {
      store,
      duet,
      getConnectionParams,
      addDuet,
      removeDuet,
      cancelConnexion,
    } = nonReactiveState()
    if (hovered) {
      addDuet(duet)
      const connexionParams = getConnectionParams()
      /** Temp */
      console.log('connexionParams:', connexionParams)
      store.setState({ connection: connexionParams })
    } else {
      removeDuet(duet)
      cancelConnexion()
    }
  }, [hovered, nonReactiveState])

  return { ref }
}

const useGetConnextionParams = ({ duet }: { duet: [string, string] }) => {
  const [sourceId, targetId] = duet
  const node1 = useInternalNode<TCustomNode>(sourceId)!
  const node2 = useInternalNode<TCustomNode>(targetId)!

  const getConnexionParams = () => {
    const handleRightSource = node1.internals.handleBounds!.source!.find(
      (handle) => handle.position === 'right',
    )!

    const fromX =
      node1.position.x + handleRightSource.x + handleRightSource.width / 2

    const fromY =
      node1.position.y + handleRightSource.y + handleRightSource.height / 2

    const handleLeftTarget = node2.internals.handleBounds!.source!.find(
      (handle) => handle.position === 'left',
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
      fromPosition: 'right',
      fromNode: node1,
      to: {
        x: toX,
        y: toY,
      },
      toHandle: handleLeftTarget,
      toPosition: 'left',
      toNode: node2,
    }
  }
  return getConnexionParams
}

const temp = {
  inProgress: true,
  isValid: true,
  from: {
    x: 628.6920166015625,
    y: 143.3329315185547,
  },
  fromHandle: {
    id: 'r',
    type: 'source',
    nodeId: 'database-0.8518345547330963',
    position: 'right',
    x: 210.6920166015625,
    y: 23.332931518554688,
    width: 8,
    height: 30,
  },
  fromPosition: 'right',
  fromNode: {
    id: 'database-0.8518345547330963',
    type: 'service',
    position: {
      x: 414,
      y: 105,
    },
    data: {
      id: 'database-0.8518345547330963',
      serviceIdType: 'database',
      title: 'Database',
      subServices: [],
      note: '',
    },
    measured: {
      width: 210,
      height: 72,
    },
    internals: {
      positionAbsolute: {
        x: 414,
        y: 105,
      },
      handleBounds: {
        source: [
          {
            id: 'l',
            type: 'source',
            nodeId: 'database-0.8518345547330963',
            position: 'left',
            x: -0.56121826171875,
            y: 23.332931518554688,
            width: 8,
            height: 30,
          },
          {
            id: 'r',
            type: 'source',
            nodeId: 'database-0.8518345547330963',
            position: 'right',
            x: 210.6920166015625,
            y: 23.332931518554688,
            width: 8,
            height: 30,
          },
        ],
        target: null,
      },
      z: 0,
      userNode: {
        id: 'database-0.8518345547330963',
        type: 'service',
        position: {
          x: 414,
          y: 105,
        },
        data: {
          id: 'database-0.8518345547330963',
          serviceIdType: 'database',
          title: 'Database',
          subServices: [],
          note: '',
        },
        measured: {
          width: 210,
          height: 72,
        },
      },
    },
  },
  to: {
    x: 948,
    y: 215,
  },
  toHandle: {
    id: 'l',
    type: 'source',
    nodeId: 'server-0.360621274536042',
    position: 'left',
    x: 948,
    y: 215,
    width: 8,
    height: 30,
  },
  toPosition: 'left',
  toNode: {
    id: 'server-0.360621274536042',
    type: 'service',
    position: {
      x: 952,
      y: 179,
    },
    data: {
      id: 'server-0.360621274536042',
      serviceIdType: 'server',
      title: 'Server',
      subServices: [],
      note: '',
    },
    measured: {
      width: 210,
      height: 72,
    },
    selected: false,
    dragging: false,
    internals: {
      positionAbsolute: {
        x: 952,
        y: 179,
      },
      handleBounds: {
        source: [
          {
            id: 'l',
            type: 'source',
            nodeId: 'server-0.360621274536042',
            position: 'left',
            x: -8,
            y: 21,
            width: 8,
            height: 30,
          },
          {
            id: 'r',
            type: 'source',
            nodeId: 'server-0.360621274536042',
            position: 'right',
            x: 210,
            y: 21,
            width: 8,
            height: 30,
          },
        ],
        target: null,
      },
      z: 0,
      userNode: {
        id: 'server-0.360621274536042',
        type: 'service',
        position: {
          x: 952,
          y: 179,
        },
        data: {
          id: 'server-0.360621274536042',
          serviceIdType: 'server',
          title: 'Server',
          subServices: [],
          note: '',
        },
        measured: {
          width: 210,
          height: 72,
        },
        selected: false,
        dragging: false,
      },
    },
  },
}
