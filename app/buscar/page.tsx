import { db } from '@/lib/db'
import VendorCard from '@/components/VendorCard'

export default async function Buscar({
  searchParams,
}: {
  searchParams: { q?: string; loc?: string }
}) {
  const qNorm = (searchParams.q || '').trim().toLowerCase()
  const locNorm = (searchParams.loc || '').trim().toLowerCase()

  const like = `%${qNorm}%`
  const locLike = `%${locNorm}%`

  const vendors = await db.$queryRawUnsafe<any[]>(
    `
    SELECT v.*, c.name_es AS category_name
    FROM "Vendor" v
    JOIN "Category" c ON c.id = v."categoryId"
    WHERE v."isPublished" = true
      AND (
        lower(v."businessName") ILIKE unaccent(lower($1))
        OR lower(c."name_es")   ILIKE unaccent(lower($1))
        OR similarity(lower(v."businessName"), unaccent(lower($2))) > 0.35
      )
      AND (
        $3 = ''
        OR lower(v."province") ILIKE unaccent(lower($4))
        OR lower(v."canton")   ILIKE unaccent(lower($4))
        OR lower(v."district") ILIKE unaccent(lower($4))
      )
    ORDER BY
      GREATEST(
        similarity(lower(v."businessName"), unaccent(lower($2))),
        similarity(lower(c."name_es"),     unaccent(lower($2)))
      ) DESC,
      v."createdAt" DESC
    LIMIT 50
    `,
    like,
    qNorm,
    locNorm,
    locLike
  )

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Resultados</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <VendorCard key={v.id} vendor={v} />
        ))}
      </div>
    </div>
  )
}
