import { useLocation } from 'react-router-dom'

export function useCurrentHash() {
  const location = useLocation()
  const { hash } = location

  return hash
}
