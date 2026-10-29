
import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { wishlistItems } = useWishlist()

  return (
    <main className="mx-auto min-h-[65vh] max-w-[1600px] px-5 py-14 sm:px-8 lg:px-12">
      <p className="editorial-label text-[#89857d]">YOUR PERSONAL COLLECTION</p>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-[#e8e4dc] pb-7">
        <div>
          <h1 className="font-editorial text-4xl sm:text-6xl">
            My Wishlist
          </h1>
          <p className="mt-3 text-sm text-[#77746d]">
            {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <Link to="/products" className="flex items-center gap-2 text-xs">
          CONTINUE SHOPPING <ArrowRight size={15} />
        </Link>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <Heart size={32} strokeWidth={1.2} className="mx-auto" />
          <h2 className="font-editorial mt-5 text-3xl">
            Your wishlist is waiting
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#77746d]">
            Save the pieces you love and find them here whenever you need them.
          </p>
          <Link to="/products" className="editorial-button mt-7">
            DISCOVER THE COLLECTION
          </Link>
        </div>
      )}
    </main>
  )
}
