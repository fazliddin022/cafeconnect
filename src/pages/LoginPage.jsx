import { useNavigate, useLocation, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebase'
import { getUserRole } from '../services/authService'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../utils/validators'

const inputClass = (error, value) => {
  if (error) return 'input-field border-red-400 focus:ring-red-400'
  if (value) return 'input-field border-green-400 focus:ring-green-400'
  return 'input-field'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const watchedEmail = watch('email')
  const watchedPassword = watch('password')

  const onSubmit = async (data) => {
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password)
      const role = await getUserRole(result.user.uid)

      if (role === 'admin') {
        navigate('/admin', { replace: true })
      } else if (role === 'staff') {
        navigate('/staff', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError('root', { message: 'Invalid email or password.' })
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
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
              placeholder="••••••••"
            />
            {errors.password ? (
              <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.password.message}</p>
            ) : watchedPassword && !errors.password ? (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><span>✓</span> Looks good!</p>
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
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#c97830] font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}