
import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  UserRound,
  Mail,
  ShoppingBag,
  Heart,
  MapPin,
  ArrowRight,
  LogOut,
  Save,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const navigate = useNavigate()

  const { user, logout, updateProfile } = useAuth()
  const { cartCount } = useCart()
  const { wishlistItems = [] } = useWishlist()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    city: '',
  })

  useEffect(() => {
    if (!user) return

    setProfile({
      fullName: user.fullName || '',
      email: user.email || '',
      city: user.city || '',
    })
  }, [user])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSave = (event) => {
    event.preventDefault()

    if (saving) return

    if (!profile.fullName.trim()) {
      toast.error('Please enter your full name.')
      return
    }

    try {
      setSaving(true)

      updateProfile({
        fullName: profile.fullName,
        city: profile.city,
      })

      setEditing(false)
      toast.success('Profile updated successfully.')
    } catch {
      toast.error('Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setProfile({
      fullName: user.fullName || '',
      email: user.email || '',
      city: user.city || '',
    })

    setEditing(false)
  }

  const handleLogout = () => {
    logout()
    toast.success('You have signed out.')
    navigate('/login', { replace: true })
  }

  const initials = (user.fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <main className="mx-auto min-h-[70vh] max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="border-b border-[#e8e4dc] pb-8">
        <p className="editorial-label text-[#89857d]">
          YOUR PERSONAL SPACE
        </p>

        <h1 className="font-editorial mt-3 text-4xl sm:text-6xl">
          My Profile
        </h1>

        <p className="mt-3 text-sm text-[#77746d]">
          Manage your details and explore your NOVA account.
        </p>
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="border border-[#e8e4dc] bg-[#f8f6f1] p-6 sm:p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#d8d2c8] bg-white">
            <span className="font-editorial text-3xl">
              {initials || 'N'}
            </span>
          </div>

          <h2 className="font-editorial mt-5 text-2xl">
            {user.fullName}
          </h2>

          <p className="mt-2 break-all text-xs text-[#77746d]">
            {user.email}
          </p>

          <div className="mt-7 space-y-3 border-t border-[#e0dbd2] pt-6">
            <Link
              to="/wishlist"
              className="flex items-center justify-between py-2 text-sm hover:opacity-60"
            >
              <span className="flex items-center gap-3">
                <Heart size={17} strokeWidth={1.4} />
                My Wishlist
              </span>

              <span className="text-xs text-[#77746d]">
                {wishlistItems.length}
              </span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center justify-between py-2 text-sm hover:opacity-60"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag size={17} strokeWidth={1.4} />
                Shopping Bag
              </span>

              <span className="text-xs text-[#77746d]">
                {cartCount}
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 py-2 text-sm text-[#77746d] hover:text-[#24231f]"
            >
              <LogOut size={17} strokeWidth={1.4} />
              Sign Out
            </button>
          </div>
        </aside>

        <section className="border border-[#e8e4dc] p-6 sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e4dc] pb-6">
            <div>
              <p className="editorial-label">
                ACCOUNT DETAILS
              </p>

              <h2 className="font-editorial mt-2 text-2xl sm:text-3xl">
                Personal information
              </h2>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="editorial-outline-button"
              >
                EDIT DETAILS
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="mt-7 space-y-6">
            <label className="block text-xs">
              <span className="flex items-center gap-2">
                <UserRound size={15} />
                Full name
              </span>

              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                disabled={!editing}
                required
                maxLength={100}
                className="mt-3 w-full border border-[#e8e4dc] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#24231f] disabled:opacity-70"
                placeholder="Enter your full name"
              />
            </label>

            <label className="block text-xs">
              <span className="flex items-center gap-2">
                <Mail size={15} />
                Email address
              </span>

              <input
                type="email"
                name="email"
                value={user.email}
                disabled
                className="mt-3 w-full border border-[#e8e4dc] bg-transparent px-4 py-3 text-sm opacity-70"
              />
            </label>

            <label className="block text-xs">
              <span className="flex items-center gap-2">
                <MapPin size={15} />
                City
              </span>

              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                disabled={!editing}
                maxLength={100}
                className="mt-3 w-full border border-[#e8e4dc] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#24231f] disabled:opacity-70"
                placeholder="Enter your city"
              />
            </label>

            {editing && (
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="editorial-button disabled:opacity-60"
                >
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                  {!saving && <Save size={15} />}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="editorial-outline-button disabled:opacity-60"
                >
                  CANCEL
                </button>
              </div>
            )}
          </form>

          <div className="mt-9 border-t border-[#e8e4dc] pt-6">
            <p className="text-xs leading-6 text-[#89857d]">
              This is a frontend-only demo account. Account data is stored
              in this browser and is not protected by a real authentication
              server. Do not use real or sensitive passwords.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-flex items-center gap-2 text-xs hover:opacity-60"
            >
              EXPLORE THE COLLECTION
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
