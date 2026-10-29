
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'NEW ARRIVALS', to: '/products' },
  { label: 'CLOTHING', to: '/products?category=Clothing' },
  { label: 'SHOES', to: '/products?category=Shoes' },
  { label: 'ACCESSORIES', to: '/products?category=Bags' },
  { label: 'EDITORIAL', to: '/#editorial' },
  { label: 'SALE', to: '/products?sale=true' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const { cartCount } = useCart()
  const { wishlistItems = [] } = useWishlist()
  const { user } = useAuth()

  const accountPath = user ? '/profile' : '/login'
  const accountLabel = user ? 'MY ACCOUNT' : 'SIGN IN'

  return (
    <>
      <div className="flex h-7 items-center justify-center bg-[#24231f] px-3 text-[9px] tracking-[0.14em] text-white">
        COMPLIMENTARY SHIPPING ON ORDERS OVER EGP 3,000
      </div>

      <header className="relative z-40 border-b border-[#e8e4dc] bg-[#fffefa]">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((previous) => !previous)}
            className="lg:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <Link
            to="/"
            className="font-editorial shrink-0 text-[29px] tracking-[-0.07em] sm:text-[33px]"
          >
            NOVA
          </Link>

          <nav className="hidden items-center justify-center gap-5 xl:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `text-[9px] font-semibold tracking-[0.1em] transition-colors hover:text-[#77746d] ${
                    isActive ? 'text-[#24231f]' : 'text-[#77746d]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            <Link
              to="/products"
              aria-label="Search products"
              className="transition hover:text-[#77746d]"
            >
              <Search size={19} strokeWidth={1.5} />
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative transition hover:text-[#77746d]"
            >
              <Heart size={20} strokeWidth={1.5} />

              {wishlistItems.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#24231f] px-1 text-[9px] text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label="Shopping bag"
              className="relative transition hover:text-[#77746d]"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#24231f] px-1 text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to={accountPath}
              className="hidden text-[9px] font-semibold tracking-[0.12em] hover:text-[#77746d] sm:block"
            >
              {accountLabel}
            </Link>
          </div>
        </div>

        {menuOpen && (
          <nav className="absolute left-0 right-0 top-full border-b border-[#e8e4dc] bg-[#fffefa] px-6 py-5 shadow-lg lg:hidden">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-[#e8e4dc] py-4 text-[11px] tracking-[0.13em] last:border-0"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to={accountPath}
                onClick={() => setMenuOpen(false)}
                className="py-4 text-[11px] tracking-[0.13em]"
              >
                {accountLabel}
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
