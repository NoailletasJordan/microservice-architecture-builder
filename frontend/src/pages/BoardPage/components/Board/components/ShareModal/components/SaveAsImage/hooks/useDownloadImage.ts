import { boardDataContext } from '@/contexts/BoardData/constants'
import { useCallback, useContext, useMemo } from 'react'
import { useGetImageUrl_ } from './useGetImageUrl_'

export function useDownloadImage_() {
  const getImageUrl = useGetImageUrl_()
  const { title: boardName } = useContext(boardDataContext)

  const fileTitle = useMemo(() => getFileName(boardName), [boardName])

  const downloadImage = useCallback(async () => {
    const imageUrl = await getImageUrl()
    downloader({ dataUrl: imageUrl, fileTitle })
  }, [getImageUrl, fileTitle])

  return downloadImage
}

function getFileName(boardTitle: string) {
  return (
    new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date()) + ` - ${boardTitle}`
  )
}

function downloader({
  dataUrl,
  fileTitle,
}: {
  dataUrl: string
  fileTitle: string
}) {
  const a = document.createElement('a')

  a.setAttribute('download', fileTitle)
  a.setAttribute('href', dataUrl)
  a.click()
}
