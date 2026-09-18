import { ACCEPTED_IMAGE_TYPES } from './constants'

export function validateClothing(values) {
  const errors = {}

  if (!values.name?.trim()) errors.name = 'Clothing name is required.'
  if (!values.categoryId) errors.categoryId = 'Choose a category.'
  if (!values.colors?.length) errors.colors = 'Select at least one color.'
  if (!values.imageId && !values.imagePreview) errors.image = 'Add an image for this item.'
  if (values.price && Number(values.price) < 0) errors.price = 'Price must be a positive number.'
  if (values.purchaseDate && Number.isNaN(new Date(values.purchaseDate).getTime())) {
    errors.purchaseDate = 'Enter a valid purchase date.'
  }

  return errors
}

export function validateImageFile(file) {
  if (!file) return 'Choose an image file.'
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Use a JPG, PNG, or WEBP image.'
  }
  return ''
}
