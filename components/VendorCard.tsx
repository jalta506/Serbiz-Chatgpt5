import Link from 'next/link'

export default function VendorCard({ vendor }: { vendor: any }) {
  const hasCover = !!vendor.coverImage
  const imgSrc = vendor.coverImage || '/placeholder.svg' // keep your placeholder path

  return (
    <div className="card hover:shadow">
      <div className="h-28 w-full rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
        {/* simple <img> to avoid next/image config */}
        <img src={imgSrc} alt={vendor.businessName} className="h-full w-full object-cover" />
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{vendor.businessName}</h3>
          {vendor.instagramUrl && (
            <a
              href={vendor.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-0.5 rounded-full border border-black/10 hover:bg-black/5"
              title="Ver en Instagram"
            >
              Instagram
            </a>
          )}
        </div>

        <p className="text-xs text-black/60">
          {vendor.category?.name_es} · {vendor.province}
          {vendor.canton ? `, ${vendor.canton}` : ''}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <Link href={`/proveedor/${vendor.id}`} className="btn btn-secondary">Ver</Link>
        <a href={vendor.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          WhatsApp
        </a>
      </div>
    </div>
  )
}
