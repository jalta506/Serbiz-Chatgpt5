// app/proveedor/[id]/page.tsx
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { whatsappUrl, telUrl, wazeUrl, gmapsUrl } from '@/lib/links'
import Image from 'next/image'

export default async function VendorDetail({ params }: { params: { id: string } }) {
  const vendor = await db.vendor.findUnique({
    where: { id: params.id },
    include: { category: true },
  })
  if (!vendor || !vendor.isPublished) return notFound()

  // Safely read optional field that may not be present in remote Prisma types yet
  const locationUrl = (vendor as any).locationUrl as string | undefined | null

  const wa = whatsappUrl(vendor)
  const tel = telUrl(vendor.phone)
  const wz = wazeUrl(vendor)
  const gm = gmapsUrl(vendor)

  const area = vendor.allCountry
    ? 'Costa Rica'
    : [vendor.district, vendor.canton, vendor.province].filter(Boolean).join(', ')

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        {vendor.coverImage ? (
          <div className="overflow-hidden rounded-2xl border">
            <Image
              src={vendor.coverImage}
              alt={vendor.businessName}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        ) : (
          <div className="h-48 rounded-2xl border bg-black/5"></div>
        )}

        <h1 className="text-2xl font-bold">{vendor.businessName}</h1>
        <div className="text-black/70">
          {vendor.category?.name_es || 'Servicio'} · {area}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            WhatsApp
          </a>
          {tel && <a href={tel} className="btn">Llamar</a>}
          <a href={wz} target="_blank" rel="noopener noreferrer" className="btn">Waze</a>
          <a href={gm} target="_blank" rel="noopener noreferrer" className="btn">Maps</a>
          {(vendor as any).instagramUrl && (
            <a
              href={(vendor as any).instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Instagram
            </a>
          )}
        </div>
      </div>

      <aside className="space-y-3">
        <div className="card">
          <div className="font-semibold mb-1">Ubicación</div>
          <div className="text-sm text-black/70">{area}</div>
          {locationUrl && (
            <a
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-2 inline-block"
            >
              Ver ubicación original
            </a>
          )}
        </div>

        <div className="card">
          <div className="font-semibold mb-1">Contacto</div>
          <div className="text-sm break-all">
            <div>
              WhatsApp:{' '}
              <a className="link" href={wa} target="_blank" rel="noreferrer">
                {wa}
              </a>
            </div>
            {tel && (
              <div>
                Teléfono: <a className="link" href={tel}>{vendor.phone}</a>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
