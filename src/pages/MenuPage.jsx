import CategoryFilter from '../components/menu/CategoryFilter'
import MenuGrid from '../components/menu/MenuGrid'

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 text-center">
        <h1 className="section-title">Our Menu</h1>
        <p className="section-subtitle">Fresh ingredients, crafted with love.</p>
      </div>

      {/* Filter + Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <CategoryFilter />
        </div>
        <MenuGrid />
      </div>
    </div>
  )
}