// app/layout.tsx
import './globals.css'
import Link from 'next/link'
import { t } from '@/lib/i18n'
import { getSession, logout } from '@/lib/auth'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (process.env.DEFAULT_LOCALE as 'es' | 'en') || 'es'
  const session = await getSession()
  const user = session.user

  async function doLogout() {
    'use server'
    await logout()
  }

  return (
    <html lang={locale}>
      <body>
        <header className="border-b sticky top-0 bg-white/80 backdrop-blur z-10">
          <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="text-xl font-bold">SERBIZ</Link>

            {!user ? (
              <nav className="flex gap-4 items-center">
                <Link className="link" href="/login">{t(locale, 'login')}</Link>
                <Link className="btn btn-primary" href="/register">{t(locale, 'register')}</Link>
              </nav>
            ) : (
              <nav className="flex gap-3 items-center">
                {/* Admin shortcut */}
                {user.role === 'admin' && (
                  <Link className="btn" href="/admin">Admin</Link>
                )}

                {/* Vendor shortcut */}
                {user.role === 'vendor' && (
                  <Link className="btn" href="/dashboard/vendor">Mi panel</Link>
                )}

                {/* Profile link for any logged-in user */}
                <Link className="link" href="/profile">Mi perfil</Link>

                <span className="text-sm text-black/70">Hola, {user.username}</span>
                <form action={doLogout}>
                  <button className="link" type="submit">{t(locale, 'logout')}</button>
                </form>
              </nav>
            )}
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-4">{children}</main>

        <footer className="mt-16 border-t py-8 text-sm text-center text-black/70">
          © {new Date().getFullYear()} SERBIZ · Turquoise & Black
        </footer>
      </body>
    </html>
  )
}
