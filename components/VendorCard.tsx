// components/VendorCard.tsx
import Link from 'next/link'
import type { Vendor, Category } from '@prisma/client'
import { whatsappUrl, telUrl, wazeUrl, gmapsUrl } from '@/lib/links'

export default function VendorCard({ vendor }: { vendor: Vendor & { category?: Category | null } }) {
  const area = vendor.allCountry
    ? 'Costa Rica'
    : [vendor.district, vendor.canton, vendor.province].filter(Boolean).join(', ')

  const tel = telUrl(vendor.phone)
  const wa  = whatsappUrl(vendor)
  const wz  = wazeUrl(vendor)
  const gm  = gmapsUrl(vendor)

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-black/5 flex items-center justify-center">
          {/* placeholder icon */}
          <span className="text-black/50">SB</span>
        </div>
        <div className="min-w-0">
          <Link href={`/proveedor/${vendor.id}`} className="font-semibold hover:underline line-clamp-1">
            {vendor.businessName}
          </Link>
          <div className="text-sm text-black/60 line-clamp-1">
            {vendor.category?.name_es || 'Servicio'} · {area}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          aria-label="Contactar por WhatsApp"
        >
          WhatsApp
        </a>

        {tel && (
          <a href={tel} className="btn" aria-label="Llamar por teléfono">
            Llamar
          </a>
        )}

        <a
          href={wz}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          aria-label="Abrir en Waze"
        >
          Waze
        </a>

        <a
          href={gm}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          aria-label="Abrir en Google Maps"
        >
          Maps
        </a>
      </div>
    </div>
  )
}
