import { IService } from '@/pages/BoardPage/configs/constants'
import { useEffect, useState } from 'react'

export function useLayoutIds_({ service }: { service: IService }) {
  const [layoutId, setLayoutId] = useState<string | undefined>(service.id)
  const layoutIdImage = layoutId ? `${layoutId}-image` : undefined

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLayoutId(undefined)
    }, 400)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return {
    bodyLayoutId: layoutId,
    imageLayoutId: layoutIdImage,
    imageLayout: layoutIdImage ? ('position' as const) : false,
  }
}
