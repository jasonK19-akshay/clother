import { saveImage, deleteImage } from './imageService'
import { getStoredClothes, saveStoredClothes } from './storageService'
import { createId } from '../utils/formatters'

export function listClothes() {
  return getStoredClothes()
}

export async function createClothing(input, imageDataUrl) {
  const now = new Date().toISOString()
  const imageId = createId('img')
  if (imageDataUrl) await saveImage(imageId, imageDataUrl)
  const item = {
    id: createId('item'),
    name: input.name.trim(),
    categoryId: input.categoryId,
    colors: input.colors,
    imageId,
    brand: input.brand?.trim() || '',
    size: input.size?.trim() || '',
    material: input.material?.trim() || '',
    price: input.price ? Number(input.price) : 0,
    purchaseDate: input.purchaseDate || '',
    description: input.description?.trim() || '',
    notes: input.notes?.trim() || '',
    favorite: Boolean(input.favorite),
    status: input.status || 'Active',
    createdAt: now,
    updatedAt: now,
  }
  saveStoredClothes([item, ...getStoredClothes()])
  return item
}

export async function updateClothing(id, input, imageDataUrl) {
  const clothes = getStoredClothes()
  const existing = clothes.find((item) => item.id === id)
  if (!existing) throw new Error('Clothing item was not found.')
  let imageId = existing.imageId
  if (imageDataUrl) {
    if (imageId) await deleteImage(imageId)
    imageId = createId('img')
    await saveImage(imageId, imageDataUrl)
  }
  if (input.removeImage) {
    await deleteImage(imageId)
    imageId = ''
  }
  const updated = {
    ...existing,
    ...input,
    name: input.name.trim(),
    imageId,
    price: input.price ? Number(input.price) : 0,
    favorite: Boolean(input.favorite),
    updatedAt: new Date().toISOString(),
  }
  delete updated.imagePreview
  delete updated.removeImage
  saveStoredClothes(clothes.map((item) => (item.id === id ? updated : item)))
  return updated
}

export async function deleteClothing(id) {
  const clothes = getStoredClothes()
  const item = clothes.find((entry) => entry.id === id)
  if (item?.imageId) await deleteImage(item.imageId)
  saveStoredClothes(clothes.filter((entry) => entry.id !== id))
}

export function setFavorite(id, favorite) {
  const clothes = getStoredClothes().map((item) =>
    item.id === id ? { ...item, favorite, updatedAt: new Date().toISOString() } : item,
  )
  saveStoredClothes(clothes)
}
