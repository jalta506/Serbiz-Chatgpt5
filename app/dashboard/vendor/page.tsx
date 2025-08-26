import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function VendorDashboard(){
  const session = await getSession()
  if (!session.user) redirect('/login')
  // Show basic info and a link to create a vendor listing
  const myVendor = await db.vendor.findFirst({ where: { ownerId: session.user.id }, include: { category: true } })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Panel de Proveedor</h1>
      {!myVendor ? (
        <a className="btn btn-primary" href="/vendor/new">Crear mi servicio</a>
      ) : (
        <div className="card">
          <div className="font-semibold">{myVendor.businessName}</div>
          <div className="text-sm opacity-70">{myVendor.category?.name_es} · {myVendor.province}</div>
          <a className="link" href={`/proveedor/${myVendor.id}`}>Ver página pública</a>
        </div>
      )}
    </div>
  )
}
