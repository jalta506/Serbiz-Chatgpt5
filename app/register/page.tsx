import { register } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function RegisterPage({ searchParams }: { searchParams?: { e?: string } }) {
  async function action(formData: FormData) {
    'use server'
    const username = String(formData.get('username') || '')
    const password = String(formData.get('password') || '')
    const role = String(formData.get('role') || 'user') as 'user' | 'vendor'

    const res = await register(username, password, role)
    if (!res.ok) {
      // bounce back with error in querystring
      redirect(`/register?e=${encodeURIComponent(res.error || 'Error')}`)
    }

    if (role === 'vendor') {
      redirect('/dashboard/vendor')
    }
    redirect('/')
  }

  const error = searchParams?.e

  return (
    <form action={action} className="max-w-md mx-auto card space-y-3 mt-6">
      <h1 className="text-xl font-bold">Crear cuenta</h1>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2">
          {error}
        </div>
      )}

      <input
        className="input"
        name="username"
        placeholder="Nombre de usuario (puede ser tu email)"
        required
      />
      <input
        className="input"
        name="password"
        type="password"
        placeholder="Contraseña"
        required
      />
      <select name="role" className="input" defaultValue="user">
        <option value="user">Usuario</option>
        <option value="vendor">Proveedor</option>
      </select>
      <button className="btn btn-primary w-full">Crear</button>
    </form>
  )
}
