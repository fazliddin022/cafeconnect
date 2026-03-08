/**
 * Format a price number to currency string
 */
export const formatPrice = (price, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)

/**
 * Format a date string to human-readable form
 */
export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

/**
 * Truncate text to a given max length
 */
export const truncateText = (text, maxLength = 100) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text