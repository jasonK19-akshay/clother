import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ColorChip from '../components/ColorChip'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { useWardrobe } from '../hooks/useWardrobe'
import { deleteClothing, setFavorite } from '../services/clothesService'
import { getImage } from '../services/imageService'
import { categoryName, formatCurrency, formatDate } from '../utils/formatters'

export default function ClothingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { clothes, categories, refresh } = useWardrobe()
  const [image, setImage] = useState('')
  const [confirming, setConfirming] = useState(false)
  const item = clothes.find((entry) => entry.id === id)

  useEffect(() => {
    if (item?.imageId) getImage(item.imageId).then((value) => setImage(value || ''))
  }, [item])

  if (!item) return <EmptyState title="This clothing item could not be found." actionLabel="Back to Wardrobe" actionTo="/wardrobe" />

  const toggleFavorite = () => {
    setFavorite(item.id, !item.favorite)
    refresh()
  }

  const remove = async () => {
    await deleteClothing(item.id)
    refresh()
    navigate('/wardrobe')
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{categoryName(categories, item.categoryId)}</p>
          <h1>{item.name}</h1>
        </div>
        <div className="actions">
          <button type="button" className="button ghost" onClick={toggleFavorite}>{item.favorite ? 'Unfavorite' : 'Favorite'}</button>
          <Link className="button ghost" to={`/edit/${item.id}`}>Edit</Link>
          <button type="button" className="button danger" onClick={() => setConfirming(true)}>Delete</button>
        </div>
      </header>
      <section className="details-layout">
        <div className="details-image">
          {image ? <img src={image} alt={item.name} /> : <span>No image</span>}
        </div>
        <div className="details-panel">
          <div className="chip-row">
            {item.colors.map((color) => <ColorChip key={`${color.name}-${color.hex}`} color={color} />)}
          </div>
          <dl className="detail-list">
            <div><dt>Brand</dt><dd>{item.brand || 'Not set'}</dd></div>
            <div><dt>Size</dt><dd>{item.size || 'Not set'}</dd></div>
            <div><dt>Material</dt><dd>{item.material || 'Not set'}</dd></div>
            <div><dt>Price</dt><dd>{formatCurrency(item.price || 0)}</dd></div>
            <div><dt>Purchase date</dt><dd>{formatDate(item.purchaseDate)}</dd></div>
            <div><dt>Status</dt><dd>{item.status}</dd></div>
            <div><dt>Favorite</dt><dd>{item.favorite ? 'Yes' : 'No'}</dd></div>
          </dl>
          {item.description && <section><h2>Description</h2><p>{item.description}</p></section>}
          {item.notes && <section><h2>Notes</h2><p>{item.notes}</p></section>}
        </div>
      </section>
      <ConfirmDialog
        open={confirming}
        title="Delete clothing item?"
        message="This will remove the item and its stored image from this browser."
        confirmLabel="Delete"
        onCancel={() => setConfirming(false)}
        onConfirm={remove}
      />
    </div>
  )
}
