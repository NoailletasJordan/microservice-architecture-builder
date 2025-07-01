import { showNotificationError, showNotificationSuccess } from '@/contants'
import { shareHashTocken } from '@/pages/BoardPage/configs/constants'
import { getNodesBounds, useReactFlow } from 'reactflow'

export function useOverwriteBoardData({
  hash,
  handleCloseModal,
}: {
  hash: string
  handleCloseModal: () => void
}) {
  const flowInstance = useReactFlow()

  const overwriteBoardData = () => {
    try {
      const objectString = hash.replace(shareHashTocken, '')
      const loadedValues = JSON.parse(decodeURIComponent(objectString))
      flowInstance.setNodes(() => loadedValues.nodes)
      flowInstance.setEdges(() => loadedValues.edges)
      flowInstance.fitBounds(getNodesBounds(loadedValues.nodes))

      showNotificationSuccess({
        title: 'Board loaded successfully',
        message: '',
      })
    } catch (error) {
      console.error(error)
      showNotificationError({
        title: 'Error loading url content',
        message:
          'Continuing on existing content, apologies for the inconvenience',
      })
    } finally {
      handleCloseModal()
    }
  }

  return overwriteBoardData
}
