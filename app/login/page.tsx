import { login } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function LoginPage() {
  async function action(formData: FormData) {
    'use server'
    const username = String(formData.get('username') || '')
    const password = String(formData.get('password') || '')

    const res = await login(username, password)

    if (!res.ok) {
      return { error: res.error }
    }

    // Redirect based on role
    if (res.role === 'admin') {
      redirect('/admin')
    } else if (res.role === 'vendor') {
      redirect('/dashboard/vendor')
    } else {
      redirect('/')
    }
  }

  return (
    <form action={action} className="max-w-md mx-auto card space-y-3 mt-6">
      <h1 className="text-xl font-bold">Iniciar sesión</h1>
      <input
        className="input"
        name="username"
        placeholder="Usuario"
        required
      />
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
