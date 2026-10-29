
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      })

      toast.success('Your NOVA account has been created!')
      navigate('/profile', { replace: true })
    } catch (error) {
      if (error.message === 'EMAIL_EXISTS') {
        toast.error('An account with this email already exists. Sign in instead.')
      } else if (error.message === 'SECURE_CRYPTO_UNAVAILABLE') {
        toast.error('Secure browser support is unavailable. Open the site through localhost.')
      } else {
        toast.error('Could not create the account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[75vh] bg-[#f8f6f1] px-5 py-14 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden border border-[#e8e4dc] bg-white md:grid-cols-2">
        <div className="relative hidden min-h-[620px] bg-[#eae6df] md:block">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85"
            alt="Fashion collection"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute bottom-10 left-8 right-8 text-white lg:left-10">
            <p className="text-[10px] tracking-[.25em]">THE NOVA EDIT</p>
            <h2 className="font-editorial mt-3 text-4xl leading-tight">
              A new chapter
              <br />
              in personal style.
            </h2>
          </div>
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
          <p className="editorial-label text-[#89857d]">JOIN THE NOVA WORLD</p>

          <h1 className="font-editorial mt-4 text-4xl sm:text-5xl">
            Create account.
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#77746d]">
            Create your profile and make the experience yours.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block text-xs">
              Full name
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
                maxLength={100}
                className="mt-2 w-full border border-[#dedad2] bg-white px-4 py-3 text-sm outline-none focus:border-[#24231f]"
                placeholder="Your full name"
              />
            </label>

            <label className="block text-xs">
              Email address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="mt-2 w-full border border-[#dedad2] bg-white px-4 py-3 text-sm outline-none focus:border-[#24231f]"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-xs">
              Password
              <span className="mt-2 flex border border-[#dedad2] focus-within:border-[#24231f]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                  placeholder="At least 8 characters"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="px-3 text-[#77746d]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            <label className="block text-xs">
              Confirm password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
                className="mt-2 w-full border border-[#dedad2] bg-white px-4 py-3 text-sm outline-none focus:border-[#24231f]"
                placeholder="Repeat your password"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="editorial-button w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-[#77746d]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-[#24231f] underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-5 text-center text-[10px] leading-5 text-[#89857d]">
            Demo account stored in this browser only.
          </p>
        </div>
      </div>
    </main>
  )
}
