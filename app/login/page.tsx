// app/login/page.tsx
import { login } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { e?: string }
}) {
  async function action(formData: FormData): Promise<void> {
    'use server'
    const username = String(formData.get('username') ?? '')
    const password = String(formData.get('password') ?? '')

    const res = await login(username, password)

    if (!res.ok) {
      // redirect back with an error message in the query string
      redirect('/login?e=' + encodeURIComponent(res.error ?? 'Credenciales inválidas'))
    }

    // success → home (or wherever you want)
    redirect('/')
  }

  const error = searchParams?.e

  return (
    <form action={action} className="max-w-md mx-auto card space-y-3 mt-6">
      <h1 className="text-xl font-bold">Iniciar sesión</h1>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2">
          {error}
        </div>
      )}

      <input className="input" name="username" placeholder="Usuario" required />
      <input
        className="input"
        name="password"
        placeholder="Contraseña"
        type="password"
        required
      />
      <button className="btn btn-primary w-full">Entrar</button>
    </form>
  )
}
