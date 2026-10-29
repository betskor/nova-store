
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      await login(form)
      toast.success('Welcome back to NOVA!')
      navigate('/profile', { replace: true })
    } catch (error) {
      if (error.message === 'SECURE_CRYPTO_UNAVAILABLE') {
        toast.error('Secure browser support is unavailable. Open the site through localhost.')
      } else {
        toast.error('Incorrect email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[75vh] bg-[#f8f6f1] px-5 py-14 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden border border-[#e8e4dc] bg-white md:grid-cols-2">
        <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
          <p className="editorial-label text-[#89857d]">WELCOME BACK</p>

          <h1 className="font-editorial mt-4 text-4xl sm:text-5xl">
            Sign in.
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#77746d]">
            Sign in to enjoy a more personal NOVA experience.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
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
                  autoComplete="current-password"
                  required
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={loading}
              className="editorial-button w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-[#77746d]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-[#24231f] underline underline-offset-4"
            >
              Create one
            </Link>
          </p>

          <p className="mt-5 text-center text-[10px] leading-5 text-[#89857d]">
            NOVA demo account — available on this browser only.
          </p>
        </div>

        <div className="relative hidden min-h-[560px] bg-[#eae6df] md:block">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
            alt="Curated fashion collection"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute bottom-10 left-8 right-8 text-white lg:left-10">
            <p className="text-[10px] tracking-[.25em]">LESS, BUT BETTER.</p>
            <h2 className="font-editorial mt-3 text-4xl leading-tight">
              Style that speaks
              <br />
              without saying.
            </h2>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/products')}
        className="mx-auto mt-7 block text-xs text-[#77746d] underline underline-offset-4"
      >
        Continue browsing as a guest
      </button>
    </main>
  )
}
