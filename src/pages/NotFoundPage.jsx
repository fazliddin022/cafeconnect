import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl mb-6">☕</p>
      <h1
        className="text-4xl font-bold text-gray-900 mb-3"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        404 – Page Not Found
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        Looks like this page wandered off. Let's get you back on track.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  )
}