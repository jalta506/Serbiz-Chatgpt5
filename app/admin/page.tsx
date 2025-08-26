// app/admin/page.tsx
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getSession()
  if (!session.user || session.user.role !== 'admin') redirect('/')

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  const vendors = await db.vendor.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
    take: 200,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex gap-2">
          <Link href="/admin/new" className="btn btn-primary">+ Agregar</Link>
          <Link href="/admin/import" className="btn">Importar IG</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-3">Usuarios recientes</h2>
          <ul className="space-y-2 text-sm">
            {users.map(u => (
              <li key={u.id} className="flex justify-between">
                <span>{u.username}</span>
                <span className="text-black/50">{u.role.toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Vendors recientes</h2>
          <ul className="space-y-2 text-sm">
            {vendors.map(v => (
              <li key={v.id} className="flex justify-between">
                <Link href={`/proveedor/${v.id}`} className="link">{v.businessName}</Link>
                <span className="text-black/50">{v.category?.name_es || '—'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
