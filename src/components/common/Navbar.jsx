import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAV_LINKS } from '../../utils/constants'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <span className="text-xl font-bold text-[#c97830]" style={{ fontFamily: 'Playfair Display, serif' }}>
              CaféConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#fdf6ee] text-[#c97830]'
                      : 'text-gray-600 hover:text-[#c97830] hover:bg-[#fdf6ee]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to="/reservation" className="ml-3 btn-primary text-sm">
              Reserve a Table
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-[#fdf6ee] text-[#c97830]' : 'text-gray-600'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/reservation"
            onClick={() => setIsOpen(false)}
            className="block btn-primary text-sm text-center mt-3"
          >
            Reserve a Table
          </Link>
        </div>
      )}
    </header>
  )
}