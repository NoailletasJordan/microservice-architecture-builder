import { useNavigate } from 'react-router-dom'

export function useHandleCloseModal(closeModal: () => void) {
  const navigate = useNavigate()

  return () => {
    closeModal()
    navigate('/')
  }
}
