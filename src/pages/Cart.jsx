
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(price)

export default function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const shipping = subtotal === 0 || subtotal >= 3000 ? 0 : 100
  const total = subtotal + shipping

  const handleRemove = (productId) => {
    removeFromCart(productId)
    toast.success('Item removed from bag')
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Your bag has been cleared')
  }

  return (
    <main className="mx-auto min-h-[65vh] max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="border-b border-[#e8e4dc] pb-8">
        <p className="editorial-label text-[#89857d]">
          YOUR NOVA EXPERIENCE
        </p>

        <h1 className="font-editorial mt-3 text-4xl sm:text-6xl">
          Shopping Bag
        </h1>

        <p className="mt-3 text-sm text-[#77746d]">
          Review your selection before checking out.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <section className="py-24 text-center">
          <ShoppingBag
            size={38}
            strokeWidth={1.2}
            className="mx-auto text-[#77746d]"
          />

          <h2 className="font-editorial mt-6 text-3xl sm:text-4xl">
            Your bag is waiting
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#77746d]">
            Discover pieces you'll love and add your favorites to your bag.
          </p>

          <Link to="/products" className="editorial-button mt-7">
            DISCOVER THE COLLECTION
            <ArrowRight size={15} />
          </Link>
        </section>
      ) : (
        <div className="mt-9 grid items-start gap-10 lg:grid-cols-[1fr_370px] xl:gap-16">
          {/* Cart items */}
          <section>
            <div className="mb-5 flex items-center justify-between border-b border-[#e8e4dc] pb-4">
              <p className="editorial-label">
                YOUR ITEMS ({cartItems.length})
              </p>

              <button
                type="button"
                onClick={handleClearCart}
                className="text-[10px] tracking-wider text-[#77746d] underline underline-offset-4 hover:text-[#24231f]"
              >
                CLEAR BAG
              </button>
            </div>

            <div className="divide-y divide-[#e8e4dc]">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 py-6 sm:gap-6"
                >
                  <Link
                    to={`/products/${item.id}`}
                    className="h-36 w-28 shrink-0 overflow-hidden bg-[#f0ede7] sm:h-48 sm:w-36"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-[.14em] text-[#89857d]">
                          {item.category}
                        </p>

                        <Link
                          to={`/products/${item.id}`}
                          className="font-editorial mt-2 block text-base leading-6 sm:text-xl"
                        >
                          {item.name}
                        </Link>

                        <p className="mt-2 text-xs">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="p-1 text-[#89857d] transition hover:text-[#24231f]"
                      >
                        <Trash2 size={17} strokeWidth={1.4} />
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                      <div className="inline-flex h-9 items-center border border-[#e8e4dc]">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-full w-9 items-center justify-center disabled:opacity-30"
                        >
                          <Minus size={13} />
                        </button>

                        <span className="min-w-8 text-center text-xs">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          disabled={item.quantity >= item.stock}
                          onClick={() => {
                            if (item.quantity >= item.stock) {
                              toast.error('Maximum available quantity reached')
                              return
                            }

                            updateQuantity(item.id, item.quantity + 1)
                          }}
                          className="flex h-full w-9 items-center justify-center disabled:opacity-30"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <p className="text-sm font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 text-xs text-[#77746d] transition hover:text-[#24231f]"
            >
              <ArrowLeft size={15} />
              CONTINUE SHOPPING
            </Link>
          </section>

          {/* Order summary */}
          <aside className="border border-[#e8e4dc] bg-[#f8f6f1] p-5 sm:p-7 lg:sticky lg:top-8">
            <p className="editorial-label">ORDER SUMMARY</p>

            <div className="mt-6 space-y-5 border-b border-[#e0dbd2] pb-6">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[#77746d]">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[#77746d]">Shipping</span>
                <span>
                  {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                </span>
              </div>

              {subtotal > 0 && subtotal < 3000 && (
                <p className="text-xs leading-6 text-[#77746d]">
                  Add {formatPrice(3000 - subtotal)} more to qualify for free shipping.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 py-6">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-editorial text-2xl">
                {formatPrice(total)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="editorial-button flex w-full"
            >
              PROCEED TO CHECKOUT
              <ArrowRight size={15} />
            </Link>

            <div className="mt-6 space-y-4 border-t border-[#e0dbd2] pt-5">
              <div className="flex items-center gap-3 text-xs text-[#77746d]">
                <Truck size={17} strokeWidth={1.4} />
                Shipping calculated at checkout
              </div>

              <div className="flex items-center gap-3 text-xs text-[#77746d]">
                <ShieldCheck size={17} strokeWidth={1.4} />
                Secure shopping experience
              </div>
            </div>

            <p className="mt-5 text-[10px] leading-5 text-[#89857d]">
              Prices and shipping are demonstration values for this frontend project.
            </p>
          </aside>
        </div>
      )}
    </main>
  )
}
