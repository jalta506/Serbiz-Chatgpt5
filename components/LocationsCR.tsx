'use client'

import { CR_GEO, PROVINCES } from '@/data/cr-geo'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  initialProvince?: string
  initialCanton?: string
  initialDistrict?: string
}

export default function LocationCR({
  initialProvince = '',
  initialCanton = '',
  initialDistrict = '',
}: Props) {
  const [allCountry, setAllCountry] = useState(false)
  const [province, setProvince] = useState(initialProvince)
  const cantones = useMemo(() => (province ? Object.keys(CR_GEO[province] || {}) : []), [province])

  const [canton, setCanton] = useState(initialCanton)
  const distritos = useMemo(() => {
    if (!province || !canton) return []
    return CR_GEO[province]?.[canton] || []
  }, [province, canton])

  const [district, setDistrict] = useState(initialDistrict)

  // Reset downstream selections when parent changes
  useEffect(() => {
    setCanton('')        // default "Todos los cantones"
    setDistrict('')      // default "Todos los distritos"
  }, [province])

  useEffect(() => {
    setDistrict('')      // reset district when canton changes
  }, [canton])

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="allCountry"
          checked={allCountry}
          onChange={(e) => setAllCountry(e.target.checked)}
        />
        Todo el país
      </label>

      {!allCountry && (
        <>
          <select
            className="input"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            name="province"
            required
          >
            <option value="">Provincia</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            className="input"
            value={canton}
            onChange={(e) => setCanton(e.target.value)}
            name="canton"
            // not required: empty = "Todos los cantones" (whole province)
          >
            <option value="">Todos los cantones</option>
            {cantones.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="input"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            name="district"
            // not required: empty = "Todos los distritos" (whole canton)
            disabled={!canton}
          >
            <option value="">Todos los distritos</option>
            {distritos.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </>
      )}

      {/* Hidden fallbacks so server always receives keys even when allCountry */}
      {allCountry && (
        <>
          <input type="hidden" name="province" value="" />
          <input type="hidden" name="canton" value="" />
          <input type="hidden" name="district" value="" />
        </>
      )}
    </div>
  )
}
