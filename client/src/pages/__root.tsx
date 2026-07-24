import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AuthProvider } from '../lib/auth'
import AppHeader from '../components/AppHeader'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <AppHeader />
        <Outlet />
      </div>
    </AuthProvider>
  )
}
