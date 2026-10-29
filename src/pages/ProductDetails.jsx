
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useProducts } from '../context/ProductsContext'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(price)

export default function ProductDetails() {
  const { id } = useParams()
  const { products, getProduct } = useProducts()
  const product = getProduct(id)

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  if (!product) {
    return (
      <main className="flex min-h-[65vh] flex-col items-center justify-center px-5 text-center">
        <p className="editorial-label text-[#89857d]">NOVA COLLECTION</p>
        <h1 className="font-editorial mt-4 text-4xl">Product not found</h1>
        <p className="mt-3 text-sm text-[#77746d]">
          This product may no longer be available.
        </p>
        <Link to="/products" className="editorial-button mt-7">
          <ArrowLeft size={15} />
          BACK TO SHOP
        </Link>
      </main>
    )
  }

  const favorite = isInWishlist(product.id)

  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        String(item.id) !== String(product.id),
    )
    .slice(0, 4)

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error('Not enough items available')
      return
    }

    addToCart(product, quantity)
    toast.success('Added to your bag')
  }

  const handleWishlist = () => {
    toggleWishlist(product)
    toast.success(
      favorite ? 'Removed from wishlist' : 'Added to wishlist',
    )
  }

  return (
    <main>
      <div className="mx-auto max-w-[1600px] px-5 pt-6 sm:px-8 lg:px-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs text-[#77746d] hover:text-[#24231f]"
        >
          <ArrowLeft size={15} />
          BACK TO COLLECTION
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ede7]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />

              {product.badge && (
                <span className="absolute left-4 top-4 bg-[#fffefa] px-3 py-2 text-[9px] tracking-[.12em]">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              {[product.image].map((image, index) => (
                <button
                  key={`${product.id}-${image}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  className={`aspect-[4/5] overflow-hidden border ${
                    activeImage === index
                      ? 'border-[#24231f]'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start lg:py-5">
            <p className="editorial-label text-[#89857d]">
              {product.category}
            </p>

            <h1 className="font-editorial mt-4 text-4xl leading-tight sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-lg">{formatPrice(product.price)}</span>

              {product.oldPrice != null && (
                <span className="text-sm text-[#99948b] line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}

              {product.oldPrice != null && (
                <span className="bg-[#eae6de] px-2 py-1 text-[9px] tracking-wider">
                  SPECIAL PRICE
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-[#24231f]" />
                <span>{product.rating}</span>
              </div>
              <span className="text-[#c7c1b7]">|</span>
              <span className="text-xs text-[#77746d]">
                {product.reviews} reviews
              </span>
            </div>

            <div className="my-7 border-t border-[#e8e4dc]" />

            <p className="text-sm leading-8 text-[#68655e]">
              {product.description}
            </p>

            <div className="mt-7 flex items-center gap-3 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  product.stock > 0 ? 'bg-[#73836b]' : 'bg-red-500'
                }`}
              />
              <span>
                {product.stock > 0
                  ? `${product.stock} items available`
                  : 'Currently sold out'}
              </span>
            </div>

            <div className="mt-7">
              <p className="editorial-label mb-3">QUANTITY</p>

              <div className="inline-flex h-12 items-center border border-[#e8e4dc]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-full w-12 items-center justify-center disabled:opacity-30"
                >
                  <Minus size={15} />
                </button>

                <span className="min-w-10 text-center text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= product.stock}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(product.stock, current + 1),
                    )
                  }
                  className="flex h-full w-12 items-center justify-center disabled:opacity-30"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={product.stock < 1 || quantity > product.stock}
                onClick={handleAddToCart}
                className="editorial-button min-h-14 flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={17} />
                ADD TO BAG — {formatPrice(product.price * quantity)}
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                aria-label={
                  favorite ? 'Remove from wishlist' : 'Add to wishlist'
                }
                className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#e8e4dc] transition hover:border-[#24231f]"
              >
                <Heart
                  size={20}
                  className={favorite ? 'fill-[#24231f]' : ''}
                />
              </button>
            </div>

            <div className="mt-8 border-t border-[#e8e4dc]">
              <div className="flex items-center gap-4 border-b border-[#e8e4dc] py-5">
                <Truck size={19} strokeWidth={1.3} />
                <div>
                  <p className="text-xs font-semibold">Delivery</p>
                  <p className="mt-1 text-xs leading-5 text-[#77746d]">
                    Delivery options and fees are confirmed at checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-[#e8e4dc] py-5">
                <RotateCcw size={19} strokeWidth={1.3} />
                <div>
                  <p className="text-xs font-semibold">Easy returns</p>
                  <p className="mt-1 text-xs leading-5 text-[#77746d]">
                    Review the store return policy before ordering.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-5">
                <ShieldCheck size={19} strokeWidth={1.3} />
                <div>
                  <p className="text-xs font-semibold">NOVA quality</p>
                  <p className="mt-1 text-xs leading-5 text-[#77746d]">
                    Thoughtfully selected pieces for everyday styling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-[#e8e4dc] bg-[#f8f6f1]">
          <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
            <p className="editorial-label text-[#89857d]">YOU MAY ALSO LIKE</p>

            <div className="mb-7 mt-2 flex items-center justify-between gap-4">
              <h2 className="font-editorial text-3xl sm:text-4xl">
                Complete the look
              </h2>
              <Link
                to="/products"
                className="flex items-center gap-2 text-[10px] tracking-wider"
              >
                SHOP ALL <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
