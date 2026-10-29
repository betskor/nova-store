
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useProducts } from './ProductsContext'

const CartContext = createContext(null)

function readCart() {
  try {
    const saved = localStorage.getItem('nova-cart')
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { products } = useProducts()
  const [cartItems, setCartItems] = useState(readCart)

  useEffect(() => {
    setCartItems((current) =>
      current.flatMap((item) => {
        const latest = products.find(
          (product) => String(product.id) === String(item.id),
        )

        if (!latest || Number(latest.stock) < 1) return []

        return [{
          ...item,
          ...latest,
          quantity: Math.min(
            Math.max(1, Number(item.quantity) || 1),
            Number(latest.stock),
          ),
        }]
      }),
    )
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem('nova-cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('NOVA cart could not be saved:', error)
    }
  }, [cartItems])

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || !Number.isFinite(quantity) || quantity < 1) return
    if (Number(product.stock) < 1) return

    setCartItems((current) => {
      const existing = current.find(
        (item) => String(item.id) === String(product.id),
      )

      if (existing) {
        return current.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                ...product,
                quantity: Math.min(
                  (Number(item.quantity) || 0) + quantity,
                  Number(product.stock ?? Infinity),
                ),
              }
            : item,
        )
      }

      return [
        ...current,
        {
          ...product,
          quantity: Math.min(quantity, Number(product.stock ?? Infinity)),
        },
      ]
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems((current) =>
      current.filter((item) => String(item.id) !== String(productId)),
    )
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (!Number.isFinite(quantity) || quantity < 1) return

    setCartItems((current) =>
      current.map((item) =>
        String(item.id) === String(productId)
          ? {
              ...item,
              quantity: Math.min(
                quantity,
                Number(item.stock ?? Infinity),
              ),
            }
          : item,
      ),
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  )

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
