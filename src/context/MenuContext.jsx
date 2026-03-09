import { createContext, useContext, useState } from 'react'
import { menuData as staticMenuData } from '../data/menuData'

const MenuContext = createContext(null)

export function MenuProvider({ children }) {
  const [menuItems] = useState(staticMenuData)
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredItems =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

  return (
    <MenuContext.Provider
      value={{ menuItems, filteredItems, activeCategory, setActiveCategory }}
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