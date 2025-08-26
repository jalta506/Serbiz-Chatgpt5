// lib/links.ts
import type { Vendor, Category } from '@prisma/client'

type VendorWithCat = Vendor & { category?: Category | null }

function areaString(v: Vendor) {
  if (v.allCountry) return 'Costa Rica'
  return [v.district, v.canton, v.province].filter(Boolean).join(', ')
}

export function whatsappUrl(v: Vendor) {
  // already normalized as https://wa.me/...
  return v.whatsapp
}

export function telUrl(phone?: string | null) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  return `tel:${digits}`
}

export function wazeUrl(v: Vendor) {
  if (v.locationUrl && /waze\.com/i.test(v.locationUrl)) return v.locationUrl
  if (v.lat != null && v.lng != null) {
    // Waze deep-link with coordinates
    return `https://waze.com/ul?ll=${v.lat},${v.lng}&navigate=yes`
  }
  // Fallback: Waze search query
  const q = `${v.businessName} ${areaString(v)}`
  return `https://waze.com/ul?q=${encodeURIComponent(q)}`
}

export function gmapsUrl(v: Vendor) {
  if (v.locationUrl && /(google\.[^/]+\/maps|goo\.gl\/maps)/i.test(v.locationUrl)) {
    return v.locationUrl
  }
  if (v.lat != null && v.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`
  }
  const q = `${v.businessName} ${areaString(v)}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}
