
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useProducts } from './ProductsContext'

const WishlistContext = createContext(null)

function readWishlist() {
  try {
    const saved = localStorage.getItem('nova-wishlist')
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const { products } = useProducts()
  const [wishlistItems, setWishlistItems] = useState(readWishlist)

  useEffect(() => {
    setWishlistItems((current) =>
      current.flatMap((item) => {
        const latest = products.find(
          (product) => String(product.id) === String(item.id),
        )

        return latest ? [latest] : []
      }),
    )
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem('nova-wishlist', JSON.stringify(wishlistItems))
    } catch (error) {
      console.error('NOVA wishlist could not be saved:', error)
    }
  }, [wishlistItems])

  const toggleWishlist = useCallback((product) => {
    setWishlistItems((current) =>
      current.some((item) => String(item.id) === String(product.id))
        ? current.filter((item) => String(item.id) !== String(product.id))
        : [...current, product],
    )
  }, [])

  const isInWishlist = useCallback(
    (productId) =>
      wishlistItems.some((item) => String(item.id) === String(productId)),
    [wishlistItems],
  )

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)

  if (!context) {
    throw new Error('useWishlist must be used inside WishlistProvider')
  }

  return context
}
