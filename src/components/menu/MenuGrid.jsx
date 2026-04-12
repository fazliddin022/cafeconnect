import { useMenuContext } from '../../context/MenuContext'
import MenuCard from './MenuCard'
import { MenuCardSkeleton } from '../common/Skeleton'

export default function MenuGrid() {
  const { filteredItems, loading } = useMenuContext()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <MenuCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🍽️</p>
        <p>No items in this category yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  )
}