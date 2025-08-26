import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import VendorCard from '@/components/VendorCard'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session.user) redirect('/login')

  // For MVP, everyone is non-premium (visible but locked UI).
  const isPremium = false

  const [favorites, recents] = await Promise.all([
    db.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: { vendor: { include: { category: true } } },
      take: 24,
    }),
    db.recentView.findMany({
      where: { userId: session.user.id },
      orderBy: { viewedAt: 'desc' },
      include: { vendor: { include: { category: true } } },
      take: 24,
    }),
  ])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Mi perfil</h1>

      {/* Recientes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recientes</h2>
          {!isPremium && (
            <Link href="/planes" className="link">Desbloquear</Link>
          )}
        </div>
        <div className={isPremium ? '' : 'pointer-events-none opacity-50'}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recents.map(r => (
              r.vendor && <VendorCard key={r.id} vendor={r.vendor} />
            ))}
          </div>
        </div>
        {!isPremium && (
          <div className="text-sm text-black/70">
            Recientes está disponible con el plan de $2/mes.{' '}
            <Link href="/planes" className="link">Ver planes</Link>
          </div>
        )}
      </section>

      {/* Favoritos */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Favoritos</h2>
          {!isPremium && (
            <Link href="/planes" className="link">Desbloquear</Link>
          )}
        </div>
        <div className={isPremium ? '' : 'pointer-events-none opacity-50'}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map(f => (
              f.vendor && <VendorCard key={f.id} vendor={f.vendor} />
            ))}
          </div>
        </div>
        {!isPremium && (
          <div className="text-sm text-black/70">
            Guarda tus servicios favoritos con el plan de $2/mes.{' '}
            <Link href="/planes" className="link">Ver planes</Link>
          </div>
        )}
      </section>
    </div>
  )
}
