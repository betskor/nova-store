
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="text-xl font-black">
          NOVA<span className="text-amber-600">.</span>
        </Link>

        <p className="text-sm text-zinc-500">
          Your everyday essentials, all in one place.
        </p>

        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} NOVA Store
        </p>
      </div>
    </footer>
  )
}
