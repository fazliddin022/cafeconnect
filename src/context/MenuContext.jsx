import { createContext, useContext, useState, useEffect } from 'react'
import { fetchMenuItems } from '../services/menuService'

const MenuContext = createContext(null)

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    try {
      const items = await fetchMenuItems()
      setMenuItems(items)
    } catch (err) {
      console.error('Failed to load menu:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        filteredItems,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        loading,
        reloadMenu: loadMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export const useMenuContext = () => {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenuContext must be used within <MenuProvider>')
  return ctx
}