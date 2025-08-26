import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { fetchOgImage, prettyFromHandle } from '@/lib/og'

type ActionResult = {
  ok: boolean
  message: string
  created?: number
  skipped?: number
  errors?: Array<{ line: string; reason: string }>
}

export default async function AdminImportPage() {
  const session = await getSession()
  if (!session.user || session.user.role !== 'admin') redirect('/')

  const categories = await db.category.findMany({
    orderBy: { name_es: 'asc' },
  })

  async function importAction(formData: FormData): Promise<ActionResult> {
    'use server'
    const s = await getSession()
    if (!s.user || s.user.role !== 'admin') return { ok: false, message: 'No autorizado' }

    const raw = String(formData.get('profiles') || '')
    const categoryId = String(formData.get('categoryId') || '')
    const province = String(formData.get('province') || '').trim()
    const canton = String(formData.get('canton') || '').trim()
    const district = String(formData.get('district') || '').trim()
    const allCountry = formData.get('allCountry') === 'on'
    const draftMode = formData.get('draftMode') !== 'off' // default ON
    const whatsappDefault = String(formData.get('whatsappDefault') || '').trim()

    if (!categoryId) return { ok: false, message: 'Seleccione una categoría' }
    if (!allCountry && (!province || !canton || !district)) {
      return { ok: false, message: 'Complete provincia/cantón/distrito o marque Todo el país' }
    }

    // normalize WhatsApp default
    function normalizeWa(input: string): string {
      const digits = (input || '').replace(/\D/g, '')
      if (!digits) return 'https://wa.me/50600000000' // placeholder if empty
      if (digits.length === 8) return `https://wa.me/506${digits}`
      if (digits.startsWith('506') && digits.length === 11) return `https://wa.me/${digits}`
      return `https://wa.me/${digits}`
    }
    const whatsapp = normalizeWa(whatsappDefault)

    const lines = raw
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)

    if (lines.length === 0) {
      return { ok: false, message: 'Pegue 1 o más perfiles de Instagram (uno por línea).' }
    }

    let created = 0
    let skipped = 0
    const errors: Array<{ line: string; reason: string }> = []

    function toInstagramUrl(line: string): string | null {
      try {
        if (line.startsWith('http')) {
          const u = new URL(line)
          const host = u.hostname.replace(/^www\./, '')
          if (!host.endsWith('instagram.com')) return null
          const parts = u.pathname.split('/').filter(Boolean)
          if (!parts[0]) return null
          return `https://www.instagram.com/${parts[0]}/`
        }
        const handle = line.replace(/^@/, '').split(/[/?#]/)[0]
        if (!handle) return null
        return `https://www.instagram.com/${handle}/`
      } catch {
        return null
      }
    }

    for (const line of lines) {
      const insta = toInstagramUrl(line)
      if (!insta) {
        skipped++
        errors.push({ line, reason: 'No es un perfil de Instagram válido' })
        continue
      }

      const { pretty } = prettyFromHandle(insta)
      const businessName = pretty || 'Perfil de Instagram'

      // Try OG image
      let coverImage: string | undefined
      try {
        const img = await fetchOgImage(insta)
        if (img) coverImage = img
      } catch {
        // ignore
      }

      try {
        // Build payload WITHOUT any `null` values
        const data: any = {
          ownerId: s.user.id,
          businessName,
          categoryId,
          tags: [],
          province: allCountry ? '' : province,
          canton: allCountry ? '' : canton,
          district: allCountry ? '' : district,
          allCountry,
          whatsapp,
          isPublished: draftMode ? false : true,
          ...(insta ? { instagramUrl: insta } : {}),
          ...(coverImage ? { imageUrl: coverImage } : {}),
          // If later you capture these, include when present:
          // ...(phone ? { phone } : {}),
          // ...(socials ? { socials } : {}),
        }

        await db.vendor.create({ data })
        created++
      } catch (e: any) {
        skipped++
        errors.push({ line, reason: e?.message || 'Error al crear el vendor' })
      }
    }

    const message = `Importación completada: ${created} creados, ${skipped} omitidos.`
    return { ok: true, message, created, skipped, errors }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Importar desde Instagram</h1>
      <p className="text-sm text-black/70">
        Pega 1 perfil de Instagram por línea. Ejemplos válidos: <code>@mi.negocio</code>,{' '}
        <code>https://www.instagram.com/mi.negocio/</code>, <code>mi.negocio</code>. Los vendors se
        crean como <b>borrador</b> por defecto (no publicados) y con un WhatsApp por defecto que
        puedes cambiar luego.
      </p>

      <form action={importAction} className="card space-y-3">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Perfiles de Instagram</label>
          <textarea
            name="profiles"
            rows={8}
            className="input min-h-[160px] font-mono"
            placeholder={`@ssremodelaciones\nhttps://www.instagram.com/mi.negocio/\nmi.negocio`}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Categoría</label>
            <select name="categoryId" className="input" required>
              <option value="">Seleccione categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name_es}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">WhatsApp (por defecto, opcional)</label>
            <input name="whatsappDefault" className="input" placeholder="506XXXXXXXX (opcional)" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-2">
          <input className="input" name="province" placeholder="Provincia" />
          <input className="input" name="canton" placeholder="Cantón" />
          <input className="input" name="district" placeholder="Distrito" />
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="allCountry" />
          Todo el país (dejar provincia/cantón/distrito vacíos)
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="draftMode" defaultChecked />
          Crear como borrador (no publicado)
        </label>

        <button className="btn btn-primary w-full">Importar</button>
      </form>

      <div className="text-sm text-black/60">
        Consejo: después de importar, revisa los vendors en <b>/admin</b>, edita WhatsApp real y
        publica.
      </div>
    </div>
  )
}
