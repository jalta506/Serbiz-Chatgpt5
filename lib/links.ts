// lib/links.ts
import type { Vendor, Category } from '@prisma/client'

type VendorWithCat = Vendor & { category?: Category | null }

function areaString(v: Vendor) {
  if ((v as any).allCountry) return 'Costa Rica'
  const parts = [(v as any).district, (v as any).canton, (v as any).province].filter(Boolean)
  return parts.join(', ')
}

export function whatsappUrl(v: Vendor) {
  return (v as any).whatsapp as string
}

export function telUrl(phone?: string | null) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  return `tel:${digits}`
}

export function wazeUrl(v: Vendor) {
  // ✅ always read via a safe cast (remote build may not see the new field yet)
  const loc = (v as any).locationUrl as string | undefined | null
  const lat = (v as any).lat as number | undefined
  const lng = (v as any).lng as number | undefined

  if (loc && /waze\.com/i.test(loc)) return loc
  if (lat != null && lng != null) return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`

  const q = `${(v as any).businessName} ${areaString(v)}`
  return `https://waze.com/ul?q=${encodeURIComponent(q)}`
}

export function gmapsUrl(v: Vendor) {
  const loc = (v as any).locationUrl as string | undefined | null
  const lat = (v as any).lat as number | undefined
  const lng = (v as any).lng as number | undefined

  if (loc && /(google\.[^/]+\/maps|goo\.gl\/maps)/i.test(loc)) return loc
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }
  const q = `${(v as any).businessName} ${areaString(v)}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}
