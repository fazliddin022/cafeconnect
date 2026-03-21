import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutAdmin } from '../../services/authService'
import AuthModal from './AuthModal'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, authModal, openAuthModal, closeAuthModal } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/')
    setDropdownOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
              <Link to="/reservation" className="btn-primary text-sm px-4 py-2">
                Reserve a Table
              </Link>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-[#c97830] text-white flex items-center justify-center text-sm font-bold hover:bg-[#a85f24] transition-colors"
                >
                  {(user.displayName || user.email)[0].toUpperCase()}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900 text-sm">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/my-reservations"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>📅</span> My Reservations
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm px-4 py-2">
                Sign In
              </Link>
              <button
                onClick={openAuthModal}
                className="btn-primary text-sm px-4 py-2"
              >
                Reserve a Table
              </button>
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
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-gray-900">
                  {user.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-400 mb-3">{user.email}</p>
              </div>
              <Link
                to="/my-reservations"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-[#c97830] text-sm"
              >
                📅 My Reservations
              </Link>
              <Link
                to="/reservation"
                onClick={() => setIsOpen(false)}
                className="block btn-primary text-center"
              >
                Reserve a Table
              </Link>
              <button
                onClick={() => { handleLogout(); setIsOpen(false) }}
                className="block w-full text-left text-red-500 text-sm py-1"
              >
                🚪 Sign Out
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
              <button
                onClick={() => { openAuthModal(); setIsOpen(false) }}
                className="block w-full btn-primary text-center"
              >
                Reserve a Table
              </button>
            </>
          )}
        </div>
      )}

      {/* Auth Modal */}
      {authModal && <AuthModal onClose={closeAuthModal} />}
    </nav>
  )
}