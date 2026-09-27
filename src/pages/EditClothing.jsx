import { useNavigate, useParams } from 'react-router-dom'
import ClothingForm from '../components/ClothingForm'
import EmptyState from '../components/EmptyState'
import { useWardrobe } from '../hooks/useWardrobe'
import { updateClothing } from '../services/clothesService'

export default function EditClothing() {
  const { id } = useParams()
  const { clothes, categories, refresh } = useWardrobe()
  const navigate = useNavigate()
  const item = clothes.find((entry) => entry.id === id)

  if (!item) return <EmptyState title="This clothing item could not be found." actionLabel="Back to Wardrobe" actionTo="/wardrobe" />

  const submit = async (values, imageDataUrl) => {
  await updateClothing(
    id,
    values,
    imageDataUrl,
  )

  await refresh()

  navigate(`/wardrobe/${id}`)
}

  return (
    <div className="page narrow">
      <header className="page-header">
        <div>
          <p className="eyebrow">Edit item</p>
          <h1>Edit Clothing</h1>
        </div>
      </header>
      <ClothingForm categories={categories} initialItem={item} onSubmit={submit} submitLabel="Update Clothing" />
    </div>
  )
}
