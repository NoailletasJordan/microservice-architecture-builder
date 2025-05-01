import { ReactNode, useState } from 'react'
import { clickCanvaContext } from './constants'

interface Props {
  children: ReactNode
}

// Board click event doesn't bubble up to the menu click event
// Update a value on clicks to manually close dropdown menus
export default function ClickCanvaProvider({ children }: Props) {
  const [canvaClickIncrement, setCanvaClickIncrement] = useState(0)

  return (
    <clickCanvaContext.Provider
      value={{
        canvaClickIncrement,
        triggerClickCanva: () => setCanvaClickIncrement((i) => i + 1),
      }}
    >
      {children}
    </clickCanvaContext.Provider>
  )
}
