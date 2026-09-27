import { supabase } from '../lib/supabaseClient'
import {
  saveImage,
  deleteImage,
} from './imageService'

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error

  if (!user) {
    throw new Error('You must be logged in.')
  }

  return user
}

function mapClothing(row) {
  return {
    id: row.id,
    name: row.name,
    categoryId: row.category_id || '',
    colors: Array.isArray(row.colors)
      ? row.colors
      : [],
    imageId: row.image_path || '',
    brand: row.brand || '',
    size: row.size || '',
    material: row.material || '',
    price: Number(row.price || 0),
    purchaseDate: row.purchase_date || '',
    description: row.description || '',
    notes: row.notes || '',
    favorite: Boolean(row.favorite),
    status: row.status || 'Active',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listClothes() {
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from('clothes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    })

  if (error) throw error

  return (data || []).map(mapClothing)
}

export async function createClothing(
  input,
  imageDataUrl,
) {
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from('clothes')
    .insert({
      user_id: user.id,
      category_id: input.categoryId || null,
      name: input.name.trim(),
      colors: input.colors || [],
      image_path: '',
      brand: input.brand?.trim() || '',
      size: input.size?.trim() || '',
      material: input.material?.trim() || '',
      price: input.price
        ? Number(input.price)
        : 0,
      purchase_date:
        input.purchaseDate || null,
      description:
        input.description?.trim() || '',
      notes:
        input.notes?.trim() || '',
      favorite: Boolean(input.favorite),
      status: input.status || 'Active',
    })
    .select()
    .single()

  if (error) throw error

  if (!imageDataUrl) {
    return mapClothing(data)
  }

  const imagePath = await saveImage(
    user.id,
    data.id,
    imageDataUrl,
  )

  const {
    data: updated,
    error: updateError,
  } = await supabase
    .from('clothes')
    .update({
      image_path: imagePath,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (updateError) {
    await deleteImage(imagePath)
    throw updateError
  }

  return mapClothing(updated)
}

export async function updateClothing(
  id,
  input,
  imageDataUrl,
) {
  const user = await getCurrentUser()

  const {
    data: existing,
    error: existingError,
  } = await supabase
    .from('clothes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (existingError) throw existingError

  let imagePath =
    existing.image_path || ''

  if (imageDataUrl) {
    if (imagePath) {
      await deleteImage(imagePath)
    }

    imagePath = await saveImage(
      user.id,
      id,
      imageDataUrl,
    )
  }

  if (input.removeImage) {
    if (imagePath) {
      await deleteImage(imagePath)
    }

    imagePath = ''
  }

  const {
    data,
    error,
  } = await supabase
    .from('clothes')
    .update({
      category_id:
        input.categoryId || null,
      name: input.name.trim(),
      colors: input.colors || [],
      image_path: imagePath,
      brand: input.brand?.trim() || '',
      size: input.size?.trim() || '',
      material: input.material?.trim() || '',
      price: input.price
        ? Number(input.price)
        : 0,
      purchase_date:
        input.purchaseDate || null,
      description:
        input.description?.trim() || '',
      notes:
        input.notes?.trim() || '',
      favorite: Boolean(
        input.favorite,
      ),
      status:
        input.status || 'Active',
      updated_at:
        new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error

  return mapClothing(data)
}

export async function deleteClothing(id) {
  const user = await getCurrentUser()

  const {
    data: existing,
    error: existingError,
  } = await supabase
    .from('clothes')
    .select('image_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (existingError) throw existingError

  if (existing?.image_path) {
    await deleteImage(
      existing.image_path,
    )
  }

  const { error } = await supabase
    .from('clothes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function setFavorite(
  id,
  favorite,
) {
  const user = await getCurrentUser()

  const {
    data,
    error,
  } = await supabase
    .from('clothes')
    .update({
      favorite: Boolean(favorite),
      updated_at:
        new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error

  return mapClothing(data)
}