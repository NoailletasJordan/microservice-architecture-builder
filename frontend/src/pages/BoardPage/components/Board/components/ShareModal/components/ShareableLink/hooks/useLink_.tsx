import {
  shareHashTocken,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { useReactFlow } from '@xyflow/react'
import { useEffect, useState } from 'react'
import { TCustomEdge } from '../../../../connexionContants'

export function useLink_({ opened }: { opened: boolean }) {
  const [link, setLink] = useState('')
  const flowInstance = useReactFlow<TCustomNode, TCustomEdge>()

  useEffect(() => {
    const baseUrl = `${window.location.origin}`
    const stringifiedData = JSON.stringify({
      nodes: flowInstance.getNodes(),
      edges: flowInstance.getEdges(),
    })
    const fullUrl = `${baseUrl}/${shareHashTocken}${encodeURIComponent(
      stringifiedData,
    )}`
    setLink(fullUrl)
  }, [opened, flowInstance])

  return link
}
