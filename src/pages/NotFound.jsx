
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
        Error 404
      </p>

      <h1 className="mt-4 text-5xl font-black">Page not found</h1>

      <p className="mt-4 text-zinc-500">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-7 rounded-full bg-zinc-900 px-6 py-3 text-white hover:bg-amber-600"
      >
        Back to home
      </Link>
    </section>
  )
}
