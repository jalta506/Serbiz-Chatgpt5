import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { fetchOgImage, prettyFromHandle } from '@/lib/og'

export default async function NewVendorPage({
  searchParams,
}: {
  searchParams?: { e?: string }
}) {
  const session = await getSession()
  if (!session.user) redirect('/login')

  const categories = await db.category.findMany({ orderBy: { name_es: 'asc' } })
  const error = searchParams?.e

  async function action(formData: FormData) {
    'use server'
    const session = await getSession()
    if (!session.user) redirect('/login')

    const businessName = String(formData.get('businessName') || '').trim()
    const categoryId   = String(formData.get('categoryId') || '')
    const province     = String(formData.get('province') || '').trim()
    const canton       = String(formData.get('canton') || '').trim()
    const district     = String(formData.get('district') || '').trim()
    const allCountry   = formData.get('allCountry') === 'on'
    const instagramUrl = String(formData.get('instagramUrl') || '').trim()

    // WhatsApp validation (as before)
    const rawWhatsapp  = String(formData.get('whatsapp') || '').trim()
    let digitsOnly     = rawWhatsapp.replace(/\D/g, '')
    if (!(digitsOnly.length === 8 || digitsOnly.length === 11)) {
      redirect('/vendor/new?e=' + encodeURIComponent('Número de WhatsApp inválido. Ingrese 8 dígitos o 506 + 8 dígitos.'))
    }
    if (digitsOnly.length === 8) digitsOnly = '506' + digitsOnly
    const whatsapp = `https://wa.me/${digitsOnly}`

    if (!businessName || !categoryId || !province || !canton || !district) {
      redirect('/vendor/new?e=' + encodeURIComponent('Complete todos los campos requeridos.'))
    }

    // Try to improve name from Instagram handle when user left name empty
    let finalName = businessName
    let coverImage: string | null = null

    if (instagramUrl) {
      // Optional: use handle to pretty-fill name if current name looks generic
      if (finalName.length < 3) {
        const { pretty } = prettyFromHandle(instagramUrl)
        if (pretty) finalName = pretty
      }
      // Try to fetch OG image as card thumbnail
      const og = await fetchOgImage(instagramUrl)
      if (og) coverImage = og
    }

    await db.vendor.create({
      data: {
        ownerId: session.user.id,
        businessName: finalName,
        categoryId,
        province,
        canton,
        district,
        allCountry,
        whatsapp,
        instagramUrl: instagramUrl || null,
        coverImage: coverImage || null,
      },
    })

    redirect('/dashboard/vendor')
  }

  return (
    <form action={action} className="max-w-xl card space-y-3">
      <h1 className="text-xl font-bold">Publicar servicio</h1>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2">
          {error}
        </div>
      )}

      <input className="input" name="businessName" placeholder="Nombre del negocio" required />
      <select className="input" name="categoryId" required>
        <option value="">Seleccione categoría</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name_es}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input className="input" name="province" placeholder="Provincia" required />
        <input className="input" name="canton" placeholder="Cantón" required />
        <input className="input" name="district" placeholder="Distrito" required />
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="allCountry" /> Todo el país
      </label>

      <input className="input" name="whatsapp" placeholder="https://wa.me/506XXXXXXXX" required />

      {/* NEW: Instagram (optional) */}
      <input className="input" name="instagramUrl" placeholder="https://www.instagram.com/tu.negocio/" />

      <button className="btn btn-primary w-full">Publicar</button>
    </form>
  )
}
