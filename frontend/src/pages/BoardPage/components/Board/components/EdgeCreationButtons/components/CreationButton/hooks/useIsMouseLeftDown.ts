import { useEffect, useState } from 'react'

export function useIsMouseLeftDown() {
  const [isMouseLeftDown, setIsMouseLeftDown] = useState(false)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) setIsMouseLeftDown(true) // Left button
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) setIsMouseLeftDown(false)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return isMouseLeftDown
}
