export default function ReviewCard({ review }) {
  const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Stars */}
      <div className="text-xl mb-3">{stars}</div>

      {/* Comment */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        "{review.comment}"
      </p>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#c97830] text-white flex items-center justify-center text-sm font-bold">
          {review.userName[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{review.userName}</p>
          <p className="text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}