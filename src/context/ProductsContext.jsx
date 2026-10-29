
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import initialProducts from '../data/products'

const ProductsContext = createContext(null)
const STORAGE_KEY = 'nova-products'

function readProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === null) return initialProducts

    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : initialProducts
  } catch {
    return initialProducts
  }
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(readProducts)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch (error) {
      console.error('NOVA products could not be saved:', error)
    }
  }, [products])

  const addProduct = useCallback((values) => {
    const product = {
      ...values,
      id: `nova-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
      name: values.name.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      oldPrice: values.oldPrice === '' || values.oldPrice == null
        ? null
        : Number(values.oldPrice),
      rating: Number(values.rating) || 0,
      reviews: Number(values.reviews) || 0,
      stock: Number(values.stock) || 0,
      badge: values.badge?.trim() || null,
      image: values.image.trim(),
      description: values.description?.trim() || '',
    }

    setProducts((current) => [...current, product])
    return product
  }, [])

  const updateProduct = useCallback((id, changes) => {
    setProducts((current) =>
      current.map((product) => {
        if (String(product.id) !== String(id)) return product

        const oldPrice =
          changes.oldPrice === ''
            ? null
            : changes.oldPrice === undefined
              ? product.oldPrice
              : changes.oldPrice == null
                ? null
                : Number(changes.oldPrice)

        return {
          ...product,
          ...changes,
          name: String(changes.name ?? product.name).trim(),
          category: String(changes.category ?? product.category).trim(),
          price: Number(changes.price ?? product.price),
          oldPrice,
          rating: Number(changes.rating ?? product.rating ?? 0),
          reviews: Number(changes.reviews ?? product.reviews ?? 0),
          stock: Number(changes.stock ?? product.stock ?? 0),
          badge: String(changes.badge ?? product.badge ?? '').trim() || null,
          image: String(changes.image ?? product.image).trim(),
          description: String(
            changes.description ?? product.description ?? '',
          ).trim(),
        }
      }),
    )
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts((current) =>
      current.filter((product) => String(product.id) !== String(id)),
    )
  }, [])

  const getProduct = useCallback(
    (id) => products.find((product) => String(product.id) === String(id)),
    [products],
  )

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)

  if (!context) {
    throw new Error('useProducts must be used inside ProductsProvider')
  }

  return context
}
