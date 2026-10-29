
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, LockKeyhole, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'

const money = (value) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  notes: '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const { addOrder } = useOrders()

  const [form, setForm] = useState(() => ({
    ...initialForm,
    fullName: user?.fullName || '',
    email: user?.email || '',
    city: user?.city || '',
  }))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = cartTotal
  const shipping = subtotal === 0 || subtotal >= 3000 ? 0 : 100
  const total = subtotal + shipping

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (isSubmitting) return

    if (cartItems.length === 0) {
      toast.error('Your bag is empty.')
      return
    }

    const invalidItem = cartItems.find(
      (item) =>
        !Number.isFinite(Number(item.price)) ||
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) < 1 ||
        Number(item.quantity) > Number(item.stock),
    )

    if (invalidItem) {
      toast.error(`Please review the stock for ${invalidItem.name}.`)
      return
    }

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim()
    ) {
      toast.error('Please complete all required fields.')
      return
    }

    setIsSubmitting(true)

    try {
      const order = {
        orderNumber: `NOVA-${Date.now().toString().slice(-8)}`,
        customer: {
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          notes: form.notes.trim(),
        },
        userId: user?.id || null,
        userEmail: user?.email || null,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: Number(item.price),
          quantity: Number(item.quantity),
          stock: Number(item.stock),
        })),
        subtotal,
        shipping,
        total,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }

      // Keep the confirmation page compatible with the existing flow.
      sessionStorage.setItem('nova-last-order', JSON.stringify(order))

      // Save to the persistent order list before clearing the cart.
      addOrder(order)
      clearCart()

      toast.success('Your demo order has been recorded.')
      navigate('/order-success', { replace: true })
    } catch (error) {
      console.error('Could not create NOVA order:', error)
      toast.error('Could not save your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
        <ShoppingBag size={32} strokeWidth={1.2} />
        <h1 className="font-editorial mt-5 text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-sm text-[#77746d]">
          Add something from the NOVA collection before checkout.
        </p>
        <Link to="/products" className="editorial-button mt-7">
          EXPLORE THE COLLECTION
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-xs text-[#77746d]"
      >
        <ArrowLeft size={15} />
        BACK TO BAG
      </Link>

      <div className="mt-5 border-b border-[#e8e4dc] pb-7">
        <p className="editorial-label text-[#89857d]">ALMOST YOURS</p>
        <h1 className="font-editorial mt-3 text-4xl sm:text-6xl">
          Checkout
        </h1>
        <p className="mt-3 text-sm text-[#77746d]">
          Enter your delivery details to record a demo order.
        </p>
      </div>

      <div className="mt-9 grid items-start gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-7">
          <section className="border border-[#e8e4dc] p-5 sm:p-7">
            <h2 className="font-editorial text-2xl">Delivery information</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block text-xs">
                Full name *
                <input
                  name="fullName"
                  required
                  maxLength={100}
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-2 w-full border border-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#24231f]"
                />
              </label>

              <label className="block text-xs">
                Email address *
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={160}
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 w-full border border-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#24231f]"
                />
              </label>

              <label className="block text-xs">
                Phone number *
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={30}
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full border border-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#24231f]"
                />
              </label>

              <label className="block text-xs">
                City *
                <input
                  name="city"
                  required
                  maxLength={100}
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2 w-full border border-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#24231f]"
                />
              </label>

              <label className="block text-xs sm:col-span-2">
                Full address *
                <input
                  name="address"
                  required
                  maxLength={250}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={handleChange}
                  className="mt-2 w-full border border-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#24231f]"
                />
              </label>

              <label className="block text-xs sm:col-span-2">
                Notes (optional)
                <textarea
                  name="notes"
                  rows={3}
                  maxLength={500}
                  value={form.notes}
                  onChange={handleChange}
                  className="mt-2 w-full border border-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#24231f]"
                />
              </label>
            </div>
          </section>

          <p className="flex items-start gap-2 text-xs leading-6 text-[#77746d]">
            <LockKeyhole size={15} className="mt-1 shrink-0" />
            This is a frontend-only demo checkout. It does not process a real
            payment or create a real delivery booking.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="editorial-button min-h-14 w-full disabled:opacity-60"
          >
            {isSubmitting ? 'RECORDING ORDER...' : 'PLACE DEMO ORDER'}
          </button>
        </form>

        <aside className="border border-[#e8e4dc] bg-[#f8f6f1] p-5 sm:p-7">
          <h2 className="font-editorial text-2xl">Order summary</h2>

          <div className="mt-5 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 border-b border-[#e0dbd2] pb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-16 shrink-0 bg-[#eae6de] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.name}</p>
                  <p className="mt-1 text-xs text-[#77746d]">
                    Qty: {item.quantity}
                  </p>
                  <p className="mt-2 text-xs">
                    {money(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-[#77746d]">Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[#77746d]">Shipping</span>
              <span>{shipping === 0 ? 'FREE' : money(shipping)}</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-[#d8d2c8] pt-4 text-sm font-semibold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
