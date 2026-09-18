import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_COLORS, USAGE_STATUSES } from '../utils/constants'
import { fileToCompressedDataUrl, getImage } from '../services/imageService'
import { validateClothing, validateImageFile } from '../utils/validators'
import ColorChip from './ColorChip'

const blankForm = {
  name: '',
  categoryId: '',
  colors: [],
  brand: '',
  size: '',
  material: '',
  price: '',
  purchaseDate: '',
  description: '',
  notes: '',
  favorite: false,
  status: 'Active',
  imagePreview: '',
  imageId: '',
  removeImage: false,
}

export default function ClothingForm({ categories, initialItem, onSubmit, submitLabel }) {
  const [values, setValues] = useState(blankForm)
  const [errors, setErrors] = useState({})
  const [customColor, setCustomColor] = useState({ name: '', hex: '#3b82f6' })
  const [busy, setBusy] = useState(false)
  const [imageChanged, setImageChanged] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!initialItem) {
      setValues((current) => ({ ...current, categoryId: categories[0]?.id || '' }))
      setImageChanged(false)
      return undefined
    }
    setValues({ ...blankForm, ...initialItem, price: initialItem.price || '' })
    getImage(initialItem.imageId).then((image) => {
      if (mounted) setValues((current) => ({ ...current, imagePreview: image || '' }))
    })
    setImageChanged(false)
    return () => {
      mounted = false
    }
  }, [initialItem, categories])

  const selectedColorNames = useMemo(
    () => values.colors.map((color) => `${color.name}-${color.hex}`),
    [values.colors],
  )

  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }))

  const toggleColor = (color) => {
    const signature = `${color.name}-${color.hex}`
    setValues((current) => {
      const exists = current.colors.some((entry) => `${entry.name}-${entry.hex}` === signature)
      return {
        ...current,
        colors: exists
          ? current.colors.filter((entry) => `${entry.name}-${entry.hex}` !== signature)
          : [...current.colors, color],
      }
    })
  }

  const addCustomColor = () => {
    if (!customColor.name.trim()) {
      setErrors((current) => ({ ...current, customColor: 'Name the custom color.' }))
      return
    }
    toggleColor({ name: customColor.name.trim(), hex: customColor.hex })
    setCustomColor({ name: '', hex: '#3b82f6' })
    setErrors((current) => ({ ...current, customColor: '' }))
  }

  const handleImage = async (event) => {
    const file = event.target.files?.[0]
    const error = validateImageFile(file)
    if (error) {
      setErrors((current) => ({ ...current, image: error }))
      return
    }
    try {
      const preview = await fileToCompressedDataUrl(file)
      update('imagePreview', preview)
      update('removeImage', false)
      setImageChanged(true)
      setErrors((current) => ({ ...current, image: '' }))
    } catch (errorMessage) {
      setErrors((current) => ({ ...current, image: errorMessage.message }))
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validateClothing(values)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    setBusy(true)
    try {
      await onSubmit(values, imageChanged ? values.imagePreview : '')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="clothing-form" onSubmit={submit}>
      <section className="form-section">
        <h2>Essentials</h2>
        <div className="form-grid">
          <label>
            Clothing name
            <input value={values.name} onChange={(event) => update('name', event.target.value)} />
            {errors.name && <span className="error">{errors.name}</span>}
          </label>
          <label>
            Category
            <select value={values.categoryId} onChange={(event) => update('categoryId', event.target.value)}>
              <option value="">Select category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            {errors.categoryId && <span className="error">{errors.categoryId}</span>}
          </label>
          <label>
            Brand
            <input value={values.brand} onChange={(event) => update('brand', event.target.value)} />
          </label>
          <label>
            Size
            <input value={values.size} onChange={(event) => update('size', event.target.value)} />
          </label>
          <label>
            Material
            <input value={values.material} onChange={(event) => update('material', event.target.value)} />
          </label>
          <label>
            Usage status
            <select value={values.status} onChange={(event) => update('status', event.target.value)}>
              {USAGE_STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label>
            Price
            <input type="number" min="0" step="0.01" value={values.price} onChange={(event) => update('price', event.target.value)} />
            {errors.price && <span className="error">{errors.price}</span>}
          </label>
          <label>
            Purchase date
            <input type="date" value={values.purchaseDate} onChange={(event) => update('purchaseDate', event.target.value)} />
            {errors.purchaseDate && <span className="error">{errors.purchaseDate}</span>}
          </label>
        </div>
      </section>

      <section className="form-section">
        <h2>Image</h2>
        <div className="image-uploader">
          <div className="image-preview">
            {values.imagePreview && !values.removeImage ? <img src={values.imagePreview} alt="Clothing preview" /> : <span>Image preview</span>}
          </div>
          <div className="stack">
            <label>
              Upload image
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} />
              {errors.image && <span className="error">{errors.image}</span>}
            </label>
            {values.imagePreview && (
              <button type="button" className="button ghost" onClick={() => { setImageChanged(false); setValues((current) => ({ ...current, imagePreview: '', removeImage: true })) }}>
                Remove image
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2>Colors</h2>
        <div className="color-picker-grid">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`color-option ${selectedColorNames.includes(`${color.name}-${color.hex}`) ? 'selected' : ''}`}
              onClick={() => toggleColor(color)}
            >
              <span className="swatch" style={{ backgroundColor: color.hex }} />
              {color.name}
            </button>
          ))}
        </div>
        {errors.colors && <span className="error">{errors.colors}</span>}
        <div className="custom-color-row">
          <input aria-label="Custom color name" placeholder="Custom color name" value={customColor.name} onChange={(event) => setCustomColor((current) => ({ ...current, name: event.target.value }))} />
          <input aria-label="Custom color value" type="color" value={customColor.hex} onChange={(event) => setCustomColor((current) => ({ ...current, hex: event.target.value }))} />
          <button type="button" className="button ghost" onClick={addCustomColor}>Add Custom</button>
        </div>
        {errors.customColor && <span className="error">{errors.customColor}</span>}
        <div className="chip-row">
          {values.colors.map((color) => (
            <ColorChip
              key={`${color.name}-${color.hex}`}
              color={color}
              removable
              onRemove={() => toggleColor(color)}
            />
          ))}
        </div>
      </section>

      <section className="form-section">
        <h2>Details</h2>
        <label className="wide">
          Description
          <textarea value={values.description} onChange={(event) => update('description', event.target.value)} rows="4" />
        </label>
        <label className="wide">
          Notes
          <textarea value={values.notes} onChange={(event) => update('notes', event.target.value)} rows="4" />
        </label>
        <label className="checkbox-line">
          <input type="checkbox" checked={values.favorite} onChange={(event) => update('favorite', event.target.checked)} />
          Mark as favorite
        </label>
      </section>

      <div className="form-actions">
        <button type="submit" className="button" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
