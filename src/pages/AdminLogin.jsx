
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LockKeyhole, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const ADMIN_KEY = 'nova-admin-session'
const ADMIN_EMAIL = 'admin@nova.demo'
const ADMIN_PASSWORD = 'NovaAdmin2026!'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (sessionStorage.getItem(ADMIN_KEY) === 'true') {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      sessionStorage.setItem(ADMIN_KEY, 'true')
      toast.success('Welcome to NOVA Admin')
      navigate('/admin/dashboard', { replace: true })
    } else {
      toast.error('Invalid demo admin credentials')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f1] px-4 py-10">
      <section className="w-full max-w-md border border-[#e8e4dc] bg-white p-7 sm:p-10">
        <p className="editorial-label text-[#89857d]">NOVA MANAGEMENT</p>
        <h1 className="font-editorial mt-3 text-4xl">Admin sign in</h1>
        <p className="mt-3 text-sm leading-7 text-[#77746d]">
          Sign in to manage the NOVA collection and demo orders.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-xs">
            Email address
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full border border-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#24231f]"
              placeholder="admin@nova.demo"
            />
          </label>

          <label className="block text-xs">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full border border-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#24231f]"
              placeholder="Enter demo password"
            />
          </label>

          <button type="submit" className="editorial-button min-h-12 w-full">
            <LockKeyhole size={16} />
            SIGN IN
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 border-t border-[#e8e4dc] pt-5 text-xs leading-6">
          <p className="text-[#77746d]">Demo credentials</p>
          <p>Email: {ADMIN_EMAIL}</p>
          <p>Password: {ADMIN_PASSWORD}</p>
          <p className="mt-3 text-[11px] text-[#89857d]">
            Demo access only. This frontend-only login is not secure
            authentication and must not be used to protect a real store.
          </p>
        </div>
      </section>
    </main>
  )
}
