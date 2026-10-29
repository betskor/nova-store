
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(price)

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const favorite = isInWishlist(product.id)

  return (
    <article className="group min-w-0">
      <div className="product-image-wrap relative overflow-hidden bg-[#f0ede7]">
        <Link
          to={`/products/${product.id}`}
          className="block aspect-[3/4] overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="product-image h-full w-full object-cover"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-3 top-3 bg-[#fffefa]/95 px-2.5 py-2 text-[8px] font-semibold tracking-[0.12em]">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={favorite ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={favorite}
          onClick={() => {
            toggleWishlist(product)
            toast.success(
              favorite ? 'Removed from wishlist' : 'Added to wishlist',
            )
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-[#fffefa]/95 transition hover:bg-white"
        >
          <Heart
            size={17}
            strokeWidth={1.5}
            className={favorite ? 'fill-[#24231f] text-[#24231f]' : ''}
          />
        </button>

        <button
          type="button"
          disabled={product.stock < 1}
          onClick={() => {
            if (product.stock < 1) {
              toast.error('This item is sold out')
              return
            }

            addToCart(product)
            toast.success('Added to bag')
          }}
          className="absolute bottom-0 left-0 right-0 flex min-h-11 items-center justify-center gap-2 bg-[#fffefa]/95 px-2 text-[9px] font-semibold tracking-[0.12em] transition hover:bg-[#24231f] hover:text-white disabled:opacity-50 sm:translate-y-full sm:group-hover:translate-y-0"
        >
          <ShoppingBag size={15} strokeWidth={1.5} />
          {product.stock < 1 ? 'SOLD OUT' : 'ADD TO BAG'}
        </button>
      </div>

      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/products/${product.id}`}
            className="font-editorial text-sm leading-5 hover:underline sm:text-base"
          >
            {product.name}
          </Link>

          <span className="flex shrink-0 items-center gap-1 pt-1 text-[10px] text-[#77746d]">
            <Star size={11} className="fill-current" />
            {product.rating}
          </span>
        </div>

        <p className="mt-1.5 text-[9px] uppercase tracking-[0.12em] text-[#89857d]">
          {product.category}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span>{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[#99948b] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
