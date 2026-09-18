import { useNavigate } from 'react-router-dom'
import ClothingForm from '../components/ClothingForm'
import { useWardrobe } from '../hooks/useWardrobe'
import { createClothing } from '../services/clothesService'

export default function AddClothing() {
  const { categories, refresh } = useWardrobe()
  const navigate = useNavigate()

  const submit = async (values, imageDataUrl) => {
    const item = await createClothing(values, imageDataUrl)
    refresh()
    navigate(`/wardrobe/${item.id}`)
  }

  return (
    <div className="page narrow">
      <header className="page-header">
        <div>
          <p className="eyebrow">New item</p>
          <h1>Add Clothing</h1>
        </div>
      </header>
      <ClothingForm categories={categories} onSubmit={submit} submitLabel="Save Clothing" />
    </div>
  )
}
