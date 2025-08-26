import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function VendorPublicPage({
  params,
}: { params: { id: string } }) {
  const vendorId = params.id
  const session = await getSession()

  // Load vendor + check if this user has it favorited
  const [vendor, fav] = await Promise.all([
    db.vendor.findUnique({
      where: { id: vendorId },
      include: { category: true },
    }),
    session.user
      ? db.favorite.findFirst({
          where: { userId: session.user.id, vendorId },
        })
      : Promise.resolve(null),
  ])

  if (!vendor || !vendor.isPublished) {
    redirect('/')
  }

  // Record a recent view (best-effort; ignore errors)
  if (session.user) {
    await db.recentView
      .create({
        data: { userId: session.user.id, vendorId },
      })
      .catch(() => {})
    // Keep only the last 50 recents for this user
    await db.$executeRawUnsafe(
      `
      DELETE FROM "RecentView"
      WHERE "id" IN (
        SELECT "id" FROM "RecentView"
        WHERE "userId" = $1
        ORDER BY "viewedAt" DESC
        OFFSET 50
      )
    `,
      session.user.id
    ).catch(() => {})
  }

  // Server action: toggle favorite
  async function toggleFavorite(formData: FormData) {
    'use server'
    const s = await getSession()
    if (!s.user) redirect('/login')
    const vId = String(formData.get('vendorId') || '')
    if (!vId) redirect(`/proveedor/${vendorId}`)

    const existing = await db.favorite.findFirst({
      where: { userId: s.user.id, vendorId: vId },
    })
    if (existing) {
      await db.favorite.delete({ where: { id: existing.id } })
    } else {
      await db.favorite.create({ data: { userId: s.user.id, vendorId: vId } })
    }
    redirect(`/proveedor/${vId}`)
  }

  const isFavorite = Boolean(fav)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{vendor.businessName}</h1>
      <div className="text-sm opacity-70">
        {vendor.category?.name_es ?? '—'} · {[vendor.province, vendor.canton, vendor.district].filter(Boolean).join(', ')}
      </div>

      <div className="flex gap-2">
        <a className="btn" href={vendor.whatsapp} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>

        {/* Toggle Favorite (requires login) */}
        <form action={toggleFavorite}>
          <input type="hidden" name="vendorId" value={vendor.id} />
          <button className="btn" type="submit">
            {isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          </button>
        </form>
      </div>

      {/* …you can render more vendor details here… */}
    </div>
  )
}
