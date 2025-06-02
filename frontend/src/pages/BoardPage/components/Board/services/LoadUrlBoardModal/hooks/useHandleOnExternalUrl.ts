import { useEffectEventP } from '@/contants'
import { boardDataContext } from '@/contexts/BoardData/constants'
import { shareHashTocken } from '@/pages/BoardPage/configs/constants'
import { useContext, useEffect } from 'react'

export function useHandleOnExternalUrl({
  overwriteBoardData,
  hash,
  modalAction,
}: {
  hash: string
  modalAction: {
    readonly open: () => void
    readonly close: () => void
    readonly toggle: () => void
  }
  overwriteBoardData: () => void
}) {
  const { nodes } = useContext(boardDataContext)
  const nonReactiveState = useEffectEventP(() => ({
    modalAction,
    nodes,
    overwriteBoardData,
  }))

  useEffect(() => {
    const { nodes, overwriteBoardData, modalAction } = nonReactiveState()
    const isLoadExternalURL = hash.includes(shareHashTocken)
    if (!isLoadExternalURL) return modalAction.close()

    if (nodes.length) return modalAction.open()

    overwriteBoardData()
  }, [hash, nonReactiveState])
}
