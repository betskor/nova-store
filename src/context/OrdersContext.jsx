
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

const OrdersContext = createContext(null)
const STORAGE_KEY = 'nova-orders'

function readOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(readOrders)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch (error) {
      console.error('NOVA orders could not be saved:', error)
    }
  }, [orders])

  const addOrder = useCallback((order) => {
    const savedOrder = {
      ...order,
      status: order.status || 'Pending',
      createdAt: order.createdAt || new Date().toISOString(),
    }

    setOrders((current) => {
      const exists = current.some(
        (item) => item.orderNumber === savedOrder.orderNumber,
      )

      if (exists) {
        return current.map((item) =>
          item.orderNumber === savedOrder.orderNumber
            ? { ...item, ...savedOrder }
            : item,
        )
      }

      return [savedOrder, ...current]
    })

    return savedOrder
  }, [])

  const updateOrderStatus = useCallback((orderNumber, status) => {
    const allowedStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ]

    if (!allowedStatuses.includes(status)) {
      throw new Error('INVALID_ORDER_STATUS')
    }

    setOrders((current) =>
      current.map((order) =>
        order.orderNumber === orderNumber
          ? { ...order, status }
          : order,
      ),
    )
  }, [])

  const getOrder = useCallback(
    (orderNumber) =>
      orders.find((order) => order.orderNumber === orderNumber) || null,
    [orders],
  )

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateOrderStatus, getOrder }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)

  if (!context) {
    throw new Error('useOrders must be used inside OrdersProvider')
  }

  return context
}
