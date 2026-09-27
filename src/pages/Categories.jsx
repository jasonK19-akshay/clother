import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { useWardrobe } from '../hooks/useWardrobe'
import { createCategory, deleteCategory, updateCategory } from '../services/categoryService'

export default function Categories() {
  const { clothes, categories, refresh } = useWardrobe()
  const [form, setForm] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [error, setError] = useState('')

  const counts = clothes.reduce((totals, item) => {
    totals[item.categoryId] = (totals[item.categoryId] || 0) + 1
    return totals
  }, {})

  const submit = async (event) => {
    try {
  if (editingId) {
    await updateCategory(
      editingId,
      form,
    )
  } else {
    await createCategory(form)
  }

  setForm({
    name: '',
    description: '',
  })

  setEditingId('')
  setError('')

  await refresh()
} catch (error) {
  setError(
    error.message ||
      'Unable to save category.',
  )
}
  }

  const startEdit = (category) => {
    setEditingId(category.id)
    setForm({ name: category.name, description: category.description || '' })
  }

  const remove = async () => {
  try {
    await deleteCategory(deleteId)

    setDeleteId('')

    await refresh()
  } catch (error) {
    setError(
      error.message ||
        'Unable to delete category.',
    )
  }
}

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Organization</p>
          <h1>Categories</h1>
        </div>
      </header>
      <div className="two-column">
        <form className="panel-form" onSubmit={submit}>
          <h2>{editingId ? 'Edit Category' : 'Create Category'}</h2>
          <label>
            Category name
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            {error && <span className="error">{error}</span>}
          </label>
          <label>
            Description
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows="4" />
          </label>
          <div className="actions">
            <button type="submit" className="button">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="button ghost" onClick={() => { setEditingId(''); setForm({ name: '', description: '' }) }}>Cancel</button>}
          </div>
        </form>
        <section className="category-list">
          {categories.map((category) => (
            <article className="category-row" key={category.id}>
              <div>
                <h3>{category.name}</h3>
                <p>{category.description || 'No description'}</p>
                <small>{counts[category.id] || 0} items</small>
              </div>
              <div className="actions">
                <button type="button" className="button ghost" onClick={() => startEdit(category)}>Edit</button>
                <button type="button" className="button danger" onClick={() => setDeleteId(category.id)}>Delete</button>
              </div>
            </article>
          ))}
        </section>
      </div>
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete category?"
        message="Items in this category will remain in your wardrobe, but their category will be cleared."
        confirmLabel="Delete"
        onCancel={() => setDeleteId('')}
        onConfirm={remove}
      />
    </div>
  )
}
