import { clearImages, getImage, saveImage } from './imageService'
import { getStoredCategories, getStoredClothes, resetMetadata, saveStoredCategories, saveStoredClothes } from './storageService'

export async function createBackup() {
  const clothes = getStoredClothes()
  const images = {}
  await Promise.all(
    clothes.map(async (item) => {
      if (item.imageId) images[item.imageId] = await getImage(item.imageId)
    }),
  )
  return {
    app: 'Clother',
    version: 1,
    exportedAt: new Date().toISOString(),
    categories: getStoredCategories(),
    clothes,
    images,
  }
}

export function downloadBackup(backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `clother-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export async function restoreBackup(backup) {
  if (!backup || !Array.isArray(backup.categories) || !Array.isArray(backup.clothes)) {
    throw new Error('This backup file is missing wardrobe data.')
  }
  await clearImages()
  saveStoredCategories(backup.categories)
  saveStoredClothes(backup.clothes)
  await Promise.all(
    Object.entries(backup.images || {}).map(([id, value]) => {
      if (!value) return Promise.resolve()
      return saveImage(id, value)
    }),
  )
}

export async function resetAllData() {
  await clearImages()
  resetMetadata()
}
