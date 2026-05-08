import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, get, set } from 'firebase/database'
import { auth, db } from '../services/firebase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../utils/validators'

const inputClass = (error, value) => {
  if (error) return 'input-field border-red-400 focus:ring-red-400'
  if (value) return 'input-field border-green-400 focus:ring-green-400'
  return 'input-field'
}

export default function RegisterPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const watchedName = watch('name')
  const watchedEmail = watch('email')
  const watchedPassword = watch('password')

  const onSubmit = async (data) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password)
      await updateProfile(result.user, { displayName: data.name })

      const snapshot = await get(ref(db, `users/${result.user.uid}`))
      if (!snapshot.exists()) {
        await set(ref(db, `users/${result.user.uid}`), {
          email: data.email,
          name: data.name,
          role: 'customer',
        })
      }

      navigate('/', { replace: true })
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('root', { message: 'This email is already registered.' })
      } else if (err.code === 'auth/weak-password') {
        setError('root', { message: 'Password must be at least 6 characters.' })
      } else {
        setError('root', { message: 'Something went wrong. Please try again.' })
      }
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register('name')}
              type="text"
              className={inputClass(errors.name, watchedName && !errors.name)}
              placeholder="John Doe"
            />
            {errors.name ? (
              <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.name.message}</p>
            ) : watchedName?.length >= 2 ? (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><span>✓</span> Looks good!</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className={inputClass(errors.email, watchedEmail && !errors.email)}
              placeholder="you@example.com"
            />
            {errors.email ? (
              <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.email.message}</p>
            ) : watchedEmail && !errors.email ? (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><span>✓</span> Valid email</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className={inputClass(errors.password, watchedPassword && !errors.password)}
              placeholder="Min. 6 characters"
            />
            {errors.password ? (
              <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.password.message}</p>
            ) : watchedPassword && !errors.password ? (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><span>✓</span> Strong password!</p>
            ) : null}
          </div>

          {errors.root && (
            <p className="error-msg text-center">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
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