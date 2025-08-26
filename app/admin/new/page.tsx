import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

/** Normalize WhatsApp to wa.me link. Allows 8-digit CR numbers or 506 + 8. */
function normalizeWa(input: string): string {
  const digits = (input || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 8) return `https://wa.me/506${digits}`
  if (digits.startsWith('506') && digits.length === 11) return `https://wa.me/${digits}`
  return `https://wa.me/${digits}`
}

/** Try to pull lat/lng from common Waze / Google Maps URLs. */
function parseLatLng(url: string | null | undefined): { lat: number; lng: number } | null {
  if (!url) return null
  try {
    const u = new URL(url)

    // 1) Waze: ...?ll=lat,lng
    const ll = u.searchParams.get('ll')
    if (ll && /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(ll)) {
      const [lat, lng] = ll.split(',').map(Number)
      if (isFinite(lat) && isFinite(lng)) return { lat, lng }
    }

    // 2) Google Maps: .../@lat,lng, or ...?q=lat,lng
    const atMatch = u.pathname.match(/@(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/)
    if (atMatch) {
      const lat = Number(atMatch[1])
      const lng = Number(atMatch[3])
      if (isFinite(lat) && isFinite(lng)) return { lat, lng }
    }

    const q = u.searchParams.get('q')
    if (q && /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(q)) {
      const [lat, lng] = q.split(',').map(Number)
      if (isFinite(lat) && isFinite(lng)) return { lat, lng }
    }
  } catch {
    // ignore parse errors
  }
  return null
}

export default async function AdminNewVendorPage() {
  const session = await getSession()
  if (!session.user || session.user.role !== 'admin') redirect('/')

  const categories = await db.category.findMany({ orderBy: { name_es: 'asc' } })

  async function addCategory(formData: FormData) {
    'use server'
    const s = await getSession()
    if (!s.user || s.user.role !== 'admin') redirect('/')

    const name = String(formData.get('newCategory') || '').trim()
    if (!name) redirect('/admin/new?e=' + encodeURIComponent('Nombre de categoría vacío'))

    // ES/EN same for now; slugified from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    await db.category.create({
      data: { name_es: name, name_en: name, slug },
    })
    redirect('/admin/new')
  }

  async function createVendor(formData: FormData) {
    'use server'
    const s = await getSession()
    if (!s.user || s.user.role !== 'admin') redirect('/')

    const businessName = String(formData.get('businessName') || '').trim()
    const categoryId   = String(formData.get('categoryId') || '')
    const province     = String(formData.get('province') || '').trim()
    const canton       = String(formData.get('canton') || '').trim()
    const district     = String(formData.get('district') || '').trim()
    const allCountry   = formData.get('allCountry') === 'on'

    const instagramUrl = String(formData.get('instagramUrl') || '').trim()
    const locationUrl  = String(formData.get('locationUrl')  || '').trim()
    const waRaw        = String(formData.get('whatsapp')     || '').trim()
    const whatsapp     = normalizeWa(waRaw)

    if (!businessName || !categoryId) {
      redirect('/admin/new?e=' + encodeURIComponent('Complete nombre y categoría'))
    }
    if (!allCountry && (!province || !canton || !district)) {
      redirect('/admin/new?e=' + encodeURIComponent('Complete ubicación o marque Todo el país'))
    }

    const latLng = parseLatLng(locationUrl)

    // IMPORTANT: Do NOT send nulls to Prisma; only include fields when present.
    await db.vendor.create({
      data: {
        ownerId: s.user.id,
        businessName,
        categoryId,
        tags: [],
        province: allCountry ? '' : province,
        canton:   allCountry ? '' : canton,
        district: allCountry ? '' : district,
        allCountry,

        // contacts / links
        whatsapp,                               // keep even if empty string
        ...(instagramUrl && { instagramUrl }),
        ...(locationUrl  && { locationUrl }),
        ...(latLng && { locationLat: latLng.lat, locationLng: latLng.lng }),

        // leave imageUrl / coverImage / phone / socials out unless you capture them
        isPublished: true,
      },
    })

    redirect('/admin')
  }

  // read error banner if present (placeholder for build friendliness)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = {} as { e?: string }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Agregar servicio / negocio</h1>

      {/* Error banner via ?e=... (optional) */}
      {/* @ts-expect-error server component params */}
      {typeof (await import('next/headers')).headers().get('x-next-url') === 'x' && null}

      <form action={createVendor} className="card space-y-3">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Nombre del negocio</label>
          <input name="businessName" className="input" placeholder="SS Remodelaciones" required />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Instagram (opcional)</label>
            <input name="instagramUrl" className="input" placeholder="https://www.instagram.com/mi.negocio/" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Ubicación (Waze/Maps URL, opcional)</label>
            <input name="locationUrl" className="input" placeholder="https://waze.com/ul?ll=..." />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">WhatsApp</label>
            <input name="whatsapp" className="input" placeholder="506XXXXXXXX" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Categoría</label>
            <select name="categoryId" className="input" required>
              <option value="">Seleccione categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_es}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-2">
          <input className="input" name="province" placeholder="Provincia" />
          <input className="input" name="canton" placeholder="Cantón" />
          <input className="input" name="district" placeholder="Distrito" />
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="allCountry" />
          Todo el país
        </label>

        <button className="btn btn-primary w-full">Guardar</button>
      </form>

      <div className="card space-y-2">
        <div className="font-medium">¿No existe la categoría?</div>
        <form action={addCategory} className="flex gap-2">
          <input name="newCategory" className="input flex-1" placeholder="Nueva categoría" />
          <button className="btn">Agregar categoría</button>
        </form>
      </div>
    </div>
  )
}
