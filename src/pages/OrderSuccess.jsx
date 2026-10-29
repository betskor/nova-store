
import { Link, Navigate } from 'react-router-dom'
import { Check, ArrowRight, Package } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'

const money = (value) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

function readLastOrder() {
  try {
    const saved = sessionStorage.getItem('nova-last-order')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export default function OrderSuccess() {
  const order = readLastOrder()
  const { getOrder } = useOrders()
  const savedOrder = order ? getOrder(order.orderNumber) : null
  const displayOrder = savedOrder || order

  if (!displayOrder) {
    return <Navigate to="/products" replace />
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d8d2c8] bg-[#f8f6f1]">
        <Check size={28} strokeWidth={1.4} />
      </div>

      <p className="editorial-label mt-7 text-[#89857d]">NOVA ORDER RECEIVED</p>
      <h1 className="font-editorial mt-3 text-4xl sm:text-5xl">
        Thank you for your order.
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-[#77746d]">
        Your demo order has been recorded in this browser. No payment has been
        processed and no real shipment has been booked.
      </p>

      <section className="mt-8 w-full border border-[#e8e4dc] bg-[#f8f6f1] p-6 text-left sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-[#e0dbd2] pb-5">
          <div>
            <p className="text-xs text-[#77746d]">ORDER REFERENCE</p>
            <p className="mt-2 break-all text-sm font-semibold">
              {displayOrder.orderNumber}
            </p>
          </div>
          <Package size={22} strokeWidth={1.3} />
        </div>

        <div className="mt-5 space-y-3 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-[#77746d]">Customer</span>
            <span className="text-right">
              {displayOrder.customer?.fullName || 'Guest'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#77746d]">Items</span>
            <span>
              {displayOrder.items?.reduce(
                (sum, item) => sum + (Number(item.quantity) || 0),
                0,
              ) || 0}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#77746d]">Status</span>
            <span>{displayOrder.status || 'Pending'}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-[#e0dbd2] pt-4 text-sm font-semibold">
            <span>Total</span>
            <span>{money(displayOrder.total)}</span>
          </div>
        </div>
      </section>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/products" className="editorial-button">
          CONTINUE SHOPPING <ArrowRight size={15} />
        </Link>
        <Link to="/profile" className="editorial-outline-button">
          MY ACCOUNT
        </Link>
      </div>
    </main>
  )
}
