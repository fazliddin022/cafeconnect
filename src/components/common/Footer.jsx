import { Link } from 'react-router-dom'
import { NAV_LINKS, OPENING_HOURS } from '../../utils/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">☕</span>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                CaféConnect
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A cozy corner for great coffee, delicious food, and unforgettable moments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="hover:text-[#e9ae6b] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/reservation"
                  className="hover:text-[#e9ae6b] transition-colors"
                >
                  Reserve a Table
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-sm">
              {OPENING_HOURS.map(({ day, hours }) => (
                <li key={day} className="flex justify-between gap-4">
                  <span>{day}</span>
                  <span className="text-[#e9ae6b]">{hours}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CaféConnect. Built by Fazliddin Khakimjonov as a Bachelor's Capstone Project.
        </div>
      </div>
    </footer>
  )
}