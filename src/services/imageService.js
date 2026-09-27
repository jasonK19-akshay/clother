import { supabase } from '../lib/supabaseClient'

const BUCKET_NAME = 'clothing-images'

function dataUrlToBlob(dataUrl) {
  const [header, base64] =
    dataUrl.split(',')

  const match = header.match(
    /data:(.*?);base64/,
  )

  if (!match) {
    throw new Error(
      'Invalid image data.',
    )
  }

  const mimeType = match[1]

  const binary = atob(base64)

  const bytes = new Uint8Array(
    binary.length,
  )

  for (
    let index = 0;
    index < binary.length;
    index += 1
  ) {
    bytes[index] =
      binary.charCodeAt(index)
  }

  return new Blob([bytes], {
    type: mimeType,
  })
}

export async function saveImage(
  userId,
  clothingId,
  dataUrl,
) {
  const blob =
    dataUrlToBlob(dataUrl)

  const path =
    `${userId}/${clothingId}.webp`

  const {
    error,
  } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(
      path,
      blob,
      {
        contentType: blob.type,
        upsert: true,
      },
    )

  if (error) throw error

  return path
}

export async function getImage(
  path,
) {
  if (!path) return ''

  const {
    data,
    error,
  } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(
      path,
      60 * 60,
    )

  if (error) {
    console.error(
      'Unable to create image URL:',
      error,
    )

    return ''
  }

  return data?.signedUrl || ''
}

export async function deleteImage(
  path,
) {
  if (!path) return

  const {
    error,
  } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) throw error
}

export async function clearImages() {
  // Cloud images are deleted individually.
  // Kept for compatibility with older code.
}

export function fileToCompressedDataUrl(
  file,
  maxSize = 1200,
  quality = 0.82,
) {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader()

      reader.onload = () => {
        const img = new Image()

        img.onload = () => {
          const ratio = Math.min(
            1,
            maxSize /
              Math.max(
                img.width,
                img.height,
              ),
          )

          const canvas =
            document.createElement(
              'canvas',
            )

          canvas.width =
            Math.round(
              img.width * ratio,
            )

          canvas.height =
            Math.round(
              img.height * ratio,
            )

          const context =
            canvas.getContext(
              '2d',
            )

          if (!context) {
            reject(
              new Error(
                'Could not process image.',
              ),
            )
            return
          }

          context.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height,
          )

          resolve(
            canvas.toDataURL(
              'image/webp',
              quality,
            ),
          )
        }

        img.onerror = () => {
          reject(
            new Error(
              'Could not read image.',
            ),
          )
        }

        img.src =
          reader.result
      }

      reader.onerror = () => {
        reject(
          new Error(
            'Could not load image file.',
          ),
        )
      }

      reader.readAsDataURL(file)
    },
  )
}