import { MENU_CATEGORIES } from '../../utils/constants'
import { useMenuContext } from '../../context/MenuContext'

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useMenuContext()

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {MENU_CATEGORIES.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveCategory(id)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === id
              ? 'bg-[#c97830] text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-[#c97830] hover:text-[#c97830]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}