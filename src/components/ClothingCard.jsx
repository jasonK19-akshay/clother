import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ColorChip from './ColorChip'
import { getImage } from '../services/imageService'
import { categoryName, formatCurrency } from '../utils/formatters'

export default function ClothingCard({ item, categories, compact = false }) {
  const [image, setImage] = useState('')

  useEffect(() => {
    let mounted = true
    getImage(item.imageId).then((value) => mounted && setImage(value || ''))
    return () => {
      mounted = false
    }
  }, [item.imageId])

  return (
    <Link className={`clothing-card ${compact ? 'compact' : ''}`} to={`/wardrobe/${item.id}`}>
      <div className="item-image">
        {image ? <img src={image} alt={item.name} loading="lazy" /> : <span>No image</span>}
        {item.favorite && <span className="favorite-badge" aria-label="Favorite">♥</span>}
      </div>
      <div className="item-card-body">
        <div>
          <h3>{item.name}</h3>
          <p>{categoryName(categories, item.categoryId)}</p>
        </div>
        <div className="chip-row">
          {item.colors.slice(0, compact ? 2 : 4).map((color) => (
            <ColorChip key={`${item.id}-${color.name}-${color.hex}`} color={color} compact />
          ))}
        </div>
        <div className="meta-row">
          <span>{item.status}</span>
          {item.price > 0 && <span>{formatCurrency(item.price)}</span>}
        </div>
      </div>
    </Link>
  )
}
