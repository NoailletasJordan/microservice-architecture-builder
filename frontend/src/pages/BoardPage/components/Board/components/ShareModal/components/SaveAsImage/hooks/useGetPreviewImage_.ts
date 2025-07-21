import { useEffect, useState } from 'react'
import { useGetImageUrl_ } from './useGetImageUrl_'

export function useGetPreviewImage_({ isOpened }: { isOpened: boolean }) {
  const [image, setImage] = useState('')
  const getImageUrl = useGetImageUrl_()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    ;(async () => {
      if (!isOpened) {
        timeoutId = setTimeout(() => {
          setImage('')
        }, 200)
        return
      }

      timeoutId = setTimeout(async () => {
        const imageUrl = await getImageUrl()
        setImage(imageUrl)
        // Delay to prevent ui block on modal
      }, 200)
    })()

    return () => {
      timeoutId && clearTimeout(timeoutId)
    }
  }, [isOpened, getImageUrl])
  return image
}
