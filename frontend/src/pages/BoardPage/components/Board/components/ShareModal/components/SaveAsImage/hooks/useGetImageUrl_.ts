import { customColors } from '@/contants'
import {
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from '@xyflow/react'
import { toPng } from 'html-to-image'
import { useCallback } from 'react'

export function useGetImageUrl_() {
  const { getNodes } = useReactFlow()

  const getImageUrl = useCallback(async () => {
    const imageWidth = 1280
    const imageHeight = 720
    const padding = 0.1

    const nodesBounds = getNodesBounds(getNodes())
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.1,
      2,
      padding,
    )

    const target = document.querySelector(
      '.react-flow__viewport',
    ) as HTMLElement

    return await toPng(target, {
      backgroundColor: customColors.gray[2],
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    })
  }, [getNodes])

  return getImageUrl
}
