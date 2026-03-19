import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutAdmin } from '../../services/authService'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <span
            className="text-xl font-bold text-[#c97830]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            CaféConnect
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'text-[#c97830] font-medium'
                  : 'text-gray-600 hover:text-[#c97830] transition-colors'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500">
                Hi, {user.displayName || user.email.split('@')[0]}
              </span>
              <Link to="/reservation" className="btn-primary text-sm px-4 py-2">
                Reserve a Table
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline text-sm px-4 py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm px-4 py-2">
                Sign In
              </Link>
              <Link to="/reservation" className="btn-primary text-sm px-4 py-2">
                Reserve a Table
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block ${isActive ? 'text-[#c97830] font-medium' : 'text-gray-600'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <Link
                to="/reservation"
                onClick={() => setIsOpen(false)}
                className="block btn-primary text-center"
              >
                Reserve a Table
              </Link>
              <button
                onClick={() => { handleLogout(); setIsOpen(false) }}
                className="block w-full btn-outline text-center"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block btn-outline text-center"
              >
                Sign In
              </Link>
              <Link
                to="/reservation"
                onClick={() => setIsOpen(false)}
                className="block btn-primary text-center"
              >
                Reserve a Table
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}