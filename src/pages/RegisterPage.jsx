import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, get, set } from 'firebase/database'
import { auth, db } from '../services/firebase'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })

      // Faqat users/ da yo'q bo'lsa customer qilamiz
      const snapshot = await get(ref(db, `users/${result.user.uid}`))
      if (!snapshot.exists()) {
        await set(ref(db, `users/${result.user.uid}`), {
          email,
          name,
          role: 'customer',
        })
      }

      navigate('/', { replace: true })
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffdf7]">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">☕</p>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1">Join CaféConnect today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Min. 6 characters"
              required
            />
          </div>

          {error && <p className="error-msg text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#c97830] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}