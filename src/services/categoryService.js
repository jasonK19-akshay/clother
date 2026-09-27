import { supabase } from '../lib/supabaseClient'
import { DEFAULT_CATEGORIES } from '../utils/constants'

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

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    createdAt: row.created_at,
  }
}

async function ensureDefaultCategories() {
  const user = await getCurrentUser()

  const { data: existing, error } = await supabase
    .from('categories')
    .select('name')
    .eq('user_id', user.id)

  if (error) throw error

  const existingNames = new Set(
    (existing || []).map((category) =>
      category.name.toLowerCase(),
    ),
  )

  const missing = DEFAULT_CATEGORIES.filter(
    (name) => !existingNames.has(name.toLowerCase()),
  )

  if (!missing.length) return

  const rows = missing.map((name) => ({
    user_id: user.id,
    name,
    description: '',
  }))

  const { error: insertError } = await supabase
    .from('categories')
    .insert(rows)

  if (insertError) throw insertError
}

export async function listCategories() {
  const user = await getCurrentUser()

  await ensureDefaultCategories()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (error) throw error

  return (data || []).map(mapCategory)
}

export async function createCategory(input) {
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: user.id,
      name: input.name.trim(),
      description: input.description?.trim() || '',
    })
    .select()
    .single()

  if (error) throw error

  return mapCategory(data)
}

export async function updateCategory(id, input) {
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from('categories')
    .update({
      name: input.name.trim(),
      description: input.description?.trim() || '',
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error

  return mapCategory(data)
}

export async function deleteCategory(id) {
  const user = await getCurrentUser()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}