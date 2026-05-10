import { useState } from 'react'
import { submitReview } from '../../services/reviewService'
import { useAuth } from '../../context/AuthContext'

export default function ReviewModal({ reservation, onClose, onSubmitted }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating.')
      return
    }
    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await submitReview({
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        reservationId: reservation.id,
        rating,
        comment: comment.trim(),
      })
      onSubmitted()
      onClose()
    } catch (err) {
      setError('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Leave a Review
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {reservation.date} at {reservation.time}
        </p>

        {/* Stars */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-9 h-9"
                  fill={star <= (hoveredRating || rating) ? '#c97830' : 'none'}
                  stroke={star <= (hoveredRating || rating) ? '#c97830' : '#d1d5db'}
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-[#c97830] font-medium mt-2">
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder="Tell us about your experience..."
          />
          <p className="text-xs text-gray-400 mt-1">{comment.length} / min 10 characters</p>
        </div>

        {error && <p className="error-msg text-center mb-4">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-outline">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 btn-primary disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
