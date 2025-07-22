import { useEffect, useState } from 'react'

export function useContentHeight_({
  opened,
  selectedIndex,
}: {
  opened: boolean
  selectedIndex: number
}) {
  const [elementStateRef, setElementStateRef] = useState<HTMLElement | null>(
    null,
  )
  const [height, setHeight] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (elementStateRef) {
      interval = setTimeout(() => {
        setHeight(elementStateRef.clientHeight)
      }, 50)
    }

    return () => {
      if (interval) clearTimeout(interval)
    }
  }, [elementStateRef, selectedIndex, opened])

  return { contentHeight: height, setElementStateRef }
}
