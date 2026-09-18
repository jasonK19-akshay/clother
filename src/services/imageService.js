const DB_NAME = 'clother-images'
const STORE_NAME = 'images'
const DB_VERSION = 1

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function transact(mode, action) {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode)
    const store = transaction.objectStore(STORE_NAME)
    const request = action(store)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => db.close()
    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

export async function saveImage(id, dataUrl) {
  await transact('readwrite', (store) => store.put(dataUrl, id))
}

export async function getImage(id) {
  if (!id) return ''
  return transact('readonly', (store) => store.get(id))
}

export async function deleteImage(id) {
  if (!id) return
  await transact('readwrite', (store) => store.delete(id))
}

export async function clearImages() {
  await transact('readwrite', (store) => store.clear())
}

export function fileToCompressedDataUrl(file, maxSize = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        const context = canvas.getContext('2d')
        context.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/webp', quality))
      }
      img.onerror = () => reject(new Error('Could not read image.'))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error('Could not load image file.'))
    reader.readAsDataURL(file)
  })
}
