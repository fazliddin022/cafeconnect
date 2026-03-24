import { useMenuContext } from '../context/MenuContext'
import CategoryFilter from '../components/menu/CategoryFilter'
import MenuGrid from '../components/menu/MenuGrid'

export default function MenuPage() {
  const { searchQuery, setSearchQuery } = useMenuContext()

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 text-center">
        <h1 className="section-title">Our Menu</h1>
        <p className="section-subtitle">Fresh ingredients, crafted with love.</p>
      </div>

      {/* Filter + Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#c97830] text-gray-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter />
        </div>

        {/* Menu Grid */}
        <MenuGrid />
      </div>
    </div>
  )
}