import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await getSession()
  if (!session.user || session.user.role !== 'admin') redirect('/')

  // --- Server actions ---
  async function deleteVendor(formData: FormData) {
    'use server'
    const s = await getSession()
    if (!s.user || s.user.role !== 'admin') redirect('/')

    const id = String(formData.get('id') || '')
    if (!id) redirect('/admin')

    // Remove dependent rows first (safe if none exist)
    await db.$transaction([
      db.favorite.deleteMany({ where: { vendorId: id } }),
      db.recentView.deleteMany({ where: { vendorId: id } }),
      db.vendor.delete({ where: { id } }),
    ])

    redirect('/admin')
  }

  async function deleteUser(formData: FormData) {
    'use server'
    const s = await getSession()
    if (!s.user || s.user.role !== 'admin') redirect('/')

    const id = String(formData.get('id') || '')
    const username = String(formData.get('username') || '').toLowerCase()

    // Safety: do not delete admin
    if (username === 'serbizadmin1') {
      redirect('/admin?e=' + encodeURIComponent('No se puede eliminar el usuario administrador.'))
    }

    // Delete user’s related data then the user
    await db.$transaction([
      // vendors owned by this user + their edges
      db.favorite.deleteMany({ where: { vendor: { ownerId: id } } }),
      db.recentView.deleteMany({ where: { vendor: { ownerId: id } } }),
      db.vendor.deleteMany({ where: { ownerId: id } }),
      // user edges
      db.favorite.deleteMany({ where: { userId: id } }),
      db.recentView.deleteMany({ where: { userId: id } }),
      db.user.delete({ where: { id } }),
    ])

    redirect('/admin')
  }

  // --- Data for UI ---
  const [users, vendors] = await Promise.all([
    db.user.findMany({ orderBy: { username: 'asc' } }),
    db.vendor.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, owner: true },
    }),
  ])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Usuarios</h2>
        <div className="grid gap-2">
          {users.map(u => (
            <div key={u.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{u.username}</div>
                <div className="text-xs uppercase opacity-60">{u.role}</div>
              </div>
              <form action={deleteUser}>
                <input type="hidden" name="id" value={u.id} />
                <input type="hidden" name="username" value={u.username} />
                <button className="btn btn-danger" type="submit">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Proveedores</h2>
        <div className="grid gap-2">
          {vendors.map(v => (
            <div key={v.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{v.businessName}</div>
                  <div className="text-sm opacity-70">
                    {(v.category?.name_es) ?? '—'} · {v.province || '—'}
                  </div>
                  <div className="text-xs opacity-60">Owner: {v.owner?.username ?? '—'}</div>
                </div>
                <form action={deleteVendor}>
                  <input type="hidden" name="id" value={v.id} />
                  <button className="btn btn-danger" type="submit">Eliminar</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
