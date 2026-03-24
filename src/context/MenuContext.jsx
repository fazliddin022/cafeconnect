import { createContext, useContext, useState } from 'react'
import { menuData as staticMenuData } from '../data/menuData'

const MenuContext = createContext(null)

export function MenuProvider({ children }) {
  const [menuItems] = useState(staticMenuData)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = menuItems.filter((item) => {
    // Category filter
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    // Search filter — name yoki description bo'yicha
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