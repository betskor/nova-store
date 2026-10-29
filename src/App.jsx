
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ProductsProvider } from './context/ProductsContext'
import { OrdersProvider } from './context/OrdersContext'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <OrdersProvider>
          <CartProvider>
            <WishlistProvider>
              <AppRoutes />
              <Toaster position="top-right" />
            </WishlistProvider>
          </CartProvider>
        </OrdersProvider>
      </ProductsProvider>
    </AuthProvider>
  )
}
