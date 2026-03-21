import { Link } from 'react-router-dom'

export default function AuthModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
        {/* Logo */}
        <p className="text-4xl mb-2">☕</p>
        <h2
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          CaféConnect
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          To reserve a table please sign in or create an account.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            to="/login"
            onClick={onClose}
            className="block w-full btn-primary text-center"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            onClick={onClose}
            className="block w-full btn-outline text-center"
          >
            Create Account
          </Link>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}