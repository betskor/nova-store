
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  LogOut,
  Package,
  Plus,
  Pencil,
  Trash2,
  ShoppingBag,
  Banknote,
  Clock3,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useProducts } from '../context/ProductsContext'
import { useOrders } from '../context/OrdersContext'

const ADMIN_KEY = 'nova-admin-session'

const money = (value) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const emptyProduct = {
  name: '',
  category: 'Clothing',
  price: '',
  oldPrice: '',
  rating: '0',
  reviews: '0',
  stock: '0',
  badge: '',
  image: '',
  description: '',
}

const statuses = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="border border-[#e8e4dc] bg-white p-5">
      <Icon size={19} className="text-[#89857d]" />
      <p className="mt-4 text-xs text-[#77746d]">{label}</p>
      <p className="font-editorial mt-1 break-words text-2xl">{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const { orders, updateOrderStatus } = useOrders()

  const [section, setSection] = useState('products')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [formOpen, setFormOpen] = useState(false)
  const [search, setSearch] = useState('')

  if (sessionStorage.getItem(ADMIN_KEY) !== 'true') {
    return <Navigate to="/admin" replace />
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyProduct)
  }

  const startAdd = () => {
    setEditingId(null)
    setForm(emptyProduct)
    setFormOpen(true)
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      category: product.category || 'Clothing',
      price: String(product.price ?? ''),
      oldPrice: product.oldPrice == null ? '' : String(product.oldPrice),
      rating: String(product.rating ?? 0),
      reviews: String(product.reviews ?? 0),
      stock: String(product.stock ?? 0),
      badge: product.badge || '',
      image: product.image || '',
      description: product.description || '',
    })
    setFormOpen(true)
  }

  const handleProductSubmit = (event) => {
    event.preventDefault()

    const price = Number(form.price)
    const stock = Number(form.stock)
    const oldPrice = form.oldPrice === '' ? null : Number(form.oldPrice)
    const rating = Number(form.rating)
    const reviews = Number(form.reviews)

    if (!form.name.trim() || !form.category.trim() || !form.image.trim()) {
      toast.error('Enter the product name, category and image URL.')
      return
    }

    if (!Number.isFinite(price) || price < 0) {
      toast.error('Enter a valid price.')
      return
    }

    if (!Number.isInteger(stock) || stock < 0) {
      toast.error('Stock must be a whole number of zero or more.')
      return
    }

    if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < 0)) {
      toast.error('Enter a valid old price.')
      return
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      toast.error('Rating must be between 0 and 5.')
      return
    }

    if (!Number.isInteger(reviews) || reviews < 0) {
      toast.error('Review count must be zero or more.')
      return
    }

    const values = {
      ...form,
      name: form.name.trim(),
      category: form.category.trim(),
      price,
      oldPrice,
      stock,
      rating,
      reviews,
    }

    try {
      if (editingId !== null) {
        updateProduct(editingId, values)
        toast.success('Product updated.')
      } else {
        addProduct(values)
        toast.success('Product added.')
      }

      closeForm()
    } catch {
      toast.error('Could not save the product.')
    }
  }

  const handleDelete = (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return

    deleteProduct(product.id)
    toast.success('Product deleted.')
  }

  const handleStatusChange = (orderNumber, status) => {
    try {
      updateOrderStatus(orderNumber, status)
      toast.success('Order status updated.')
    } catch {
      toast.error('Could not update order status.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_KEY)
    toast.success('Admin session ended.')
    navigate('/admin', { replace: true })
  }

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  const totalOrderValue = orders.reduce(
    (total, order) => total + (Number(order.total) || 0),
    0,
  )

  const pendingOrders = orders.filter(
    (order) => (order.status || 'Pending') === 'Pending',
  ).length

  return (
    <main className="min-h-screen bg-[#f8f6f1] text-[#24231f]">
      <header className="border-b border-[#e8e4dc] bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <div>
            <p className="editorial-label text-[#89857d]">NOVA MANAGEMENT</p>
            <h1 className="font-editorial mt-1 text-3xl sm:text-4xl">
              Admin dashboard
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="editorial-outline-button"
            >
              <ArrowLeft size={15} /> VIEW STORE
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="editorial-outline-button"
            >
              <LogOut size={15} /> SIGN OUT
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          <Stat icon={Package} label="PRODUCTS" value={products.length} />
          <Stat icon={ShoppingBag} label="ORDERS" value={orders.length} />
          <Stat
            icon={Banknote}
            label="TOTAL ORDER VALUE"
            value={money(totalOrderValue)}
          />
          <Stat icon={Clock3} label="PENDING ORDERS" value={pendingOrders} />
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#e8e4dc]">
          <button
            type="button"
            onClick={() => setSection('products')}
            className={`px-4 py-3 text-xs tracking-wider ${
              section === 'products'
                ? 'border-b-2 border-[#24231f] font-semibold'
                : 'text-[#77746d]'
            }`}
          >
            PRODUCTS ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setSection('orders')}
            className={`px-4 py-3 text-xs tracking-wider ${
              section === 'orders'
                ? 'border-b-2 border-[#24231f] font-semibold'
                : 'text-[#77746d]'
            }`}
          >
            ORDERS ({orders.length})
          </button>
        </div>

        {section === 'products' ? (
          <section className="mt-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl">
                  Product collection
                </h2>
                <p className="mt-2 text-xs text-[#77746d]">
                  Changes are saved in this browser.
                </p>
              </div>
              <button
                type="button"
                onClick={startAdd}
                className="editorial-button"
              >
                <Plus size={16} /> ADD PRODUCT
              </button>
            </div>

            {formOpen && (
              <form
                onSubmit={handleProductSubmit}
                className="mt-6 border border-[#e8e4dc] bg-white p-5 sm:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-editorial text-2xl">
                    {editingId !== null ? 'Edit product' : 'Add product'}
                  </h3>
                  <button
                    type="button"
                    onClick={closeForm}
                    aria-label="Close product form"
                    className="p-2"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ['name', 'Product name', 'text', true],
                    ['price', 'Price (EGP)', 'number', true],
                    ['oldPrice', 'Old price (optional)', 'number', false],
                    ['stock', 'Stock quantity', 'number', true],
                    ['rating', 'Rating (0–5)', 'number', true],
                    ['reviews', 'Review count', 'number', true],
                    ['badge', 'Badge (optional)', 'text', false],
                    ['image', 'Image URL', 'url', true],
                  ].map(([key, label, type, required]) => (
                    <label key={key} className="block text-xs">
                      {label}
                      <input
                        type={type}
                        required={required}
                        min={type === 'number' ? '0' : undefined}
                        max={key === 'rating' ? '5' : undefined}
                        step={key === 'rating' ? '0.1' : '1'}
                        value={form[key]}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            [key]: event.target.value,
                          }))
                        }
                        className="mt-2 w-full border border-[#e8e4dc] px-3 py-3 text-sm outline-none focus:border-[#24231f]"
                      />
                    </label>
                  ))}

                  <label className="block text-xs">
                    Category
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      className="mt-2 w-full border border-[#e8e4dc] bg-white px-3 py-3 text-sm"
                    >
                      <option>Clothing</option>
                      <option>Outerwear</option>
                      <option>Bags</option>
                      <option>Shoes</option>
                      <option>Accessories</option>
                    </select>
                  </label>

                  <label className="block text-xs sm:col-span-2 lg:col-span-3">
                    Description
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      className="mt-2 w-full border border-[#e8e4dc] px-3 py-3 text-sm outline-none focus:border-[#24231f]"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="submit" className="editorial-button">
                    {editingId !== null ? 'SAVE CHANGES' : 'CREATE PRODUCT'}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="editorial-outline-button"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            )}

            <label className="mt-6 block max-w-md text-xs">
              Search products
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or category..."
                className="mt-2 w-full border border-[#e8e4dc] bg-white px-4 py-3 text-sm outline-none focus:border-[#24231f]"
              />
            </label>

            <div className="mt-5 overflow-x-auto border border-[#e8e4dc] bg-white">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="bg-[#f0ede7]">
                  <tr>
                    <th className="p-4">PRODUCT</th>
                    <th className="p-4">CATEGORY</th>
                    <th className="p-4">PRICE</th>
                    <th className="p-4">STOCK</th>
                    <th className="p-4">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-[#e8e4dc]"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt=""
                            className="h-14 w-11 bg-[#f0ede7] object-cover"
                          />
                          <div>
                            <p className="max-w-[240px] font-medium">
                              {product.name}
                            </p>
                            <p className="mt-1 text-[#89857d]">
                              {String(product.id)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{money(product.price)}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className="border border-[#e8e4dc] p-2"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="border border-[#e8e4dc] p-2 text-red-700"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[#77746d]">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="mt-6">
            <h2 className="font-editorial text-2xl sm:text-3xl">
              Customer orders
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#77746d]">
              Order totals are demo records, not verified payments.
            </p>

            <div className="mt-5 overflow-x-auto border border-[#e8e4dc] bg-white">
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead className="bg-[#f0ede7]">
                  <tr>
                    <th className="p-4">ORDER</th>
                    <th className="p-4">CUSTOMER</th>
                    <th className="p-4">DATE</th>
                    <th className="p-4">TOTAL</th>
                    <th className="p-4">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.orderNumber}
                      className="border-t border-[#e8e4dc] align-top"
                    >
                      <td className="p-4">
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="mt-1 text-[#77746d]">
                          {order.items?.length || 0} line items
                        </p>
                      </td>
                      <td className="p-4">
                        <p>{order.customer?.fullName || 'Guest'}</p>
                        <p className="mt-1 text-[#77746d]">
                          {order.customer?.email || '—'}
                        </p>
                      </td>
                      <td className="p-4">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : '—'}
                      </td>
                      <td className="p-4">{money(order.total)}</td>
                      <td className="p-4">
                        <select
                          value={order.status || 'Pending'}
                          onChange={(event) =>
                            handleStatusChange(
                              order.orderNumber,
                              event.target.value,
                            )
                          }
                          className="border border-[#e8e4dc] bg-white px-2 py-2"
                          aria-label={`Status for ${order.orderNumber}`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[#77746d]">
                        No saved orders yet. Orders will appear after checkout
                        is connected to OrdersContext.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <p className="mt-8 text-[11px] leading-5 text-[#89857d]">
          Frontend-only demo: data is stored in this browser. Admin access is
          not secure against someone who can inspect or modify browser storage.
        </p>
      </div>
    </main>
  )
}
