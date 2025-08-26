import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

function normalizeWa(input: string): string {
  const digits = (input || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 8) return `https://wa.me/506${digits}`
  if (digits.startsWith('506') && digits.length === 11) return `https://wa.me/${digits}`
  return `https://wa.me/${digits}`
}

function titleCase(s: string) {
  const t = s.trim().toLowerCase()
  if (!t) return ''
  return t.replace(/\b([\p{L}\p{M}]+)/gu, w => w.charAt(0).toUpperCase() + w.slice(1))
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

    const slug = name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
    const provinceRaw  = String(formData.get('province') || '')
    const cantonRaw    = String(formData.get('canton') || '')
    const districtRaw  = String(formData.get('district') || '')
    const allCountry   = formData.get('allCountry') === 'on'

    const instagramUrl = String(formData.get('instagramUrl') || '').trim() || null
    const locationUrl  = String(formData.get('locationUrl')  || '').trim() || null
    const waRaw        = String(formData.get('whatsapp')     || '').trim()
    const whatsapp     = normalizeWa(waRaw)

    if (!businessName || !categoryId) {
      redirect('/admin/new?e=' + encodeURIComponent('Complete nombre y categoría'))
    }

    // NEW: relax validation — if not "Todo el país", at least Provincia is required
    const province = titleCase(provinceRaw)
    const canton   = titleCase(cantonRaw)
    const district = titleCase(districtRaw)

    if (!allCountry && !province) {
      redirect('/admin/new?e=' + encodeURIComponent('Indique al menos la provincia o marque "Todo el país".'))
    }

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
        whatsapp,
        phone: null,
        imageUrl: null,
        socials: null,
        instagramUrl,
        coverImage: null,
        locationUrl,
        locationLat: null,
        locationLng: null,
        isPublished: true,
      },
    })

    redirect('/admin?msg=' + encodeURIComponent('Servicio creado'))
  }

  // (Build-friendly) no-op use of headers to avoid TS complaining in some hosts
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ignore = (await import('next/headers')).headers

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Agregar servicio / negocio</h1>

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
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name_es}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-2">
          <input className="input" name="province" placeholder="Provincia (mínimo requerido)" />
          <input className="input" name="canton" placeholder="Cantón (opcional)" />
          <input className="input" name="district" placeholder="Distrito (opcional)" />
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
