export function SkeletonBox({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg ${className}`}
    />
  )
}

// Menu card skeleton
export function MenuCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <SkeletonBox className="h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <SkeletonBox className="h-5 w-32" />
          <SkeletonBox className="h-5 w-12" />
        </div>
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-2/3" />
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

// Event card skeleton
export function EventCardSkeleton() {
  return (
    <div className="card flex flex-col sm:flex-row overflow-hidden">
      <SkeletonBox className="sm:w-48 h-48 rounded-none flex-shrink-0" />
      <div className="p-6 flex-1 space-y-3">
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-6 w-48" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-3/4" />
        <div className="flex gap-4">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

// Reservation card skeleton
export function ReservationCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-6 w-40" />
            <SkeletonBox className="h-5 w-20 rounded-full" />
          </div>
          <SkeletonBox className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <SkeletonBox className="h-9 w-24 rounded-lg" />
          <SkeletonBox className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}