import { useParams } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function BoardPage() {
  const { id } = useParams()

  return (
    <Layout>
      <div>new component {id} </div>
    </Layout>
  )
}
