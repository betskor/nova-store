
import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'nova-demo-users'
const SESSION_KEY = 'nova-demo-session'

function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

function readCurrentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    if (!session?.email) return null

    return (
      readUsers().find((item) => item.email === session.email) || null
    )
  } catch {
    return null
  }
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('SECURE_CRYPTO_UNAVAILABLE')
  }

  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data)

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function makeSalt() {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function saveSession(email) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email }))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readCurrentUser())

  const register = useCallback(async ({ fullName, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const users = readUsers()

    if (users.some((item) => item.email === normalizedEmail)) {
      throw new Error('EMAIL_EXISTS')
    }

    const salt = makeSalt()
    const passwordHash = await hashPassword(password, salt)

    const newUser = {
      id: globalThis.crypto.randomUUID(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      city: '',
      salt,
      passwordHash,
    }

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
    saveSession(normalizedEmail)
    setUser(newUser)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = readUsers().find(
      (item) => item.email === normalizedEmail,
    )

    if (!existingUser) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const passwordHash = await hashPassword(password, existingUser.salt)

    if (passwordHash !== existingUser.passwordHash) {
      throw new Error('INVALID_CREDENTIALS')
    }

    saveSession(normalizedEmail)
    setUser(existingUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback((changes) => {
    const currentUser = readCurrentUser()

    if (!currentUser) {
      setUser(null)
      throw new Error('NOT_LOGGED_IN')
    }

    const users = readUsers()
    const updatedUser = {
      ...currentUser,
      fullName: changes.fullName.trim(),
      city: (changes.city || '').trim(),
    }

    const updatedUsers = users.map((item) =>
      item.email === currentUser.email ? updatedUser : item,
    )

    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
    setUser(updatedUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
