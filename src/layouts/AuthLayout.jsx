
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <Outlet />
    </main>
  )
}
